// src/app/story/configure/page.tsx
// Story Configuration Page - Screen 5 from UI design

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sparkles, Feather } from 'lucide-react'
import { HomeButton } from '@/components/HomeButton'

interface StoryConfig {
  input: string
  mode: 'realistic' | 'fantasy'
  style: 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic'
  length: 8 | 12 | 16
}

export default function StoryConfigurePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [config, setConfig] = useState<StoryConfig>({
    input: '',
    mode: 'fantasy',
    style: 'watercolor',
    length: 12
  })

  useEffect(() => {
    const input = searchParams.get('input') || ''
    const mode = (searchParams.get('mode') as 'realistic' | 'fantasy') || 'fantasy'
    
    setConfig(prev => ({
      ...prev,
      input,
      mode
    }))
  }, [searchParams])

  const styles = [
    { id: 'peppa-pig', name: 'Peppa Pig Style', color: '#F1948A' },
    { id: 'pixi-book', name: 'Pixi-Buch Style', color: '#A8E6CF' },
    { id: 'watercolor', name: 'Ghibli Style', color: '#7B9AE0' },
    { id: 'comic', name: 'Cartoon Style', color: '#F4D03F' },
  ]

  const lengths = [
    { id: 8, name: 'Short', pages: '8' },
    { id: 12, name: 'Medium', pages: '12' },
    { id: 16, name: 'Long', pages: '16' },
  ]

  const handleCreateStory = async () => {
    // Navigate to generation page
    router.push(`/story/generate?${new URLSearchParams({
      input: config.input,
      mode: config.mode,
      style: config.style,
      length: config.length
    }).toString()}`)
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 text-[#2C3E50] font-sans bg-[#FFF8F0] relative">
      {/* Home Button */}
      <HomeButton />
      
      {/* Header - mit korrektem Abstand für HomeButton */}
      <div className="w-full pt-16">
        <h2 className="text-3xl/tight font-semibold font-['Poppins'] text-[#2C3E50]">
          Choose the look & feel.
        </h2>
        <p className="text-base font-['Poppins'] text-[#95A5A6] mt-2">
          How should the illustrations appear?
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full flex-grow flex flex-col justify-center gap-8">
        {/* Visual Style Selection */}
        <div>
          <h3 className="font-['Poppins'] font-semibold text-lg mb-3">Visual Style</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
            {styles.map(style => (
              <button
                key={style.id}
                onClick={() => setConfig(prev => ({ ...prev, style: style.id }))}
                className={`flex-shrink-0 w-32 h-40 rounded-2xl p-3 border-2 flex flex-col justify-end transition-all duration-300 ${
                  config.style === style.id 
                    ? 'border-[#F4D03F]' 
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: style.color }}
              >
                <div className="w-full h-full rounded-xl bg-white/30 mb-2 flex items-center justify-center">
                  <Feather size={32} className="text-white"/>
                </div>
                <span className="font-['Poppins'] text-xs font-medium text-white">
                  {style.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Story Length Selection */}
        <div>
          <h3 className="font-['Poppins'] font-semibold text-lg mb-3">Story Length</h3>
          <div className="flex gap-3">
            {lengths.map(length => (
              <button
                key={length.id}
                onClick={() => setConfig(prev => ({ ...prev, length: length.id }))}
                className={`w-1/3 h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                  config.length === length.id 
                    ? 'bg-[#F7F1E8] border-2 border-[#7B9AE0]' 
                    : 'bg-[#F7F1E8]'
                }`}
              >
                <span className="font-['Poppins'] font-bold text-2xl text-[#2C3E50]">
                  {length.pages}
                </span>
                <span className="font-['Poppins'] text-sm text-[#95A5A6]">pages</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full pb-8">
        <button
          onClick={handleCreateStory}
          className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#FF8A65] to-[#F1948A] text-white font-['Poppins'] font-medium text-base shadow-[0px_4px_12px_rgba(255,138,101,0.3)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
        >
          <Sparkles size={20}/> Create Story
        </button>
      </div>
    </div>
  )
} 