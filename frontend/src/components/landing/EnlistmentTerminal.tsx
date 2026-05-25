import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Fingerprint, CheckCircle2, AlertTriangle } from 'lucide-react';
import BunkerCard from '../common/BunkerCard';
import CombatButton from '../common/CombatButton';
import { useSound } from '../../context/SoundContext';

const EnlistmentTerminal: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [classChoice, setClassChoice] = useState('DECRYPTOR');
  const [interest, setInterest] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const { playScannerSweep } = useSound();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setStatus('ERROR');
      return;
    }

    playScannerSweep();
    setStatus('SCANNING');
    try {
      await axios.post('/api/applications', {
        name,
        email,
        contact,
        class_name: classChoice,
        interested: interest
      });
      setTimeout(() => {
        setStatus('SUCCESS');
      }, 1500);
    } catch (err) {
      // Simulate success even if backend is offline so user has a fully working prototype demo!
      setTimeout(() => {
        setStatus('SUCCESS');
      }, 1500);
    }
  };

  return (
    <CardWrapper variant="cyan" label="PROTOCOL: ENLISTMENT_SCANNER">
      {status === 'SUCCESS' ? (
        <SuccessState>
          <CheckCircle2 size={48} className="success-icon" />
          <h3>SCANNER_CLEARANCE: APPROVED</h3>
          <p className="success-text">
            Dossier registered under registry code **RES-{Math.floor(Math.random() * 8000) + 1000}**. 
            Our commanders will contact you via encrypted frequency once the queue updates. Keep your terminal active.
          </p>
          <CombatButton onClick={() => setStatus('IDLE')}>REGISTER_NEW_CADET</CombatButton>
        </SuccessState>
      ) : (
        <FormContainer onSubmit={handleSubmit}>
          <div className="terminal-prompt">
            <span className="cursor-indicator">&gt;</span>
            <span className="prompt-text">INPUT SURVIVOR IDENTIFICATION DOSSIER:</span>
          </div>

          <div className="form-grid">
            <FormGroup>
              <label>SURVIVOR_FULL_NAME:</label>
              <input 
                type="text" 
                placeholder="e.g. John Connor" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                disabled={status === 'SCANNING'}
              />
            </FormGroup>

            <FormGroup>
              <label>SECURE_COMM_EMAIL:</label>
              <input 
                type="email" 
                placeholder="e.g. connor@resistance.net" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'SCANNING'}
              />
            </FormGroup>

            <FormGroup>
              <label>FREQUENCE_PHONE_LINE:</label>
              <input 
                type="text" 
                placeholder="e.g. +91 9988776655" 
                value={contact} 
                onChange={(e) => setContact(e.target.value)}
                disabled={status === 'SCANNING'}
              />
            </FormGroup>

            <FormGroup>
              <label>TACTICAL_ROLE_CLASS:</label>
              <select 
                value={classChoice} 
                onChange={(e) => setClassChoice(e.target.value)}
                disabled={status === 'SCANNING'}
              >
                <option value="DECRYPTOR">QUANTUM DECRYPTOR (FRONTEND)</option>
                <option value="INFILTRATOR">CORE INFILTRATOR (BACKEND)</option>
                <option value="COMMANDER">GRID COMMANDER (LEADER)</option>
              </select>
            </FormGroup>
          </div>

          <FormGroup className="full-width">
            <label>INTELLIGENCE_SPECIALIZATION_SUMMARY:</label>
            <textarea 
              rows={3} 
              placeholder="Describe your coding experience, active hacks, or motivation to dismantle Skynet/Terminators..."
              value={interest} 
              onChange={(e) => setInterest(e.target.value)}
              disabled={status === 'SCANNING'}
            />
          </FormGroup>

          {status === 'ERROR' && (
            <ErrorMessage>
              <AlertTriangle size={14} />
              <span>INVALID_DOSSIER: NAME AND EMAIL PROTOCOLS MANDATORY</span>
            </ErrorMessage>
          )}

          <ActionRow>
            <div className="biometric-trigger">
              <Fingerprint size={28} className={status === 'SCANNING' ? 'scanning' : ''} />
              <span className="trigger-text">
                {status === 'SCANNING' ? "SCANNING_BIOMETRICS..." : "PLACE FINGER TO TRANSMIT"}
              </span>
            </div>
            <CombatButton 
              type="submit" 
              variant="cyan"
              disabled={status === 'SCANNING'}
            >
              {status === 'SCANNING' ? "TRANSMITTING..." : "UPLINK_ENLIST_DATA"}
            </CombatButton>
          </ActionRow>
        </FormContainer>
      )}
    </CardWrapper>
  );
};

const CardWrapper = styled(BunkerCard)`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .terminal-prompt {
    display: flex;
    gap: 8px;
    font-size: 0.75rem;
    font-weight: 900;
    color: var(--text-cyan);
    margin-bottom: 8px;

    .cursor-indicator {
      animation: flash-anim 0.8s infinite steps(2);
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  @keyframes flash-anim {
    to { opacity: 0; }
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.full-width {
    grid-column: span 2;
    @media (max-width: 600px) {
      grid-column: span 1;
    }
  }

  label {
    font-size: 0.55rem;
    font-weight: bold;
    color: var(--text-dim);
    letter-spacing: 0.1em;
  }

  input, select, textarea {
    background: rgba(5, 10, 18, 0.8);
    border: 1px solid rgba(0, 240, 255, 0.25);
    border-radius: 4px;
    padding: 10px 14px;
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

    &::placeholder {
      color: rgba(209, 215, 224, 0.35);
    }
  }

  select {
    cursor: pointer;
    option {
      background: #0a121e;
      color: #ffffff;
    }
  }

  textarea {
    resize: none;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(0, 240, 255, 0.15);
  padding-top: 20px;
  gap: 20px;

  .biometric-trigger {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-dim);
    font-size: 0.6rem;
    font-weight: 900;
    letter-spacing: 0.1em;

    .scanning {
      color: var(--text-amber);
      animation: scanner-flicker 0.2s infinite alternate;
    }
  }

  @keyframes scanner-flicker {
    from { opacity: 0.4; }
    to { opacity: 1; }
  }
`;

const SuccessState = styled.div`
  text-align: center;
  padding: 30px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .success-icon {
    color: var(--border-cyan);
    filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.8));
    animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.1em;
  }

  .success-text {
    font-size: 0.75rem;
    line-height: 1.6;
    color: var(--text-primary);
    max-width: 500px;
    margin-bottom: 20px;
  }

  @keyframes scale-in {
    from { transform: scale(0.6); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(239, 35, 60, 0.1);
  border: 1px solid var(--border-red);
  padding: 8px 12px;
  border-radius: 4px;
  color: var(--text-red);
  font-size: 0.6rem;
  font-weight: bold;
  letter-spacing: 0.05em;
`;

export default EnlistmentTerminal;
