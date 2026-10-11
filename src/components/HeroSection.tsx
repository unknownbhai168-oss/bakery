import React from 'react';
import { Hero3DStudio } from './three/Hero3DStudio.tsx';
import { GlazeFinish } from '../types.ts';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onCustomCake: () => void;
  onAddToCart: (pastryId: string, finish: GlazeFinish) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMenu,
  onCustomCake,
  onAddToCart,
}) => {
  return (
    <section id="hero" className="relative z-10 pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Split: Editorial Brand Narrative + 3D Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Typography & Brand Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Unboxed clean metadata kicker (anti-slop: no pills) */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A059] font-medium mb-4">
              <span>Maison Fondée 2018</span>
              <span aria-hidden="true">·</span>
              <span>Paris</span>
              <span aria-hidden="true">/</span>
              <span>Tokyo</span>
              <span aria-hidden="true">/</span>
              <span>New York</span>
            </div>

            {/* Headline with balanced wrapping */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-[#FDFBF7] leading-[1.08] [text-wrap:balance]">
              Haute Pâtisserie, Sculpted in Light & Sugar.
            </h1>

            {/* Body Prose */}
            <p className="mt-5 text-base sm:text-lg text-[#BDB4A5] leading-relaxed max-w-xl font-light">
              Where classical French architectural pastry mastery meets modern sensory refinement.
              Experience multi-tiered entremets, voluptuous brioche donuts with mirror glazes,
              and shatteringly delicate macarons—baked fresh at dawn from Normandy AOP terroir butter
              and single-origin Grand Cru cacao.
            </p>

            {/* Dual CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreMenu}
                className="px-6 py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#121110] font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#C5A059]/15 flex items-center gap-2.5 whitespace-nowrap shrink-0"
              >
                <span>Explore Haute Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onCustomCake}
                className="px-6 py-3.5 rounded-xl bg-[#1A1815] hover:bg-[#25221E] border border-[#302B24] text-[#F3EFE6] hover:text-[#D4AF37] font-medium text-sm transition-all duration-200 active:scale-[0.98] flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>Design Custom Cake</span>
              </button>
            </div>

            {/* Proof Points Strip Adjacent to Claim */}
            <div className="mt-10 pt-8 border-t border-[#26221D] grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-2xl font-serif font-medium text-[#FDFBF7] tabular-nums">100%</div>
                <div className="text-xs text-[#8C8375] mt-0.5">AOP Charentes Butter</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-medium text-[#FDFBF7] tabular-nums">72h</div>
                <div className="text-xs text-[#8C8375] mt-0.5">Slow Fermentation</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-medium text-[#FDFBF7] tabular-nums">6 AM</div>
                <div className="text-xs text-[#8C8375] mt-0.5">Baked Daily at Dawn</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Pastry Studio */}
          <div className="lg:col-span-7 w-full">
            <Hero3DStudio onAddToCart={onAddToCart} />
          </div>
        </div>

        {/* 4-Item Heritage Banner below hero */}
        <div className="mt-14 py-6 px-6 rounded-2xl bg-[#161412]/60 border border-[#26221D] backdrop-blur-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-sm font-medium text-[#FDFBF7]">Single-Origin Valrhona</div>
            <div className="text-xs text-[#8C8375]">Guanaja 70% & Caraïbe 66% cacao</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-[#FDFBF7]">24-Karat Gold Leaf</div>
            <div className="text-xs text-[#8C8375]">Certified edible culinary gold</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-[#FDFBF7]">Chilled Courier Service</div>
            <div className="text-xs text-[#8C8375]">Insulated temperature delivery</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-[#FDFBF7]">Bespoke Monogram</div>
            <div className="text-xs text-[#8C8375]">Hand-piped chocolate plaque</div>
          </div>
        </div>
      </div>
    </section>
  );
};
