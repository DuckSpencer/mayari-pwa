// src/lib/ai/fal.ts
import { fal } from '@fal-ai/client';

// Types for fal.ai Image Generation
export interface FalImageRequest {
  prompt: string;
  negative_prompt?: string;
  num_inference_steps?: number;
  image_size?: 'landscape_4_3' | 'portrait_3_4' | 'square_1_1' | 'landscape_16_9' | 'portrait_9_16' | 'square_hd';
  seed?: number;
  guidance_scale?: number;
  sync_mode?: boolean;
  num_images?: number;
  // keep optional but not sent to payload unless supported by model
  enable_safety_checker?: boolean;
  output_format?: 'jpeg' | 'png';
  acceleration?: 'none' | 'regular' | 'high';
  aspect_ratio?: '1:1' | '16:9' | '9:16' | '3:4' | '4:3';
  // kontext-specific
  safety_tolerance?: '1' | '2' | '3' | '4' | '5' | '6';
  enhance_prompt?: boolean;
}

export interface FalTimings {
  inference?: number;
  queue?: number;
  total?: number;
  [key: string]: number | undefined;
}

export interface FalImageResponse {
  success: boolean;
  images?: string[];
  error?: string;
  seed?: number;
  timings?: FalTimings;
  has_nsfw_concepts?: boolean[];
}

export interface FalError {
  detail: string[];
  headers?: {
    'X-Fal-Retryable'?: string;
    'Retry-After'?: string;
  };
}

// Internal types for API responses
interface FalImageObject {
  url?: string;
  data?: string;
  content?: string;
}

interface FalApiResult {
  images?: (string | FalImageObject)[];
  image?: string;
  data?: {
    images?: FalImageObject[];
  } | (string | FalImageObject)[];
  seed?: number;
  timings?: FalTimings;
  has_nsfw_concepts?: boolean[];
}

// Payload types for different models
interface FluxPayload {
  prompt: string;
  negative_prompt?: string;
  image_size?: FalImageRequest['image_size'];
  num_inference_steps?: number;
  num_images?: number;
  enable_safety_checker?: boolean;
  output_format?: 'jpeg' | 'png';
  guidance_scale?: number;
  sync_mode?: boolean;
  acceleration?: string;
  seed?: number;
}

interface Imagen4Payload {
  prompt: string;
  negative_prompt?: string;
  aspect_ratio?: string;
  num_images?: number;
  seed?: number;
}

type FalPayload = FluxPayload | Imagen4Payload;

// fal.ai Client for Image Generation
export class FalClient {
  private apiKey: string | undefined;
  private modelId: string = process.env.FAL_MODEL_ID || 'fal-ai/flux/schnell';

  constructor() {
    // Defer API key check to runtime to allow build without env vars
    this.apiKey = process.env.FAL_KEY;

    // Configure fal.ai client (will work even without key during build)
    if (this.apiKey) {
      fal.config({
        credentials: this.apiKey,
      });
    }
  }

  private ensureApiKey(): void {
    if (!this.apiKey) {
      throw new Error('FAL_KEY environment variable is required');
    }
  }

  /**
   * Generate images using fal.ai FLUX.1 [schnell]
   */
  async generateImages(request: FalImageRequest): Promise<FalImageResponse> {
    this.ensureApiKey();
    try {
      console.log('Generating fal.ai image with payload:', {
        prompt: request.prompt,
        model: this.modelId,
        aspect_ratio: request.aspect_ratio ?? '4:3',
        guidance_scale: request.guidance_scale ?? 3.5,
      });

      // Normalize and prepare the request payload based on model (avoid invalid fields)
      let payload: FalPayload;
      const isImagen4 = this.modelId.startsWith('fal-ai/imagen4');
      if (isImagen4) {
        const imagen4Payload: Imagen4Payload = {
          prompt: request.prompt,
          negative_prompt: request.negative_prompt || '',
          aspect_ratio: request.aspect_ratio || '4:3',
          num_images: request.num_images ?? 1,
        };
        if (typeof request.seed === 'number') imagen4Payload.seed = request.seed;
        payload = imagen4Payload;
      } else {
        const fluxPayload: FluxPayload = {
          prompt: request.prompt,
          image_size: request.image_size ?? 'square_hd',
          num_inference_steps: request.num_inference_steps ?? 4,
          num_images: request.num_images ?? 1,
          enable_safety_checker: request.enable_safety_checker !== false,
          output_format: request.output_format ?? 'jpeg',
        };
        if (typeof request.negative_prompt === 'string') fluxPayload.negative_prompt = request.negative_prompt;
        if (typeof request.guidance_scale === 'number') fluxPayload.guidance_scale = request.guidance_scale;
        if (typeof request.sync_mode === 'boolean') fluxPayload.sync_mode = request.sync_mode;
        if (typeof request.acceleration === 'string') fluxPayload.acceleration = request.acceleration;
        if (typeof request.seed === 'number') fluxPayload.seed = request.seed;
        payload = fluxPayload;
      }

      // Use fal.ai client with proper error handling
      const result = await this.makeRequestWithRetry(payload);

      return {
        success: true,
        images: this.extractImageUrls(result),
        seed: result.seed,
        timings: result.timings,
        has_nsfw_concepts: result.has_nsfw_concepts,
      };

    } catch (error: unknown) {
      const err = error as { body?: unknown; message?: string };
      try {
        if (err?.body) {
          console.error('fal.ai error body:', JSON.stringify(err.body));
        }
      } catch { /* ignore JSON errors */ }
      console.error('fal.ai Image Generation Error:', error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  /**
   * Make request with retry logic based on Perplexity research
   */
  private async makeRequestWithRetry(payload: FalPayload, maxRetries: number = 3): Promise<FalApiResult> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`fal.ai request attempt ${attempt + 1}/${maxRetries}`);

        const result = await fal.subscribe(this.modelId, {
          input: payload,
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === 'IN_PROGRESS') {
              update.logs?.map((log) => log.message).forEach(console.log);
            }
          },
        });

        console.log('fal.ai generation completed successfully');
        return result as FalApiResult;

      } catch (error: unknown) {
        const err = error as { message?: string; status?: number; code?: string; stack?: string; headers?: Record<string, string> };
        console.error(`fal.ai request attempt ${attempt + 1} failed:`, error);
        console.error('Error details:', {
          message: err.message,
          status: err.status,
          code: err.code,
          stack: err.stack
        });

        // Check if retryable based on headers
        if (err.headers && err.headers['X-Fal-Retryable'] === 'true') {
          const retryAfter = err.headers['Retry-After'];
          if (retryAfter) {
            const delay = parseInt(retryAfter, 10) * 1000;
            console.log(`Waiting ${delay}ms before retry (Retry-After header)`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            // Exponential backoff with jitter
            const jitter = Math.random() * 1000;
            const delay = Math.pow(2, attempt) * 1000 + jitter;
            console.log(`Waiting ${delay}ms before retry (exponential backoff)`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          continue;
        }

        // For Docker/Node.js 18+ compatibility issues, retry with delay
        if (err.message?.includes('fetch failed') || err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
          console.log('Docker/Node.js 18+ compatibility issue detected, retrying...');
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // If not retryable or last attempt, throw error
        if (attempt === maxRetries - 1) {
          throw error;
        }

        // For rate limiting (429), use exponential backoff
        if (err.status === 429) {
          const jitter = Math.random() * 1000;
          const delay = Math.pow(2, attempt) * 1000 + jitter;
          console.log(`Rate limited. Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // For other errors, don't retry
        throw error;
      }
    }

    throw new Error('All retry attempts failed');
  }

  /**
   * Format error message for better debugging
   */
  private formatError(error: unknown): string {
    const err = error as { detail?: string[]; message?: string };
    if (err.detail && Array.isArray(err.detail)) {
      return err.detail.join(', ');
    }
    if (err.message) {
      return err.message;
    }
    return 'Unknown fal.ai error';
  }

  /**
   * Extract image URL from image object
   */
  private extractUrlFromImage(image: string | FalImageObject): string | null {
    if (typeof image === 'string') return image;
    if (image.url) return image.url;
    if (image.data) return image.data;
    if (image.content) return image.content;
    return null;
  }

  /**
   * Extract image URLs from fal.ai response
   */
  private extractImageUrls(result: FalApiResult): string[] {
    try {
      console.log('Extracting image URLs from result:', JSON.stringify(result, null, 2));

      // Check if result has data with images (most common structure)
      if (result.data && typeof result.data === 'object' && 'images' in result.data && Array.isArray(result.data.images)) {
        const urls = result.data.images
          .map(image => this.extractUrlFromImage(image))
          .filter((url): url is string => url !== null);
        console.log('Extracted URLs from data.images:', urls.length);
        return urls;
      }

      // Check if result has images array with objects
      if (result.images && Array.isArray(result.images)) {
        const urls = result.images
          .map(image => this.extractUrlFromImage(image))
          .filter((url): url is string => url !== null);
        console.log('Extracted URLs from images array:', urls.length);
        return urls;
      }

      // Check if result has a single image
      if (result.image && typeof result.image === 'string') {
        console.log('Extracted single image:', result.image);
        return [result.image];
      }

      // Check if result has data as direct array
      if (result.data && Array.isArray(result.data)) {
        const urls = result.data
          .map(image => this.extractUrlFromImage(image))
          .filter((url): url is string => url !== null);
        console.log('Extracted URLs from data array:', urls.length);
        return urls;
      }

      console.log('No images found in result');
      return [];
    } catch (error) {
      console.error('Error extracting image URLs:', error);
      return [];
    }
  }

  /**
   * Generate story illustration
   */
  async generateStoryIllustration(
    storyTitle: string,
    storyContent: string,
    style: 'realistic' | 'fantasy' = 'fantasy'
  ): Promise<FalImageResponse> {
    const prompt = this.createStoryPrompt(storyTitle, storyContent, style);
    
    return this.generateImages({
      prompt,
      image_size: 'landscape_4_3',
      num_inference_steps: 4, // Fast generation
      guidance_scale: 3.5,
      sync_mode: false, // Use async for better performance
      num_images: 1,
      enable_safety_checker: true,
      output_format: 'jpeg',
      acceleration: 'regular',
    });
  }

  /**
   * Create a story prompt for image generation
   */
  private createStoryPrompt(
    title: string,
    content: string,
    style: 'realistic' | 'fantasy'
  ): string {
    const stylePrompt = style === 'fantasy' 
      ? 'fantasy art style, magical, vibrant colors, child-friendly'
      : 'realistic photography style, natural lighting, detailed';
    
    return `A beautiful illustration for the story "${title}": ${content.substring(0, 200)}... ${stylePrompt}, high quality, artistic composition`;
  }

  /**
   * Generate multiple story scenes
   */
  async generateStoryScenes(
    storyContent: string,
    style: 'realistic' | 'fantasy' = 'fantasy',
    numScenes: number = 3
  ): Promise<FalImageResponse> {
    try {
      const scenes = this.extractStoryScenes(storyContent);
      const selectedScenes = scenes.slice(0, numScenes);
      
      const scenePrompts = selectedScenes.map(scene => 
        this.createScenePrompt(scene, style)
      );
      
      // Generate images for each scene
      const imagePromises = scenePrompts.map(prompt =>
        this.generateImages({
          prompt,
          image_size: 'landscape_4_3',
          num_inference_steps: 4,
          guidance_scale: 3.5,
          sync_mode: false,
          num_images: 1,
          enable_safety_checker: true,
          output_format: 'jpeg',
          acceleration: 'regular',
        })
      );
      
      const results = await Promise.all(imagePromises);
      const allImages = results.flatMap(result => result.images || []);
      
      return {
        success: true,
        images: allImages,
      };

    } catch (error: unknown) {
      console.error('Error generating story scenes:', error);
      const err = error as { message?: string };
      return {
        success: false,
        error: err.message || 'Failed to generate story scenes',
      };
    }
  }

  /**
   * Extract key scenes from story content
   */
  private extractStoryScenes(content: string): string[] {
    // Simple scene extraction - split by paragraphs and take first few
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    return paragraphs.slice(0, 3); // Take first 3 scenes
  }

  /**
   * Create a scene prompt for image generation
   */
  private createScenePrompt(scene: string, style: 'realistic' | 'fantasy'): string {
    const stylePrompt = style === 'fantasy' 
      ? 'fantasy art style, magical, vibrant colors, child-friendly'
      : 'realistic photography style, natural lighting, detailed';
    
    return `Scene from story: ${scene.substring(0, 150)}... ${stylePrompt}, high quality, artistic composition`;
  }
}

// Export singleton instance
export const falClient = new FalClient(); 