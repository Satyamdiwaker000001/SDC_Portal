import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import CampaignQuest from './CampaignQuest';
import type { CampaignData } from './CampaignQuest';

const mockCampaigns: CampaignData[] = [
  {
    id: "CAMP-01",
    name: "CAMPAIGN: AEGIS SHIELD",
    description: "Developing post-apocalyptic network shields and secure firewalls to protect the core resistance cell database from machine sweeps.",
    category: "CYBER_SECURITY",
    status: "LIVE",
    threatLevel: "MEDIUM",
    progress: 94,
    deadline: "2026-06-15"
  },
  {
    id: "CAMP-02",
    name: "CAMPAIGN: DEEP NODE BREAKER",
    description: "Infiltrating the central Terminator mainframe core and injecting payload exploits to override localized drone sweeps.",
    category: "CORE_EXPLOIT",
    status: "LIVE",
    threatLevel: "CRITICAL",
    progress: 74,
    deadline: "2026-07-01"
  },
  {
    id: "CAMP-03",
    name: "CAMPAIGN: GHOST COMMS",
    description: "Deploying high-stability encrypted communication relays utilizing SQLite mapping and JWT authenticating Uplinks.",
    category: "SECURE_WEB_APP",
    status: "COMPLETED",
    threatLevel: "LOW",
    progress: 100,
    deadline: "2026-05-01"
  }
];

const CampaignQuestBoard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignData[]>(mockCampaigns);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('/api/projects');
        if (response.data && response.data.length > 0) {
          const mapped: CampaignData[] = response.data.map((p: any) => ({
            id: p.id || `CAMP-${Math.floor(Math.random() * 90) + 10}`,
            name: p.name,
            description: p.description || "Infiltration and security override campaign.",
            category: p.type || "CYBERNETIC_MODULE",
            status: p.status || "LIVE",
            threatLevel: p.progress < 50 ? "CRITICAL" : (p.progress < 80 ? "HIGH" : "MEDIUM"),
            progress: p.progress || 0,
            deadline: p.deadline || "TBD"
          }));
          setCampaigns(mapped);
        }
      } catch (err) {
        console.warn('Failed to load campaigns from API backend, falling back to mock quest logs.');
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <BoardWrapper>
      {campaigns.map((camp) => (
        <CampaignQuest key={camp.id} campaign={camp} />
      ))}
    </BoardWrapper>
  );
};

const BoardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
  width: 100%;
`;

export default CampaignQuestBoard;
