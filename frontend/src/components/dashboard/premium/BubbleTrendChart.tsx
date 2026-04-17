import React from 'react';
import styled from 'styled-components';

interface BubbleTrendChartProps {
  data: { name: string; value: number; color: string }[];
}

const Container = styled.div`
  padding: 24px;
  height: 380px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 30px;
`;

const ChartArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BubbleWrap = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
`;

const Bubble = styled.div<{ size: number; color: string; x: number; y: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background-color: ${props => props.color};
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.25rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    z-index: 10;
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.textSecondary};
`;

const Dot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const BubbleTrendChart: React.FC<BubbleTrendChartProps> = ({ data }) => {
  // Simple mapping for the 3 bubbles in the reference
  const bubbles = [
    { ...data[0], size: 140, x: 20, y: 50 },
    { ...data[1], size: 100, x: 130, y: 70 },
    { ...data[2], size: 60, x: 0, y: 120 },
  ];

  return (
    <Container className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title>Call trends</Title>
        <div style={{ fontSize: '1.25rem', color: '#94A3B8' }}>...</div>
      </div>

      <ChartArea>
        <BubbleWrap>
          {bubbles.map((b, i) => (
            <Bubble key={i} size={b.size} color={b.color} x={b.x} y={b.y}>
              {b.value}%
            </Bubble>
          ))}
        </BubbleWrap>
      </ChartArea>

      <Legend>
        {data.map((item, i) => (
          <LegendItem key={i}>
            <Dot color={item.color} />
            {item.name}
          </LegendItem>
        ))}
      </Legend>
    </Container>
  );
};

export default BubbleTrendChart;
