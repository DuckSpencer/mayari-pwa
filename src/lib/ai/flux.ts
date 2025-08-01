// src/lib/ai/flux.ts
import axios from 'axios';

// Types for FLUX.1 Image Generation
export interface FluxImageRequest {
  prompt: string;
  image_prompt?: string | null;
  width?: number;
  height?: number;
  steps?: number | null;
  prompt_upsampling?: boolean;
  seed?: number | null;
  guidance?: number | null;
  safety_tolerance?: number;
  output_format?: 'jpeg' | 'png';
  webhook_url?: string | null;
  webhook_secret?: string | null;
}

export interface FluxImageResponse {
  success: boolean;
  images?: string[];
  error?: string;
  id?: string;
  polling_url?: string;
  status?: string;
}

export interface FluxAsyncResponse {
  id: string;
  polling_url: string;
}

export interface FluxAsyncWebhookResponse {
  id: string;
  status: string;
  webhook_url: string;
}

export interface FluxValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface FluxError {
  detail: FluxValidationError[];
}

// FLUX.1 Client for Image Generation using Axios
export class FluxClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.bfl.ai';

  constructor() {
    const apiKey = process.env.FLUX_API_KEY;
    if (!apiKey) {
      throw new Error('FLUX_API_KEY environment variable is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Generate images using FLUX.1
   */
  async generateImages(request: FluxImageRequest): Promise<FluxImageResponse> {
    try {
      // Prepare the request payload based on FLUX.1 API documentation
      const payload = {
        prompt: request.prompt,
        aspect_ratio: this.calculateAspectRatio(request.width || 1024, request.height || 768),
        steps: request.steps || 28,
        guidance: request.guidance || 3,
        seed: request.seed || null,
      };

      console.log('Generating FLUX.1 image with payload:', payload);

      // Use the global endpoint as recommended in documentation
      const response = await axios.post(`${this.baseUrl}/v1/flux-pro-1.1`, payload, {
        headers: {
          'accept': 'application/json',
          'x-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      console.log('FLUX.1 generation started, ID:', response.data.id);
      console.log('Polling URL:', response.data.polling_url);

      // Use the polling_url from the response as required by documentation
      const result = await this.pollForCompletion(response.data.polling_url);

      return {
        success: true,
        images: result.images || [],
        id: response.data.id,
      };

    } catch (error: any) {
      console.error('FLUX.1 Image Generation Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate images',
      };
    }
  }

  /**
   * Calculate aspect ratio from width and height
   */
  private calculateAspectRatio(width: number, height: number): string {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    const ratioWidth = width / divisor;
    const ratioHeight = height / divisor;
    return `${ratioWidth}:${ratioHeight}`;
  }

  /**
   * Poll for image generation completion using Axios
   */
  private async pollForCompletion(pollingUrl: string, maxAttempts: number = 120): Promise<{ images?: string[] }> {
    console.log('Starting polling for completion at:', pollingUrl);

    // Extract request ID from polling URL
    const urlParams = new URL(pollingUrl);
    const requestId = urlParams.searchParams.get('id');
    console.log('Request ID:', requestId);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        console.log(`Polling attempt ${attempt + 1}/${maxAttempts}`);
        
        console.log('Making axios request to:', pollingUrl);
        console.log('Headers:', { 'accept': 'application/json', 'x-key': this.apiKey });
        
        const response = await axios.get(pollingUrl, {
          headers: {
            'accept': 'application/json',
            'x-key': this.apiKey,
          },
          timeout: 10000, // 10 second timeout for each polling request
        });

        console.log(`Response status: ${response.status}`);
        console.log('Response data:', response.data);

        const result = response.data;
        console.log('Polling result status:', result.status);
        
        if (result.status === 'Ready') {
          console.log('Image generation completed successfully');
          const images = this.extractImageUrls(result);
          return { images };
        } else if (result.status === 'Error' || result.status === 'Failed') {
          console.error('Image generation failed:', result);
          throw new Error(`Image generation failed: ${result.status}`);
        } else if (result.status === 'Content Moderated') {
          throw new Error('Content was flagged by moderation system');
        } else if (result.status === 'Request Moderated') {
          throw new Error('Request input was flagged by moderation system');
        } else if (result.status === 'Pending') {
          console.log('Status: Pending - continuing to poll...');
        } else {
          console.log('Status:', result.status, '- continuing to poll...');
        }

        // Wait 0.5 seconds as recommended in documentation
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error: any) {
        console.error(`Polling attempt ${attempt + 1} failed:`, error);
        
        // Handle axios specific errors
        if (error.response) {
          // Server responded with error status
          console.error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
          
          if (error.response.status === 429) {
            const waitTime = Math.pow(2, Math.min(attempt, 5)) * 1000; // Max 32 seconds
            console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          if (error.response.status === 402) {
            throw new Error('Insufficient credits. Please add credits to your account.');
          }
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
        } else {
          // Something else happened
          console.error('Axios error:', error.message);
        }
        
        // If it's a known error, don't retry
        if (error.message.includes('Insufficient credits') || 
            error.message.includes('Content Moderated') ||
            error.message.includes('Request Moderated')) {
          throw error;
        }
        
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        
        // Exponential backoff for retries
        const waitTime = Math.pow(2, Math.min(attempt, 5)) * 1000; // Max 32 seconds
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw new Error('Image generation timed out after all attempts');
  }

  /**
   * Extract image URLs from the result
   */
  private extractImageUrls(result: any): string[] {
    try {
      if (result.result && result.result.sample) {
        return [result.result.sample];
      }
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
  ): Promise<FluxImageResponse> {
    const prompt = this.createStoryPrompt(storyTitle, storyContent, style);
    
    return this.generateImages({
      prompt,
      width: 1024,
      height: 1024,
      steps: 28,
      guidance: 3,
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
  ): Promise<FluxImageResponse> {
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
          width: 1024,
          height: 1024,
          steps: 28,
          guidance: 3,
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
export const fluxClient = new FluxClient(); 