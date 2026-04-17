import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: DataItem[];
  totalValue: string;
  totalLabel: string;
}

const ChartWrapper = styled.div`
  width: 100%;
  height: 220px;
  position: relative;
  margin: 0 auto;
`;

const CenterContent = styled.div`
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  
  h4 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-main);
    line-height: 1;
    margin-bottom: 4px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  }
  
  p {
    font-size: 0.7rem;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
  }
`;

const RadialProgress: React.FC<Props> = ({ data, totalValue, totalLabel }) => {
  const chartData = data.map(d => ({ ...d, value: d.value || 0 }));
  
  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="55%"
            innerRadius={72}
            outerRadius={88}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
            startAngle={90}
            endAngle={450}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                style={{ filter: `drop-shadow(0 0 6px ${entry.color}88)` }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <CenterContent>
        <h4>{totalValue}</h4>
        <p>{totalLabel}</p>
      </CenterContent>
    </ChartWrapper>
  );
};

export default RadialProgress;
