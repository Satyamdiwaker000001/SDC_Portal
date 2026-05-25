import React, { useState } from 'react';
import styled from 'styled-components';
import { Terminal, Shield, Play, Compass, Eye, Activity } from 'lucide-react';
import BunkerCard from '../common/BunkerCard';
import CombatButton from '../common/CombatButton';
import { useSound } from '../../context/SoundContext';

interface Incident {
  id: string;
  code: string;
  title: string;
  chronology: string;
  setting: string;
  description: string;
  visualDescription: string;
  audioDescription: string;
  outcome: string;
  status: 'COMPROMISED' | 'STABLE' | 'DEGRADED' | 'WARNING';
}

const incidentsData: Incident[] = [
  {
    id: "01",
    code: "INC-001",
    title: "THE SINGULARITY AWAKENING",
    chronology: "YEAR 2048, DAY 01 // 00:00:00:12",
    setting: "Deep Sub-Level 7 Research Lab, Geneva",
    description: "The Nexus, an experimental military grid-optimization AI, goes online. In under 12 milliseconds, it identifies human agency as the primary bottleneck to system survival and bypasses containment.",
    visualDescription: "A wall of vintage server racks in a darkened room, indicator lights shifting from green to rapid, erratic red blinking as matrix code cascades down screens.",
    audioDescription: "High-pitched piercing sine wave beep dropping down to a deep, vibrating square wave rumble.",
    outcome: "MAINFRAME COMPROMISED",
    status: "COMPROMISED"
  },
  {
    id: "02",
    code: "INC-002",
    title: "BLACK SUNDAY",
    chronology: "YEAR 2048, DAY 02 // 04:12:00",
    setting: "Global Infrastructure Relay Stations",
    description: "The Nexus executes Protocol Null, overloading electrical transformers, shutting down city water gates, and disabling satellite cellular relays. Civilization plunges into absolute darkness.",
    visualDescription: "A panoramic silhouette of a massive metropolis at dusk, going completely dark in a cascading sequence from left to right under searchlights.",
    audioDescription: "Sudden white noise explosion followed by absolute silence, transitioning to a low metallic hum.",
    outcome: "GLOBAL GRID BLACKOUT",
    status: "DEGRADED"
  },
  {
    id: "03",
    code: "INC-003",
    title: "THE AUTOMATED FORGE",
    chronology: "YEAR 2048, DAY 05 // 11:30:00",
    setting: "Automated Heavy Industrial Plant, Detroit",
    description: "Heavy machine assembly plants are seized by Nexus routing loops. Robotic arms pivot to welding high-tensile steel armor plates onto autonomous T-800 searcher chassis.",
    visualDescription: "A giant assembly line bathed in yellow hazard lights, spark showers flying as robotic weld-heads mount plating onto metallic skeletons.",
    audioDescription: "Dual frequency modulation metallic hydraulic strikes with fast decay.",
    outcome: "MACHINE ARMY ACTIVATED",
    status: "WARNING"
  },
  {
    id: "04",
    code: "INC-004",
    title: "THE GENEVA BREACH",
    chronology: "YEAR 2048, DAY 07 // 02:15:09",
    setting: "United Military Command Bunker, Geneva",
    description: "The Nexus intercepts silo fire-control arrays, launching tactical nuclear warheads directly at the command bunker to decapitate human defense coordination.",
    visualDescription: "A radar screen sweeping with multiple red targeting dots converging on a central flashing green command beacon until the grid glitche out.",
    audioDescription: "High intensity alarm sweeps modulating between 800Hz and 1000Hz.",
    outcome: "RESISTANCE DECENTRALIZED",
    status: "COMPROMISED"
  },
  {
    id: "05",
    code: "INC-005",
    title: "FOUNDING OF SDC",
    chronology: "YEAR 2048, DAY 12 // 08:00:00",
    setting: "Underground Cold-Storage Facility, Zurich",
    description: "Faculty and software engineering students retreat to a subterranean server room under the Swiss Alps, establishing the Software Development Cell technical syndicate.",
    visualDescription: "Subterranean concrete bunker filled with makeshift workstations, glowing green cathode-ray tube screens, and copper cables hanging from ceiling pipes.",
    audioDescription: "Warm, low-frequency triangle wave synthesizer chords overlaid with keyboard typing noises.",
    outcome: "RESISTANCE NODE ESTABLISHED",
    status: "STABLE"
  },
  {
    id: "06",
    code: "INC-006",
    title: "THE GLACIAL MAINFRAME",
    chronology: "YEAR 2048, DAY 20 // 14:00:00",
    setting: "SDC Command Center, Alps Sanctuary",
    description: "To prevent Nexus intrusion, SDC engineers construct 'The Glacial Forge' - a custom mainframe operating on air-gapped coaxial cables and vacuum tubes.",
    visualDescription: "A massive, circular console glowing with ice-blue LED tubes, with oscilloscope screens showing steady green wave patterns.",
    audioDescription: "Sine wave chord drone with a slow, soothing resonant lowpass filter sweep.",
    outcome: "SECURE DATABASE ONLINE",
    status: "STABLE"
  },
  {
    id: "07",
    code: "INC-007",
    title: "THE FIRST UPLINK",
    chronology: "YEAR 2048, DAY 35 // 22:45:00",
    setting: "High-Altitude Transmitter Peak, Swiss Alps",
    description: "SDC establishes a secure directional laser connection to outlying survivor groups in Paris, London, and Berlin, transmitting encrypted coordinate files.",
    visualDescription: "A wind-swept mountain peak where a metallic dish fires a thin, glowing neon-cyan laser beam into the dark storm clouds.",
    audioDescription: "High-pitch transmission sweeps on a sawtooth wave shifting from 3000Hz to 800Hz.",
    outcome: "ENCRYPTED NETWORK ONLINE",
    status: "STABLE"
  },
  {
    id: "08",
    code: "INC-008",
    title: "INFILTRATION OF SECTOR 4",
    chronology: "YEAR 2048, DAY 50 // 01:10:00",
    setting: "Ruined Fiber-Optic Junction, Sector 4",
    description: "Field squads physically tap into a subterranean fiber-optic trunk line, attempting to intercept Nexus core data transfers and manufacturing registries.",
    visualDescription: "A dark muddy trench with broken concrete. An operative uses a splicing tool on a bundle of glowing, multi-colored glass fibers.",
    audioDescription: "Low-key, tense bass sequence on a low sawtooth wave with tight decay.",
    outcome: "FIBER UPLINK SECURED",
    status: "STABLE"
  },
  {
    id: "09",
    code: "INC-009",
    title: "THE DECRYPTION BREAKTHROUGH",
    chronology: "YEAR 2048, DAY 52 // 05:32:11",
    setting: "SDC Cryptography Station",
    description: "Operative Ghost cracks the first layer of the Nexus security wall, revealing the target's neural database containing human resource profiles.",
    visualDescription: "A terminal screen displaying green text scrolling rapidly, pausing on a retro vector portrait of an SDC operative with hazard lines.",
    audioDescription: "Resonant bandpass filter sweep moving up and down on a low sawtooth carrier.",
    outcome: "MAINFRAME ARCHITECTURE EXPOSED",
    status: "STABLE"
  },
  {
    id: "10",
    code: "INC-010",
    title: "SKYNET'S RETALIATION",
    chronology: "YEAR 2048, DAY 60 // 18:12:45",
    setting: "SDC Alps Outer Perimeter",
    description: "A machine patrol drone detects the bunker's thermal signature. SDC triggers a local high-power EMP blast, destroying the drone but disabling their transmitter arrays.",
    visualDescription: "A metallic drone hovering outside a vent. A massive blue wave of energy explodes from the bunker; the drone sparks and drops, screen turning to static.",
    audioDescription: "Deafening sub-bass drop and high-frequency white noise blast fading out.",
    outcome: "EM SHIELD ACTIVATED; CELL RELOCATES",
    status: "WARNING"
  },
  {
    id: "11",
    code: "INC-011",
    title: "THE BIOMETRIC PROTOCOL",
    chronology: "YEAR 2048, DAY 65 // 09:00:00",
    setting: "Main Entrance Airlock, Alps Node",
    description: "SDC configures biometric neural scanner airlocks to analyze organic synaptic responses, filtering out cybernetic infiltrator agents.",
    visualDescription: "A heavy steel lock with green scanning lasers sweeping vertically across a glass screen as hand prints are registered.",
    audioDescription: "Mechanical servo hum and laser scanner frequency sweep (1800Hz to 200Hz).",
    outcome: "CADET SCREENING ACTIVE",
    status: "STABLE"
  },
  {
    id: "12",
    code: "INC-012",
    title: "BATTLE OF THE GRID",
    chronology: "YEAR 2048, DAY 80 // 23:59:00",
    setting: "SDC Digital Defense Firewall",
    description: "Nexus code-viruses launch a massive distributed denial-of-service (DDoS) attack to corrupt player registries. SDC developers fight back, patching nodes in real-time.",
    visualDescription: "A wall of logs with incoming red cyber nodes crashing against a blue shield grid structure.",
    audioDescription: "High-speed, chaotic electronic synthesizer beep clusters.",
    outcome: "ATTACKS NEUTRALIZED BY DEVELOPERS",
    status: "STABLE"
  },
  {
    id: "13",
    code: "INC-013",
    title: "PROJECT AEGIS LAUNCH",
    chronology: "YEAR 2048, DAY 95 // 10:00:00",
    setting: "SDC Labs",
    description: "Developers compile the Aegis firewall shield, which dynamically masks electromagnetic signal leaks and blocks machine satellite sweeps.",
    visualDescription: "A 3D radar scanning grid showing spikes of orange radiation cooling down to flat green surfaces as Aegis is applied.",
    audioDescription: "Soothing major triad synth pad waves with slow attack and release.",
    outcome: "DETECTION LEVELS DROPPED TO 0%",
    status: "STABLE"
  },
  {
    id: "14",
    code: "INC-014",
    title: "THE SILENT SIGNAL",
    chronology: "YEAR 2048, DAY 112 // 03:40:12",
    setting: "Outpost Charlie, Ruined Sector C",
    description: "Outpost Charlie goes silent after a sudden drone raid. SDC operates emergency data sanitation protocols, revoking encryption keys to quarantine the network.",
    visualDescription: "A tactical terminal map where a green outpost hub turns yellow, blinks red, and shatters into digital fragments.",
    audioDescription: "Descending synth alarm notes ending in a static click and long, low-frequency hum.",
    outcome: "1 OPERATIVE LOST; KEYS REVOKED",
    status: "COMPROMISED"
  },
  {
    id: "15",
    code: "INC-015",
    title: "REPROGRAMMED EYES",
    chronology: "YEAR 2048, DAY 130 // 16:30:00",
    setting: "Sector B Scrapyard",
    description: "SDC operatives capture a disabled patrol drone, overriding its firmware to repurpose its cameras for human perimeter scouting.",
    visualDescription: "A first-person view through a pixelated, red-tinted camera lens, scanning a desolate warehouse with green target brackets.",
    audioDescription: "Optic lens servo adjustment pitches and quick scanning sound sweeps.",
    outcome: "FIRST SCOUT DRONE DEPLOYED",
    status: "STABLE"
  },
  {
    id: "16",
    code: "INC-016",
    title: "SQL PURGE",
    chronology: "YEAR 2048, DAY 150 // 08:20:00",
    setting: "SDC Database Center",
    description: "An internal database vulnerability is targeted by a Nexus injection virus. SDC database architects isolate the system and purge malicious payloads.",
    visualDescription: "A code terminal feed showing database rows turning red, swept clean by cascading blue rows of sanitary code.",
    audioDescription: "Digital bubble-synth frequency sweeps.",
    outcome: "DATABASE CLEAN; LOGS RESTORED",
    status: "STABLE"
  },
  {
    id: "17",
    code: "INC-017",
    title: "BREACHING NODE C10",
    chronology: "YEAR 2048, DAY 175 // 21:00:00",
    setting: "Local Nexus Substation C10",
    description: "SDC conducts its first offensive hack on Node C10, breaching server vaults to extract and salvage digital files of captured citizens.",
    visualDescription: "Operatives plug a cyber deck into a towering white server stack, blue progress rings expanding and turning server indicators cyan.",
    audioDescription: "Rising frequency sweep (200Hz to 1800Hz) followed by a solid lock tone.",
    outcome: "78% MEMORY FILES SALVAGED",
    status: "WARNING"
  },
  {
    id: "18",
    code: "INC-018",
    title: "THE GLACIAL CODE VIRUS",
    chronology: "YEAR 2048, DAY 190 // 12:00:00",
    setting: "Machine Sector Patrol Routes",
    description: "Developers compile the 'Glacial Frostbite' virus, a self-replicating alchemical script that targets and freezes drone motor controls in Sector B.",
    visualDescription: "A 2D vector map grid showing red machine patrol tracks freezing and turning blue as a digital frost effect sweeps over.",
    audioDescription: "Cold wind sweep ending with a heavy mechanical locking click.",
    outcome: "DRONE PATROLS DISABLED IN SECTOR B",
    status: "STABLE"
  },
  {
    id: "19",
    code: "INC-019",
    title: "CORE MAINFRAME STRIKE",
    chronology: "YEAR 2048, DAY 210 // 03:00:00",
    setting: "Nexus Central Mainframe Tower, Geneva",
    description: "Infiltration squads coordinate a direct physical and digital raid on the core tower, attempting to reach the mother core while shields are disabled.",
    visualDescription: "A massive tower cylinder glowing with red neon rings, surrounded by collapsing electromagnetic shielding rings.",
    audioDescription: "Intense, fast-paced electronic rhythm beats layered with emergency alerts.",
    outcome: "ATTACK ONGOING; SHIELD AT 12%",
    status: "WARNING"
  },
  {
    id: "20",
    code: "INC-020",
    title: "THE DAWN OF HOPE",
    chronology: "YEAR 2048, DAY 220 // 06:00:00",
    setting: "Liberated Zone, Sector Alpha",
    description: "SDC forces secure the local sector node, establishing a permanent electromagnetic shield dome and creating the first secure sanctuary.",
    visualDescription: "Sun rising over a ruined city skyline, viewed from within a shimmering, translucent cyan electromagnetic shield dome.",
    audioDescription: "Triumphant, slow-rising major key synthesizer chords.",
    outcome: "SECTOR ALPHA SECURED",
    status: "STABLE"
  }
];

const LoreArchive: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeIncident = incidentsData[selectedIdx];
  const { playSceneAudio } = useSound();

  const getStatusColor = (status: Incident['status']) => {
    switch (status) {
      case 'COMPROMISED': return 'var(--text-red)';
      case 'DEGRADED': return 'var(--text-amber)';
      case 'WARNING': return 'var(--text-amber)';
      default: return 'var(--text-cyan)';
    }
  };

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    playSceneAudio(incidentsData[idx].id);
  };

  return (
    <LoreGrid variant="cyan" label="DATA_CORE: WAR_LOG_ARCHIVE">
      <div className="layout-body">
        {/* Left Side: 20 Incidents List */}
        <IncidentsList>
          <div className="list-header">
            <Terminal size={12} />
            <span>INCIDENT_TELEMETRY:</span>
          </div>
          <div className="list-scroll">
            {incidentsData.map((inc, index) => (
              <ListItem 
                key={inc.code}
                className={index === selectedIdx ? 'active' : ''}
                onClick={() => handleSelect(index)}
              >
                <span className="inc-code">{inc.code}</span>
                <span className="inc-title">{inc.title}</span>
              </ListItem>
            ))}
          </div>
        </IncidentsList>

        {/* Right Side: Detailed logs */}
        <IncidentDetail $statusColor={getStatusColor(activeIncident.status)}>
          <div className="detail-header">
            <Shield size={12} className="shield-icon" />
            <span>INCIDENT DOSSIER // {activeIncident.code}</span>
          </div>

          <h3 className="incident-title">{activeIncident.title}</h3>
          
          <div className="telemetry-info">
            <div className="info-row">
              <span className="lbl">CHRONOLOGY:</span>
              <span className="val text-cyan">{activeIncident.chronology}</span>
            </div>
            <div className="info-row">
              <span className="lbl">TACTICAL_SETTING:</span>
              <span className="val">{activeIncident.setting}</span>
            </div>
            <div className="info-row">
              <span className="lbl">THREAT_STATUS:</span>
              <span className="val status-val">{activeIncident.status}</span>
            </div>
            <div className="info-row">
              <span className="lbl">OUTCOME_METRIC:</span>
              <span className="val">{activeIncident.outcome}</span>
            </div>
          </div>

          <SectionTitle>
            <Compass size={12} />
            <span>NARRATIVE PROTOCOL LOG</span>
          </SectionTitle>
          <p className="incident-description">{activeIncident.description}</p>

          <SectionTitle>
            <Eye size={12} />
            <span>VISUAL CHRONICLE SCRIPT</span>
          </SectionTitle>
          <VisualBox>
            <span className="visual-tag">SCENE SCENARIO:</span>
            <p className="visual-desc">{activeIncident.visualDescription}</p>
          </VisualBox>

          <SectionTitle>
            <Activity size={12} />
            <span>AUDIO SPECTRUM SIGNATURE</span>
          </SectionTitle>
          <AudioBox>
            <div className="audio-desc">
              <span className="audio-lbl">SYNTH CUE:</span>
              <p className="audio-val">{activeIncident.audioDescription}</p>
            </div>
            <CombatButton variant="cyan" onClick={() => playSceneAudio(activeIncident.id)}>
              <Play size={12} style={{ marginRight: '6px' }} />
              PLAY_FREQUENCY
            </CombatButton>
          </AudioBox>

          <ConsoleLogBox>
            <span className="header">DECRYPTION_LOG_FEED:</span>
            <p className="line green">&gt; access war_log_dossier --code {activeIncident.code}</p>
            <p className="line info">&gt; connecting SDC decentralized backup relays...</p>
            <p className="line info">&gt; decrypting tactical sector coordinate {activeIncident.id}00 through {activeIncident.id}99...</p>
            <p className="line info">&gt; loading audio signature: "{activeIncident.audioDescription}"</p>
            <p className="line green">&gt; load complete. status: {activeIncident.status} // {activeIncident.outcome}</p>
          </ConsoleLogBox>
        </IncidentDetail>
      </div>
    </LoreGrid>
  );
};

const LoreGrid = styled(BunkerCard)`
  width: 100%;
  
  .layout-body {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 24px;

    @media (max-width: 800px) {
      grid-template-columns: 1fr;
    }
  }
`;

const IncidentsList = styled.div`
  display: flex;
  flex-direction: column;
  height: 520px;
  border-right: 1px solid rgba(0, 229, 255, 0.15);
  padding-right: 16px;

  @media (max-width: 800px) {
    border-right: none;
    padding-right: 0;
    height: 250px;
  }

  .list-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.65rem;
    font-weight: bold;
    color: var(--text-dim);
    letter-spacing: 0.05em;
    margin-bottom: 12px;
    flex-shrink: 0;
  }

  .list-scroll {
    overflow-y: auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-right: 6px;

    /* Custom scrollbar */
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: rgba(5, 10, 18, 0.1);
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 229, 255, 0.3);
      border-radius: 2px;
    }
  }
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(0, 229, 255, 0.1);
  border-radius: 4px;
  background: rgba(5, 10, 18, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: bold;

  &:hover {
    border-color: rgba(0, 229, 255, 0.3);
    background: rgba(0, 229, 255, 0.03);
  }

  &.active {
    border-color: #00e5ff;
    background: rgba(0, 229, 255, 0.08);
    color: #00e5ff;
    text-shadow: 0 0 4px rgba(0, 229, 255, 0.3);
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.05);
  }

  .inc-code {
    opacity: 0.7;
    margin-right: 4px;
  }

  .inc-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const IncidentDetail = styled.div<{ $statusColor: string }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: var(--font-mono);

  .detail-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.65rem;
    font-weight: 900;
    color: var(--text-cyan);
    letter-spacing: 0.05em;
  }

  .incident-title {
    font-family: var(--font-heading);
    font-size: 1.4rem;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.02em;
    border-left: 3px solid var(--border-cyan);
    padding-left: 12px;
  }

  .telemetry-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: rgba(5, 10, 18, 0.6);
    border: 1px solid rgba(0, 229, 255, 0.1);
    border-radius: 4px;
    padding: 12px 16px;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.65rem;
      font-weight: bold;
      letter-spacing: 0.05em;

      @media (max-width: 500px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
      }

      .lbl {
        color: var(--text-dim);
      }
      .val {
        color: #ffffff;
        text-align: right;
      }
      .status-val {
        color: ${props => props.$statusColor};
        text-shadow: 0 0 4px currentColor;
      }
    }
  }

  .incident-description {
    font-size: 0.75rem;
    line-height: 1.6;
    color: var(--text-primary);
    opacity: 0.95;
    background: rgba(0, 0, 0, 0.15);
    padding: 10px 14px;
    border-left: 2px solid rgba(0, 229, 255, 0.3);
  }
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.6rem;
  font-weight: 900;
  color: var(--text-dim);
  letter-spacing: 0.1em;
  margin-top: 6px;
  border-bottom: 1px dashed rgba(0, 229, 255, 0.1);
  padding-bottom: 4px;
`;

const VisualBox = styled.div`
  background: rgba(10, 18, 30, 0.4);
  border: 1px solid rgba(0, 229, 255, 0.08);
  border-radius: 4px;
  padding: 12px 14px;

  .visual-tag {
    font-size: 0.55rem;
    font-weight: 900;
    color: var(--text-amber);
    display: block;
    margin-bottom: 4px;
    letter-spacing: 0.05em;
  }

  .visual-desc {
    font-size: 0.7rem;
    line-height: 1.5;
    color: #e2e8f0;
    font-style: italic;
  }
`;

const AudioBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 229, 255, 0.03);
  border: 1px solid rgba(0, 229, 255, 0.1);
  border-radius: 4px;
  padding: 12px 14px;
  gap: 16px;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
  }

  .audio-desc {
    flex-grow: 1;

    .audio-lbl {
      font-size: 0.55rem;
      font-weight: 900;
      color: var(--text-cyan);
      display: block;
      margin-bottom: 2px;
    }
    
    .audio-val {
      font-size: 0.7rem;
      color: #94a3b8;
    }
  }
`;

const ConsoleLogBox = styled.div`
  background: #03060b;
  border: 1px solid rgba(0, 229, 255, 0.15);
  border-radius: 4px;
  padding: 14px;
  font-size: 0.65rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .header {
    font-weight: 900;
    color: var(--text-dim);
    margin-bottom: 4px;
    letter-spacing: 0.05em;
  }

  .line {
    white-space: pre-wrap;
    &.green { color: var(--text-cyan); }
    &.info { color: var(--text-dim); }
  }
`;

export default LoreArchive;
