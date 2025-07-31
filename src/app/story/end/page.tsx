// src/app/story/end/page.tsx
// Story End Page - Screen 9 from UI design

'use client'

import { useRouter } from 'next/navigation'
import { RefreshCw, PlusCircle, PenTool, Save, BookCopy } from 'lucide-react'

export default function StoryEndPage() {
  const router = useRouter()

  const handleReadAgain = () => {
    // Navigate back to reading view
    router.back()
  }

  const handleNewStory = () => {
    router.push('/story/setup')
  }

  const handleContinueStory = () => {
    // Navigate to story continuation
    router.push('/story/continue')
  }

  const handleSaveStory = () => {
    // Implement save functionality
    // For now, just show a success message
    alert('Story saved to your library!')
  }

  return (
    <div className="w-full h-full flex flex-col justify-between items-center p-6 text-[#2C3E50] font-sans bg-[#F7F1E8]">
      {/* Header */}
      <div className="w-full pt-12 text-center">
        <BookCopy size={48} className="text-[#7B9AE0] mx-auto" />
        <h2 className="text-4xl font-bold font-['Poppins'] text-[#2C3E50] mt-4">
          The End
        </h2>
        <p className="text-base font-['Georgia'] text-[#95A5A6] mt-2">
          A wonderful story for another time.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex-grow flex flex-col justify-center gap-3">
        <button 
          onClick={handleReadAgain}
          className="w-full h-[52px] rounded-full bg-white border-2 border-[#7B9AE0] text-[#2C3E50] font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105"
        >
          <RefreshCw size={20} /> Read Again
        </button>
        
        <button 
          onClick={handleNewStory}
          className="w-full h-[52px] rounded-full bg-white border-2 border-[#7B9AE0] text-[#2C3E50] font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105"
        >
          <PlusCircle size={20} /> New Story
        </button>
        
        <button 
          onClick={handleContinueStory}
          className="w-full h-[52px] rounded-full bg-white border-2 border-[#7B9AE0] text-[#2C3E50] font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105"
        >
          <PenTool size={20} /> Continue Story
        </button>
      </div>

      {/* Save Button */}
      <div className="w-full pb-8 flex flex-col gap-4">
        <button 
          onClick={handleSaveStory}
          className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#FF8A65] to-[#F1948A] text-white font-['Poppins'] font-medium text-base shadow-[0px_4px_12px_rgba(255,138,101,0.3)] flex items-center justify-center gap-2 transition-transform hover:scale-105"
        >
          <Save size={20} /> Save to My Stories
        </button>
      </div>
    </div>
  )
} 