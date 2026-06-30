import React from 'react';
import PixelBorder from './PixelBorder';

const Patrons = () => {
  const sponsors = [
    { name: 'Sponsor 1', tier: 'Title', color: 'var(--color-retro-cyan)' },
    { name: 'Sponsor 2', tier: 'Gold', color: 'var(--color-retro-yellow)' },
    { name: 'Sponsor 3', tier: 'Silver', color: 'var(--color-retro-red)' },
    { name: 'Sponsor 4', tier: 'Bronze', color: 'var(--color-retro-green)' },
    { name: 'Sponsor 5', tier: 'Partner', color: 'var(--color-retro-cyan)' },
    { name: 'Sponsor 6', tier: 'Partner', color: 'var(--color-retro-yellow)' },
  ];

  return (
    <section id="patrons" className="py-24 px-4 bg-retro-bg relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="inline-block font-pixel text-3xl md:text-5xl text-white uppercase text-shadow-pixel mb-4 border-b-4 border-retro-cyan pb-2">
            Patrons Unlocked
          </h2>
          <p className="font-sans text-gray-400 mt-4 max-w-2xl mx-auto">
            The power-ups that make this level possible.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <PixelBorder key={index} color={sponsor.color} className="p-8 flex flex-col items-center justify-center bg-retro-dark transform transition-transform hover:-translate-y-2">
              {/* Placeholder for Sponsor Logo */}
              <div className="w-24 h-24 mb-6 bg-gray-800 flex items-center justify-center animate-pulse">
                <span className="font-pixel text-4xl text-gray-600">?</span>
              </div>
              <h3 className="font-pixel text-xl text-white mb-2 text-center">{sponsor.name}</h3>
              <span className="font-sans text-sm font-bold tracking-widest uppercase" style={{ color: sponsor.color }}>
                {sponsor.tier}
              </span>
            </PixelBorder>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Patrons;
