import React, { useState } from 'react';
import { PastryItem, Category, GlazeFinish } from '../types.ts';
import { PASTRY_CATALOG } from '../data/pastryData.ts';
import { MiniPastry3DView } from './three/MiniPastry3DView.tsx';
import { Plus, Check, Eye, Search } from 'lucide-react';

interface FeaturedCollectionProps {
  onSelectPastry: (pastry: PastryItem) => void;
  onAddToCart: (pastryId: string, finish?: GlazeFinish) => void;
}

const CATEGORY_TABS: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Creations' },
  { id: 'entremets', label: 'Signature Entremets' },
  { id: 'donuts', label: 'Brioche Donuts' },
  { id: 'macarons', label: 'Macarons Parisiens' },
  { id: 'viennoiserie', label: 'Artisanal Viennoiserie' },
  { id: 'boxes', label: 'Tasting Gift Boxes' },
];

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
  onSelectPastry,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const filteredPastries = PASTRY_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.frenchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.flavorNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (pastryId: string) => {
    onAddToCart(pastryId, 'mirror');
    setAddedItemIds((prev) => ({ ...prev, [pastryId]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [pastryId]: false }));
    }, 2000);
  };

  return (
    <section id="collection" className="relative z-10 py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A059] font-medium mb-2">
            <span>La Collection Gastronomique</span>
            <span aria-hidden="true">·</span>
            <span>Handcrafted Daily</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#FDFBF7] tracking-tight">
            Curated Pastry Catalog
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#A89F91] max-w-xl">
            Each creation is sculpted individually with precision temperature control,
            AOP dry churned butter, and pristine organic ingredients.
          </p>
        </div>

        {/* Search input with clean luxury border */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8375]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flavor, ingredient..."
            aria-label="Search pastries by name or ingredient"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181614] border border-[#2B2620] text-sm text-[#F3EFE6] placeholder-[#6E6659] focus:outline-none focus:border-[#C5A059] transition-colors"
          />
        </div>
      </div>

      {/* Category Tabs (Segmented Control Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 ${
              selectedCategory === tab.id
                ? 'bg-[#C5A059] text-[#121110] font-semibold shadow-md'
                : 'bg-[#181614] hover:bg-[#221F1B] text-[#A89F91] hover:text-[#F3EFE6] border border-[#28241E]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Cards Grid: 3-column desktop */}
      {filteredPastries.length === 0 ? (
        <div className="text-center py-20 bg-[#161412] rounded-2xl border border-[#26221D]">
          <p className="text-lg font-serif text-[#FDFBF7]">No pastry found matching your search</p>
          <p className="text-xs text-[#8C8375] mt-1">Try searching for chocolate, vanilla, raspberry, or pistachio.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 text-xs text-[#C5A059] border border-[#C5A059]/40 rounded-lg hover:bg-[#C5A059]/10"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPastries.map((item) => {
            const isAdded = addedItemIds[item.id] || false;
            const isCardHovered = hoveredCardId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="group relative flex flex-col justify-between rounded-2xl bg-[#161412] border border-[#28231D] hover:border-[#C5A059]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 overflow-hidden"
              >
                {/* 3D Interactive Pastry Canvas Header (60-70% height emphasis) */}
                <div className="relative w-full h-64 bg-gradient-to-b from-[#1E1B18]/60 to-[#141210] overflow-hidden flex items-center justify-center border-b border-[#24201A]">
                  <MiniPastry3DView
                    modelType={item.modelType}
                    glazeColor={item.glazeColor}
                    accentColor={item.accentColor}
                    isHovered={isCardHovered}
                  />

                  {/* Clean unboxed text badge (top left) */}
                  {item.badge && (
                    <div className="absolute top-3.5 left-4 text-[11px] text-[#D4AF37] font-medium tracking-wide">
                      {item.badge}
                    </div>
                  )}

                  {/* 3D Inspect Action Overlay on hover */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onSelectPastry(item)}
                      className="p-2 rounded-lg bg-[#121110]/90 text-[#F3EFE6] hover:text-[#D4AF37] border border-[#332D24] text-xs flex items-center gap-1.5 backdrop-blur-sm"
                      title="Inspect tasting notes & 3D cross-section"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Inspect</span>
                    </button>
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Clean unboxed metadata with dot separators */}
                    <div className="flex items-center gap-2 text-xs text-[#8C8375] mb-1.5">
                      <span>{item.frenchName}</span>
                      {item.servings && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.servings}</span>
                        </>
                      )}
                    </div>

                    {/* Product Title */}
                    <h3
                      onClick={() => onSelectPastry(item)}
                      className="text-lg sm:text-xl font-serif font-medium text-[#FDFBF7] group-hover:text-[#D4AF37] transition-colors cursor-pointer"
                    >
                      {item.name}
                    </h3>

                    {/* Short Description */}
                    <p className="mt-2 text-xs sm:text-sm text-[#A89F91] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Flavor Notes (unboxed text) */}
                    <div className="mt-3 text-xs text-[#7A7163] flex items-center gap-1.5 flex-wrap">
                      {item.flavorNotes.slice(0, 3).map((note, idx) => (
                        <React.Fragment key={note}>
                          <span>{note}</span>
                          {idx < 2 && idx < item.flavorNotes.length - 1 && (
                            <span aria-hidden="true">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Price & Add to Cart Action */}
                  <div className="mt-6 pt-4 border-t border-[#24201A] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#736B5D]">Price</div>
                      <div className="text-xl font-serif font-medium text-[#FDFBF7] tabular-nums">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectPastry(item)}
                        className="px-3 py-2 rounded-xl bg-[#1F1C18] hover:bg-[#2B2721] text-[#A89F91] hover:text-[#F3EFE6] text-xs font-medium transition-colors"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleAdd(item.id)}
                        disabled={isAdded}
                        aria-label={`Add ${item.name} to tasting box`}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#C5A059] hover:bg-[#D4AF37] text-[#121110] active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
