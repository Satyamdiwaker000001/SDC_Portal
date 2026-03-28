// src/store/useStore.ts
// cSpell:ignore Satyam Diwaker Vedant Sharma Rahul Singh
import { create } from 'zustand';

import type { User, Team, Project, Member } from '../types';

interface CreateTeamInput {
  name: string;
  leaderId: string;
  memberIds: string[];
}

interface BulkTeamInput {
  name: string;
  leaderName: string;
  memberNames: string;
  projectNames?: string;
}

interface SdcStore {
  isInterviewLive: boolean;
  toggleInterview: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  members: readonly Member[];
  teams: Team[];
  projects: Project[];
  createTeam: (team: CreateTeamInput) => void;
  createTeamBulk: (teams: BulkTeamInput[]) => void;
  updateProgress: (projectId: string, progress: number) => void;
}

export const useStore = create<SdcStore>((set) => ({
  isInterviewLive: false,
  toggleInterview: () => set((state) => ({ isInterviewLive: !state.isInterviewLive })),
  user: { id: '1', name: 'Satyam Diwaker', role: 'ADMIN' },
  setUser: (user) => set({ user }),
  members: [
    { id: 'S1', name: 'Satyam Diwaker', email: 'satyam@sdc.portal', spec: 'SYSTEM_ARCHITECT', joinDate: '2023-01-01', retirementDate: '2028-12-31', status: 'ONLINE' },
    { id: 'S2', name: 'Vedant Sharma', email: 'vedant@sdc.portal', spec: 'SEC_SPECIALIST', joinDate: '2024-02-15', retirementDate: '2027-06-30', status: 'ONLINE' },
    { id: 'S3', name: 'Rahul Singh', email: 'rahul@sdc.portal', spec: 'CORE_DEV', joinDate: '2022-01-01', retirementDate: '2024-12-31', status: 'OFFLINE' }
  ] as const,
  teams: [
    { id: 't1', name: 'Alpha Squad', leaderId: 'S1', memberIds: ['S1', 'S2'] },
    { id: 't2', name: 'Beta Unit', leaderId: 'S3', memberIds: ['S3'] },
  ],
  projects: [
    { id: 'p1', name: 'Portal v2', progress: 75, teamId: 't1' },
    { id: 'p2', name: 'Security Layer', progress: 40, teamId: 't2' },
  ],
  createTeam: (teamInput) => set((state) => {
    return {
      teams: [...state.teams, { 
        ...teamInput,
        id: `t${state.teams.length + 1}` 
      }],
    };
  }),
  createTeamBulk: (bulkTeams) => set((state) => {
    const members = state.members as Member[];
    const allProjects = state.projects;
    const newTeams: Team[] = [];
    const newProjects: Project[] = [...allProjects];
    let nextTeamNum = state.teams.length + 1;
    let nextProjectNum = allProjects.length + 1;

    bulkTeams.forEach((bulkTeam) => {
      // Find leader by name
      const leader = members.find(m => 
        m.name.toLowerCase() === bulkTeam.leaderName.toLowerCase()
      );
      
      if (!leader) return;

      // Find members by names
      const memberNames = bulkTeam.memberNames.split(',').map(n => n.trim());
      const teamMembers = members.filter(m => 
        memberNames.some(name => name.toLowerCase() === m.name.toLowerCase())
      );

      const teamId = `t${nextTeamNum}`;
      
      // Create team
      newTeams.push({
        id: teamId,
        name: bulkTeam.name,
        leaderId: leader.id,
        memberIds: teamMembers.map(m => m.id)
      });

      // Create projects if specified
      if (bulkTeam.projectNames) {
        const projectNames = bulkTeam.projectNames.split(',').map(n => n.trim());
        projectNames.forEach((projName) => {
          newProjects.push({
            id: `p${nextProjectNum}`,
            name: projName,
            progress: 0,
            teamId
          });
          nextProjectNum++;
        });
      }

      nextTeamNum++;
    });

    return {
      teams: [...state.teams, ...newTeams],
      projects: newProjects
    };
  }),
  updateProgress: (projectId, progress) => set((state) => ({
    projects: state.projects.map(p => p.id === projectId ? { ...p, progress } : p),
  })),
})); 
