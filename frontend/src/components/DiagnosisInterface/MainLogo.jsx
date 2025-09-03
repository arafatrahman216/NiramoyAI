import React from 'react';

// ==============================================
// MAIN LOGO COMPONENT
// ==============================================
// Contains: Central Perplexity branding
// Edit styling, text, or add animations here
const MainLogo = () => {
  return (
    <div className="text-center mb-12">
      {/* PERPLEXITY TEXT LOGO */}
      {/* Edit font size, spacing, color here */}
      <h1 className="text-6xl font-extralight mb-2 tracking-wide text-white">
        NiramoyAI
      </h1>
      
      {/* Optional: Add tagline below logo */}
      {/* Uncomment and edit to add subtitle */}
      {/* <p className="text-zinc-500 text-lg">Where knowledge begins</p> */}
    </div>
  );
};

export default MainLogo;
