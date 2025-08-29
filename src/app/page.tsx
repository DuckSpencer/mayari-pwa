import { PlusCircle, Library, Sparkles, Moon } from "lucide-react";
import { UserButton } from '@/components/auth/UserButton';
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 text-primary-navy font-sans bg-primary-warm">
      {/* Header */}
      <div className="w-full flex justify-center items-center pt-4 relative">
        <h1 className="font-['Poppins'] text-3xl font-bold text-primary-navy">Mayari</h1>
        <div className="absolute right-0">
          <UserButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative w-full flex-grow flex items-center justify-center">
        {/* Background Elements */}
        <div className="absolute w-72 h-72 bg-secondary-lavender/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/2 left-10 w-16 h-16 bg-secondary-peach/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-accent-mint/30 rounded-full blur-2xl"></div>
        
        {/* Floating Icons */}
        <Sparkles className="absolute top-1/4 left-1/4 text-accent-gold w-8 h-8 opacity-70" />
        <Moon className="absolute bottom-1/3 right-1/4 text-primary-blue w-10 h-10 opacity-60" />
        
        {/* Central Text */}
        <p className="font-['Georgia'] text-center text-lg max-w-xs text-primary-navy/80">
          Create magical bedtime stories with your child, one question at a time.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-4 pb-8">
        <Link 
          href="/story/setup" 
          className="w-full h-[52px] rounded-full bg-gradient-to-r from-accent-coral to-accent-rose text-white font-['Poppins'] font-medium text-base shadow-button-primary flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
        >
          <PlusCircle size={20} />
          New Story
        </Link>
        
        <Link 
          href="/stories" 
          className="w-full h-[48px] rounded-full bg-secondary-cream text-primary-navy border-2 border-primary-blue font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
        >
          <Library size={20} />
          My Stories
        </Link>
      </div>
    </div>
  );
}