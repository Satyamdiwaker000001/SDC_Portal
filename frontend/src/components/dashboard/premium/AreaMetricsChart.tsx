import React from 'react';
import styled from 'styled-components';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AreaMetricsChartProps {
  data: { day: string; value: number; dottedValue: number }[];
}

const Container = styled.div`
  padding: 24px;
  height: 380px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
`;

const AreaMetricsChart: React.FC<AreaMetricsChartProps> = ({ data }) => {
  return (
    <Container className="glass-card">
      <Header>
        <Title>Outbound call metrics</Title>
        <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Weekly</div>
      </Header>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94A3B8' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94A3B8' }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8B5CF6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
          <Area 
            type="monotone" 
            dataKey="dottedValue" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="transparent" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default AreaMetricsChart;
