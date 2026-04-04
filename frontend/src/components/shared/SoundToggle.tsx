/* cspell:disable */
import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../utils/SoundManager';

export const SoundToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(soundManager.isEnabled());

  const toggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    soundManager.setEnabled(newValue);
    if (newValue) {
      soundManager.init();
      soundManager.playConfirm();
    }
  };

  return (
    <button 
      onClick={toggle}
      className="fixed bottom-8 left-8 z-[5000] p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-slate-grey-400 hover:text-sky-500 hover:bg-white transition-all shadow-lg group"
      title={enabled ? "Mute System" : "Unmute System"}
    >
      {enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      <span className="absolute left-full ml-4 whitespace-nowrap kpr-mono opacity-0 group-hover:opacity-100 transition-opacity">
        SYSTEM_AUDIO: {enabled ? 'ON' : 'OFF'}
      </span>
    </button>
  );
};
