import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type {
  PublicHomeData,
  Project,
  Developer,
  RecruitmentStatus,
  ApplicationFormData,
} from '../../types/api';

const queryClient = new QueryClient();

export const useHomeData = () =>
  useQuery({
    queryKey: ['home'],
    queryFn: async () => {
      const res = await api.get<PublicHomeData>('/public/home');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const usePublicProjects = () =>
  useQuery({
    queryKey: ['projects', 'public'],
    queryFn: async () => {
      const res = await api.get<Project[]>('/public/projects');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const usePublicDevelopers = (isFounder?: boolean) =>
  useQuery({
    queryKey: ['developers', 'public', { isFounder }],
    queryFn: async () => {
      const params = isFounder ? '?is_founder=true' : '';
      const res = await api.get<Developer[]>(`/public/developers${params}`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const usePublicAlumni = () =>
  useQuery({
    queryKey: ['alumni', 'public'],
    queryFn: async () => {
      const res = await api.get<Developer[]>('/public/alumni');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useRecruitmentStatus = () =>
  useQuery({
    queryKey: ['recruitment', 'status'],
    queryFn: async () => {
      const res = await api.get<RecruitmentStatus>('/public/recruitment/status');
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });

export const useSubmitApplication = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/applications/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recruitment', 'status'] });
    },
  });
};