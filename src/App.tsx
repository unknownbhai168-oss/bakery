/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PastryItem, CartItem, GlazeFinish, CakeConfig } from './types.ts';
import { PASTRY_CATALOG } from './data/pastryData.ts';
import { FloatingPastryCanvas } from './components/three/FloatingPastryCanvas.tsx';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { FeaturedCollection } from './components/FeaturedCollection.tsx';
import { StorySection } from './components/StorySection.tsx';
import { CustomCakeAtelier } from './components/CustomCakeAtelier.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { QuickViewModal } from './components/QuickViewModal.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      pastry: PASTRY_CATALOG[0], // Opéra Impérial
      quantity: 1,
      glazeFinish: 'mirror',
    },
    {
      pastry: PASTRY_CATALOG[2], // Haute Brioche Strawberry Donut
      quantity: 2,
      glazeFinish: 'mirror',
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [inspectPastry, setInspectPastry] = useState<PastryItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPackaging, setCheckoutPackaging] = useState('signature');

  // Total item count in cart
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Cart operations
  const handleAddToCart = (pastryId: string, finish: GlazeFinish = 'mirror') => {
    const pastry = PASTRY_CATALOG.find((p) => p.id === pastryId);
    if (!pastry) return;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.pastry.id === pastryId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      } else {
        return [...prev, { pastry, quantity: 1, glazeFinish: finish }];
      }
    });
  };

  const handleAddCustomCake = (customPastry: PastryItem, _config: CakeConfig) => {
    setCartItems((prev) => [
      ...prev,
      {
        pastry: customPastry,
        quantity: 1,
        glazeFinish: 'mirror',
      },
    ]);
  };

  const handleUpdateQuantity = (pastryId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(pastryId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.pastry.id === pastryId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (pastryId: string) => {
    setCartItems((prev) => prev.filter((item) => item.pastry.id !== pastryId));
  };

  const handleProceedToCheckout = (packaging: string) => {
    setCheckoutPackaging(packaging);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#121110] text-[#F3EFE6] selection:bg-[#C5A059] selection:text-[#121110] bg-grain font-sans">
      {/* 3D Floating Pastries Background (Rotates & Parallaxes on Scroll) */}
      <FloatingPastryCanvas />

      {/* Top Header Navigation (Complies strictly with 3-Zone Top Bar Contract) */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
      />

      <main>
        {/* Hero Section with Interactive 3D Studio Stage */}
        <HeroSection
          onExploreMenu={() => handleNavigate('collection')}
          onCustomCake={() => handleNavigate('custom-cake')}
          onAddToCart={handleAddToCart}
        />

        {/* Featured Pastry Collection Grid with Live 3D Miniature Viewports */}
        <FeaturedCollection
          onSelectPastry={(pastry) => setInspectPastry(pastry)}
          onAddToCart={handleAddToCart}
        />

        {/* The 4 Pillars of Haute Pâtisserie & Interactive Degustation Guide */}
        <StorySection />

        {/* Custom Celebration Cake 3D Atelier & Bespoke Builder */}
        <CustomCakeAtelier
          onAddCustomCake={handleAddCustomCake}
        />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Slide-Over Tasting Box Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Quick View Inspection Modal */}
      <QuickViewModal
        pastry={inspectPastry}
        onClose={() => setInspectPastry(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        packaging={checkoutPackaging}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
