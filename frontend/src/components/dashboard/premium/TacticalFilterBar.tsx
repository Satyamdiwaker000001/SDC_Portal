import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { useSearchFilter } from '../../../context/SearchFilterContext';

interface TacticalFilterBarProps {
  placeholder?: string;
  statusOptions?: { label: string; value: string }[];
}

const TacticalFilterBar: React.FC<TacticalFilterBarProps> = ({ 
  placeholder = "Search by Name or ID...", 
  statusOptions = [] 
}) => {
  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter, resetFilters } = useSearchFilter();

  return (
    <FilterContainer
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <SearchWrapper>
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder={placeholder} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <ClearBtn onClick={() => setSearchQuery('')}>
            <X size={14} />
          </ClearBtn>
        )}
      </SearchWrapper>

      <ActionsWrapper>
        {statusOptions.length > 0 && (
          <StatusSelect>
            <Filter size={14} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </StatusSelect>
        )}
        
        {(searchQuery || statusFilter !== 'ALL') && (
          <ResetBtn onClick={resetFilters}>
            Reset Filters
          </ResetBtn>
        )}
      </ActionsWrapper>

      <DecorationLine />
    </FilterContainer>
  );
};

/* --- STYLED COMPONENTS --- */

const FilterContainer = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background: var(--bg-card);
  backdrop-filter: var(--glass-blur);
  border: var(--border-glass);
  border-radius: 16px;
  margin-bottom: 30px;
  position: relative;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${props => props.theme.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)'};
  border: 1px solid ${props => props.theme.mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'};
  border-radius: 12px;
  padding: 10px 16px;
  transition: 0.3s;
  
  &:focus-within {
    border-color: var(--accent-primary);
    background: ${props => props.theme.mode === 'light' ? 'white' : 'rgba(96,165,250,0.03)'};
    box-shadow: 0 0 15px rgba(96, 165, 250, 0.1);
  }

  .search-icon {
    color: var(--accent-primary);
    opacity: 0.7;
  }

  input {
    background: none;
    border: none;
    outline: none;
    color: var(--text-main);
    font-family: var(--font-body);
    font-size: 0.85rem;
    width: 100%;
    
    &::placeholder {
      color: var(--text-dim);
      opacity: 0.5;
    }
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StatusSelect = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${props => props.theme.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)'};
  border: 1px solid ${props => props.theme.mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'};
  border-radius: 10px;
  padding: 0 12px;
  height: 40px;
  color: var(--text-dim);
  
  select {
    background: none;
    border: none;
    outline: none;
    color: var(--text-main);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 700;
    cursor: pointer;
    
    option {
      background: var(--bg-card);
      color: var(--text-main);
    }
  }
`;

const ClearBtn = styled.button`
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  &:hover {
    background: rgba(255,255,255,0.05);
    color: var(--accent-error);
  }
`;

const ResetBtn = styled.button`
  background: none;
  border: 1px solid var(--accent-primary);
  color: var(--accent-primary);
  padding: 8px 15px;
  border-radius: 10px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
  
  &:hover {
    background: var(--accent-primary);
    color: white;
  }
`;

const DecorationLine = styled.div`
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
  opacity: 0.15;
`;

export default TacticalFilterBar;
