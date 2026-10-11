import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 3500);
  };

  return (
    <footer className="relative z-10 bg-[#0E0D0C] border-t border-[#24201A] text-[#B8AF9F] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-serif text-2xl text-[#FDFBF7] font-medium tracking-tight">
              L'Étoile Pâtisserie
            </h2>
            <p className="text-xs sm:text-sm text-[#8C8375] leading-relaxed max-w-sm">
              Haute French confectionery sculpted by architectural geometry,
              uncompromising butterfat density, and daily morning devotion.
            </p>
            <div className="text-[11px] text-[#736B5D] pt-2">
              © {new Date().getFullYear()} L'Étoile Pâtisserie Atelier. All rights reserved.
            </div>
          </div>

          {/* Boutique Locations */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-medium">Paris Atelier</h3>
            <p className="text-[#A89F91]">18 Place Vendôme</p>
            <p className="text-[#736B5D]">75001 Paris, France</p>
            <p className="text-[#8C8375] text-[11px]">Mar–Dim · 08:00 — 19:30</p>
          </div>

          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-medium">Tokyo Atelier</h3>
            <p className="text-[#A89F91]">5-7-22 Minami-Aoyama</p>
            <p className="text-[#736B5D]">Minato-ku, Tokyo 107-0062</p>
            <p className="text-[#8C8375] text-[11px]">Wed–Mon · 10:00 — 20:00</p>
          </div>

          {/* Tasting Club Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-medium">Private Tasting Gazette</h3>
            <p className="text-xs text-[#8C8375] leading-relaxed">
              Receive private invitations to seasonal Grand Cru releases, limited batch macaron drops,
              and masterclass allocations.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#161412] border border-[#2B2620] text-xs text-[#F3EFE6] placeholder-[#6E6659] focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                aria-label="Subscribe to Private Tasting Gazette"
                className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#121110] font-semibold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
              >
                {isSubscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
            {isSubscribed && (
              <p className="text-[11px] text-[#D4AF37]">
                Merci. You will receive private tasting notes in your inbox.
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
