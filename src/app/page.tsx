import { PlusCircle, Library, Sparkles, Moon } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 text-primary-navy font-sans bg-primary-warm">
      {/* Header */}
      <div className="w-full max-w-sm flex justify-between items-center pt-4 safe-area-top">
        <h1 className="font-bold text-4xl text-primary-navy">Mayari</h1>
        <button className="p-2 rounded-full bg-secondary-cream border-2 border-primary-blue/30 hover:border-primary-blue transition-all touch-target">
          <Library className="text-primary-navy" size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-sm flex-grow flex items-center justify-center magical-background">
        {/* Floating magical elements */}
        <div className="absolute w-72 h-72 bg-secondary-lavender/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/2 left-10 w-16 h-16 bg-secondary-peach/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-accent-mint/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        {/* Icons */}
        <Sparkles className="absolute top-1/4 left-1/4 text-accent-gold w-8 h-8 opacity-70 animate-float" style={{ animationDelay: '0.5s' }} />
        <Moon className="absolute bottom-1/3 right-1/4 text-primary-blue w-10 h-10 opacity-60 animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Central Text */}
        <p className="font-serif text-center text-lg max-w-xs text-primary-navy/80 z-10">
          Create magical bedtime stories with your child, one question at a time.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-4 pb-8 safe-area-bottom">
        <Link href="/story/setup" className="btn-primary">
          <PlusCircle size={20} />
          New Story
        </Link>
        <Link href="/library" className="btn-secondary">
          <Library size={20} />
          My Stories
        </Link>
      </div>
    </div>
  );
}