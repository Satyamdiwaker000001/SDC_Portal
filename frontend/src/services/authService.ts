import api from '../lib/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export const authService = {
  async login(userId: string, password: string): Promise<UserProfile> {
    const response = await api.post('/auth/login', {
      user_id: userId,
      password: password,
    });
    
    const { token, role, name, id } = response.data;
    
    // Normalize role to lowercase for frontend compatibility
    const normalizedRole = role.toLowerCase();
    
    const userProfile: UserProfile = {
      id: id,
      name: name,
      email: `${id.toLowerCase()}@sdc.com`, // fallback email if not structured
      role: normalizedRole,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
    };
    
    localStorage.setItem('sdc_token', token);
    localStorage.setItem('sdc_user', JSON.stringify(userProfile));
    
    return userProfile;
  },

  logout(): void {
    localStorage.removeItem('sdc_token');
    localStorage.removeItem('sdc_user');
  },

  getCurrentUser(): UserProfile | null {
    const rawUser = localStorage.getItem('sdc_user');
    return rawUser ? JSON.parse(rawUser) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('sdc_token');
  }
};
