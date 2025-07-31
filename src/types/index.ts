// types/index.ts - Mayari Application Types

export interface Story {
  id: string;
  user_id: string;
  prompt: string;
  story_type: 'realistic' | 'fantasy';
  art_style: 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic';
  page_count: 8 | 12 | 16;
  image_urls: string[];
  text_content: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoryCreationRequest {
  prompt: string;
  story_type: 'realistic' | 'fantasy';
  art_style: 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic';
  page_count: 8 | 12 | 16;
}

export interface StoryPage {
  page_number: number;
  text: string;
  image_url: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface StoryGenerationStatus {
  status: 'idle' | 'generating-text' | 'generating-images' | 'complete' | 'error';
  progress: number;
  message: string;
  story_id?: string;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// UI Component Props
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'magic';
  className?: string;
  icon?: React.ReactNode;
}

export interface StoryCardProps {
  story: Story;
  onClick: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
}

export interface ProgressDotsProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export interface SwipeNavigationProps {
  currentIndex: number;
  totalItems: number;
  onNext: () => void;
  onPrevious: () => void;
  children: React.ReactNode;
}

// Form Types
export interface StoryCreationForm {
  prompt: string;
  storyType: 'realistic' | 'fantasy';
  artStyle: 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic';
  pageCount: 8 | 12 | 16;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

export type StoryType = 'realistic' | 'fantasy';
export type ArtStyle = 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic';
export type PageCount = 8 | 12 | 16;