/* cspell:disable */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Cpu, Layers, HardDrive, Shield } from 'lucide-react';
import { soundManager } from '../../utils/SoundManager';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { label: "WORLD", path: "/", icon: Globe, ref: "REF_001" },
  { label: "ABOUT", path: "/about", icon: Layers, ref: "REF_002" },
  { label: "FORGE", path: "/projects", icon: Cpu, ref: "REF_003" },
  { label: "APPLY", path: "/apply", icon: Shield, ref: "REF_004" },
  { label: "SYSTEM", path: "/login", icon: HardDrive, ref: "REF_005" },
];

export const SystemSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-md"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 150 }}
            className="fixed top-0 left-0 bottom-0 w-full md:w-[450px] z-[101] bg-kpr-white border-r border-kpr-grey shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Sidebar Grid Detail */}
            <div className="absolute inset-0 kpr-grid-main opacity-20 pointer-events-none" />

            {/* Header / Close */}
            <div className="p-12 flex justify-between items-start relative z-10">
              <div>
                <span className="kpr-mono-label mb-2 block">LOCAL_ACCESS_POINT</span>
                <span className="kpr-mono-value">SDC_SYSTEM_V4.0</span>
              </div>
              <button 
                onClick={() => { soundManager.playClick(); onClose(); }}
                onMouseEnter={() => soundManager.playHover()}
                className="p-4 hover:bg-kpr-black hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Menu Links */}
            <nav className="flex-grow p-12 space-y-8 relative z-10">
              {MENU_ITEMS.map((item, i) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => { soundManager.playConfirm(); onClose(); }}
                  onMouseEnter={() => soundManager.playHover()}
                  className="group block relative"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-6"
                  >
                    <span className="kpr-mono-label opacity-40 group-hover:opacity-100 group-hover:text-kpr-green transition-opacity">
                      {item.ref}
                    </span>
                    <h2 className={`text-6xl md:text-7xl font-black italic tracking-tighter transition-all group-hover:translate-x-4 ${location.pathname === item.path ? 'text-kpr-green' : 'text-kpr-black'}`}>
                      {item.label}
                    </h2>
                  </motion.div>
                </Link>
              ))}
            </nav>

            {/* Footer Metadata */}
            <div className="p-12 border-t border-kpr-grey relative z-10 bg-white">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex gap-4 items-center">
                    <div className="w-2 h-2 bg-kpr-green animate-pulse rounded-full" />
                    <span className="kpr-mono-value">SECURE_CHANNEL_ACTIVE</span>
                 </div>
                 <span className="kpr-mono-label">PGE-004</span>
              </div>
              <p className="kpr-mono-label leading-relaxed">
                THE SDC_PORTAL IS A PROTECTED REPOSITORY OF THE SOFTWARE DEVELOPMENT CELL. ALL TRANSITIONS RECORDED.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
