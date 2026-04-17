import React from 'react';
import styled from 'styled-components';

interface Props {
  progress: number;
  height?: string;
  color?: string;
  showText?: boolean;
}

const ProgressWrapper = styled.div<{ $height: string }>`
  width: 100%;
  height: ${props => props.$height};
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Bar = styled.div<{ $progress: number; $color: string }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: ${props => props.$color};
  box-shadow: 0 0 15px ${props => props.$color}44;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 10px;
`;

const ProgressText = styled.span`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 0 4px rgba(0,0,0,0.5);
`;

const LinearProgressBar: React.FC<Props> = ({ progress, height = "8px", color = "var(--accent-primary)", showText = false }) => {
  return (
    <ProgressWrapper $height={height}>
      <Bar $progress={progress} $color={color} />
      {showText && <ProgressText>{progress}%</ProgressText>}
    </ProgressWrapper>
  );
};

export default LinearProgressBar;
