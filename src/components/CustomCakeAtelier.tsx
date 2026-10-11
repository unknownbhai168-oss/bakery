import React, { useState } from 'react';
import { GlazeFinish, CakeConfig, PastryItem } from '../types.ts';
import { MiniPastry3DView } from './three/MiniPastry3DView.tsx';
import { Sparkles, Calendar, Check, Gift } from 'lucide-react';

interface CustomCakeAtelierProps {
  onAddCustomCake: (customItem: PastryItem, config: CakeConfig) => void;
}

const TIER_OPTIONS = [
  { tiers: 1, label: 'Single Tier (6–8 guests)', price: 75, servings: 8 },
  { tiers: 2, label: 'Two Tiers (14–18 guests)', price: 145, servings: 16 },
  { tiers: 3, label: 'Three Tiers Grand (25–30 guests)', price: 260, servings: 28 },
];

const SPONGE_OPTIONS = [
  { id: 'almond_joconde', label: 'Almond Joconde Biscuit', extra: 0 },
  { id: 'guanaja_cacao', label: '70% Guanaja Chocolate Sponge', extra: 10 },
  { id: 'bourbon_vanilla', label: 'Madagascar Vanilla Genoise', extra: 0 },
  { id: 'bronte_pistachio', label: 'Bronte Green Pistachio Sponge', extra: 15 },
];

const FILLING_OPTIONS = [
  { id: 'vanilla_bavarian', label: 'Tahitian Vanilla Bavarian Cream' },
  { id: 'wild_raspberry', label: 'Wild Forest Raspberry Confit' },
  { id: 'salted_caramel', label: 'Guérande Salted Butter Caramel' },
  { id: 'espresso_ganache', label: 'Ethiopian Gesha Coffee Ganache' },
];

const GLAZE_FINISHES: { id: GlazeFinish; label: string; color: string }[] = [
  { id: 'mirror', label: 'Mirror Chocolate Noir', color: '#24140D' },
  { id: 'velours', label: 'Rose Velours Poudré', color: '#B53D58' },
  { id: 'gold_leaf', label: 'Edible 24K Gold Leaf', color: '#D4AF37' },
  { id: 'satin', label: 'Pistache Satin Crème', color: '#6A875D' },
];

export const CustomCakeAtelier: React.FC<CustomCakeAtelierProps> = ({
  onAddCustomCake,
}) => {
  const [selectedTier, setSelectedTier] = useState(TIER_OPTIONS[1]);
  const [selectedSponge, setSelectedSponge] = useState(SPONGE_OPTIONS[0]);
  const [selectedFilling, setSelectedFilling] = useState(FILLING_OPTIONS[0]);
  const [selectedGlaze, setSelectedGlaze] = useState(GLAZE_FINISHES[0]);
  const [inscription, setInscription] = useState('Pour Notre Amour');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-18');
  const [isSuccess, setIsSuccess] = useState(false);

  const totalPrice = selectedTier.price + selectedSponge.extra;

  const handleReserve = () => {
    const customPastry: PastryItem = {
      id: `custom-cake-${Date.now()}`,
      name: `Bespoke ${selectedTier.tiers}-Tier Atelier Cake`,
      frenchName: `Gâteau Sur Mesure (${selectedGlaze.label})`,
      category: 'entremets',
      price: totalPrice,
      description: `${selectedTier.label} crafted with ${selectedSponge.label}, layered with ${selectedFilling.label}, finished in ${selectedGlaze.label}. Chocolate Plaque: "${inscription || 'None'}".`,
      flavorNotes: [selectedSponge.label, selectedFilling.label, selectedGlaze.label],
      allergens: ['Dairy', 'Eggs', 'Gluten', 'Tree Nuts'],
      dietary: ['Vegetarian', 'Hand-Sculpted'],
      originIngredients: 'AOP Charentes-Poitou Butter, Grand Cru Cacao, Valrhona Ivoire',
      modelType: 'cake',
      glazeColor: selectedGlaze.color,
      servings: `${selectedTier.servings} guests`,
      badge: 'Bespoke Atelier Creation',
    };

    const config: CakeConfig = {
      tiers: selectedTier.tiers,
      sponge: selectedSponge.label,
      filling: selectedFilling.label,
      glaze: selectedGlaze.id,
      toppings: ['Fresh Berries', 'Gold Leaf', 'Chocolate Plaque'],
      inscription,
      servings: selectedTier.servings,
      deliveryDate,
    };

    onAddCustomCake(customPastry, config);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2400);
  };

  return (
    <section id="custom-cake" className="relative z-10 py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A059] font-medium mb-2">
          <span>Haute Couture Pâtisserie</span>
          <span aria-hidden="true">·</span>
          <span>Bespoke Celebration Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#FDFBF7] tracking-tight">
          Custom Celebration Cake Atelier
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#A89F91] max-w-xl">
          Design your bespoke centerpiece for galas, weddings, and milestones.
          Sculpted by our master entremetiers with your bespoke monogram.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Configurator Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Tiers Selection */}
          <div className="p-5 rounded-2xl bg-[#161412] border border-[#28231D]">
            <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-3">
              1. Architecture & Tier Height
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {TIER_OPTIONS.map((tier) => (
                <button
                  key={tier.tiers}
                  onClick={() => setSelectedTier(tier)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedTier.tiers === tier.tiers
                      ? 'bg-[#26211A] border-[#C5A059] text-[#FDFBF7]'
                      : 'bg-[#181614] border-[#2B2620] text-[#A89F91] hover:text-[#F3EFE6]'
                  }`}
                >
                  <div className="text-sm font-serif font-medium">{tier.label.split(' ')[0]} {tier.label.split(' ')[1]}</div>
                  <div className="text-xs text-[#8C8375] mt-0.5">{tier.servings} guests</div>
                  <div className="text-xs text-[#D4AF37] font-semibold mt-2 tabular-nums">${tier.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Sponge Biscuit */}
          <div className="p-5 rounded-2xl bg-[#161412] border border-[#28231D]">
            <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-3">
              2. Sponge Biscuit Foundation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SPONGE_OPTIONS.map((sponge) => (
                <button
                  key={sponge.id}
                  onClick={() => setSelectedSponge(sponge)}
                  className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                    selectedSponge.id === sponge.id
                      ? 'bg-[#26211A] border-[#C5A059] text-[#FDFBF7]'
                      : 'bg-[#181614] border-[#2B2620] text-[#A89F91] hover:text-[#F3EFE6]'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium">{sponge.label}</span>
                  {sponge.extra > 0 && (
                    <span className="text-xs text-[#D4AF37] ml-2 tabular-nums">+${sponge.extra}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Filling Core */}
          <div className="p-5 rounded-2xl bg-[#161412] border border-[#28231D]">
            <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-3">
              3. Cream & Confit Core
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FILLING_OPTIONS.map((filling) => (
                <button
                  key={filling.id}
                  onClick={() => setSelectedFilling(filling)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedFilling.id === filling.id
                      ? 'bg-[#26211A] border-[#C5A059] text-[#FDFBF7]'
                      : 'bg-[#181614] border-[#2B2620] text-[#A89F91] hover:text-[#F3EFE6]'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium">{filling.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Glaze Finish */}
          <div className="p-5 rounded-2xl bg-[#161412] border border-[#28231D]">
            <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-3">
              4. Haute Glaze & Finish
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {GLAZE_FINISHES.map((glaze) => (
                <button
                  key={glaze.id}
                  onClick={() => setSelectedGlaze(glaze)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedGlaze.id === glaze.id
                      ? 'bg-[#26211A] border-[#C5A059] text-[#FDFBF7]'
                      : 'bg-[#181614] border-[#2B2620] text-[#A89F91] hover:text-[#F3EFE6]'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full mb-1.5 border border-white/20 shadow-sm"
                    style={{ backgroundColor: glaze.color }}
                  />
                  <div className="text-xs font-medium">{glaze.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Inscription & Date */}
          <div className="p-5 rounded-2xl bg-[#161412] border border-[#28231D] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-2">
                Chocolate Plaque Monogram
              </label>
              <input
                type="text"
                value={inscription}
                onChange={(e) => setInscription(e.target.value)}
                maxLength={45}
                placeholder="e.g. Joyeux Anniversaire"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1815] border border-[#2D2821] text-sm text-[#F3EFE6] focus:outline-none focus:border-[#C5A059]"
              />
              <span className="text-[11px] text-[#736B5D] mt-1 block">Hand-piped in dark chocolate</span>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-2">
                Atelier Delivery Date
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1815] border border-[#2D2821] text-sm text-[#F3EFE6] focus:outline-none focus:border-[#C5A059]"
              />
              <span className="text-[11px] text-[#736B5D] mt-1 block">Requires minimum 48 hours notice</span>
            </div>
          </div>
        </div>

        {/* Right: Live 3D Preview & Atelier Order Summary */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="rounded-2xl bg-[#161412] border border-[#2B2620] overflow-hidden shadow-2xl">
            {/* Live 3D Cake Preview */}
            <div className="relative w-full h-72 bg-gradient-to-b from-[#1E1B18] to-[#121110] flex items-center justify-center border-b border-[#24201A]">
              <MiniPastry3DView
                modelType="cake"
                glazeColor={selectedGlaze.color}
                isHovered={true}
              />
              <div className="absolute top-4 left-4 text-xs font-serif text-[#D4AF37]">
                Live 3D Geometry Preview
              </div>
            </div>

            {/* Inscription Plaque Preview */}
            {inscription && (
              <div className="px-6 py-3 bg-[#1A1815] border-b border-[#26211A] text-center">
                <span className="text-xs text-[#8C8375] mr-2">Plaque Inscription:</span>
                <span className="font-serif italic text-sm text-[#E0D7C7]">"{inscription}"</span>
              </div>
            )}

            {/* Spec Breakdown */}
            <div className="p-6 space-y-3 text-xs sm:text-sm text-[#A89F91]">
              <div className="flex justify-between pb-2 border-b border-[#231F19]">
                <span>Tiers & Capacity:</span>
                <span className="text-[#FDFBF7] font-medium">{selectedTier.label}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#231F19]">
                <span>Sponge Biscuit:</span>
                <span className="text-[#FDFBF7] font-medium">{selectedSponge.label}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#231F19]">
                <span>Core Filling:</span>
                <span className="text-[#FDFBF7] font-medium">{selectedFilling.label}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#231F19]">
                <span>Glaze Finish:</span>
                <span className="text-[#FDFBF7] font-medium">{selectedGlaze.label}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-serif text-[#FDFBF7]">
                <span>Total Atelier Quote:</span>
                <span className="text-xl text-[#D4AF37] tabular-nums">${totalPrice.toFixed(2)}</span>
              </div>

              {/* Reserve CTA */}
              <button
                onClick={handleReserve}
                disabled={isSuccess}
                className={`w-full mt-4 py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                  isSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#C5A059] hover:bg-[#D4AF37] text-[#121110] font-semibold active:scale-[0.99] shadow-lg shadow-[#C5A059]/20'
                }`}
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added Bespoke Cake to Box</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>Reserve Bespoke Cake (${totalPrice})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
