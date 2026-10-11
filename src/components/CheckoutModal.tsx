import React, { useState } from 'react';
import { CartItem } from '../types.ts';
import { X, CheckCircle, ShieldCheck, ArrowRight, Truck } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  packaging: string;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  packaging,
  onClearCart,
}) => {
  const [name, setName] = useState('Éléonore de Montmirail');
  const [email, setEmail] = useState('eleonore@montmirail.fr');
  const [phone, setPhone] = useState('+33 6 42 18 90 22');
  const [address, setAddress] = useState('18 Place Vendôme, 75001 Paris');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-14');
  const [deliverySlot, setDeliverySlot] = useState('09:00 - 12:00 Morning Courier');
  const [giftNote, setGiftNote] = useState('With warmest compliments and sweet wishes.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.pastry.price * item.quantity, 0);
  const packagingCost = packaging === 'insulated' ? 6 : packaging === 'linen' ? 4 : 0;
  const isFreeDelivery = subtotal >= 75;
  const deliveryCost = isFreeDelivery ? 0 : 8.5;
  const total = subtotal + packagingCost + deliveryCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const randomId = `ET-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedOrderId(randomId);
      onClearCart();
    }, 1200);
  };

  const handleFinish = () => {
    setConfirmedOrderId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={confirmedOrderId ? handleFinish : onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-xl bg-[#161412] border border-[#2D2821] rounded-2xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="p-6 border-b border-[#26211B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#C5A059]" />
            <h2 className="text-xl font-serif font-medium text-[#FDFBF7]">
              {confirmedOrderId ? 'Commande Confirmée' : 'Atelier Courier Checkout'}
            </h2>
          </div>
          <button
            onClick={confirmedOrderId ? handleFinish : onClose}
            aria-label="Close checkout"
            className="p-1.5 rounded-lg text-[#8C8375] hover:text-[#F3EFE6] hover:bg-[#201D1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrderId ? (
          /* Confirmation Receipt Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 bg-[#1F271D] text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-[#C5A059] font-medium mb-1">
                Order #{confirmedOrderId} Confirmed
              </div>
              <h3 className="text-2xl font-serif font-medium text-[#FDFBF7]">
                Your Haute Degustation Is Scheduled
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#A89F91] max-w-md mx-auto leading-relaxed">
                Our pastry chef will begin hand-tempering and glazing your selection at 5:00 AM on the day of delivery.
                Your chilled courier will arrive at <span className="text-[#F3EFE6] font-medium">{address}</span> between{' '}
                <span className="text-[#F3EFE6] font-medium">{deliverySlot}</span> on{' '}
                <span className="text-[#F3EFE6] font-medium">{deliveryDate}</span>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1B1815] border border-[#2B2620] text-left text-xs space-y-1.5">
              <div className="flex justify-between text-[#8C8375]">
                <span>Recipient:</span>
                <span className="text-[#FDFBF7]">{name}</span>
              </div>
              <div className="flex justify-between text-[#8C8375]">
                <span>Confirmation Dispatch:</span>
                <span className="text-[#FDFBF7]">{email}</span>
              </div>
              <div className="flex justify-between text-[#8C8375]">
                <span>Total Amount Paid:</span>
                <span className="text-[#D4AF37] font-serif text-sm font-medium tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#121110] font-semibold text-sm transition-all"
            >
              Return to Atelier
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-1.5">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1815] border border-[#2B2620] text-sm text-[#F3EFE6] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-1.5">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1815] border border-[#2B2620] text-sm text-[#F3EFE6] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-1.5">
                Email for Degustation Certificate
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1815] border border-[#2B2620] text-sm text-[#F3EFE6] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-1.5">
                Delivery Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1815] border border-[#2B2620] text-sm text-[#F3EFE6] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-1.5">
                  Courier Date
                </label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1815] border border-[#2B2620] text-sm text-[#F3EFE6] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-1.5">
                  Time Slot
                </label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1815] border border-[#2B2620] text-sm text-[#F3EFE6] focus:outline-none focus:border-[#C5A059]"
                >
                  <option>09:00 - 12:00 Morning Courier</option>
                  <option>13:00 - 16:00 Afternoon Courier</option>
                  <option>17:00 - 20:00 Evening Dinner Service</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block mb-1.5">
                Handwritten Calligraphy Gift Card (Complimentary)
              </label>
              <input
                type="text"
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="Include a personal message..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1815] border border-[#2B2620] text-sm text-[#F3EFE6] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Total Strip */}
            <div className="pt-4 border-t border-[#26211B] flex items-center justify-between">
              <div>
                <div className="text-[11px] text-[#8C8375]">Total to be charged:</div>
                <div className="text-xl font-serif text-[#D4AF37] font-medium tabular-nums">
                  ${total.toFixed(2)}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#121110] font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#C5A059]/20 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>Confirm Degustation Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
