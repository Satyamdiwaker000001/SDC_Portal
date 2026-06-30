import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from "lucide-react";
import { Github, Linkedin } from "../ui/Icons";
import { PixelCard } from '../ui/PixelCard';
import { usePublicDevelopers } from '../../api/hooks/usePublicAPI';

const FounderCard = ({ founder }) => (
  <PixelCard hoverGlow className="h-full flex flex-col">
    <div className="flex flex-col items-center text-center mb-4">
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/20 to-accent-magenta/20 rounded-full blur-xl" />
        {founder.image ? (
          <img 
            src={founder.image} 
            alt={founder.name}
            className="relative w-24 h-24 rounded-full object-cover border-2 border-accent-cyan/50"
          />
        ) : (
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center">
            <span className="font-display text-3xl font-bold text-bg-deep">
              {founder.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent-gold rounded-full flex items-center justify-center border-2 border-bg">
          <span className="font-mono text-xs text-bg font-bold">★</span>
        </div>
      </div>
      <h3 className="font-display text-xl text-fg mb-1">{founder.name}</h3>
      <p className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-2">FOUNDER</p>
      {founder.spec && <p className="text-sm text-fg-muted mb-4">{founder.spec}</p>}
    </div>

    <div className="flex items-center justify-center gap-3 mt-auto pt-4 border-t border-border">
      {founder.linkedin_url && (
        <a 
          href={founder.linkedin_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-lg bg-bg-deep border border-border flex items-center justify-center hover:border-accent-cyan hover:text-accent-cyan transition-colors"
          aria-label={`${founder.name} on LinkedIn`}
        >
          <Linkedin className="w-5 h-5" />
        </a>
      )}
      {founder.github_url && (
        <a 
          href={founder.github_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-lg bg-bg-deep border border-border flex items-center justify-center hover:border-accent-magenta hover:text-accent-magenta transition-colors"
          aria-label={`${founder.name} on GitHub`}
        >
          <Github className="w-5 h-5" />
        </a>
      )}
    </div>
  </PixelCard>
);

const FoundersSection = () => {
  const { data: founders = [], isLoading } = usePublicDevelopers(true);

  if (isLoading) {
    return (
      <section id="founders" className="py-20 md:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-accent-cyan uppercase tracking-widest">FOUNDERS</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl mt-2">THE ARCHITECTS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <PixelCard key={i} className="h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="founders" className="py-20 md:py-32 px-4 bg-gradient-to-b from-transparent via-accent-cyan/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs text-accent-cyan uppercase tracking-widest">FOUNDERS</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-2 text-fg">
            THE <span className="text-accent-cyan">ARCHITECTS</span>
          </h2>
          <p className="mt-4 text-fg-muted max-w-2xl mx-auto">
            Visionaries who built SDC from the ground up. Their legacy continues in every project we ship.
          </p>
        </motion.div>

        {founders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-fg-muted">Founder profiles coming soon...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {founders.map((founder) => (
                <motion.div
                  key={founder.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5 }}
                >
                  <FounderCard founder={founder} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FoundersSection;