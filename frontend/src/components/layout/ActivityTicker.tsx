import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Activity } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const activityLogs = [
  "DB backup synchronization completed successfully",
  "New member application submitted — review pending",
  "FastAPI production server uptime: 99.98%",
  "JWT token rotation scheduled — gateway secured",
  "WebGL canvas initialized at 60 FPS",
  "SQL indexing audit queued for next cycle",
  "New project workspace created by Admin",
  "Nginx proxy health check: all nodes responsive",
];

const Ticker: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<string[]>(activityLogs);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = Reflect.get(activityLogs, Math.floor(Math.random() * activityLogs.length)) as string;
      setLogs((prev) => {
        const next = [...prev.slice(1), `${new Date().toLocaleTimeString()} — ${randomLog}`];
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TickerWrapper>
      <div className="status-label">
        <Activity size={12} className="heartbeat" />
        <span>{t('ACTIVITY FEED')}</span>
      </div>
      <div className="ticker-container">
        <div className="ticker-track">
          {logs.map((log, index) => (
            <span key={index} className="log-item">{log}</span>
          ))}
          {logs.map((log, index) => (
            <span key={`dup-${index}`} className="log-item">{log}</span>
          ))}
        </div>
      </div>
    </TickerWrapper>
  );
};

const TickerWrapper = styled.div`
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

export default Ticker;
