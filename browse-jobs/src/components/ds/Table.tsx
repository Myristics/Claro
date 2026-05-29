import React from 'react';

interface Column {
  key: string;
  label: string;
  width?: string | number;
}

interface TableProps {
  columns: Column[];
  rows: Record<string, React.ReactNode>[];
  onRowClick?: (row: Record<string, React.ReactNode>, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Table({ columns, rows, onRowClick, className, style }: TableProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        overflowX: 'auto',
        ...style,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'var(--font-base)',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: 'var(--page-bg)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '10px var(--space-4)',
                  textAlign: 'left',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--text-tertiary)',
                  borderBottom: '1px solid var(--border-light)',
                  whiteSpace: 'nowrap',
                  width: col.width !== undefined
                    ? (typeof col.width === 'number' ? `${col.width}px` : col.width)
                    : undefined,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              onClick={onRowClick ? () => onRowClick(row, idx) : undefined}
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color 0.1s ease',
              }}
              onMouseEnter={(e) => {
                if (onRowClick) e.currentTarget.style.backgroundColor = 'var(--page-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: '11px var(--space-4)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--text-primary)',
                    borderBottom: '1px solid var(--border-light)',
                    verticalAlign: 'middle',
                  }}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
