import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Activity } from 'lucide-react';

const logTemplates = [
  "SECURE LINK ROUTED TO SECTOR_B9 // IP: 192.168.84.10",
  "TERMINATOR DETECTED IN SECTOR 4 // SECURITY PROTOCOLS ENGAGED",
  "SHIELD AEGIS COMPILING CORE INTERFACE // 94% COMPLETED",
  "INFILTRATOR EXPELLED // ROOT EXPLOIT PREVENTED",
  "GHOST COMMS COMPLETED: CRYPTO LINK STABLE",
  "DECRYPTING HOSTILE NODE [NODE_C10] // STATUS: 74% OVERRIDDEN",
  "RECRUIT INITIATED: SYNDICATE CLEARANCE STABLE",
  "WARNING: MAIN NET SCAN DETECTED FROM AI MAINMAIN_33"
];

const ThreatFeed: React.FC = () => {
  const [logs, setLogs] = useState<string[]>(logTemplates);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random telemetry log addition
      const randomLog = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      setLogs((prev) => {
        const next = [...prev.slice(1), `${new Date().toLocaleTimeString()} - ${randomLog}`];
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <FeedWrapper>
      <div className="status-label">
        <Activity size={12} className="heartbeat" />
        <span>THREAT_TELEMETRY_FEED:</span>
      </div>
      <div className="ticker-container">
        <div className="ticker-track">
          {logs.map((log, index) => (
            <span key={index} className="log-item">{log}</span>
          ))}
          {/* Duplicate to ensure seamless looping */}
          {logs.map((log, index) => (
            <span key={`dup-${index}`} className="log-item">{log}</span>
          ))}
        </div>
      </div>
    </FeedWrapper>
  );
};

const FeedWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background: #03060b;
  border-top: 1px solid rgba(0, 240, 255, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: bold;
  padding: 0 20px;
  box-shadow: 0 -5px 15px rgba(5, 10, 18, 0.8);

  .status-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-amber);
    border-right: 1px solid rgba(255, 170, 0, 0.2);
    padding-right: 15px;
    margin-right: 15px;
    flex-shrink: 0;

    .heartbeat {
      animation: heartbeat-anim 1.5s infinite alternate;
    }
  }

  .ticker-container {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    position: relative;
  }

  .ticker-track {
    display: inline-block;
    animation: ticker-anim 40s linear infinite;
  }

  .log-item {
    padding-right: 50px;
    color: var(--text-cyan);
    opacity: 0.85;
    letter-spacing: 0.05em;
  }

  @keyframes heartbeat-anim {
    from { opacity: 0.4; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1.1); }
  }

  @keyframes ticker-anim {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-50%, 0, 0); }
  }
`;

export default ThreatFeed;
