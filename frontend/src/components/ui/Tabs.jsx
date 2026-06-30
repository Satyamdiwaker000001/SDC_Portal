import React from 'react';
import { motion } from 'framer-motion';

export const Tabs = ({ tabs, activeTab, onChange, className = '' }) => (
  <div className={`flex flex-wrap gap-2 ${className}`} role="tablist">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        role="tab"
        aria-selected={activeTab === tab.id}
        onClick={() => onChange(tab.id)}
        className={`
          relative px-5 py-2.5 font-mono text-xs uppercase tracking-wider rounded-lg
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-bg-deep
          ${activeTab === tab.id
            ? 'bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan shadow-[0_0_20px_rgba(0,255,245,0.2)]'
            : 'bg-bg-deep border border-border-glow text-fg-muted hover:text-fg-primary hover:border-accent-cyan/50'
          }
        `}
      >
        {tab.label}
        {tab.count !== undefined && (
          <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded ${activeTab === tab.id ? 'bg-accent-cyan text-bg-deep' : 'bg-border-glow text-fg-muted'}`}>
            {tab.count}
          </span>
        )}
      </button>
    ))}
    <motion.div
      className="absolute bottom-0 h-0.5 bg-accent-cyan rounded"
      style={{
        width: tabs.findIndex(t => t.id === activeTab) >= 0 ? `${100 / tabs.length}%` : 0,
        left: `${tabs.findIndex(t => t.id === activeTab) * (100 / tabs.length)}%`,
      }}
      animate={{
        width: tabs.findIndex(t => t.id === activeTab) >= 0 ? `${100 / tabs.length}%` : 0,
        left: `${tabs.findIndex(t => t.id === activeTab) * (100 / tabs.length)}%`,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
    />
  </div>
);