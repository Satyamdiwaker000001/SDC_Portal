// User type
export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'OPERATOR';
}

// Member/Operative type
export interface Member {
  id: string;
  name: string;
  email: string;
  spec: string;
  joinDate: string;
  retirementDate: string;
  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
}

// Team type
export interface Team {
  id: string;
  name: string;
  leaderId: string;
  memberIds: string[];
}

// Project type
export interface Project {
  id: string;
  name: string;
  progress: number;
  teamId: string;
}
