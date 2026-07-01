import client from './client';

export const authAPI = {
  login: async (username, password) => {
    // OAuth2PasswordBearer expects form data
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const { data } = await client.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data;
  },
  getMe: async () => {
    const { data } = await client.get('/auth/me');
    return data;
  },
  logout: async () => {
    const { data } = await client.post('/auth/logout');
    return data;
  }
};

export const usersAPI = {
  getAll: async () => {
    const { data } = await client.get('/users/');
    return data;
  },
  create: async (userData) => {
    const { data } = await client.post('/users/', userData);
    return data;
  }
};

export const teamsAPI = {
  getAll: async () => {
    const { data } = await client.get('/teams/');
    return data;
  },
  create: async (teamData) => {
    const { data } = await client.post('/teams/', teamData);
    return data;
  },
  getMembers: async (teamId) => {
    const { data } = await client.get(`/teams/${teamId}/members`);
    return data;
  }
};

export const projectsAPI = {
  getAll: async () => {
    const { data } = await client.get('/projects/');
    return data;
  },
  create: async (projectData) => {
    const { data } = await client.post('/projects/', projectData);
    return data;
  },
  updateStatus: async (id, status) => {
    const { data } = await client.patch(`/projects/${id}/status?status=${status}`);
    return data;
  }
};

export const tasksAPI = {
  getAll: async () => {
    const { data } = await client.get('/tasks/');
    return data;
  },
  create: async (taskData) => {
    const { data } = await client.post('/tasks/', taskData);
    return data;
  },
  updateStatus: async (id, status) => {
    const { data } = await client.patch(`/tasks/${id}/status?status=${status}`);
    return data;
  }
};

export const applicationsAPI = {
  getAll: async () => {
    const { data } = await client.get('/applications/');
    return data;
  },
  create: async (applicationData) => {
    const { data } = await client.post('/applications/', applicationData);
    return data;
  },
  updateStatus: async (id, status) => {
    const { data } = await client.patch(`/applications/${id}/status?status=${status}`);
    return data;
  }
};

export const announcementsAPI = {
  getAll: async () => {
    const { data } = await client.get('/announcements/');
    return data;
  },
  create: async (announcementData) => {
    const { data } = await client.post('/announcements/', announcementData);
    return data;
  }
};

export const interactionsAPI = {
  getAll: async (entityType, entityId) => {
    const { data } = await client.get(`/interactions/?entity_type=${entityType}&entity_id=${entityId}`);
    return data;
  },
  create: async (interactionData) => {
    const { data } = await client.post('/interactions/', interactionData);
    return data;
  }
};
