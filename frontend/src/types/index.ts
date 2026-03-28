export interface Member {
  id: string;
  name: string;
  email: string;
  spec: string;
  joinDate: string;
  retirementDate: string;
  status: 'ONLINE' | 'OFFLINE';
  image?: string;
}

export interface Team {
  id: string;
  name: string;
  leaderId: string;
  memberIds: string[];
}

export interface Project {
  id: string;
  name: string;
  teamId: string;
  progress: number;
}

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'MEMBER';
  image?: string;
}