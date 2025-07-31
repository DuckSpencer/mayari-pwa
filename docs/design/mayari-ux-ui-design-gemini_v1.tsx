import React, { useState } from 'react';
import { Home, BookOpen, Sparkles, Wand2, Settings, ArrowRight, ArrowLeft, FileText, Share2, Save, RefreshCw, PlusCircle, BookCopy, ChevronLeft, ChevronRight, Star, Sun, Moon, BrainCircuit, BookImage, Image, Pipette, Paintbrush, Feather, PenTool, Lightbulb, Library, User, LogIn, LogOut, Mail, KeyRound, Loader2, Heart, Download, MoreHorizontal, Trash2, WifiOff, AlertTriangle } from 'lucide-react';

// Helper component for the iPhone frame
const IPhoneFrame = ({ children }) => (
  <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[10px] rounded-[2.5rem] h-[800px] w-[380px] shadow-xl">
    <div className="w-[140px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
    <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[13px] top-[72px] rounded-s-lg"></div>
    <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[13px] top-[124px] rounded-s-lg"></div>
    <div className="h-[46px] w-[3px] bg-gray-800 absolute -end-[13px] top-[124px] rounded-e-lg"></div>
    <div className="rounded-[2rem] overflow-hidden w-full h-full bg-[#FFF8F0]">
      {children}
    </div>
  </div>
);

// Helper for screen navigation
const ScreenNavigator = ({ currentScreen, totalScreens, onNext, onPrev }) => (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
    <button onClick={onPrev} className="p-2 bg-white/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/80 transition-colors">
      <ChevronLeft className="text-[#2C3E50]" />
    </button>
    <span className="text-sm font-semibold text-[#2C3E50] w-28 text-center">{`Screen ${currentScreen + 1} / ${totalScreens}`}</span>
    <button onClick={onNext} className="p-2 bg-white/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/80 transition-colors">
      <ChevronRight className="text-[#2C3E50]" />
    </button>
  </div>
);

// --- Component Definition for each screen ---

// Screen 1: Start Screen
const StartScreen = () => (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 text-[#2C3E50] font-sans bg-[#FFF8F0]">
      <div className="w-full flex justify-between items-center pt-4">
          <h1 className="font-['Poppins'] text-3xl font-bold text-[#2C3E50]">Mayari</h1>
          <button className="p-2 rounded-full bg-[#F7F1E8] border-2 border-[#7B9AE0]/30 hover:border-[#7B9AE0] transition-all">
              <User className="text-[#2C3E50]" size={20} />
          </button>
      </div>
      <div className="relative w-full flex-grow flex items-center justify-center">
          <div className="absolute w-72 h-72 bg-[#D4C5F0]/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/2 left-10 w-16 h-16 bg-[#FFB4A1]/30 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 bg-[#A8E6CF]/30 rounded-full blur-2xl"></div>
          <Sparkles className="absolute top-1/4 left-1/4 text-[#F4D03F] w-8 h-8 opacity-70" />
          <Moon className="absolute bottom-1/3 right-1/4 text-[#7B9AE0] w-10 h-10 opacity-60" />
          <p className="font-['Georgia'] text-center text-lg max-w-xs text-[#2C3E50]/80">
              Create magical bedtime stories with your child, one question at a time.
          </p>
      </div>
      <div className="w-full flex flex-col gap-4 pb-8">
        <button className="w-full h-[52px] rounded-full bg-gradient-to-r from-[#FF8A65] to-[#F1948A] text-white font-['Poppins'] font-medium text-base shadow-[0px_4px_12px_rgba(255,138,101,0.3)] flex items-center justify-center gap-2 transition-transform hover:scale-105">
          <PlusCircle size={20} />
          New Story
        </button>
        <button className="w-full h-[48px] rounded-full bg-[#F7F1E8] text-[#2C3E50] border-2 border-[#7B9AE0] font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105">
          <Library size={20} />
          My Stories
        </button>
      </div>
    </div>
);

// Screen 2: Login Screen
const LoginScreen = () => (
    <div className="w-full h-full flex flex-col justify-between p-6 text-[#2C3E50] font-sans bg-[#FFF8F0]">
        <div className="w-full pt-12">
            <h2 className="text-4xl font-bold font-['Poppins'] text-[#2C3E50]">Welcome Back</h2>
            <p className="text-base font-['Poppins'] text-[#95A5A6] mt-2">Let's continue the adventure.</p>
        </div>
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="font-['Poppins'] text-sm font-medium text-[#2C3E50]">Email</label>
                <input type="email" placeholder="you@example.com" className="h-[56px] px-4 rounded-2xl bg-white border-2 border-[#7B9AE0]/30 focus:border-[#7B9AE0] focus:ring-0 outline-none placeholder:text-[#95A5A6]" />
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-['Poppins'] text-sm font-medium text-[#2C3E50]">Password</label>
                <input type="password" placeholder="••••••••" className="h-[56px] px-4 rounded-2xl bg-white border-2 border-[#7B9AE0]/30 focus:border-[#7B9AE0] focus:ring-0 outline-none placeholder:text-[#95A5A6]" />
            </div>
            <p className="text-sm text-right text-[#F48FB1] font-medium font-['Poppins']">Incorrect password. Please try again.</p>
        </div>
        <div className="w-full flex flex-col gap-4 pb-8">
            <button className="w-full h-[52px] rounded-full bg-[#7B9AE0] text-white font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105">
                Log In
            </button>
            <p className="text-center text-sm text-[#95A5A6]">
                Don't have an account? <a href="#" className="font-semibold text-[#7B9AE0]">Sign Up</a>
            </p>
        </div>
    </div>
);

// Screen 3: Registration Screen
const RegistrationScreen = () => (
    <div className="w-full h-full flex flex-col justify-between p-6 text-[#2C3E50] font-sans bg-[#FFF8F0]">
        <div className="w-full pt-12">
            <h2 className="text-4xl font-bold font-['Poppins'] text-[#2C3E50]">Create Account</h2>
            <p className="text-base font-['Poppins'] text-[#95A5A6] mt-2">Start your magical journey with us.</p>
        </div>
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="font-['Poppins'] text-sm font-medium text-[#2C3E50]">Email</label>
                <input type="email" placeholder="you@example.com" className="h-[56px] px-4 rounded-2xl bg-white border-2 border-[#7B9AE0]/30 focus:border-[#7B9AE0] focus:ring-0 outline-none placeholder:text-[#95A5A6]" />
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-['Poppins'] text-sm font-medium text-[#2C3E50]">Password</label>
                <input type="password" placeholder="Create a password" className="h-[56px] px-4 rounded-2xl bg-white border-2 border-[#7B9AE0]/30 focus:border-[#7B9AE0] focus:ring-0 outline-none placeholder:text-[#95A5A6]" />
            </div>
             <div className="flex flex-col gap-2">
                <label className="font-['Poppins'] text-sm font-medium text-[#2C3E50]">Confirm Password</label>
                <input type="password" placeholder="Confirm your password" className="h-[56px] px-4 rounded-2xl bg-white border-2 border-[#7B9AE0]/30 focus:border-[#7B9AE0] focus:ring-0 outline-none placeholder:text-[#95A5A6]" />
            </div>
        </div>
        <div className="w-full flex flex-col gap-4 pb-8">
            <button className="w-full h-[52px] rounded-full bg-gradient-to-r from-[#FF8A65] to-[#F1948A] text-white font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105">
                Sign Up
            </button>
            <p className="text-center text-sm text-[#95A5A6]">
                Already have an account? <a href="#" className="font-semibold text-[#7B9AE0]">Log In</a>
            </p>
        </div>
    </div>
);

// Screen 4: Story Setup (Page 1)
const SetupScreen1 = () => {
  const [mode, setMode] = useState('fantasy');
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 text-[#2C3E50] font-sans relative bg-[#FFF8F0]">
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out -z-10 ${mode === 'realistic' ? 'bg-gradient-to-br from-[#5DADE2]/20 to-[#FFF8F0]' : 'bg-gradient-to-br from-[#BB8FCE]/20 to-[#FFF8F0]'}`}></div>
      <div className="w-full pt-8 z-10">
          <h2 className="text-3xl/tight font-semibold font-['Poppins'] text-[#2C3E50]">What should your story be about?</h2>
          <p className="text-base font-['Poppins'] text-[#95A5A6] mt-2">Ask a question or enter a topic.</p>
      </div>
      <div className="w-full flex-grow flex flex-col justify-center gap-8 z-10">
          <textarea
              placeholder="e.g., Why is the sky blue?"
              className={`w-full h-32 p-4 rounded-2xl bg-white/50 border-2 transition-colors duration-300 placeholder:text-[#95A5A6] focus:ring-0 outline-none text-lg font-['Georgia'] ${mode === 'realistic' ? 'border-[#5DADE2]/50 focus:border-[#5DADE2]' : 'border-[#BB8FCE]/50 focus:border-[#BB8FCE]'}`}
          />
          <div className="w-full">
              <div className="relative w-full h-16 bg-[#F7F1E8] rounded-full p-2 flex items-center">
                  <div className={`absolute top-1 left-1 w-[calc(50%-4px)] h-14 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${mode === 'fantasy' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                  <button onClick={() => setMode('realistic')} className="w-1/2 h-full rounded-full z-10 flex items-center justify-center gap-2 font-['Poppins'] font-medium transition-colors" style={{color: mode === 'realistic' ? '#5DADE2' : '#95A5A6'}}>
                      <Lightbulb size={20}/> Realistic
                  </button>
                  <button onClick={() => setMode('fantasy')} className="w-1/2 h-full rounded-full z-10 flex items-center justify-center gap-2 font-['Poppins'] font-medium transition-colors" style={{color: mode === 'fantasy' ? '#BB8FCE' : '#95A5A6'}}>
                      <Wand2 size={20}/> Fantasy
                  </button>
              </div>
          </div>
      </div>
      <div className="w-full pb-8 z-10">
          <button className="w-full h-[52px] rounded-full bg-[#7B9AE0] text-white font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105">
              Next Step <ArrowRight size={20} />
          </button>
      </div>
    </div>
  );
};

// Screen 5: Story Configuration (Page 2)
const SetupScreen2 = () => {
  const [style, setStyle] = useState('style1');
  const [length, setLength] = useState('medium');
  const styles = [
    { id: 'style1', name: 'Peppa Pig Style', color: '#F1948A' },
    { id: 'style2', name: 'Pixi-Buch Style', color: '#A8E6CF' },
    { id: 'style3', name: 'Ghibli Style', color: '#7B9AE0' },
    { id: 'style4', name: 'Cartoon Style', color: '#F4D03F' },
  ];
  const lengths = [
      {id: 'short', name: 'Short', pages: '8'},
      {id: 'medium', name: 'Medium', pages: '12'},
      {id: 'long', name: 'Long', pages: '16'},
  ];
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 text-[#2C3E50] font-sans bg-[#FFF8F0]">
      <div className="w-full pt-8">
          <h2 className="text-3xl/tight font-semibold font-['Poppins'] text-[#2C3E50]">Choose the look & feel.</h2>
          <p className="text-base font-['Poppins'] text-[#95A5A6] mt-2">How should the illustrations appear?</p>
      </div>
      <div className="w-full flex-grow flex flex-col justify-center gap-8">
          <div>
              <h3 className="font-['Poppins'] font-semibold text-lg mb-3">Visual Style</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
                  {styles.map(s => (
                      <button key={s.id} onClick={() => setStyle(s.id)} className={`flex-shrink-0 w-32 h-40 rounded-2xl p-3 border-2 flex flex-col justify-end transition-all duration-300 ${style === s.id ? 'border-[#F4D03F]' : 'border-transparent'}`} style={{backgroundColor: s.color}}>
                          <div className={`w-full h-full rounded-xl bg-white/30 mb-2 flex items-center justify-center`}>
                             <Feather size={32} className="text-white"/>
                          </div>
                          <span className="font-['Poppins'] text-xs font-medium text-white">{s.name}</span>
                      </button>
                  ))}
              </div>
          </div>
          <div>
              <h3 className="font-['Poppins'] font-semibold text-lg mb-3">Story Length</h3>
              <div className="flex gap-3">
                  {lengths.map(l => (
                      <button key={l.id} onClick={() => setLength(l.id)} className={`w-1/3 h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${length === l.id ? 'bg-[#F7F1E8] border-2 border-[#7B9AE0]' : 'bg-[#F7F1E8]'}`}>
                          <span className="font-['Poppins'] font-bold text-2xl text-[#2C3E50]">{l.pages}</span>
                          <span className="font-['Poppins'] text-sm text-[#95A5A6]">pages</span>
                      </button>
                  ))}
              </div>
          </div>
      </div>
      <div className="w-full pb-8">
          <button className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#FF8A65] to-[#F1948A] text-white font-['Poppins'] font-medium text-base shadow-[0px_4px_12px_rgba(255,138,101,0.3)] flex items-center justify-center gap-2 transition-transform hover:scale-105">
              <Sparkles size={20}/> Create Story
          </button>
      </div>
    </div>
  );
};

// Screen 6: Continue Story Screen
const ContinueStoryScreen = () => (
    <div className="w-full h-full flex flex-col justify-between p-6 text-[#2C3E50] font-sans bg-[#D4C5F0]/20">
        <div className="w-full pt-12">
            <h2 className="text-4xl font-bold font-['Poppins'] text-[#2C3E50]">Continue the Tale?</h2>
            <p className="text-base font-['Poppins'] text-[#95A5A6] mt-2">The adventure isn't over yet.</p>
        </div>
        <div className="w-full p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/80 shadow-lg">
            <h3 className="font-['Poppins'] font-semibold text-lg">The Little Fox's Key</h3>
            <p className="font-['Georgia'] text-sm text-[#2C3E50]/80 mt-2 line-clamp-3">
                The little fox found a shiny, golden key under a large mushroom. He didn't know what it opened, but his heart fluttered with excitement. He decided to ask the wisest animal he knew, the old owl...
            </p>
        </div>
        <div className="w-full flex flex-col gap-4 pb-8">
            <button className="w-full h-[52px] rounded-full bg-gradient-to-r from-[#7B9AE0] to-[#D4C5F0] text-white font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105">
                <PenTool size={20} /> Continue Story
            </button>
            <button className="w-full h-[48px] rounded-full bg-transparent text-[#2C3E50] font-['Poppins'] font-medium text-base flex items-center justify-center gap-2">
                Start a New One
            </button>
        </div>
    </div>
);

// Screen 7: Generating Screen
const GeneratingScreen = () => (
    <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center font-sans bg-[#FFF8F0] overflow-hidden">
      <div className="relative w-48 h-48">
        <Star className="text-[#F4D03F] w-24 h-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 animate-draw-star" />
        <PenTool size={48} className="text-[#7B9AE0] absolute animate-draw-pen" />
      </div>
      <h2 className="text-2xl font-semibold font-['Poppins'] text-[#2C3E50] mt-12">The magic is happening...</h2>
      <p className="text-base font-['Georgia'] text-[#95A5A6] mt-2">A little spark of imagination becomes a story.</p>
    </div>
);

// Screen 8: Reading View
const ReadingScreen = () => {
  const [page, setPage] = useState(3);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-400 text-white font-sans relative overflow-hidden">
      <img src="https://placehold.co/360x780/81C784/FFFFFF?text=Story+Image" className="absolute inset-0 w-full h-full object-cover" alt="Story page illustration" />
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative p-8 mt-auto w-full">
        <p className="font-['Georgia'] text-2xl/relaxed text-center" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
          The little fox found a shiny, golden key under a large mushroom.
        </p>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < page ? 'bg-[#F4D03F]' : 'bg-white/50'}`}></div>
        ))}
      </div>
    </div>
  );
};

// Screen 9: End-of-Story Screen
const EndScreen = () => (
    <div className="w-full h-full flex flex-col justify-between items-center p-6 text-[#2C3E50] font-sans bg-[#F7F1E8]">
      <div className="w-full pt-12 text-center">
          <BookCopy size={48} className="text-[#7B9AE0] mx-auto" />
          <h2 className="text-4xl font-bold font-['Poppins'] text-[#2C3E50] mt-4">The End</h2>
          <p className="text-base font-['Georgia'] text-[#95A5A6] mt-2">A wonderful story for another time.</p>
      </div>
      <div className="w-full flex-grow flex flex-col justify-center gap-3">
          <button className="w-full h-[52px] rounded-full bg-white border-2 border-[#7B9AE0] text-[#2C3E50] font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105">
              <RefreshCw size={20} /> Read Again
          </button>
          <button className="w-full h-[52px] rounded-full bg-white border-2 border-[#7B9AE0] text-[#2C3E50] font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105">
              <PlusCircle size={20} /> New Story
          </button>
          <button className="w-full h-[52px] rounded-full bg-white border-2 border-[#7B9AE0] text-[#2C3E50] font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105">
              <PenTool size={20} /> Continue Story
          </button>
      </div>
      <div className="w-full pb-8 flex flex-col gap-4">
        <button className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#FF8A65] to-[#F1948A] text-white font-['Poppins'] font-medium text-base shadow-[0px_4px_12px_rgba(255,138,101,0.3)] flex items-center justify-center gap-2 transition-transform hover:scale-105">
            <Save size={20} /> Save to My Stories
        </button>
      </div>
    </div>
);

// Screen 10: My Stories (Library)
const MyStoriesScreen = () => {
    const stories = [
        {title: "The Fox's Golden Key", img: "https://placehold.co/150x200/F1948A/FFFFFF?text=1"},
        {title: "Why the Sky is Blue", img: "https://placehold.co/150x200/7B9AE0/FFFFFF?text=2"},
        {title: "The Sleepy Mountain", img: "https://placehold.co/150x200/A8E6CF/FFFFFF?text=3"},
        {title: "A Star's Journey", img: "https://placehold.co/150x200/F4D03F/FFFFFF?text=4"},
    ];
    return (
        <div className="w-full h-full flex flex-col p-6 text-[#2C3E50] font-sans bg-[#FFF8F0]">
            <div className="w-full pt-8">
                <h2 className="text-4xl font-bold font-['Poppins'] text-[#2C3E50]">My Stories</h2>
                <p className="text-base font-['Poppins'] text-[#95A5A6] mt-2">Your collection of adventures.</p>
            </div>
            <div className="flex-grow w-full overflow-y-auto mt-6">
                <div className="grid grid-cols-2 gap-4">
                    {stories.map((story, i) => (
                        <div key={i} className="bg-[#F7F1E8] border-2 border-[#7B9AE0]/20 rounded-2xl shadow-[0px_6px_20px_rgba(44,62,80,0.08)] overflow-hidden">
                            <img src={story.img} alt={story.title} className="w-full h-32 object-cover" />
                            <div className="p-3">
                                <h3 className="font-['Poppins'] font-semibold text-sm line-clamp-2 h-10">{story.title}</h3>
                                <div className="flex justify-end mt-2">
                                    <button className="p-1 text-[#95A5A6] hover:text-[#2C3E50]"><MoreHorizontal size={16}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Screen 11: User Profile
const ProfileScreen = () => (
    <div className="w-full h-full flex flex-col p-6 text-[#2C3E50] font-sans bg-[#F7F1E8]">
        <div className="w-full pt-8">
            <h2 className="text-4xl font-bold font-['Poppins'] text-[#2C3E50]">Profile</h2>
        </div>
        <div className="flex-grow flex flex-col justify-center gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white">
                <User size={20} className="text-[#7B9AE0]" />
                <span className="font-['Poppins'] font-medium">user@example.com</span>
            </div>
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white">
                <KeyRound size={20} className="text-[#7B9AE0]" />
                <span className="font-['Poppins'] font-medium">Change Password</span>
            </button>
        </div>
        <div className="w-full pb-8">
            <button className="w-full h-[52px] rounded-full bg-white border-2 border-[#F48FB1] text-[#F48FB1] font-['Poppins'] font-medium text-base flex items-center justify-center gap-2">
                <LogOut size={20} /> Log Out
            </button>
        </div>
    </div>
);

// Screen 12: Shared Story (Public View)
const SharedStoryScreen = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-400 text-white font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 p-3 bg-black/30 backdrop-blur-sm z-10 text-center">
          <p className="font-['Poppins'] text-sm">You are viewing a shared story.</p>
      </div>
      <img src="https://placehold.co/360x780/BB8FCE/FFFFFF?text=Shared+Story" className="absolute inset-0 w-full h-full object-cover" alt="Story page illustration" />
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative p-8 mt-auto w-full">
        <p className="font-['Georgia'] text-2xl/relaxed text-center" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
          The magical cupcake granted one delicious wish!
        </p>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < 5 ? 'bg-[#F4D03F]' : 'bg-white/50'}`}></div>
        ))}
      </div>
    </div>
);

// Screen 13: Error/Offline Screen
const ErrorScreen = () => (
    <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center font-sans bg-[#FFF8F0]">
        <AlertTriangle size={64} className="text-[#F48FB1]" />
        <h2 className="text-3xl font-semibold font-['Poppins'] text-[#2C3E50] mt-6">Oops! Something went wrong.</h2>
        <p className="text-base font-['Georgia'] text-[#95A5A6] mt-2">We couldn't create your story right now. Please check your connection and try again.</p>
        <button className="mt-8 w-full h-[52px] rounded-full bg-[#7B9AE0] text-white font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105">
            <RefreshCw size={20} /> Try Again
        </button>
    </div>
);


// Main App Component
export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    <StartScreen />,
    <LoginScreen />,
    <RegistrationScreen />,
    <SetupScreen1 />,
    <SetupScreen2 />,
    <ContinueStoryScreen />,
    <GeneratingScreen />,
    <ReadingScreen />,
    <EndScreen />,
    <MyStoriesScreen />,
    <ProfileScreen />,
    <SharedStoryScreen />,
    <ErrorScreen />,
  ];

  const handleNext = () => {
    setCurrentScreen((prev) => (prev + 1) % screens.length);
  };

  const handlePrev = () => {
    setCurrentScreen((prev) => (prev - 1 + screens.length) % screens.length);
  };
  
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
        <style>
            {`
            @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Georgia&family=Poppins:wght@300;400;500;600;700&display=swap');
            @keyframes twinkle { 0% { opacity: 0.2; } 100% { opacity: 1; } }
            .animate-twinkle { animation: twinkle 2s infinite alternate; }
            @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .animate-spin-slow { animation: spin-slow 3s linear infinite; }
            @keyframes draw-pen {
              0% { top: 0%; left: 100%; transform: rotate(0deg); }
              20% { top: 40%; left: 60%; transform: rotate(-45deg); }
              40% { top: 60%; left: 20%; transform: rotate(10deg); }
              60% { top: 50%; left: 70%; transform: rotate(-25deg); }
              80% { top: 30%; left: 30%; transform: rotate(20deg); }
              100% { top: 0%; left: 100%; transform: rotate(0deg); }
            }
            .animate-draw-pen { animation: draw-pen 4s ease-in-out infinite; }
            @keyframes draw-star {
              0%, 20% { opacity: 0; transform: scale(0.5); }
              50% { opacity: 1; transform: scale(1); }
              80%, 100% { opacity: 0; transform: scale(1.2); }
            }
            .animate-draw-star { animation: draw-star 4s ease-in-out infinite; animation-delay: 0.2s; }
            `}
        </style>
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Mayari UI Design</h1>
            <p className="text-gray-600 mt-2">Use the arrows to navigate through the prototype.</p>
        </div>
        <div className="relative">
            <IPhoneFrame>
                {screens[currentScreen]}
            </IPhoneFrame>
            <ScreenNavigator currentScreen={currentScreen} totalScreens={screens.length} onNext={handleNext} onPrev={handlePrev} />
        </div>
    </div>
  );
}
