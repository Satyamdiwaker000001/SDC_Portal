import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface TacticalSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const TacticalSelect: React.FC<TacticalSelectProps> = ({ options, value, onChange, label, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <SelectWrapper ref={containerRef}>
      {label && <label className="system-label">{label}</label>}
      <Trigger 
        onClick={() => setIsOpen(!isOpen)} 
        isOpen={isOpen}
      >
        <span className="selected-value">
          {selectedOption ? selectedOption.label : placeholder || 'SELECT_OPTION...'}
        </span>
        <motion.div
           animate={{ rotate: isOpen ? 180 : 0 }}
           transition={{ duration: 0.3 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </Trigger>

      <AnimatePresence>
        {isOpen && (
          <Menu
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((option) => (
              <MenuItem 
                key={option.value}
                active={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        )}
      </AnimatePresence>
    </SelectWrapper>
  );
};

const SelectWrapper = styled.div`
  display: flex; flex-direction: column; gap: 10px; position: relative; width: 100%;
  .system-label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent-primary); font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
`;

const Trigger = styled.div<{ isOpen: boolean }>`
  background: var(--bg-main);
  border: 1px solid ${props => props.isOpen ? 'var(--accent-primary)' : 'var(--border-glass)'};
  border-radius: 14px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between;
  cursor: pointer; transition: 0.3s;
  
  .selected-value { color: var(--text-main); font-family: var(--font-heading); font-size: 0.8rem; font-weight: 700; }
  svg { color: var(--accent-primary); }
  
  &:hover { 
    background: var(--bg-card);
    border-color: var(--accent-primary);
  }
`;

const Menu = styled(motion.div)`
  position: absolute; top: calc(100% + 8px); left: 0; width: 100%;
  background: var(--bg-card); backdrop-filter: var(--glass-blur);
  border: var(--border-glass); border-radius: 14px; 
  box-shadow: var(--shadow-xl); z-index: 1100;
  overflow: hidden; padding: 8px;
`;

const MenuItem = styled.div<{ active: boolean }>`
  padding: 12px 16px; border-radius: 10px; cursor: pointer; transition: 0.2s;
  font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700;
  color: ${props => props.active ? 'var(--accent-primary)' : 'var(--text-dim)'};
  background: ${props => props.active ? 'rgba(96, 165, 250, 0.08)' : 'transparent'};
  
  &:hover { background: rgba(96, 165, 250, 0.05); color: var(--accent-primary); }
`;
