import React from 'react';
import styled from 'styled-components';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

const SoundToggle: React.FC = () => {
  const { isMuted, toggleMute } = useSound();

  return (
    <ToggleWrapper 
      onClick={toggleMute} 
      $muted={isMuted}
      title={isMuted ? "Enable Audio Link" : "Disable Audio Link"}
    >
      <span className="uplink-label">AUDIO_LINK:</span>
      <IconBox>
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="pulse-icon" />}
      </IconBox>
      <span className="status-text">{isMuted ? "MUTE" : "STABLE"}</span>
      <VisualBars $active={!isMuted}>
        <div className="bar bar-1" />
        <div className="bar bar-2" />
        <div className="bar bar-3" />
      </VisualBars>
    </ToggleWrapper>
  );
};

const ToggleWrapper = styled.div<{ $muted: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: bold;
  border: 1px solid ${props => props.$muted ? 'rgba(255, 170, 0, 0.4)' : 'rgba(0, 240, 255, 0.4)'};
  background: rgba(10, 18, 30, 0.4);
  padding: 6px 12px;
  border-radius: 4px;
  box-shadow: ${props => props.$muted ? 'none' : 'var(--hud-glow)'};
  transition: all 0.3s ease;

  color: ${props => props.$muted ? 'var(--text-amber)' : 'var(--text-cyan)'};

  &:hover {
    border-color: ${props => props.$muted ? 'var(--border-amber)' : 'var(--border-cyan)'};
    background: rgba(0, 240, 255, 0.05);
  }

  .uplink-label {
    opacity: 0.7;
    letter-spacing: 0.05em;
  }

  .status-text {
    letter-spacing: 0.1em;
  }
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .pulse-icon {
    animation: icon-pulse 1.5s infinite;
  }

  @keyframes icon-pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const VisualBars = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;

  .bar {
    width: 2px;
    background: currentColor;
    border-radius: 1px;
    transition: height 0.3s ease;
  }

  .bar-1 { height: ${props => props.$active ? '8px' : '3px'}; animation: ${props => props.$active ? 'bar-dance 0.8s infinite 0.1s' : 'none'}; }
  .bar-2 { height: ${props => props.$active ? '12px' : '3px'}; animation: ${props => props.$active ? 'bar-dance 0.8s infinite 0.3s' : 'none'}; }
  .bar-3 { height: ${props => props.$active ? '6px' : '3px'}; animation: ${props => props.$active ? 'bar-dance 0.8s infinite 0.5s' : 'none'}; }

  @keyframes bar-dance {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.4); }
  }
`;

export default SoundToggle;
