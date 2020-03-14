import React from 'react';
import { Tooltip } from '@chakra-ui/core';
import { formatDate } from '../utils';

const fillMap = {
  completed: {
    border: 'white',
    fill: '#9CBD3B',
    textColor: '#9CBD3B',
    tooltipText: 'Completed'
  },
  overdue: {
    border: '#F14965',
    fill: 'white',
    textColor: '#F14965',
    tooltipText: 'Overdue'
  },
  default: {
    border: '#D3D5E0',
    fill: '#D3D5E0',
    textColor: 'black',
    tooltipText: 'Not yet complete'
  }
};

interface EventProps {
  y: number;
  date: Date;
  title: string;
  completed: boolean;
  isOverdue: boolean;
  commentCount?: number;
  handleClick: () => void;
}

export default function Event({
  y = 20,
  date,
  title,
  completed,
  isOverdue,
  handleClick = () => alert('this worked'),
  commentCount = 0
}: EventProps) {
  const statusKey = completed ? 'completed' : isOverdue ? 'overdue' : 'default';

  return (
    <svg
      y={y}
      overflow='visible'
      className='event-wrapper'
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <svg x='-8' y={2} overflow='visible'>
        <text
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}
          textAnchor='end'
          alignmentBaseline='middle'
          className='event-date'
          fill='black'
        >
          {formatDate(date)}
        </text>
      </svg>
      <Tooltip
        aria-label={fillMap[statusKey].tooltipText}
        label={fillMap[statusKey].tooltipText}
        placement='left'
        hasArrow
      >
        <svg overflow='visible'>
          <circle fill={fillMap[statusKey].border} r={7} cx={10} />
          <circle fill={fillMap[statusKey].fill} r={5} cx={10} />
          <svg overflow='visible' x='28' y={2}>
            <text
              style={{ fontWeight: completed ? 600 : 500 }}
              className='event-label'
              alignmentBaseline='middle'
              fill={fillMap[statusKey].textColor}
            >
              {title}
            </text>
          </svg>
        </svg>
      </Tooltip>

      {Boolean(commentCount) && (
        <svg y={16} x={32} overflow='visible'>
          <svg width={17} height={18} fill='none'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M13.032 14.463c1.969-1.467 3.242-3.798 3.242-6.423C16.274 3.6 12.63 0 8.137 0 3.643 0 0 3.6 0 8.04c0 4.44 3.643 8.04 8.137 8.04.715 0 1.41-.09 2.07-.262a3.26 3.26 0 002.812 1.595c1.707 0 .173-1.298.013-2.95z'
              fill='#394AB6'
            />
            <path
              d='M4.953 6.5h6.51M4.953 10.5H9.02'
              stroke='#fff'
              strokeLinecap='round'
            />
          </svg>
          <text y={14} x={22}>
            {commentCount} comments
          </text>
        </svg>
      )}
    </svg>
  );
}
