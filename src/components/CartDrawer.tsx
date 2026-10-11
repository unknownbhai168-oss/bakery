import React, { useState } from 'react';
import { CartItem } from '../types.ts';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (pastryId: string, quantity: number) => void;
  onRemoveItem: (pastryId: string) => void;
  onProceedToCheckout: (packaging: string) => void;
}

const PACKAGING_OPTIONS = [
  { id: 'signature', label: 'Signature Gold-Embossed Gift Box', price: 0, desc: 'Lustrous matte noir box with champagne ribbon' },
  { id: 'insulated', label: 'Thermal Cold-Chain Courier Box', price: 6, desc: 'Gel-pack chilled for 6 hours transit protection' },
  { id: 'linen', label: 'Normandy Artisan Linen Wrap', price: 4, desc: 'Reusable French natural baker linen cloth' },
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [selectedPackaging, setSelectedPackaging] = useState('signature');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.pastry.price * item.quantity, 0);
  const packagingCost = PACKAGING_OPTIONS.find((p) => p.id === selectedPackaging)?.price || 0;
  const freeShippingThreshold = 75;
  const isFreeDelivery = subtotal >= freeShippingThreshold;
  const deliveryCost = isFreeDelivery ? 0 : 8.5;
  const grandTotal = subtotal + packagingCost + (subtotal > 0 ? deliveryCost : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#161412] border-l border-[#2B2620] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#26211B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
              <h2 className="text-xl font-serif font-medium text-[#FDFBF7]">
                Your Tasting Box
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 rounded-lg text-[#8C8375] hover:text-[#F3EFE6] hover:bg-[#201D1A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Delivery Progress Strip */}
          <div className="px-6 py-3 bg-[#1B1815] border-b border-[#26211B]">
            <div className="flex justify-between text-xs text-[#A89F91] mb-1.5">
              <span>
                {isFreeDelivery
                  ? 'Complimentary chilled courier delivery unlocked'
                  : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} for complimentary courier delivery`}
              </span>
              <span className="font-semibold text-[#D4AF37] tabular-nums">
                {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#2A251E] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C5A059] transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#4A4237] mx-auto" />
                <p className="text-lg font-serif text-[#FDFBF7]">Your tasting box is empty</p>
                <p className="text-xs text-[#8C8375] max-w-xs mx-auto">
                  Explore our handcrafted entremets, brioche donuts, or custom cakes to begin.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-[#C5A059] border border-[#C5A059]/40 rounded-xl hover:bg-[#C5A059]/10"
                >
                  Explore Haute Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.pastry.id}
                  className="p-4 rounded-xl bg-[#1B1815] border border-[#2B2620] flex gap-4 items-start"
                >
                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#C5A059] font-medium line-clamp-1">
                      {item.pastry.frenchName}
                    </div>
                    <div className="text-sm font-serif font-medium text-[#FDFBF7] truncate">
                      {item.pastry.name}
                    </div>
                    <div className="text-xs text-[#8C8375] mt-0.5 tabular-nums">
                      ${item.pastry.price.toFixed(2)} each
                    </div>

                    {/* Quantity Stepper */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center border border-[#332D24] rounded-lg bg-[#141210]">
                        <button
                          onClick={() => onUpdateQuantity(item.pastry.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="p-1 hover:text-[#C5A059] text-[#A89F91] transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#FDFBF7] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.pastry.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-1 hover:text-[#C5A059] text-[#A89F91] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.pastry.id)}
                        aria-label={`Remove ${item.pastry.name}`}
                        className="text-[#736B5D] hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Total for item */}
                  <div className="text-sm font-serif font-medium text-[#FDFBF7] tabular-nums">
                    ${(item.pastry.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}

            {/* Packaging Presentation Options */}
            {items.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[#26211B]">
                <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-2.5">
                  Atelier Packaging Presentation
                </label>
                <div className="space-y-2">
                  {PACKAGING_OPTIONS.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackaging(pkg.id)}
                      className={`w-full p-3 rounded-xl text-left border transition-all flex items-start justify-between ${
                        selectedPackaging === pkg.id
                          ? 'bg-[#221D17] border-[#C5A059] text-[#FDFBF7]'
                          : 'bg-[#181614] border-[#2B2620] text-[#A89F91] hover:text-[#F3EFE6]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-medium text-[#FDFBF7]">{pkg.label}</div>
                        <div className="text-[11px] text-[#8C8375] mt-0.5">{pkg.desc}</div>
                      </div>
                      <div className="text-xs font-semibold text-[#D4AF37] tabular-nums ml-2">
                        {pkg.price === 0 ? 'Free' : `+$${pkg.price}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout Bar */}
          {items.length > 0 && (
            <div className="p-6 bg-[#181614] border-t border-[#26211B] space-y-3">
              <div className="space-y-1.5 text-xs text-[#A89F91]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#FDFBF7] font-medium tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging Presentation</span>
                  <span className="text-[#FDFBF7] font-medium tabular-nums">
                    {packagingCost === 0 ? 'Complimentary' : `$${packagingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Chilled White-Glove Courier</span>
                  <span className="text-[#FDFBF7] font-medium tabular-nums">
                    {isFreeDelivery ? 'Complimentary' : `$${deliveryCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#26211B] text-base font-serif text-[#FDFBF7]">
                  <span>Total Due</span>
                  <span className="text-xl text-[#D4AF37] font-medium tabular-nums">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onProceedToCheckout(selectedPackaging)}
                className="w-full py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#121110] font-semibold text-sm transition-all duration-200 active:scale-[0.99] shadow-lg shadow-[#C5A059]/20 flex items-center justify-center gap-2"
              >
                <span>Proceed to Tasting Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C8375] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Insulated freshness & temperature guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
