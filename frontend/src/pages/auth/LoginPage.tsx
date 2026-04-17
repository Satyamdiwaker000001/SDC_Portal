import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import sdcLogo from '../../assets/sdclogo.png';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.bgMain};
  transition: background-color 0.5s ease;
  position: relative;
  overflow: hidden;

  /* Subtle background accent */
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 1;
  }
`;

const GlassCard = styled(motion.div)`
  width: 100%;
  max-width: 440px;
  background: ${props => props.theme.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.7)'};
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid ${props => props.theme.border};
  border-radius: 32px;
  padding: 48px;
  box-shadow: ${props => props.theme.shadow};
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  img {
    height: 56px;
    filter: ${props => props.theme.mode === 'light' ? 'brightness(0)' : 'brightness(0) invert(1)'};
    margin-bottom: 8px;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 800;
    color: ${props => props.theme.textPrimary};
    letter-spacing: -0.02em;
    margin: 0;
  }

  p {
    font-size: 0.95rem;
    color: ${props => props.theme.textSecondary};
    font-weight: 500;
    margin: 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-size: 0.85rem;
    font-weight: 700;
    color: ${props => props.theme.textSecondary};
    margin-left: 4px;
  }
`;

const InputWrapper = styled.div<{ $focused?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${props => props.theme.mode === 'light' ? 'white' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.$focused ? '#6366F1' : props.theme.border};
  padding: 0 18px;
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$focused ? '0 0 15px rgba(99, 102, 241, 0.1)' : 'none'};

  svg {
    color: ${props => props.$focused ? '#6366F1' : props.theme.textSecondary};
    opacity: 0.6;
    transition: all 0.3s ease;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 0;
  border: none;
  background: transparent;
  outline: none;
  color: ${props => props.theme.textPrimary};
  font-size: 0.95rem;
  font-weight: 500;

  &::placeholder {
    color: ${props => props.theme.textSecondary};
    opacity: 0.4;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #6366F1;
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
  margin-top: 12px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(99, 102, 241, 0.4);
    background: #4F46E5;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorBanner = styled(motion.div)`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #EF4444;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, name, role, id } = response.data;
      localStorage.setItem('sdc_token', access_token);
      localStorage.setItem('sdc_user', JSON.stringify({ name, role, id }));

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Identity verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <GlassCard
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <LogoSection>
          <img src={sdcLogo} alt="SDC" />
          <h1>Central Command</h1>
          <p>Access the mission control terminal</p>
        </LogoSection>

        <Form onSubmit={handleLogin}>
          <AnimatePresence>
            {error && (
              <ErrorBanner
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle size={18} />
                {error}
              </ErrorBanner>
            )}
          </AnimatePresence>

          <InputGroup>
            <label>Operative Email</label>
            <InputWrapper $focused={focused === 'email'}>
              <Mail size={18} />
              <Input
                type="email"
                placeholder="agent@sdc.central"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                required
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <label>Encryption Key</label>
            <InputWrapper $focused={focused === 'password'}>
              <Lock size={18} />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                required
              />
            </InputWrapper>
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Establishing Uplink...
              </>
            ) : (
              <>
                Establish Connection
                <ChevronRight size={20} />
              </>
            )}
          </SubmitButton>
        </Form>
      </GlassCard>
    </Container>
  );
};

export default LoginPage;
