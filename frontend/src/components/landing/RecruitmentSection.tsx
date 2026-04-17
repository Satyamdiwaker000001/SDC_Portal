import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, RefreshCcw, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

const RecruitmentSection: React.FC = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    contact: '', 
    class_name: '', 
    interested: '' 
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const submission = new FormData();
    submission.append('name', formData.name);
    submission.append('email', formData.email);
    submission.append('contact', formData.contact);
    submission.append('class_name', formData.class_name);
    submission.append('interested', formData.interested);
    if (photo) submission.append('photo', photo);
    if (resume) submission.append('resume', resume);

    try {
      await api.post('/applications/submit', submission, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <Container id="recruitment">
      <AnimatePresence mode="wait">
        {status !== 'success' ? (
          <GlassForm
            key="form"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <HeaderContent>
              <div className="badge">
                <ShieldCheck size={14} /> ENLISTMENT_PORTAL
              </div>
              <Title>Join the Syndicate</Title>
              <Subtitle>
                We are seeking elite agents to architect the next generation of production systems. 
                Submit your credentials for command review.
              </Subtitle>
            </HeaderContent>

            <Form onSubmit={handleSubmit}>
              <InputGrid>
                <FormGroup>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Satyam Diwaker"
                    required
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Official Email</label>
                  <input 
                    type="email" 
                    placeholder="agent@sdc.central"
                    required
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </FormGroup>
              </InputGrid>

              <InputGrid>
                <FormGroup>
                  <label>Operational Domain (Class/Stream)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. B.Tech CS_3rd"
                    required
                    onChange={e => setFormData({ ...formData, class_name: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Comms Frequency (Contact #)</label>
                  <input 
                    type="text" 
                    placeholder="+91 XXXX XXXX"
                    required
                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                  />
                </FormGroup>
              </InputGrid>

              <InputGrid>
                <FormGroup>
                  <label>Visual_ID (Photo)</label>
                  <div className="file-input-wrapper">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => setPhoto(e.target.files?.[0] || null)}
                    />
                    <div className="file-info">{photo ? photo.name : 'Select tactical photo...'}</div>
                  </div>
                </FormGroup>
                <FormGroup>
                  <label>Tactical_Dossier (Resume)</label>
                  <div className="file-input-wrapper">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={e => setResume(e.target.files?.[0] || null)}
                    />
                    <div className="file-info">{resume ? resume.name : 'Select PDF dossier...'}</div>
                  </div>
                </FormGroup>
              </InputGrid>

              <FormGroup>
                <label>Operational Objectives (Why Join?)</label>
                <textarea 
                  rows={4} 
                  placeholder="Describe your primary intent for joining the syndicate..."
                  required
                  onChange={e => setFormData({ ...formData, interested: e.target.value })}
                />
              </FormGroup>

              <SubmitRow>
                <div className="disclaimer">
                  By submitting, you acknowledge that your credentials will be evaluated against high-stability production standards.
                </div>
                <SubmitBtn type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Transmitting Data...' : 'Submit Enlistment'}
                  <Send size={18} />
                </SubmitBtn>
              </SubmitRow>
            </Form>
          </GlassForm>
        ) : (
          <SuccessGate 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="icon">
              <CheckCircle size={60} />
            </div>
            <Title>Transmission Complete</Title>
            <Subtitle style={{ margin: '0 auto 40px' }}>
              Your dossier has been securely uplinked. Command will evaluate your tactical profile 
              and contact you via secure channels.
            </Subtitle>
            <ResetBtn onClick={() => setStatus('idle')}>
              <RefreshCcw size={16} /> New Submission
            </ResetBtn>
          </SuccessGate>
        )}
      </AnimatePresence>
    </Container>
  );
};

const Container = styled.section`
  padding: 60px 0;
  display: flex;
  justify-content: center;
`;

const GlassForm = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 40px;
  padding: 80px;
  max-width: 900px;
  width: 100%;
  transition: all 0.4s;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.03);
  
  &:hover {
    border-color: #6366F1;
    box-shadow: 0 40px 80px rgba(99, 102, 241, 0.05);
  }

  @media (max-width: 768px) {
    padding: 40px 24px;
    border-radius: 32px;
  }
`;

const HeaderContent = styled.div`
  margin-bottom: 60px;
  text-align: center;
  
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: #6366F1;
    background: rgba(99, 102, 241, 0.08);
    padding: 6px 16px;
    border-radius: 99px;
    margin-bottom: 24px;
    font-weight: 800;
  }
`;

const Title = styled.h2`
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) { font-size: 2.2rem; }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748B;
  max-width: 600px;
  line-height: 1.6;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  label {
    font-size: 0.85rem;
    color: #475569;
    font-weight: 700;
    margin-left: 4px;
  }

  input, textarea {
    background: #F8FAFC;
    border: 1px solid rgba(0,0,0,0.05);
    padding: 16px 20px;
    border-radius: 16px;
    color: #0F172A;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s;

    &:focus {
      background: #FFF;
      border-color: #6366F1;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    &::placeholder { color: #94A3B8; }
  }

  .file-input-wrapper {
    position: relative;
    background: #F8FAFC;
    border: 1px dashed rgba(99, 102, 241, 0.3);
    border-radius: 16px;
    padding: 16px;
    cursor: pointer;
    overflow: hidden;
    transition: 0.3s;
    
    &:hover { background: rgba(99, 102, 241, 0.05); border-color: #6366F1; }
    
    input {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      opacity: 0; cursor: pointer; z-index: 2;
    }
    
    .file-info {
      font-family: var(--font-mono); font-size: 0.7rem; color: #64748B;
      text-align: center; pointer-events: none;
    }
  }
`;

const SubmitRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  gap: 40px;
  @media (max-width: 768px) { flex-direction: column; text-align: center; }

  .disclaimer { font-size: 0.8rem; color: #94A3B8; line-height: 1.5; }
`;

const SubmitBtn = styled.button`
  background: #0F172A;
  color: #fff;
  border: none;
  padding: 18px 40px;
  border-radius: 16px;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s;
  flex-shrink: 0;

  &:hover {
    background: #6366F1;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SuccessGate = styled(motion.div)`
  text-align: center;
  padding: 80px;
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 40px;
  width: 100%;
  max-width: 900px;
  
  .icon {
    color: #10B981;
    margin-bottom: 32px;
    display: inline-block;
  }
`;

const ResetBtn = styled.button`
  background: #F1F5F9;
  border: none;
  color: #475569;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
  transition: all 0.2s;
  &:hover { background: #E2E8F0; color: #0F172A; }
`;

export default RecruitmentSection;
