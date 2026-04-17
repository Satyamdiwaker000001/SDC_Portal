import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { formatInTimeZone } from 'date-fns-tz';
import { Globe } from 'lucide-react';

import laImg from '../../assets/cyberpunk_los_angeles_showcase_1776002227080.png';
import londonImg from '../../assets/cyberpunk_london_showcase_1776002574260.png';
import parisImg from '../../assets/cyberpunk_paris_showcase_1776002757126.png';

const cities = [
  { id: 'LA', name: 'LOS ANGELES', tz: 'America/Los_Angeles', country: 'USA', img: laImg },
  { id: 'LDN', name: 'LONDON', tz: 'Europe/London', country: 'UK', img: londonImg },
  { id: 'PAR', name: 'PARIS', tz: 'Europe/Paris', country: 'FRANCE', img: parisImg },
  { id: 'TOK', name: 'TOKYO', tz: 'Asia/Tokyo', country: 'JAPAN', img: londonImg },
];

const GlobalOperationsTerminal: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [activeCityIdx, setActiveCityIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const rotator = setInterval(() => {
      setActiveCityIdx((prev) => (prev + 1) % cities.length);
    }, 12000); 
    return () => {
      clearInterval(timer);
      clearInterval(rotator);
    };
  }, []);

  const activeCity = cities[activeCityIdx];

  return (
    <TerminalWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <ClockGrid>
        <SidebarInfo>
          <div className="status-pill">
            <div className="led" /> LIVE_OPERATIONS
          </div>
          <div className="meta-block">
             <span className="label">GLOBAL_COMMAND_CENTER</span>
             <span className="val">NODE_ALPHA_STABLE</span>
          </div>
          <CityList>
             {cities.map((city, i) => (
               <CityItem 
                 key={city.id} 
                 active={i === activeCityIdx}
                 onClick={() => setActiveCityIdx(i)}
               >
                 <span className="id">{city.id}</span>
                 <span className="name">{city.name}</span>
                 <span className="time">{formatInTimeZone(time, city.tz, 'HH:mm')}</span>
               </CityItem>
             ))}
          </CityList>
        </SidebarInfo>

        <MainDisplayPart>
          <AnimatePresence mode="wait">
            <LargeDigitContainer
              key={activeCity.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="city-meta">
                <span className="label">PRIMARY_UPLINK</span>
                <h3>{activeCity.name} // {activeCity.country}</h3>
              </div>
              <div className="digits-row">
                 <span className="unit">{formatInTimeZone(time, activeCity.tz, 'HH')}</span>
                 <span className="sep">:</span>
                 <span className="unit">{formatInTimeZone(time, activeCity.tz, 'mm')}</span>
                 <span className="sec-unit">{formatInTimeZone(time, activeCity.tz, 'ss')}</span>
              </div>
            </LargeDigitContainer>
          </AnimatePresence>

          <DisplayFooter>
             <div className="coord-block">
                <Globe size={14} />
                <span>LAT: 34.0522° N // LONG: 118.2437° W</span>
             </div>
             <div className="protocol">STABLE_RELAY_V2.5</div>
          </DisplayFooter>
        </MainDisplayPart>
      </ClockGrid>

      <VisualPart>
        <AnimatePresence mode="wait">
          <ShowcaseImage
            key={activeCity.id}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ backgroundImage: `url(${activeCity.img})` }}
          />
        </AnimatePresence>
        <ImageOverlay />
      </VisualPart>
    </TerminalWrapper>
  );
};

const TerminalWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 600px;
  background: #000815;
  border-bottom: 3px solid #000;
  overflow: hidden;
  
  @media (max-width: 1200px) { grid-template-columns: 1fr; height: auto; }
`;

const ClockGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  background: linear-gradient(135deg, #00102b 0%, #000815 100%);
  position: relative;
  
  &::before {
    content: ''; position: absolute; inset: 0;
    background-image: radial-gradient(circle at 0 0, rgba(255, 213, 0, 0.05) 0%, transparent 60%);
  }
`;

const SidebarInfo = styled.div`
  padding: 40px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 40px;
  z-index: 1;

  .status-pill {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--font-mono); font-size: 0.6rem; color: #ffd500;
    padding: 6px 12px; border-radius: 100px; background: rgba(255, 213, 0, 0.1); width: fit-content;
    .led { width: 6px; height: 6px; border-radius: 50%; background: #ffd500; animation: pulse 1.5s infinite; }
  }

  .meta-block {
    display: flex; flex-direction: column; gap: 4px;
    .label { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-dim); letter-spacing: 0.1em; }
    .val { font-family: var(--font-heading); font-size: 0.75rem; color: #ffd500; font-weight: 800; }
  }

  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
`;

const CityList = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`;

const CityItem = styled.div<{ active: boolean }>`
  display: flex; align-items: center; gap: 15px;
  cursor: pointer; transition: 0.3s;
  opacity: ${props => props.active ? 1 : 0.3};
  padding: 8px 0;
  
  &:hover { opacity: 1; }
  
  .id { font-family: var(--font-mono); font-size: 0.65rem; color: #ffd500; font-weight: 900; width: 35px; }
  .name { font-family: var(--font-heading); font-size: 0.7rem; color: #fff; flex: 1; }
  .time { font-family: var(--font-mono); font-size: 0.7rem; color: #fff; opacity: 0.8; }
`;

const MainDisplayPart = styled.div`
  display: flex; flex-direction: column; justify-content: center; padding: 60px;
  position: relative; z-index: 1;
`;

const LargeDigitContainer = styled(motion.div)`
  .city-meta {
    margin-bottom: 20px;
    .label { font-family: var(--font-mono); font-size: 0.6rem; color: #0076e4; font-weight: 800; letter-spacing: 0.2em; }
    h3 { font-family: var(--font-heading); font-size: 1.5rem; color: #fff; letter-spacing: 0.1em; margin-top: 5px; }
  }

  .digits-row {
    display: flex; align-items: baseline; gap: 15px;
    .unit { font-family: var(--font-heading); font-size: 10rem; line-height: 0.8; color: #fff; font-weight: 900; letter-spacing: -0.05em; }
    .sep { font-family: var(--font-heading); font-size: 4rem; color: #ffd500; opacity: 0.5; }
    .sec-unit { font-family: var(--font-heading); font-size: 4rem; color: #ffd500; font-weight: 800; opacity: 0.8; }
  }
`;

const DisplayFooter = styled.div`
  margin-top: 60px; display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 25px;
  font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); letter-spacing: 0.1em;
  
  .coord-block { display: flex; align-items: center; gap: 10px; }
`;

const VisualPart = styled.div`
  position: relative; overflow: hidden; background: #000;
`;

const ShowcaseImage = styled(motion.div)`
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  filter: contrast(1.1) brightness(0.7);
`;

const ImageOverlay = styled.div`
  position: absolute; inset: 0;
  background: linear-gradient(to right, #000815 0%, transparent 40%);
  pointer-events: none;
`;

export default GlobalOperationsTerminal;
