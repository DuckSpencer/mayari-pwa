// src/lib/utils/share.ts
// Shared utility for Web Share API with clipboard fallback

export interface ShareOptions {
  title?: string
  text: string
  url?: string
}

/**
 * Share content using Web Share API with clipboard fallback
 * @returns true if share was successful, false if cancelled/failed
 */
export async function shareContent(options: ShareOptions): Promise<boolean> {
  const { title = 'My Mayari Story', text, url } = options

  try {
    // Try Web Share API first
    if (navigator.share) {
      await navigator.share({
        title,
        text: text.length > 100 ? text.substring(0, 100) + '...' : text,
        url: url || window.location.href
      })
      return true
    }

    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(text)
    alert('Story copied to clipboard!')
    return true

  } catch (error) {
    // User cancelled share or permission denied
    if (error instanceof Error && error.name === 'AbortError') {
      // User cancelled - this is not an error
      return false
    }

    console.error('Share failed:', error)

    // Try clipboard as final fallback
    try {
      await navigator.clipboard.writeText(text)
      alert('Story copied to clipboard!')
      return true
    } catch {
      alert('Unable to share. Please copy the story manually.')
      return false
    }
  }
}

/**
 * Share a story with optional images
 */
export async function shareStory(
  storyText: string,
  options?: { title?: string; url?: string }
): Promise<boolean> {
  return shareContent({
    title: options?.title || 'My Mayari Story',
    text: storyText,
    url: options?.url
  })
}
