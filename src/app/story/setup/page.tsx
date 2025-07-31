// src/app/story/setup/page.tsx
// Story Setup Page - Screen 4 from UI design

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Lightbulb, Wand2 } from 'lucide-react'

export default function StorySetupPage() {
  const [mode, setMode] = useState<'realistic' | 'fantasy'>('fantasy')
  const [userInput, setUserInput] = useState('')
  const router = useRouter()

  const handleNext = () => {
    if (!userInput.trim()) return
    
    // Navigate to configuration page with data
    router.push(`/story/configure?input=${encodeURIComponent(userInput)}&mode=${mode}`)
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 text-[#2C3E50] font-sans relative bg-[#FFF8F0]">
      {/* Background gradient based on mode */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out -z-10 ${
        mode === 'realistic' 
          ? 'bg-gradient-to-br from-[#5DADE2]/20 to-[#FFF8F0]' 
          : 'bg-gradient-to-br from-[#BB8FCE]/20 to-[#FFF8F0]'
      }`}></div>

      {/* Header */}
      <div className="w-full pt-8 z-10">
        <h2 className="text-3xl/tight font-semibold font-['Poppins'] text-[#2C3E50]">
          What should your story be about?
        </h2>
        <p className="text-base font-['Poppins'] text-[#95A5A6] mt-2">
          Ask a question or enter a topic.
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full flex-grow flex flex-col justify-center gap-8 z-10">
        {/* Story Input */}
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="e.g., Why is the sky blue?"
          className={`w-full h-32 p-4 rounded-2xl bg-white/50 border-2 transition-colors duration-300 placeholder:text-[#95A5A6] focus:ring-0 outline-none text-lg font-['Georgia'] ${
            mode === 'realistic' 
              ? 'border-[#5DADE2]/50 focus:border-[#5DADE2]' 
              : 'border-[#BB8FCE]/50 focus:border-[#BB8FCE]'
          }`}
        />

        {/* Mode Toggle */}
        <div className="w-full">
          <div className="relative w-full h-16 bg-[#F7F1E8] rounded-full p-2 flex items-center">
            <div className={`absolute top-1 left-1 w-[calc(50%-4px)] h-14 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
              mode === 'fantasy' ? 'translate-x-full' : 'translate-x-0'
            }`}></div>
            
            <button 
              onClick={() => setMode('realistic')} 
              className="w-1/2 h-full rounded-full z-10 flex items-center justify-center gap-2 font-['Poppins'] font-medium transition-colors"
              style={{ color: mode === 'realistic' ? '#5DADE2' : '#95A5A6' }}
            >
              <Lightbulb size={20}/> Realistic
            </button>
            
            <button 
              onClick={() => setMode('fantasy')} 
              className="w-1/2 h-full rounded-full z-10 flex items-center justify-center gap-2 font-['Poppins'] font-medium transition-colors"
              style={{ color: mode === 'fantasy' ? '#BB8FCE' : '#95A5A6' }}
            >
              <Wand2 size={20}/> Fantasy
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full pb-8 z-10">
        <button 
          onClick={handleNext}
          disabled={!userInput.trim()}
          className={`w-full h-[52px] rounded-full text-white font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105 ${
            userInput.trim() 
              ? 'bg-[#7B9AE0]' 
              : 'bg-[#95A5A6] cursor-not-allowed'
          }`}
        >
          Next Step <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
} 