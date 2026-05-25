import React from 'react';
import styled from 'styled-components';
import { Target, AlertOctagon } from 'lucide-react';
import BunkerCard from '../common/BunkerCard';

export interface CampaignData {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string; // 'LIVE' | 'PENDING' | 'COMPLETED'
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  progress: number;
  deadline: string;
}

interface CampaignQuestProps {
  campaign: CampaignData;
}

const CampaignQuest: React.FC<CampaignQuestProps> = ({ campaign }) => {
  const isCritical = campaign.threatLevel === 'CRITICAL' || campaign.threatLevel === 'HIGH';

  return (
    <CardWrapper 
      label={`CAMPAIGN_ID: ${campaign.id}`} 
      variant={campaign.status === 'LIVE' ? (isCritical ? 'red' : 'cyan') : 'amber'}
    >
      <HeaderRow>
        <div className="header-meta">
          <span className="quest-tag">QUEST_SECTOR // {campaign.category}</span>
          <h3 className="quest-title">{campaign.name}</h3>
        </div>
        <div className={`threat-badge ${campaign.threatLevel.toLowerCase()}`}>
          <AlertOctagon size={12} />
          <span>THREAT_{campaign.threatLevel}</span>
        </div>
      </HeaderRow>

      <p className="quest-description">{campaign.description}</p>

      <CompileTelemetry>
        <div className="progress-label">
          <Target size={12} />
          <span>COMPILING_DECRYPTION_LOGS:</span>
          <span className="percent">{campaign.progress}%</span>
        </div>
        <div className="progress-track">
          <div 
            className={`progress-fill ${campaign.status.toLowerCase()}`} 
            style={{ width: `${campaign.progress}%` }} 
          />
        </div>
      </CompileTelemetry>

      <FooterRow>
        <span className="meta-item">TARGET_EST: {campaign.deadline}</span>
        <span className="meta-item status">DEPLOY_STATUS: {campaign.status}</span>
      </FooterRow>
    </CardWrapper>
  );
};

const CardWrapper = styled(BunkerCard)`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .quest-description {
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--text-primary);
    opacity: 0.85;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  .header-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .quest-tag {
      font-size: 0.5rem;
      color: var(--text-dim);
      font-weight: bold;
      letter-spacing: 0.1em;
    }

    .quest-title {
      font-size: 1.05rem;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.01em;
    }
  }

  .threat-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.55rem;
    font-weight: 900;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid transparent;
    letter-spacing: 0.05em;

    &.low {
      background: rgba(0, 240, 255, 0.1);
      border-color: var(--border-cyan);
      color: var(--text-cyan);
    }
    &.medium {
      background: rgba(255, 170, 0, 0.15);
      border-color: var(--border-amber);
      color: var(--text-amber);
    }
    &.high, &.critical {
      background: rgba(239, 35, 60, 0.15);
      border-color: var(--border-red);
      color: var(--text-red);
      animation: alert-flash 1s infinite alternate;
    }
  }

  @keyframes alert-flash {
    from { opacity: 0.6; }
    to { opacity: 1; filter: drop-shadow(0 0 4px var(--border-red)); }
  }
`;

const CompileTelemetry = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .progress-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.6rem;
    font-weight: bold;
    color: var(--text-dim);
    letter-spacing: 0.05em;

    .percent {
      color: var(--text-cyan);
      margin-left: auto;
    }
  }

  .progress-track {
    height: 8px;
    background: rgba(0, 240, 255, 0.06);
    border: 1px solid rgba(0, 240, 255, 0.15);
    border-radius: 4px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: var(--border-cyan);
      box-shadow: var(--hud-glow);
      &.completed {
        background: var(--border-cyan);
      }
      &.live {
        background: var(--border-amber);
        box-shadow: var(--hud-glow-amber);
      }
      &.pending {
        background: var(--border-red);
        box-shadow: var(--hud-glow-red);
      }
    }
  }
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.55rem;
  font-weight: 800;
  color: var(--text-dim);
  border-top: 1px solid rgba(127, 140, 157, 0.1);
  padding-top: 12px;
  letter-spacing: 0.05em;
`;

export default CampaignQuest;
