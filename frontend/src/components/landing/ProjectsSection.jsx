import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Eye, Code, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Github, Linkedin } from "../ui/Icons";
import { PixelCard } from '../ui/PixelCard';
import { Tabs } from '../ui/Tabs';
import { Modal } from '../ui/Modal';
import { usePublicProjects } from '../../api/hooks/usePublicAPI';

const typeColors = {
  Web_App: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Cybersecurity: 'bg-red-500/20 text-red-400 border-red-500/30',
  Mobile_App: 'bg-green-500/20 text-green-400 border-green-500/30',
  ML_AI: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Blockchain: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Desktop: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  API: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
};

const statusColors = {
  LIVE: 'bg-accent-green/20 text-accent-green border-accent-green/30',
  PENDING: 'bg-accent-gold/20 text-accent-gold border-accent-gold/30',
  COMPLETED: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30',
  PENDING_ADMIN: 'bg-accent-magenta/20 text-accent-magenta border-accent-magenta/30',
  DRAFT: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const ProjectCard = ({ project, onClick }) => {
  const typeColor = typeColors[project.type] || typeColors.Web_App;
  const statusColor = statusColors[project.status] || statusColors.DRAFT;

  return (
    <PixelCard hoverGlow onClick={onClick} className="h-full cursor-pointer flex flex-col">
      <div className="relative aspect-video mb-4 overflow-hidden rounded-lg bg-bg-deep border border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-accent-magenta/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        {project.team && (
          <div className="absolute top-3 right-3 flex gap-1">
            {project.team.members?.slice(0, 3).map((member, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-cyan to-accent-magenta border-2 border-bg flex items-center justify-center">
                <span className="font-mono text-xs text-bg font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            ))}
            {project.team.members && project.team.members.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-bg-deep border border-border flex items-center justify-center">
                <span className="font-mono text-xs text-fg-muted">+{project.team.members.length - 3}</span>
              </div>
            )}
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className={`px-2 py-1 text-xs font-mono rounded ${typeColor}`}>
            {project.type.replace('_', ' ')}
          </span>
          <span className={`px-2 py-1 text-xs font-mono rounded ${statusColor}`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col mb-4">
        <h3 className="font-display text-xl text-fg mb-2 line-clamp-1">{project.name}</h3>
        <p className="text-sm text-fg-muted flex-1 line-clamp-2">{project.short_description || project.description || 'No description available'}</p>
      </div>

      {project.team && (
        <div className="mb-4">
          <p className="text-xs text-fg-muted mb-1">TEAM: {project.team.name}</p>
          <div className="flex gap-1">
            {project.team.members?.slice(0, 4).map((member, i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-cyan/30 to-accent-magenta/30 border border-accent-cyan/50 flex items-center justify-center">
                <span className="font-mono text-xs text-fg">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-4 border-t border-border">
        {project.github_repo && (
          <a 
            href={project.github_repo} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-mono bg-bg-deep border border-border rounded-lg hover:border-accent-cyan hover:text-accent-cyan transition-colors"
          >
            <Code className="w-4 h-4" />
            CODE
          </a>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-mono bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded-lg hover:bg-accent-cyan hover:text-bg transition-colors"
        >
          <Eye className="w-4 h-4" />
          VIEW
        </button>
      </div>
    </PixelCard>
  );
};

const ProjectModal = ({ project, onClose, onNavigate }) => {
  if (!project) return null;

  const typeColor = typeColors[project.type] || typeColors.Web_App;
  const statusColor = statusColors[project.status] || statusColors.DRAFT;

  return (
    <Modal isOpen={!!project} onClose={onClose} title={project.name} size="xl">
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-3 py-1 text-sm font-mono rounded ${typeColor}`}>
            {project.type.replace('_', ' ')}
          </span>
          <span className={`px-3 py-1 text-sm font-mono rounded ${statusColor}`}>
            {project.status}
          </span>
          {project.deadline && (
            <span className="px-3 py-1 text-sm font-mono text-fg-muted bg-bg-deep border border-border rounded">
              Due: {new Date(project.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="prose prose-dark max-w-none">
          <p className="text-fg-muted leading-relaxed">{project.description || project.short_description || 'No detailed description available.'}</p>
        </div>

        {project.team && (
          <div className="bg-bg-deep/50 border border-border rounded-xl p-6">
            <h4 className="font-display text-lg text-fg mb-4">Development Team: {project.team.name}</h4>
            <div className="flex flex-wrap gap-3">
              {project.team.members?.map((member, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-bg-card border border-border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan/30 to-accent-magenta/30 flex items-center justify-center">
                    <span className="font-mono text-sm text-fg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-sm text-fg">{member.name}</p>
                    <p className="font-mono text-xs text-fg-muted">{member.role || 'Developer'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          {project.github_repo && (
            <a href={project.github_repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 font-mono text-sm bg-bg-deep border border-border rounded-lg hover:border-accent-cyan hover:text-accent-cyan transition-colors">
              <Github className="w-4 h-4" />
              VIEW SOURCE
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 font-mono text-sm bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded-lg hover:bg-accent-cyan hover:text-bg transition-colors">
              <ExternalLink className="w-4 h-4" />
              LIVE DEMO
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);

  const { data: projects = [], isLoading } = usePublicProjects();

  const types = ['all', ...Array.from(new Set(projects.map(p => p.type)))];

  React.useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.type === activeFilter));
    }
  }, [projects, activeFilter]);

  const handleNavigate = (dir) => {
    const idx = filteredProjects.findIndex(p => p.id === selectedProject?.id);
    const nextIdx = (idx + dir + filteredProjects.length) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIdx]);
  };

  const tabs = types.map(t => ({ 
    id: t, 
    label: t === 'all' ? 'ALL' : t.replace('_', ' ').toUpperCase(),
    count: t === 'all' ? projects.length : projects.filter(p => p.type === t).length
  }));

  return (
    <section id="projects" className="py-20 md:py-32 px-4 bg-gradient-to-b from-transparent via-accent-magenta/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs text-accent-cyan uppercase tracking-widest">SHOWCASE</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-2 text-fg">
            <span className="text-accent-cyan">PROJECTS</span> ARCHIVE
          </h2>
          <p className="mt-4 text-fg-muted max-w-2xl mx-auto">
            Live, completed, and in-progress projects built by SDC teams. Real code. Real impact.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs tabs={tabs} activeTab={activeFilter} onChange={setActiveFilter} className="mb-10" />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PixelCard key={i} className="h-72 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-fg-muted">No projects found for this category</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.08 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5 }}
                >
                  <ProjectCard 
                    project={project} 
                    onClick={() => setSelectedProject(project)} 
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {selectedProject && (
            <ProjectModal 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)}
              onNavigate={handleNavigate}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectsSection;