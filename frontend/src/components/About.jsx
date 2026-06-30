import React from 'react';
import PixelBorder from './PixelBorder';

const About = () => {
  return (
    <section id="about" className="py-24 px-4 bg-retro-dark relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <div className="flex-1 w-full">
            <PixelBorder color="var(--color-retro-cyan)" className="p-8 md:p-12 bg-retro-bg">
              <h2 className="font-pixel text-3xl md:text-5xl text-retro-cyan mb-8 uppercase text-shadow-pixel">
                About The Game
              </h2>
              <div className="space-y-6 font-sans text-gray-300 text-lg">
                <p>
                  Shaastra is the annual technical festival of IIT Madras. It is the first student-managed festival in the world to be ISO 9001:2015 certified.
                </p>
                <p>
                  This year, we are diving deep into the <span className="text-retro-yellow font-bold uppercase">Artifacts of Arcade</span>. Prepare yourself for a nostalgic journey mixed with cutting-edge technology, hackathons, workshops, and exhibitions that will challenge your limits.
                </p>
                <p>
                  Player 1, are you ready to enter the arena?
                </p>
              </div>
            </PixelBorder>
          </div>

          <div className="w-full md:w-1/3 flex justify-center">
            {/* A simple CSS representation of an arcade cabinet or game element */}
            <div className="relative w-48 h-64 bg-retro-bg border-4 border-retro-dark pixel-shadow-yellow transform rotate-3">
              <div className="absolute inset-x-2 top-2 h-32 bg-gray-900 border-4 border-retro-dark flex items-center justify-center overflow-hidden">
                <div className="w-8 h-8 bg-retro-cyan animate-bounce" />
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-retro-red border-2 border-retro-dark" />
                <div className="w-8 h-8 rounded-full bg-retro-yellow border-2 border-retro-dark" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
