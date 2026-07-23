import client from './client';

export const authAPI = {
  login: async (username, password) => {
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
  },
  bulkUpload: async (formData) => {
    const { data } = await client.post('/users/bulk-upload', formData);
    return data;
  },
  update: async (id, userData) => {
    const { data } = await client.patch(`/users/${id}`, userData);
    return data;
  },
  toggleMembership: async (id, isRetired) => {
    const { data } = await client.patch(`/users/${id}/membership?is_retired=${isRetired}`);
    return data;
  },
  runAutoConvert: async () => {
    const { data } = await client.post('/users/alumni/auto-convert');
    return data;
  },
  delete: async (id) => {
    const { data } = await client.delete(`/users/${id}`);
    return data;
  },
  uploadAvatar: async (userId, formData) => {
    const { data } = await client.post(
      `/users/upload-avatar?user_id=${userId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },
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
  },
  addMember: async (teamId, memberData) => {
    const { data } = await client.post(`/teams/${teamId}/members`, memberData);
    return data;
  },
  update: async (id, teamData) => {
    const { data } = await client.patch(`/teams/${id}`, teamData);
    return data;
  },
  delete: async (id) => {
    const { data } = await client.delete(`/teams/${id}`);
    return data;
  },
  removeMember: async (teamId, userId) => {
    const { data } = await client.delete(`/teams/${teamId}/members/${userId}`);
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
  },
  update: async (id, projectData) => {
    const { data } = await client.patch(`/projects/${id}`, projectData);
    return data;
  },
  delete: async (id) => {
    const { data } = await client.delete(`/projects/${id}`);
    return data;
  },
  getPhases: async (id) => {
    const { data } = await client.get(`/projects/${id}/phases`);
    return data;
  },
  unlockPhase: async (id, phaseId) => {
    const { data } = await client.patch(`/projects/${id}/phases/${phaseId}/unlock`);
    return data;
  },
  getDocuments: async (id) => {
    const { data } = await client.get(`/projects/${id}/documents`);
    return data;
  },
  uploadDocument: async (id, docId, formData) => {
    const { data } = await client.post(`/projects/${id}/documents/${docId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }
};

export const tasksAPI = {
  getAll: async (projectId = null, assignedTo = null, status = null) => {
    let params = [];
    if (projectId) params.push(`project_id=${projectId}`);
    if (assignedTo) params.push(`assigned_to=${assignedTo}`);
    if (status) params.push(`status=${status}`);
    
    let url = '/tasks/';
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    const { data } = await client.get(url);
    return data;
  },
  create: async (taskData) => {
    const { data } = await client.post('/tasks/', taskData);
    return data;
  },
  updateStatus: async (id, status) => {
    const { data } = await client.patch(`/tasks/${id}/status?status=${status}`);
    return data;
  },
  submit: async (id, submissionData) => {
    const { data } = await client.post(`/tasks/${id}/submit`, submissionData);
    return data;
  },
  verify: async (id, verificationData) => {
    const { data } = await client.post(`/tasks/${id}/verify`, verificationData);
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
    const { data } = await client.patch(`/applications/${id}/status?status_update=${status}`);
    return data;
  },
  delete: async (id) => {
    const { data } = await client.delete(`/applications/${id}`);
    return data;
  }
};

export const announcementsAPI = {
  getAll: async () => {
    const { data } = await client.get('/announcements/');
    return data.map(item => ({
      id: item.id,
      title: item.title,
      body: item.content,
      priority: 'Normal',
      is_global: item.audience_type === 'ALL_USERS',
      team_ids: item.target_team_ids || [],
      timestamp: item.created_at || new Date().toISOString(),
      pinned: false
    }));
  },
  create: async (announcementData) => {
    const payload = {
      title: announcementData.title,
      content: announcementData.body,
      audience_type: announcementData.is_global ? "ALL_USERS" : "SPECIFIC_TEAMS",
      target_team_ids: announcementData.team_ids || []
    };
    const { data } = await client.post('/announcements/', payload);
    return {
      id: data.id,
      title: data.title,
      body: data.content,
      priority: announcementData.priority || 'Normal',
      is_global: data.audience_type === 'ALL_USERS',
      team_ids: data.target_team_ids || [],
      timestamp: data.created_at || new Date().toISOString(),
      pinned: false
    };
  },
  delete: async (id) => {
    const { data } = await client.delete(`/announcements/${id}`);
    return data;
  }
};

export const noticesAPI = {
  getAll: async () => {
    const { data } = await client.get('/notices/');
    return data.map(item => ({
      id: item.id,
      title: item.title,
      body: item.description,
      priority: item.category === 'General' ? 'Normal' : item.category,
      is_global: item.audience_type === 'ALL_USERS',
      team_ids: item.target_team_ids || [],
      timestamp: item.created_at || new Date().toISOString(),
      pinned: item.is_pinned || false
    }));
  },
  create: async (noticeData) => {
    const payload = {
      title: noticeData.title,
      description: noticeData.body,
      category: noticeData.priority === 'Normal' ? 'General' : noticeData.priority,
      audience_type: noticeData.is_global ? "ALL_USERS" : "SPECIFIC_TEAMS",
      target_team_ids: noticeData.team_ids || [],
      is_pinned: noticeData.pinned || false
    };
    const { data } = await client.post('/notices/', payload);
    return {
      id: data.id,
      title: data.title,
      body: data.description,
      priority: data.category === 'General' ? 'Normal' : data.category,
      is_global: data.audience_type === 'ALL_USERS',
      team_ids: data.target_team_ids || [],
      timestamp: data.created_at || new Date().toISOString(),
      pinned: data.is_pinned || false
    };
  },
  update: async (id, noticeData) => {
    const { data } = await client.patch(`/notices/${id}`, noticeData);
    return data;
  },
  delete: async (id) => {
    const { data } = await client.delete(`/notices/${id}`);
    return data;
  }
};

export const interactionsAPI = {
  getAll: async (entityType = null, entityId = null) => {
    let url = '/interactions/';
    if (entityType && entityId) {
      url += `?entity_type=${entityType}&entity_id=${entityId}`;
    } else if (entityType) {
      url += `?entity_type=${entityType}`;
    }
    const { data } = await client.get(url);
    return data;
  },
  create: async (interactionData) => {
    const { data } = await client.post('/interactions/', interactionData);
    return data;
  }
};

export const settingsAPI = {
  get: async (key) => {
    const { data } = await client.get(`/settings/${key}`);
    return data;
  },
  update: async (key, value) => {
    const { data } = await client.patch(`/settings/${key}?value=${value}`);
    return data;
  }
};

export const leaderboardsAPI = {
  getDevelopers: async () => {
    const { data } = await client.get('/leaderboards/developers');
    return data;
  },
  getTeams: async () => {
    const { data } = await client.get('/leaderboards/teams');
    return data;
  }
};

export const auditAPI = {
  getLogs: async () => {
    const { data } = await client.get('/audit/logs');
    return data;
  }
};

export const notificationsAPI = {
  getAll: async () => {
    const { data } = await client.get('/notifications');
    return data;
  },

  getUnreadCount: async () => {
    const { data } = await client.get('/notifications/unread-count');
    return data;
  },

  markAsRead: async (id) => {
    const { data } = await client.patch(`/notifications/${id}/read`);
    return data;
  }
};