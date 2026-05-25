import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ShieldAlert } from 'lucide-react';
import BunkerCard from '../../components/common/BunkerCard';
import CombatButton from '../../components/common/CombatButton';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'COMPILING' | 'ERROR'>('IDLE');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus('ERROR');
      return;
    }

    setStatus('COMPILING');
    setTimeout(() => {
      // Set dummy token for bypass auth
      localStorage.setItem('sdc_token', 'mock_resistance_uplink_token_v6');
      localStorage.setItem('sdc_user', JSON.stringify({
        id: 'OP-001',
        name: 'COMMANDER_SINCERE',
        email: email,
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Commander'
      }));
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <LoginContainer>
      <div className="alert-top">
        <ShieldAlert size={16} />
        <span>SECURE GATEWAY: UNRESOLVED SESSIONS WILL BE TERMINATED</span>
      </div>

      <CardWrapper variant="cyan" label="AUTHENTICATE: RESISTANCE_DECK">
        <FormHeader>
          <div className="icon-badge"><KeyRound size={28} /></div>
          <h3>UPLINK PROTOCOL V6</h3>
          <p className="subtitle">Enter your credential tokens to access SDC internal command grid.</p>
        </FormHeader>

        <Form onSubmit={handleLogin}>
          <FormGroup>
            <label>OPERATIVE_EMAIL_TOKEN:</label>
            <input 
              type="email" 
              placeholder="e.g. agent@resistance.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'COMPILING'}
            />
          </FormGroup>

          <FormGroup>
            <label>ENCRYPTION_PASSWORD_KEY:</label>
            <input 
              type="password" 
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === 'COMPILING'}
            />
          </FormGroup>

          {status === 'ERROR' && (
            <ErrorBadge>
              <span>ACCESS_DENIED: COMPILATION DECRYPTION FAILURE</span>
            </ErrorBadge>
          )}

          <div className="action-row">
            <CombatButton 
              type="submit" 
              variant="cyan"
              disabled={status === 'COMPILING'}
            >
              {status === 'COMPILING' ? "UPLINKING..." : "SECURE_UPLINK"}
            </CombatButton>
            <CombatButton 
              type="button" 
              variant="amber" 
              glow={false}
              onClick={() => navigate('/')}
            >
              ABORT_MISSION
            </CombatButton>
          </div>
        </Form>
      </CardWrapper>

      <FooterCredits>
        <span>SDC RESISTANCE CENTRAL // NODE_01 // SECURE CONSOLE</span>
      </FooterCredits>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: var(--bg-main);
  background-image: 
    linear-gradient(rgba(18, 30, 49, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 30, 49, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;

  .alert-top {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--text-amber);
    border: 1px solid rgba(255, 170, 0, 0.2);
    padding: 6px 12px;
    border-radius: 4px;
    background: rgba(255, 170, 0, 0.05);
    margin-bottom: 24px;
    letter-spacing: 0.05em;
  }
`;

const CardWrapper = styled(BunkerCard)`
  width: 100%;
  max-width: 450px;
`;

const FormHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;

  .icon-badge {
    color: var(--text-cyan);
    filter: drop-shadow(0 0 6px var(--border-cyan));
    animation: pulse 2s infinite;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.1em;
  }

  .subtitle {
    font-size: 0.65rem;
    line-height: 1.5;
    color: var(--text-dim);
    letter-spacing: 0.02em;
    max-width: 320px;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .action-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(0, 240, 255, 0.15);
    padding-top: 20px;
    margin-top: 10px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.55rem;
    font-weight: bold;
    color: var(--text-dim);
    letter-spacing: 0.1em;
  }

  input {
    background: rgba(5, 10, 18, 0.8);
    border: 1px solid rgba(0, 240, 255, 0.25);
    border-radius: 4px;
    padding: 12px 14px;
    color: #ffffff;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    outline: none;
    transition: all 0.3s ease;

    &:focus {
      border-color: var(--border-cyan);
      box-shadow: var(--hud-glow);
      background: rgba(0, 240, 255, 0.02);
    }
  }
`;

const ErrorBadge = styled.div`
  background: rgba(239, 35, 60, 0.1);
  border: 1px solid var(--border-red);
  padding: 8px 12px;
  border-radius: 4px;
  color: var(--text-red);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.05em;
`;

const FooterCredits = styled.div`
  margin-top: 24px;
  font-family: var(--font-mono);
  font-size: 0.5rem;
  color: var(--text-dim);
  letter-spacing: 0.15em;
  font-weight: bold;
  opacity: 0.7;
`;

export default LoginPage;
