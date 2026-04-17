import { useState, useEffect } from 'react';

export interface SDCMember {
  id: string;
  name: string;
  email: string;
  spec: string;
  role: string; // Added for alignment
  joinDate: string;
  status: string;
  techStack: string[];
  isFounder: boolean;
  image: string;
}

export interface SDCProject {
  id: string;
  name: string;
  missionCode: string;
  type: string;
  status: string;
  progress: number;
  deadline: string;
  description: string;
  academicYear: string; // Added for alignment
  gitHubRepo: string;    // Added for alignment
  team: { id: string; name: string; leaderId: string };
  tasks: any[];
}

export interface SDCTeam {
  id: string;
  name: string;
  leaderId: string;
  members: string[] | SDCMember[]; // Support both IDs and full objects
}

export interface SDCDataState {
  members: SDCMember[];
  projects: SDCProject[];
  applications: any[];
  teams: SDCTeam[];
  leaderboard: {
    teams: Array<{ id: string; name: string; score: number; projectCount: number }>;
    individuals: Array<{ id: string; name: string; avgProgress: number; spec: string; image: string }>;
    projects: Array<{ id: string; name: string; progress: number; status: string }>;
  };
  loading: boolean;
  error: string | null;
}

export const useSDCData = () => {
  const [data, setData] = useState<SDCDataState>({
    members: [],
    projects: [],
    applications: [],
    teams: [],
    leaderboard: { teams: [], individuals: [], projects: [] },
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    setData(prev => ({ ...prev, loading: true }));
    
    // Simulate tactical uplink [LATENCY_MOCK]
    setTimeout(() => {
      const mockMembers = [
        { id: 'MEM-001', name: 'Satyam Diwaker', email: 'satyam@sdc.com', spec: 'Full Stack Sentinel', role: 'Lead Developer', joinDate: '2024-01-15', status: 'ACTIVE', techStack: ['React', 'FastAPI', 'PostgreSQL'], isFounder: true, image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Satyam' },
        { id: 'MEM-002', name: 'Alex Rivera', email: 'alex@sdc.com', spec: 'Cybersecurity Analyst', role: 'Security Ops', joinDate: '2024-02-01', status: 'ACTIVE', techStack: ['Python', 'Kali', 'Wireshark'], isFounder: false, image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
        { id: 'MEM-003', name: 'Sarah Chen', email: 'sarah@sdc.com', spec: 'UI/UX Architect', role: 'Design Lead', joinDate: '2024-02-10', status: 'ACTIVE', techStack: ['Figma', 'React', 'Tailwind'], isFounder: false, image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
        { id: 'MEM-004', name: 'Marcus Thorne', email: 'marcus@sdc.com', spec: 'DevOps Engineer', role: 'Infrastructure', joinDate: '2024-03-05', status: 'ACTIVE', techStack: ['Docker', 'K8s', 'AWS'], isFounder: false, image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' }
      ];

      const mockProjects = [
        { id: 'PROJ-ALPHA', name: 'PhishGuard Sentinel', missionCode: 'PGS-X9', type: 'Cybersecurity', status: 'LIVE', progress: 85, deadline: '2026-06-30', description: 'Advanced neural network for real-time phishing detection and mitigation.', academicYear: '2025-26', gitHubRepo: 'https://github.com/sdc/phishguard', team: { id: 'T1', name: 'CYBER_VANGUARD', leaderId: 'MEM-001' }, tasks: [] },
        { id: 'PROJ-BETA', name: 'Titanium Dashboard', missionCode: 'TIB-V5', type: 'Web System', status: 'IN_PROGRESS', progress: 45, deadline: '2026-08-15', description: 'Next-gen analytics suite with glassmorphic interface and real-time telemetry.', academicYear: '2025-26', gitHubRepo: 'https://github.com/sdc/titanium', team: { id: 'T2', name: 'UI_ELITE', leaderId: 'MEM-003' }, tasks: [] },
        { id: 'PROJ-GAMMA', name: 'SDC Cloud Core', missionCode: 'SCC-P1', type: 'Infrastructure', status: 'DRAFT', progress: 12, deadline: '2026-12-01', description: 'Centralized cloud infrastructure for SDC decentralized operations.', academicYear: '2026-27', gitHubRepo: 'https://github.com/sdc/cloudcore', team: { id: 'T3', name: 'CORE_FORGE', leaderId: 'MEM-004' }, tasks: [] }
      ];

      const mockTeams = [
        { id: 'T1', name: 'CYBER_VANGUARD', leaderId: 'MEM-001', members: ['MEM-001', 'MEM-002'] },
        { id: 'T2', name: 'UI_ELITE', leaderId: 'MEM-003', members: ['MEM-003', 'MEM-001'] },
        { id: 'T3', name: 'CORE_FORGE', leaderId: 'MEM-004', members: ['MEM-004', 'MEM-002'] }
      ];

      const mockApplications = [
        { id: 1, name: 'John Doe', email: 'john@gmail.com', contact: '9876543210', class_name: 'B.Tech CS', interested: 'Full Stack Development', status: 'PENDING', timestamp: '2026-04-10T10:00:00Z' },
        { id: 2, name: 'Jane Smith', email: 'jane@gmail.com', contact: '8877665544', class_name: 'M.Tech IT', interested: 'Cybersecurity', status: 'REVIEWED', timestamp: '2026-04-12T14:30:00Z' }
      ];

      setData({
        members: mockMembers,
        projects: mockProjects,
        applications: mockApplications,
        teams: mockTeams,
        leaderboard: {
          teams: [
            { id: 'T1', name: 'CYBER_VANGUARD', score: 98, projectCount: 3 },
            { id: 'T2', name: 'UI_ELITE', score: 85, projectCount: 2 },
            { id: 'T3', name: 'CORE_FORGE', score: 72, projectCount: 1 }
          ],
          individuals: [
            { id: 'MEM-001', name: 'Satyam Diwaker', avgProgress: 95, spec: 'Full Stack Sentinel', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Satyam' },
            { id: 'MEM-002', name: 'Alex Rivera', avgProgress: 88, spec: 'Cybersecurity', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
            { id: 'MEM-003', name: 'Sarah Chen', avgProgress: 82, spec: 'UI Architect', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
          ],
          projects: [
            { id: 'PROJ-ALPHA', name: 'PhishGuard', progress: 85, status: 'LIVE' },
            { id: 'PROJ-BETA', name: 'Titanium', progress: 45, status: 'IN_PROGRESS' }
          ]
        },
        loading: false,
        error: null,
      });
    }, 1200);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { ...data, refresh: fetchData };
};
