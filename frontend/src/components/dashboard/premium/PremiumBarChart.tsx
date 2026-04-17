import React from 'react';
import styled from 'styled-components';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { useTheme } from '../../../context/ThemeContext';

interface PremiumBarChartProps {
  data: Array<{ name: string; value: number; fill?: string }>;
  title?: string;
  height?: number;
  isAnimated?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
}

const ChartWrapper = styled.div<{ $height?: number }>`
  width: 100%;
  height: ${props => props.$height || 300}px;
  padding: var(--space-md);
  background: transparent;
`;

const CustomTooltip = styled.div`
  background: var(--bg-card);
  border: var(--border-glass);
  backdrop-filter: var(--glass-blur);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  
  .label {
    font-size: var(--text-xs);
    color: var(--text-dim);
    margin-bottom: 4px;
    font-family: var(--font-mono);
  }
  .value {
    font-size: var(--text-sm);
    font-weight: 800;
    color: var(--ui-accent);
    font-family: var(--font-heading);
  }
`;

const PremiumBarChart: React.FC<PremiumBarChartProps> = ({ 
  data, 
  title, 
  height = 300, 
  isAnimated = true, 
  showGrid = true, 
  showTooltip = true 
}) => {
  const { mode } = useTheme();

  return (
    <ChartWrapper $height={height}>
      {title && <h4 style={{ marginBottom: '20px', fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>{title}</h4>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} 
            />
          )}
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          />
          {showTooltip && (
            <Tooltip 
              cursor={{ fill: 'rgba(0, 41, 107, 0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <CustomTooltip>
                      <div className="label">{payload[0].payload.name}</div>
                      <div className="value">{payload[0].value} UNITS</div>
                    </CustomTooltip>
                  );
                }
                return null;
              }}
            />
          )}
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]} 
            barSize={32}
            isAnimationActive={isAnimated}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill || 'var(--ui-primary)'} 
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default PremiumBarChart;
