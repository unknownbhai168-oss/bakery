import React, { useState } from 'react';
import { Sparkles, Thermometer, Clock, ShieldCheck, Flame } from 'lucide-react';

interface PairingGuide {
  category: string;
  idealTemp: string;
  shelfLife: string;
  sommelierPairing: string;
  tastingNote: string;
}

const PAIRING_DATA: PairingGuide[] = [
  {
    category: 'Entremets & Layered Cakes',
    idealTemp: '14°C — 16°C (Remove from chill 20 min prior)',
    shelfLife: '48 hours under refrigeration',
    sommelierPairing: 'Champagne Grand Cru Blanc de Noirs or Ethiopian Gesha Drip',
    tastingNote: 'Tempering softens the cocoa butter in the ganache, unleashing floral jasmine and red fruit nuances in the mirror glaze.',
  },
  {
    category: 'Haute Brioche Donuts',
    idealTemp: 'Fresh Room Temperature (20°C — 22°C)',
    shelfLife: 'Same day consumption recommended',
    sommelierPairing: 'Flat White with oat milk or Darjeeling First Flush Tea',
    tastingNote: 'The slow-proofed brioche crumb retains moist pillowy elasticity without oily residue.',
  },
  {
    category: 'Macarons Parisiens',
    idealTemp: '10°C — 12°C (Delicate chilled bite)',
    shelfLife: '5 days in sealed temperature box',
    sommelierPairing: 'Matcha Uji Ceremonial Grade or Tokaji Aszú 5 Puttonyos',
    tastingNote: 'The moisture from the whipped ganache gently migrates into the almond meringue, yielding a crisp crust with a chewy heart.',
  },
  {
    category: 'Artisanal Viennoiserie',
    idealTemp: 'Warm 30°C (Reheat 3 min at 160°C oven)',
    shelfLife: 'Best within 12 hours of morning bake',
    sommelierPairing: 'Single-Origin Cortado or Fresh Tangerine Juice',
    tastingNote: 'Thermal reactivation restores the 27 laminated butter layers to instant shatteringly crisp resonance.',
  },
];

export const StorySection: React.FC = () => {
  const [activeGuideIndex, setActiveGuideIndex] = useState(0);
  const activeGuide = PAIRING_DATA[activeGuideIndex];

  return (
    <section id="craft" className="relative z-10 py-16 lg:py-24 bg-[#141210]/90 border-y border-[#26221D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#C5A059] font-medium mb-3">
            <span>Atelier Terroir & Méthode</span>
            <span aria-hidden="true">·</span>
            <span>Zero Artificial Compromise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#FDFBF7] tracking-tight">
            The Four Foundations of Haute Pâtisserie
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A89F91] leading-relaxed">
            Every creation produced in our kitchen begins with rigorous ingredient provenance,
            uncompromising thermal precision, and slow multi-day patience.
          </p>
        </div>

        {/* 4 Foundations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-20">
          <div className="p-6 rounded-2xl bg-[#181614] border border-[#2B2620]">
            <div className="text-2xl font-serif text-[#C5A059] mb-3">01.</div>
            <h3 className="text-lg font-serif text-[#FDFBF7] font-medium">AOP Charentes-Poitou Butter</h3>
            <p className="mt-2 text-xs sm:text-sm text-[#A89F91] leading-relaxed">
              We exclusively use 84% butterfat dry churned winter butter from protected Poitou pastures.
              Its higher melting curve allows us to sculpt 27 honeycomb laminations without butter bleeding.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#181614] border border-[#2B2620]">
            <div className="text-2xl font-serif text-[#C5A059] mb-3">02.</div>
            <h3 className="text-lg font-serif text-[#FDFBF7] font-medium">Valrhona Grand Cru Cacao</h3>
            <p className="mt-2 text-xs sm:text-sm text-[#A89F91] leading-relaxed">
              Single-plantation Guanaja 70% from rare Criollo and Trinitario beans. We balance bitter
              woodiness with high-fat Normandy cream to form a flawless, mirror-like chocolate ganache.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#181614] border border-[#2B2620]">
            <div className="text-2xl font-serif text-[#C5A059] mb-3">03.</div>
            <h3 className="text-lg font-serif text-[#FDFBF7] font-medium">72-Hour Cold Retardation</h3>
            <p className="mt-2 text-xs sm:text-sm text-[#A89F91] leading-relaxed">
              No artificial baking powders or commercial speed-proofing. Our brioche dough rests in
              sub-zero cold rooms for 72 hours, allowing natural wild yeasts to develop complex aromatic esters.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#181614] border border-[#2B2620]">
            <div className="text-2xl font-serif text-[#C5A059] mb-3">04.</div>
            <h3 className="text-lg font-serif text-[#FDFBF7] font-medium">Pure Terroir Sourcing</h3>
            <p className="mt-2 text-xs sm:text-sm text-[#A89F91] leading-relaxed">
              DOP Bronte emerald pistachios grown on volcanic Sicilian slopes, wild Corrèze forest raspberries,
              and whole Tahitian vanilla beans hand-split for our daily creams.
            </p>
          </div>
        </div>

        {/* Interactive Degustation & Temperature Pairing Module */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#181614] border border-[#2D2821] shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#28231C]">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#C5A059] font-medium mb-1">
                Degustation Science
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#FDFBF7]">
                Ideal Serving Temperature & Pairing Guide
              </h3>
            </div>

            {/* Category Selector Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {PAIRING_DATA.map((p, idx) => (
                <button
                  key={p.category}
                  onClick={() => setActiveGuideIndex(idx)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeGuideIndex === idx
                      ? 'bg-[#C5A059] text-[#121110]'
                      : 'bg-[#221F1B] text-[#A89F91] hover:text-[#F3EFE6]'
                  }`}
                >
                  {p.category.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-[#8C8375] flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Serving Temperature</span>
              </div>
              <div className="text-base sm:text-lg font-serif text-[#FDFBF7] pt-1">
                {activeGuide.idealTemp}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-[#8C8375] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Peak Longevity</span>
              </div>
              <div className="text-base sm:text-lg font-serif text-[#FDFBF7] pt-1">
                {activeGuide.shelfLife}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-[#8C8375] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Sommelier Accord</span>
              </div>
              <div className="text-base sm:text-lg font-serif text-[#FDFBF7] pt-1">
                {activeGuide.sommelierPairing}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#26211A] text-xs sm:text-sm text-[#BDB4A5] leading-relaxed">
            <span className="text-[#C5A059] font-medium mr-2">Chef Note:</span>
            {activeGuide.tastingNote}
          </div>
        </div>
      </div>
    </section>
  );
};
