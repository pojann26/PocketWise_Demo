'use client';

import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-0 sm:p-4 text-neutral-800 antialiased selection:bg-lime-400 selection:text-neutral-900">
      {/* Outer Phone Mockup (rendered as a card with bezel on larger displays) */}
      <div className="relative w-full h-screen sm:w-[390px] sm:h-[844px] bg-black sm:rounded-[55px] sm:border-[12px] sm:border-neutral-800 sm:shadow-2xl sm:shadow-black/70 overflow-hidden flex flex-col transition-all duration-300">
        
        {/* iOS Dynamic Island notch (desktop/tablet mockup only) */}
        <div className="hidden sm:block absolute top-3.5 left-1/2 -translate-x-1/2 w-[110px] h-[30px] bg-black rounded-3xl z-50 pointer-events-none">
          <div className="absolute right-4 top-3.5 w-2.5 h-2.5 bg-neutral-900 rounded-full opacity-60"></div>
          <div className="absolute left-8 top-4.5 w-5 h-1 bg-neutral-900/50 rounded-full"></div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50 relative">
          {children}
        </div>

        {/* iOS Bottom Home Indicator (mockup only) */}
        <div className="hidden sm:block absolute bottom-2 left-1/2 -translate-x-1/2 w-[140px] h-[5px] bg-white rounded-full z-50 pointer-events-none opacity-20"></div>
      </div>
    </div>
  );
}
