import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Mail, User } from "lucide-react";
import { Github, Linkedin } from "../ui/Icons";
import { PixelCard } from '../ui/PixelCard';
import { Tabs } from '../ui/Tabs';
import { Modal } from '../ui/Modal';
import { usePublicDevelopers, usePublicAlumni } from '../../api/hooks/usePublicAPI';

const DeveloperCard = ({ developer, onClick }) => (
  <PixelCard hoverGlow onClick={onClick} className="h-full cursor-pointer">
    <div className="flex items-start gap-4">
      <div className="relative w-16 h-16 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/20 to-accent-magenta/20 rounded-xl blur-lg" />
        {developer.image ? (
          <img 
            src={developer.image} 
            alt={developer.name}
            className="relative w-16 h-16 rounded-xl object-cover border border-accent-cyan/30"
          />
        ) : (
          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center">
            <span className="font-display text-xl font-bold text-bg-deep">
              {developer.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        {developer.status === 'ACTIVE' && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-green rounded-full border-2 border-bg" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display text-lg text-fg truncate">{developer.name}</h3>
          {developer.is_founder && (
            <span className="px-2 py-0.5 text-[10px] font-mono bg-accent-gold/10 border border-accent-gold/30 text-accent-gold rounded">
              FOUNDER
            </span>
          )}
        </div>
        <p className="text-sm text-fg-muted mb-2">{developer.spec || 'Software Developer'}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {developer.tech_stack?.slice(0, 4).map((tech) => (
            <span key={tech} className="px-2 py-0.5 text-xs font-mono bg-bg-deep border border-border rounded text-fg-muted hover:text-accent-cyan hover:border-accent-cyan/50 transition-colors">
              {tech}
            </span>
          ))}
          {developer.tech_stack && developer.tech_stack.length > 4 && (
            <span className="px-2 py-0.5 text-xs font-mono bg-bg-deep border border-border rounded text-fg-muted">
              +{developer.tech_stack.length - 4}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-fg-muted">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {developer.join_date ? new Date(developer.join_date).getFullYear() : '2024'}
          </span>
        </div>
      </div>
    </div>
  </PixelCard>
);

const DeveloperModal = ({ developer, onClose }) => {
  if (!developer) return null;

  return (
    <Modal isOpen={!!developer} onClose={onClose} title={developer.name} size="lg">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex flex-col items-center md:items-start">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6">
            {developer.image ? (
              <img src={developer.image} alt={developer.name} className="w-full h-full rounded-xl object-cover border-2 border-accent-cyan/30" />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center">
                <span className="font-display text-4xl md:text-6xl font-bold text-bg-deep">
                  {developer.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
            {developer.status === 'ACTIVE' && (
              <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-accent-green rounded-full border-2 border-bg flex items-center justify-center">
                <span className="font-mono text-xs text-bg font-bold">●</span>
              </div>
            )}
          </div>
          <div className="w-full space-y-3">
            {developer.linkedin_url && (
              <a href={developer.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 bg-bg-deep border border-border rounded-lg hover:border-accent-cyan transition-colors">
                <Linkedin className="w-5 h-5 text-accent-cyan" />
                <span className="font-mono text-sm">LinkedIn</span>
              </a>
            )}
            {developer.github_url && (
              <a href={developer.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 bg-bg-deep border border-border rounded-lg hover:border-accent-magenta transition-colors">
                <Github className="w-5 h-5 text-accent-magenta" />
                <span className="font-mono text-sm">GitHub</span>
              </a>
            )}
            {developer.email && (
              <a href={`mailto:${developer.email}`} className="flex items-center gap-3 w-full px-4 py-3 bg-bg-deep border border-border rounded-lg hover:border-accent-gold transition-colors">
                <Mail className="w-5 h-5 text-accent-gold" />
                <span className="font-mono text-sm">Email</span>
              </a>
            )}
          </div>
        </div>
        <div className="md:w-2/3">
          <div className="mb-6">
            <h4 className="font-display text-xl text-fg mb-2">Specialization</h4>
            <p className="text-fg-muted">{developer.spec || 'Software Developer'}</p>
          </div>
          <div className="mb-6">
            <h4 className="font-display text-xl text-fg mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {developer.tech_stack?.map((tech) => (
                <span key={tech} className="px-3 py-1 text-sm font-mono bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded-lg">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-xl text-fg mb-3">Profile</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-fg-muted font-mono text-xs">STATUS</span>
                <p className="text-fg capitalize">{developer.status?.toLowerCase() || 'Active'}</p>
              </div>
              <div>
                <span className="text-fg-muted font-mono text-xs">JOINED</span>
                <p className="text-fg">{developer.join_date ? new Date(developer.join_date).getFullYear() : '2024'}</p>
              </div>
              {developer.retirement_date && (
                <div>
                  <span className="text-fg-muted font-mono text-xs">RETIRED</span>
                  <p className="text-fg">{new Date(developer.retirement_date).getFullYear()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const DevelopersSection = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedDev, setSelectedDev] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: activeDevs = [], isLoading: loadingActive } = usePublicDevelopers(false);
  const { data: alumni = [], isLoading: loadingAlumni } = usePublicAlumni();

  const currentDevs = activeTab === 'active' ? activeDevs : alumni;
  const isLoading = activeTab === 'active' ? loadingActive : loadingAlumni;

  const filteredDevs = currentDevs.filter(dev => 
    dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.spec?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.tech_stack?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs = [
    { id: 'active', label: 'ACTIVE DEVELOPERS', count: activeDevs.length },
    { id: 'alumni', label: 'ALUMNI', count: alumni.length },
  ];

  return (
    <section id="developers" className="py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs text-accent-cyan uppercase tracking-widest">TEAM</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-2 text-fg">
            <span className="text-accent-cyan">DEVELOPERS</span> & ALUMNI
          </h2>
          <p className="mt-4 text-fg-muted max-w-2xl mx-auto">
            Meet the builders. Current members shipping code and alumni making waves in the industry.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-muted/50" />
              <input
                type="text"
                placeholder="Search by name, role, tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-bg-deep border border-border rounded-lg text-fg placeholder-fg-muted/50 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-accent-cyan"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PixelCard key={i} className="h-48 animate-pulse" />
            ))}
          </div>
        ) : filteredDevs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-fg-muted">No developers found matching "{searchQuery}"</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.08 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDevs.map((dev) => (
                <motion.div
                  key={dev.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4 }}
                >
                  <DeveloperCard 
                    developer={dev} 
                    onClick={() => setSelectedDev(dev)} 
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {selectedDev && <DeveloperModal developer={selectedDev} onClose={() => setSelectedDev(null)} />}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DevelopersSection;