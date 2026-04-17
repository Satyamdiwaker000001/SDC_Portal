import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface SearchFilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  resetFilters: () => void;
}

const SearchFilterContext = createContext<SearchFilterContextType | undefined>(undefined);

export const SearchFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
  };

  return (
    <SearchFilterContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      statusFilter, 
      setStatusFilter,
      resetFilters
    }}>
      {children}
    </SearchFilterContext.Provider>
  );
};

export const useSearchFilter = () => {
  const context = useContext(SearchFilterContext);
  if (context === undefined) {
    throw new Error('useSearchFilter must be used within a SearchFilterProvider');
  }
  return context;
};
