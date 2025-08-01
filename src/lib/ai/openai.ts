// src/lib/ai/openai.ts
import OpenAI from 'openai';

// Types for OpenAI Image Generation
export interface OpenAIImageRequest {
  prompt: string;
  n?: number;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  model?: 'dall-e-2' | 'dall-e-3';
  response_format?: 'url' | 'b64_json';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export interface OpenAIImageResponse {
  success: boolean;
  images?: string[];
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAIImageError {
  error: {
    message: string;
    type?: string;
    code?: string;
  };
}

// OpenAI Client for Image Generation
export class OpenAIClient {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = new OpenAI({
      apiKey,
    });
  }

  /**
   * Generate images using DALL-E
   */
  async generateImages(request: OpenAIImageRequest): Promise<OpenAIImageResponse> {
    try {
      const response = await this.client.images.generate({
        prompt: request.prompt,
        n: request.n || 1,
        size: request.size || '1024x1024',
        model: request.model || 'dall-e-3',
        response_format: request.response_format || 'url',
        quality: request.quality || 'standard',
        style: request.style || 'vivid',
      });

      return {
        success: true,
        images: response.data.map(img => img.url || ''),
        usage: {
          prompt_tokens: 0, // OpenAI doesn't provide token usage for images
          completion_tokens: 0,
          total_tokens: 0,
        },
      };
    } catch (error: any) {
      console.error('OpenAI Image Generation Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate images',
      };
    }
  }

  /**
   * Generate a story illustration based on story content
   */
  async generateStoryIllustration(
    storyTitle: string,
    storyContent: string,
    style: 'realistic' | 'fantasy' = 'fantasy'
  ): Promise<OpenAIImageResponse> {
    // Create a compelling prompt for story illustration
    const prompt = this.createStoryPrompt(storyTitle, storyContent, style);
    
    return this.generateImages({
      prompt,
      n: 1,
      size: '1024x1024',
      model: 'dall-e-3',
      quality: 'hd',
      style: style === 'fantasy' ? 'vivid' : 'natural',
    });
  }

  /**
   * Create an optimized prompt for story illustration
   */
  private createStoryPrompt(
    title: string,
    content: string,
    style: 'realistic' | 'fantasy'
  ): string {
    // Extract key elements from the story
    const lines = content.split('\n');
    const firstParagraph = lines.find(line => 
      line.trim().length > 20 && !line.includes('The End') && !line.includes('[')
    ) || '';

    // Create a child-friendly, colorful prompt
    const styleModifier = style === 'fantasy' 
      ? 'magical, colorful, whimsical, child-friendly illustration'
      : 'realistic, warm, child-friendly illustration';

    return `Create a beautiful ${styleModifier} for a children's story titled "${title}". 
    The scene should be: ${firstParagraph.substring(0, 200)}... 
    Style: Watercolor painting, soft colors, safe for children, no scary elements, 
    suitable for bedtime stories. Make it warm and inviting.`;
  }

  /**
   * Generate multiple illustrations for a story (for different scenes)
   */
  async generateStoryScenes(
    storyContent: string,
    style: 'realistic' | 'fantasy' = 'fantasy',
    numScenes: number = 3
  ): Promise<OpenAIImageResponse> {
    const scenes = this.extractStoryScenes(storyContent);
    const selectedScenes = scenes.slice(0, numScenes);
    
    const prompts = selectedScenes.map(scene => 
      this.createScenePrompt(scene, style)
    );

    try {
      const responses = await Promise.all(
        prompts.map(prompt => 
          this.generateImages({
            prompt,
            n: 1,
            size: '1024x1024',
            model: 'dall-e-3',
            quality: 'hd',
            style: style === 'fantasy' ? 'vivid' : 'natural',
          })
        )
      );

      const allImages = responses
        .filter(response => response.success && response.images)
        .flatMap(response => response.images || []);

      return {
        success: allImages.length > 0,
        images: allImages,
      };
    } catch (error: any) {
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
    const paragraphs = content
      .split('\n')
      .filter(line => line.trim().length > 30)
      .filter(line => !line.includes('The End') && !line.includes('['));

    // Take first, middle, and last paragraphs as key scenes
    const scenes = [];
    if (paragraphs.length > 0) scenes.push(paragraphs[0]);
    if (paragraphs.length > 2) scenes.push(paragraphs[Math.floor(paragraphs.length / 2)]);
    if (paragraphs.length > 1) scenes.push(paragraphs[paragraphs.length - 1]);

    return scenes;
  }

  /**
   * Create a prompt for a specific story scene
   */
  private createScenePrompt(scene: string, style: 'realistic' | 'fantasy'): string {
    const styleModifier = style === 'fantasy' 
      ? 'magical, colorful, whimsical, child-friendly illustration'
      : 'realistic, warm, child-friendly illustration';

    return `Create a beautiful ${styleModifier} for this children's story scene: 
    "${scene.substring(0, 150)}..." 
    Style: Watercolor painting, soft colors, safe for children, no scary elements, 
    suitable for bedtime stories. Make it warm and inviting.`;
  }
}

// Export singleton instance
export const openAIClient = new OpenAIClient(); 