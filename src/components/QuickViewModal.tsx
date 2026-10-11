import React, { useState } from 'react';
import { PastryItem, GlazeFinish } from '../types.ts';
import { MiniPastry3DView } from './three/MiniPastry3DView.tsx';
import { X, Plus, Check, ShieldCheck, Sparkles } from 'lucide-react';

interface QuickViewModalProps {
  pastry: PastryItem | null;
  onClose: () => void;
  onAddToCart: (pastryId: string, finish?: GlazeFinish) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  pastry,
  onClose,
  onAddToCart,
}) => {
  const [isAdded, setIsAdded] = useState(false);

  if (!pastry) return null;

  const handleAdd = () => {
    onAddToCart(pastry.id, 'mirror');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#161412] border border-[#2D2821] rounded-2xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1F1C18]/80 text-[#8C8375] hover:text-[#F3EFE6] hover:bg-[#2A2621] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left: 3D Pastry Interactive Stage */}
          <div className="md:col-span-6 bg-gradient-to-b from-[#1F1C18] to-[#121110] relative flex items-center justify-center min-h-[300px] md:min-h-[420px] border-b md:border-b-0 md:border-r border-[#26211A]">
            <div className="w-full h-full absolute inset-0 flex items-center justify-center">
              <MiniPastry3DView
                modelType={pastry.modelType}
                glazeColor={pastry.glazeColor}
                accentColor={pastry.accentColor}
                isHovered={true}
              />
            </div>
            <div className="absolute bottom-4 left-4 text-[11px] text-[#A89F91]">
              Live 3D Specimen View
            </div>
          </div>

          {/* Right: Detailed Pastry Anatomy */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#C5A059] font-medium mb-1">
                {pastry.frenchName}
              </div>
              <h3 className="text-2xl font-serif font-medium text-[#FDFBF7]">
                {pastry.name}
              </h3>

              <div className="mt-2 text-2xl font-serif text-[#D4AF37] tabular-nums">
                ${pastry.price.toFixed(2)}
              </div>

              <p className="mt-4 text-xs sm:text-sm text-[#A89F91] leading-relaxed">
                {pastry.description}
              </p>

              {/* Flavor Profile Nuances */}
              <div className="mt-5 space-y-2.5">
                <div className="text-[11px] uppercase tracking-wider text-[#736B5D] font-medium">
                  Degustation Notes:
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs text-[#E0D7C7]">
                  {pastry.flavorNotes.map((note, idx) => (
                    <span key={note} className="bg-[#1F1C18] px-2.5 py-1 rounded-md border border-[#2B2620]">
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Origin Ingredients */}
              <div className="mt-4 pt-4 border-t border-[#231F19] text-xs text-[#8C8375]">
                <span className="text-[#C5A059] font-medium mr-1.5">Terroir Provenance:</span>
                <span>{pastry.originIngredients}</span>
              </div>

              {/* Allergens & Dietary */}
              <div className="mt-2 text-[11px] text-[#736B5D]">
                <span>Allergens: {pastry.allergens.join(', ')}</span>
              </div>
            </div>

            {/* Add to Box Action */}
            <div className="mt-6 pt-4 border-t border-[#24201A] flex items-center justify-between gap-4">
              <div className="text-xs text-[#8C8375]">
                {pastry.servings || 'Individual Serving'}
              </div>

              <button
                onClick={handleAdd}
                disabled={isAdded}
                className={`px-6 py-3 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#C5A059] hover:bg-[#D4AF37] text-[#121110] font-semibold active:scale-[0.98]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Box</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Tasting Box</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
