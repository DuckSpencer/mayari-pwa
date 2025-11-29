// src/lib/ai/image-service.ts
import { falClient, FalImageRequest, FalImageResponse } from './fal';

// Unified image request interface
export interface ImageRequest {
  prompt: string;
  width?: number;
  height?: number;
  style?: 'realistic' | 'fantasy';
  numImages?: number;
}

// Unified image response interface
export interface ImageResponse {
  success: boolean;
  images?: string[];
  error?: string;
  provider?: 'fal' | 'flux';
  metadata?: any;
}

// Provider interface for abstraction
interface ImageProvider {
  generateImages(request: ImageRequest): Promise<ImageResponse>;
  isAvailable(): Promise<boolean>;
  getName(): string;
}

// fal.ai Provider implementation
class FalProvider implements ImageProvider {
  async generateImages(request: ImageRequest): Promise<ImageResponse> {
    try {
      const falRequest: FalImageRequest = {
        prompt: request.prompt,
        image_size: 'square_hd', // Use official documented size
        num_inference_steps: 4, // Fast generation
        guidance_scale: 3.5,
        sync_mode: false, // Use async mode as per official docs
        num_images: 1, // Always generate 1 image
        enable_safety_checker: true,
        output_format: 'jpeg',
        acceleration: 'regular',
      };

      const result = await falClient.generateImages(falRequest);
      
      return {
        success: result.success,
        images: result.images,
        error: result.error,
        provider: 'fal',
        metadata: {
          seed: result.seed,
          timings: result.timings,
          has_nsfw_concepts: result.has_nsfw_concepts,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: `fal.ai error: ${error.message}`,
        provider: 'fal',
      };
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Simple availability check - try to generate a minimal image
      const testRequest: FalImageRequest = {
        prompt: 'test',
        num_inference_steps: 1,
        sync_mode: true,
      };
      
      const result = await falClient.generateImages(testRequest);
      return result.success;
    } catch (error) {
      console.log('fal.ai availability check failed:', error);
      return false;
    }
  }

  getName(): string {
    return 'fal.ai (FLUX.1 [schnell])';
  }

  private mapImageSize(width?: number, height?: number): 'landscape_4_3' | 'portrait_3_4' | 'square_1_1' | 'landscape_16_9' | 'portrait_9_16' {
    if (!width || !height) return 'landscape_4_3';
    
    const ratio = width / height;
    if (ratio > 1.5) return 'landscape_16_9';
    if (ratio > 1.2) return 'landscape_4_3';
    if (ratio < 0.8) return 'portrait_9_16';
    if (ratio < 0.9) return 'portrait_3_4';
    return 'square_1_1';
  }
}

// Note: FLUX.1 provider removed - using fal.ai only

// Multi-Provider Image Service
export class ImageService {
  private falProvider: FalProvider;

  constructor() {
    this.falProvider = new FalProvider();
  }

  /**
   * Generate images using fal.ai only
   */
  async generateImages(request: ImageRequest): Promise<ImageResponse> {
    console.log(`ImageService: Generating images with fal.ai, prompt: "${request.prompt}"`);

    try {
      console.log('ImageService: Starting fal.ai generation...');
      const result = await this.falProvider.generateImages(request);
      
      console.log('ImageService: fal.ai result:', {
        success: result.success,
        error: result.error,
        provider: result.provider,
        imagesCount: result.images?.length || 0
      });
      
      if (result.success && result.images && result.images.length > 0) {
        console.log('ImageService: fal.ai generation succeeded');
        return result;
      }
      
      console.log('ImageService: fal.ai generation failed - no success or no images');
      return {
        success: false,
        error: result.error || 'fal.ai generation failed',
        provider: 'fal',
      };
      
    } catch (error: any) {
      console.error('ImageService: fal.ai EXCEPTION:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code
      });
      
      return {
        success: false,
        error: `fal.ai error: ${error.message}`,
        provider: 'fal',
      };
    }
  }

  /**
   * Generate story illustration with failover
   */
  async generateStoryIllustration(
    storyTitle: string,
    storyContent: string,
    style: 'realistic' | 'fantasy' = 'fantasy'
  ): Promise<ImageResponse> {
    const prompt = this.createStoryPrompt(storyTitle, storyContent, style);
    
    return this.generateImages({
      prompt,
      style,
      numImages: 1,
    });
  }

  /**
   * Generate multiple story scenes with failover
   */
  async generateStoryScenes(
    storyContent: string,
    style: 'realistic' | 'fantasy' = 'fantasy',
    numScenes: number = 3
  ): Promise<ImageResponse> {
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
          style,
          numImages: 1,
        })
      );
      
      const results = await Promise.all(imagePromises);
      const allImages = results.flatMap(result => result.images || []);
      
      return {
        success: allImages.length > 0,
        images: allImages,
        provider: results[0]?.provider || undefined,
      };
      
    } catch (error: unknown) {
      console.error('Error generating story scenes:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate story scenes',
      };
    }
  }

  /**
   * Check fal.ai provider availability
   */
  async checkProviderAvailability(): Promise<{
    fal: boolean;
  }> {
    try {
      const falAvailable = await this.falProvider.isAvailable();
      
      console.log(`ImageService: fal.ai availability check: ${falAvailable}`);
      
      return {
        fal: falAvailable,
      };
    } catch (error) {
      console.error('Error checking fal.ai availability:', error);
      return {
        fal: false,
      };
    }
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
export const imageService = new ImageService(); 