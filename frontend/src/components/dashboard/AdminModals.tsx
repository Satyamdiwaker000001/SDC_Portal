import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Upload, FileText, Database } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onCSVUpload?: (file: File) => void;
  csvTemplateUrl?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onCSVUpload, csvTemplateUrl }) => {
  const [mode, setMode] = useState<'MANUAL' | 'CSV'>('MANUAL');

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <div className="title-block">
                <div className="title-icon"><Terminal size={16} /></div>
                <div className="title-text">
                  <div className="title-tag">SDC_COMMAND_INTERFACE</div>
                  <h3>{title}</h3>
                </div>
              </div>
              <HUDActions>
                {onCSVUpload && (
                  <ModeToggle>
                    <button className={mode === 'MANUAL' ? 'active' : ''} onClick={() => setMode('MANUAL')}>MANUAL</button>
                    <button className={mode === 'CSV' ? 'active' : ''} onClick={() => setMode('CSV')}>BULK_CSV</button>
                  </ModeToggle>
                )}
                <CloseBtn onClick={onClose}><X size={16} /></CloseBtn>
              </HUDActions>
            </ModalHeader>

            <ModalBody>
              {mode === 'MANUAL' ? (
                children
              ) : (
                <CSVUploadZone onUpload={onCSVUpload!} templateUrl={csvTemplateUrl} />
              )}
            </ModalBody>
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

const CSVUploadZone = ({ onUpload, templateUrl }: { onUpload: (f: File) => void, templateUrl?: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };
  return (
    <CSVContainer onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <div className="icon-ring"><Upload size={28} /></div>
      <h4>DROP_CSV_CARTRIDGE_HERE</h4>
      <p>Accepted format: .csv | Max size: 10MB</p>
      <input type="file" id="csv-upload" hidden accept=".csv" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
      <label htmlFor="csv-upload" className="browse-btn">
        {file ? file.name : 'SELECT_FILE'}
      </label>
      {file && (
        <SubmitButton onClick={() => onUpload(file)}>
          <Database size={16} /> INITIATE_BULK_SYNC
        </SubmitButton>
      )}
      {templateUrl && (
        <a href={templateUrl} download className="template-link">
          <FileText size={13} /> DOWNLOAD_CSV_BLUEPRINT
        </a>
      )}
    </CSVContainer>
  );
};

/* ════════════════════════════════════════
   STYLED COMPONENTS — Full theme-aware
════════════════════════════════════════ */

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 5000;
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  background: var(--bg-overlay);
  backdrop-filter: blur(12px);
`;

const ModalContent = styled(motion.div)`
  width: 100%; max-width: 680px;
  background: var(--bg-card);
  border: var(--border-glass);
  border-radius: 28px;
  box-shadow: var(--shadow-xl);
  overflow: hidden; position: relative;

  &::before {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px;
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), var(--accent-primary));
    background-size: 200% 100%; animation: shimmer 3s linear infinite;
  }
  @keyframes shimmer { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }
`;

const ModalHeader = styled.div`
  padding: 24px 32px;
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: var(--border-glass);
  background: var(--bg-glass);

  .title-block {
    display: flex; align-items: center; gap: 14px;
    .title-icon {
      width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
      background: var(--bg-glass);
      border: 1px solid rgba(96,165,250,0.25);
      display: flex; align-items: center; justify-content: center;
      color: var(--accent-primary);
    }
    .title-text { display: flex; flex-direction: column; gap: 3px; }
    .title-tag {
      font-family: var(--font-mono); font-size: 0.48rem; font-weight: 800;
      color: var(--accent-primary); letter-spacing: 0.15em; opacity: 0.7;
    }
    h3 {
      font-family: var(--font-heading); font-size: 0.95rem; font-weight: 900;
      letter-spacing: 0.04em; margin: 0;
      color: var(--text-main);
    }
  }
`;

const HUDActions = styled.div` display: flex; align-items: center; gap: 16px; `;

const ModeToggle = styled.div`
  background: var(--bg-main);
  border: var(--border-glass);
  padding: 4px; border-radius: 10px; display: flex; gap: 4px;
  button {
    background: none; border: none; padding: 7px 14px; border-radius: 8px;
    font-family: var(--font-mono); font-size: 0.58rem; font-weight: 700;
    color: var(--text-dim);
    cursor: pointer; transition: 0.25s; letter-spacing: 0.05em;
    &.active {
      background: var(--bg-card);
      color: var(--accent-primary);
      box-shadow: var(--shadow-sm);
      border: 1px solid rgba(96,165,250,0.2);
    }
  }
`;

const CloseBtn = styled.button`
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: var(--bg-glass);
  border: var(--border-glass);
  color: var(--text-dim);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: 0.3s;
  &:hover { background: var(--accent-error); color: white; border-color: var(--accent-error); transform: rotate(90deg); }
`;

const ModalBody = styled.div`
  padding: 32px; max-height: 62vh; overflow-y: auto;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: var(--accent-primary); border-radius: 10px; opacity: 0.4; }
`;

/* ── Form Exports ── */

export const FormGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
`;

export const FormGroup = styled.div<{ fullWidth?: boolean }>`
  display: flex; flex-direction: column; gap: 8px;
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};

  label {
    font-family: var(--font-mono); font-size: 0.58rem; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-dim);
    display: flex; align-items: center; gap: 6px;
  }

  input, select, textarea {
    width: 100%;
    background: var(--bg-main);
    border: 1.5px solid var(--border-glass);
    border-radius: 12px;
    padding: 14px 18px;
    color: var(--text-main);
    font-family: var(--font-alt); /* More readable Outfit/Jakarta */
    font-size: 0.9rem; font-weight: 500;
    transition: all 0.25s; outline: none;
    box-sizing: border-box;

    &:focus {
      border-color: var(--accent-primary);
      background: var(--bg-card);
      box-shadow: 0 0 0 4px rgba(96,165,250,0.1);
    }
    &::placeholder {
      color: rgba(148,163,184,0.4);
    }
  }

  select {
    appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2360A5FA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    padding-right: 44px;
    option {
      background: var(--bg-card);
      color: var(--text-main);
    }
  }

  textarea { min-height: 110px; resize: none; }
`;

export const SubmitButton = styled.button`
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border: none; border-radius: 14px; padding: 16px 28px;
  color: #fff !important; font-weight: 900;
  font-family: var(--font-heading); font-size: 0.85rem;
  margin-top: 24px; width: 100%; cursor: pointer;
  box-shadow: 0 8px 24px rgba(96,165,250,0.25); transition: all 0.3s;
  display: flex; align-items: center; justify-content: center;
  gap: 10px; letter-spacing: 0.06em;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(96,165,250,0.4);
    color: #fff !important;
  }
  &:active { transform: translateY(-1px); }
  &:disabled {
    background: var(--bg-main);
    color: var(--text-dim) !important;
    opacity: 0.8; cursor: not-allowed; transform: none; box-shadow: none;
  }
`;

const CSVContainer = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 48px 32px; text-align: center;
  border: 2px dashed var(--border-glass);
  border-radius: 20px;
  background: var(--bg-main);
  transition: 0.3s;
  &:hover {
    border-color: rgba(96,165,250,0.5);
    background: var(--bg-glass);
  }
  .icon-ring {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--bg-glass);
    border: 1px solid rgba(96,165,250,0.25);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent-primary); margin-bottom: 20px;
  }
  h4 {
    font-family: var(--font-heading); font-size: 0.95rem; font-weight: 900; margin-bottom: 8px;
    color: var(--text-main);
  }
  p { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); margin-bottom: 24px; }
  .browse-btn {
    display: inline-block; padding: 11px 26px;
    border: 1px solid rgba(96,165,250,0.35);
    background: var(--bg-glass);
    color: var(--accent-primary); border-radius: 10px;
    font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700;
    cursor: pointer; transition: 0.3s;
    &:hover { background: var(--accent-primary); color: white; border-color: var(--accent-primary); }
  }
  .template-link {
    margin-top: 18px; font-family: var(--font-mono); font-size: 0.6rem;
    color: var(--text-dim);
    display: flex; align-items: center; gap: 8px; text-decoration: none; opacity: 0.7;
    &:hover { opacity: 1; color: var(--accent-primary); }
  }
`;
