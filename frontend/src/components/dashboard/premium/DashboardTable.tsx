import React from 'react';
import styled from 'styled-components';

interface Column {
  header: string;
  accessor: string;
  render?: (row: any) => React.ReactNode;
}

interface DashboardTableProps {
  data: any[];
  columns: Column[];
  isLoading?: boolean;
}

import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  background: rgba(15, 23, 42, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 20px 24px;
    font-size: 0.75rem;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  td {
    padding: 20px 24px;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--text-primary);
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    transition: all 0.3s ease;
  }
  
  tr:last-child td {
    border-bottom: none;
  }

  tr {
    transition: all 0.3s ease;
  }

  tr:hover td {
    background: rgba(59, 130, 246, 0.05);
    color: white;
  }
`;

const EmptyState = styled.div`
  padding: 60px;
  text-align: center;
  color: var(--text-secondary);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;

const DashboardTable: React.FC<DashboardTableProps> = ({ data, columns, isLoading }) => {
  if (isLoading) {
    return (
      <EmptyState>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          SYNCING DATA CHANNELS...
        </motion.div>
      </EmptyState>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState>NO ENCRYPTED RECORDS FOUND IN SECTOR.</EmptyState>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Container>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {data.map((row, i) => (
              <motion.tr key={i} variants={rowVariants}>
                {columns.map((col, j) => (
                  <td key={j}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </motion.tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default DashboardTable;
