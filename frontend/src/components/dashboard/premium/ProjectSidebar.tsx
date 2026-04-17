import React from 'react';
import styled from 'styled-components';
import { Folder } from 'lucide-react';
import LinearProgressBar from './LinearProgressBar';

// Minimal interface for Sidebar
interface SidebarProject {
  id: string;
  name: string;
  status: string;
  progress: number;
  academicYear?: string;
}

const SidebarContainer = styled.div`
  width: 320px;
  height: 100%;
  padding: 24px;
  background: rgba(13, 18, 29, 0.4);
  border-right: 1px solid var(--border-glass);
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  flex-shrink: 0;

  &::-webkit-scrollbar {
    width: 4px;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  
  h2 {
    font-size: 0.9rem;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-weight: 700;
  }
`;

const ProjectCard = styled.div<{ $active: boolean }>`
  background: ${props => props.$active ? 'var(--bg-card-hover)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.$active ? 'var(--accent-primary)' : 'var(--border-glass)'};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: var(--bg-card-hover);
    border-color: rgba(108, 99, 255, 0.5);
    transform: translateY(-2px);
  }

  ${props => props.$active && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--accent-primary);
      box-shadow: 0 0 10px var(--accent-primary);
    }
  `}
`;

const ProjectInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  
  h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-main);
    line-height: 1.2;
  }
  
  span {
    font-size: 0.7rem;
    color: var(--text-dim);
    background: rgba(255,255,255,0.05);
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

const StatusTag = styled.div<{ $status: string }>`
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${props => 
    props.$status === 'LIVE' ? 'rgba(16, 185, 129, 0.1)' : 
    props.$status === 'COMPLETED' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
  color: ${props => 
    props.$status === 'LIVE' ? 'var(--accent-success)' : 
    props.$status === 'COMPLETED' ? 'var(--accent-info)' : 'var(--accent-warning)'};
  font-weight: 700;
  margin-bottom: 8px;
  display: inline-block;
  text-transform: uppercase;
`;

interface SidebarProps {
  projects: SidebarProject[];
  activeProjectId: string | null;
  onSelect: (id: string) => void;
}

const ProjectSidebar: React.FC<SidebarProps> = ({ projects, activeProjectId, onSelect }) => {
  return (
    <SidebarContainer>
      <SidebarHeader>
        <Folder size={18} color="var(--accent-primary)" />
        <h2>Mission Pipeline</h2>
      </SidebarHeader>
      
      {projects.map(project => (
        <ProjectCard 
          key={project.id} 
          $active={activeProjectId === project.id}
          onClick={() => onSelect(project.id)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <StatusTag $status={project.status}>{project.status}</StatusTag>
            {project.academicYear && <span>{project.academicYear}</span>}
          </div>
          <ProjectInfo>
            <h3>{project.name}</h3>
          </ProjectInfo>
          <LinearProgressBar 
            progress={project.progress} 
            color={project.status === 'COMPLETED' ? 'var(--accent-info)' : 'var(--accent-primary)'} 
            showText 
            height="6px"
          />
        </ProjectCard>
      ))}
    </SidebarContainer>
  );
};

export default ProjectSidebar;
