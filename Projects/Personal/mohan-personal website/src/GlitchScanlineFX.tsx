import React from 'react';

const GlitchScanlineFX: React.FC = () => (
  <div className="glitch-scanline-fx fixed inset-0 w-full h-full pointer-events-none z-0">
    <div className="scanlines absolute inset-0 w-full h-full" />
    <div className="glitch absolute inset-0 w-full h-full" />
  </div>
);

export default GlitchScanlineFX; 