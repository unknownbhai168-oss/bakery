import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#121110]/90 backdrop-blur-md border-b border-[#26221D] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark in luxury display face */}
        <button
          onClick={() => onNavigate('hero')}
          className="text-left group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#FDFBF7] group-hover:text-[#D4AF37] transition-colors">
            L'Étoile Pâtisserie
          </span>
        </button>

        {/* Zone 2: 4 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#C8BFB0]">
          <button
            onClick={() => onNavigate('collection')}
            className="hover:text-[#FDFBF7] transition-colors whitespace-nowrap shrink-0 hover:underline decoration-[#C5A059] decoration-1 underline-offset-8"
          >
            Haute Menu
          </button>
          <button
            onClick={() => onNavigate('studio')}
            className="hover:text-[#FDFBF7] transition-colors whitespace-nowrap shrink-0 hover:underline decoration-[#C5A059] decoration-1 underline-offset-8"
          >
            3D Studio
          </button>
          <button
            onClick={() => onNavigate('craft')}
            className="hover:text-[#FDFBF7] transition-colors whitespace-nowrap shrink-0 hover:underline decoration-[#C5A059] decoration-1 underline-offset-8"
          >
            Terroir & Craft
          </button>
          <button
            onClick={() => onNavigate('custom-cake')}
            className="hover:text-[#FDFBF7] transition-colors whitespace-nowrap shrink-0 hover:underline decoration-[#C5A059] decoration-1 underline-offset-8"
          >
            Custom Cakes
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            aria-label={`Shopping bag containing ${cartCount} items`}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#1D1A17] hover:bg-[#282420] border border-[#302B24] text-[#F3EFE6] hover:text-[#D4AF37] transition-all text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
            <span>Tasting Box</span>
            {cartCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[11px] font-semibold bg-[#C5A059] text-[#121110] rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
