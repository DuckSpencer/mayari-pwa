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

export interface FalImageResponse {
  success: boolean;
  images?: string[];
  error?: string;
  seed?: number;
  timings?: any;
  has_nsfw_concepts?: boolean[];
}

export interface FalError {
  detail: string[];
  headers?: {
    'X-Fal-Retryable'?: string;
    'Retry-After'?: string;
  };
}

// fal.ai Client for Image Generation
export class FalClient {
  private apiKey: string;
  private modelId: string = process.env.FAL_MODEL_ID || 'fal-ai/flux-pro/kontext/text-to-image';

  constructor() {
    const apiKey = process.env.FAL_KEY;
    if (!apiKey) {
      throw new Error('FAL_KEY environment variable is required');
    }
    this.apiKey = apiKey;
    
    // Configure fal.ai client
    fal.config({
      credentials: this.apiKey,
    });
  }

  /**
   * Generate images using fal.ai FLUX.1 [schnell]
   */
  async generateImages(request: FalImageRequest): Promise<FalImageResponse> {
    try {
      console.log('Generating fal.ai image with payload:', {
        prompt: request.prompt,
        model: this.modelId,
        aspect_ratio: request.aspect_ratio ?? '4:3',
        guidance_scale: request.guidance_scale ?? 3.5,
      });

      // Normalize and prepare the request payload based on model (avoid invalid fields)
      let payload: any;
      const isImagen4 = this.modelId.startsWith('fal-ai/imagen4');
      const isFluxKontext = this.modelId.includes('flux-pro/kontext');
      if (isImagen4) {
        payload = {
          prompt: request.prompt,
          negative_prompt: request.negative_prompt || '',
          aspect_ratio: request.aspect_ratio || '4:3',
          num_images: request.num_images ?? 1,
        };
        if (typeof request.seed === 'number') payload.seed = request.seed
      } else if (isFluxKontext) {
        // FLUX.1 Kontext text-to-image supports: prompt, seed, guidance_scale, sync_mode, num_images,
        // output_format, safety_tolerance, aspect_ratio, enhance_prompt
        payload = {
          prompt: request.prompt,
          guidance_scale: request.guidance_scale ?? 3.5,
          num_images: request.num_images ?? 1,
          output_format: request.output_format ?? 'jpeg',
          safety_tolerance: request.safety_tolerance ?? '2',
          aspect_ratio: request.aspect_ratio ?? '4:3',
        };
        if (typeof request.seed === 'number') payload.seed = request.seed
        if (typeof request.sync_mode === 'boolean') payload.sync_mode = request.sync_mode
        if (typeof request.enhance_prompt === 'boolean') payload.enhance_prompt = request.enhance_prompt
        // Do not include: negative_prompt, image_size, num_inference_steps, enable_safety_checker, acceleration
      } else {
        payload = {
          prompt: request.prompt,
          image_size: request.image_size ?? 'square_hd',
          num_inference_steps: request.num_inference_steps ?? 4,
          num_images: request.num_images ?? 1,
          enable_safety_checker: request.enable_safety_checker !== false,
          output_format: request.output_format ?? 'jpeg',
        };
        if (typeof request.negative_prompt === 'string') payload.negative_prompt = request.negative_prompt
        if (typeof request.guidance_scale === 'number') payload.guidance_scale = request.guidance_scale
        if (typeof request.sync_mode === 'boolean') payload.sync_mode = request.sync_mode
        if (typeof request.acceleration === 'string') payload.acceleration = request.acceleration
        if (typeof request.seed === 'number') payload.seed = request.seed
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

    } catch (error: any) {
      try {
        if (error?.body) {
          console.error('fal.ai error body:', JSON.stringify(error.body));
        }
      } catch {}
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
  private async makeRequestWithRetry(payload: any, maxRetries: number = 3): Promise<any> {
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
        return result;

      } catch (error: any) {
        console.error(`fal.ai request attempt ${attempt + 1} failed:`, error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          code: error.code,
          stack: error.stack
        });

        // Check if retryable based on headers
        if (error.headers && error.headers['X-Fal-Retryable'] === 'true') {
          const retryAfter = error.headers['Retry-After'];
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
        if (error.message?.includes('fetch failed') || error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
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
        if (error.status === 429) {
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
  private formatError(error: any): string {
    if (error.detail && Array.isArray(error.detail)) {
      return error.detail.join(', ');
    }
    if (error.message) {
      return error.message;
    }
    return 'Unknown fal.ai error';
  }

  /**
   * Extract image URLs from fal.ai response
   */
  private extractImageUrls(result: any): string[] {
    try {
      console.log('Extracting image URLs from result:', JSON.stringify(result, null, 2));
      
      // Check if result has data with images (most common structure)
      if (result.data && result.data.images && Array.isArray(result.data.images)) {
        const urls = result.data.images.map((image: any) => {
          // Handle both URL and Base64 formats
          if (image.url) return image.url;
          if (image.data) return image.data; // Base64
          if (image.content) return image.content; // Base64 fallback
          return null;
        }).filter(Boolean);
        console.log('Extracted URLs from data.images:', urls.length);
        return urls;
      }
      
      // Check if result has images array with objects
      if (result.images && Array.isArray(result.images)) {
        const urls = result.images.map((image: any) => {
          if (typeof image === 'string') return image; // Direct string (URL or Base64)
          if (image.url) return image.url;
          if (image.data) return image.data; // Base64
          if (image.content) return image.content; // Base64 fallback
          return null;
        }).filter(Boolean);
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
        const urls = result.data.map((image: any) => {
          if (typeof image === 'string') return image; // Direct string
          if (image.url) return image.url;
          if (image.data) return image.data; // Base64
          if (image.content) return image.content; // Base64 fallback
          return null;
        }).filter(Boolean);
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
      
    } catch (error: any) {
      console.error('Error generating story scenes:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate story scenes',
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