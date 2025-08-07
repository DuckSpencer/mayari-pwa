// src/app/stories/page.tsx
// Story Library - Epic 2, Story 2.4 from PRD

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Plus, Search, Filter, Trash2, Share2, Download } from 'lucide-react'

interface SavedStory {
  id: string
  title: string
  story: string
  images: string[]
  config: {
    input: string
    mode: 'realistic' | 'fantasy'
    style: string
    length: string
  }
  createdAt: string
}

export default function StoriesPage() {
  const router = useRouter()
  const [stories, setStories] = useState<SavedStory[]>([])
  const [filteredStories, setFilteredStories] = useState<SavedStory[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'fantasy' | 'realistic'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStories()
  }, [])

  useEffect(() => {
    filterStories()
  }, [stories, searchTerm, selectedFilter])

  const loadStories = () => {
    try {
      const savedStories = JSON.parse(localStorage.getItem('mayari-stories') || '[]')
      setStories(savedStories)
    } catch (error) {
      console.error('Error loading stories:', error)
      setStories([])
    } finally {
      setIsLoading(false)
    }
  }

  const filterStories = () => {
    let filtered = stories

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.story.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(story => story.config?.mode === selectedFilter)
    }

    setFilteredStories(filtered)
  }

  const handleStoryClick = (story: SavedStory) => {
    const params = new URLSearchParams({
      story: story.story,
      images: JSON.stringify(story.images)
    })
    router.push(`/story/read?${params.toString()}`)
  }

  const handleDeleteStory = (storyId: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      const updatedStories = stories.filter(story => story.id !== storyId)
      setStories(updatedStories)
      localStorage.setItem('mayari-stories', JSON.stringify(updatedStories))
    }
  }

  const handleShareStory = (story: SavedStory) => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.story.substring(0, 100) + '...',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(story.story)
      alert('Story copied to clipboard!')
    }
  }

  const handleExportStory = (story: SavedStory) => {
    // TODO: Implement PDF export (Epic 2, Story 2.5)
    alert('PDF export coming soon!')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF8F0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B9AE0]"></div>
        <p className="text-[#95A5A6] mt-4 font-['Poppins']">Loading your stories...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#FFF8F0]">
      {/* Header */}
      <div className="w-full p-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold font-['Poppins'] text-[#2C3E50]">
            My Stories
          </h1>
          <button 
            onClick={() => router.push('/story/setup')}
            className="h-[48px] px-6 rounded-full bg-gradient-to-r from-[#FF8A65] to-[#F1948A] text-white font-['Poppins'] font-medium text-base flex items-center gap-2 transition-transform hover:scale-105 shadow-[0px_4px_12px_rgba(255,138,101,0.3)]"
          >
            <Plus size={20}/> New Story
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="w-full px-6 pb-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#95A5A6]" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[48px] pl-10 pr-4 rounded-full bg-white border-2 border-[#F7F1E8] focus:border-[#7B9AE0] focus:outline-none font-['Poppins'] text-[#2C3E50]"
            />
          </div>
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'fantasy' | 'realistic')}
              className="h-[48px] px-4 pr-10 rounded-full bg-white border-2 border-[#F7F1E8] focus:border-[#7B9AE0] focus:outline-none font-['Poppins'] text-[#2C3E50] appearance-none"
            >
              <option value="all">All Stories</option>
              <option value="fantasy">Fantasy</option>
              <option value="realistic">Realistic</option>
            </select>
            <Filter size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#95A5A6] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {filteredStories.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-[#95A5A6] text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold font-['Poppins'] text-[#2C3E50] text-center">
              {stories.length === 0 ? 'No stories yet' : 'No stories found'}
            </h2>
            <p className="text-base font-['Georgia'] text-[#95A5A6] mt-2 text-center">
              {stories.length === 0 
                ? 'Create your first story to get started!' 
                : 'Try adjusting your search or filters.'
              }
            </p>
            {stories.length === 0 && (
              <button 
                onClick={() => router.push('/story/setup')}
                className="mt-6 h-[52px] px-8 rounded-full bg-gradient-to-r from-[#FF8A65] to-[#F1948A] text-white font-['Poppins'] font-medium text-base flex items-center gap-2 transition-transform hover:scale-105 shadow-[0px_4px_12px_rgba(255,138,101,0.3)]"
              >
                <Plus size={20}/> Create Your First Story
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStories.map((story) => (
              <div 
                key={story.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#F7F1E8] hover:shadow-md transition-all cursor-pointer group"
                onClick={() => handleStoryClick(story)}
              >
                {/* Story Thumbnail */}
                <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-[#7B9AE0] to-[#D4C5F0] flex items-center justify-center">
                  {story.images.length > 0 ? (
                    <img 
                      src={story.images[0]} 
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen size={32} className="text-white/80" />
                  )}
                </div>

                {/* Story Info */}
                <div className="space-y-2">
                  <h3 className="font-['Poppins'] font-semibold text-[#2C3E50] line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-sm font-['Georgia'] text-[#95A5A6] line-clamp-2">
                    {story.story.substring(0, 80)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-['Poppins'] text-[#95A5A6]">
                      {formatDate(story.createdAt)}
                    </span>
                     <span className={`text-xs font-['Poppins'] px-2 py-1 rounded-full ${
                      (story.config?.mode || 'fantasy') === 'fantasy' 
                        ? 'bg-[#BB8FCE]/20 text-[#BB8FCE]' 
                        : 'bg-[#5DADE2]/20 text-[#5DADE2]'
                    }`}>
                      {(story.config?.mode || 'fantasy') === 'fantasy' ? 'Fantasy' : 'Realistic'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShareStory(story)
                    }}
                    className="flex-1 h-[32px] rounded-full bg-[#F7F1E8] text-[#2C3E50] flex items-center justify-center gap-1 text-xs font-['Poppins'] hover:bg-[#D4C5F0] transition-colors"
                  >
                    <Share2 size={14}/> Share
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleExportStory(story)
                    }}
                    className="flex-1 h-[32px] rounded-full bg-[#F7F1E8] text-[#2C3E50] flex items-center justify-center gap-1 text-xs font-['Poppins'] hover:bg-[#D4C5F0] transition-colors"
                  >
                    <Download size={14}/> Export
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteStory(story.id)
                    }}
                    className="h-[32px] w-[32px] rounded-full bg-[#F48FB1]/20 text-[#F48FB1] flex items-center justify-center hover:bg-[#F48FB1]/30 transition-colors"
                  >
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 