import React from 'react';
import { useTranslation } from 'react-i18next';

// ==============================================
// MAIN LOGO COMPONENT
// ==============================================
// Contains: Central Perplexity branding
// Edit styling, text, or add animations here
const MainLogo = () => {
  const { i18n } = useTranslation();
  
  // Show "নিরাময়AI" for Bangla, "NiramoyAI" for English
  const logoText = i18n.language === 'bn' ? 'নিরাময়AI' : 'NiramoyAI';
  
  return (
    <div className="text-center mb-12">
      {/* PERPLEXITY TEXT LOGO */}
      {/* Edit font size, spacing, color here */}
      <h1 className="text-6xl font-extralight mb-2 tracking-wide text-white">
        {logoText}
      </h1>
      
      {/* Optional: Add tagline below logo */}
      {/* Uncomment and edit to add subtitle */}
      {/* <p className="text-zinc-500 text-lg">Where knowledge begins</p> */}
    </div>
  );
};

export default MainLogo;
