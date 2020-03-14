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
        <Tooltip
          hasArrow
          placement='left'
          aria-label='Comment Count'
          label={`${commentCount} ${
            commentCount === 1 ? 'comment' : 'comments'
          }`}
        >
          <svg y={18} x={32} overflow='visible'>
            <rect width='260%' rx={16} height={32} fill='#E2EDF1' />
            <svg x={9} y={9} height={16} fill='none' viewBox='0 0 13 12'>
              <path
                d='M2.473 8.285l.488.112.069-.298-.235-.197-.322.383zm-.348 1.512l.487.113-.487-.113zm1.58 1.02l.304.397-.303-.397zM5.759 9.25v-.5h-.17l-.134.103.304.397zM1.5 5.125A3.625 3.625 0 015.125 1.5v-1A4.625 4.625 0 00.5 5.125h1zm1.295 2.777A3.616 3.616 0 011.5 5.125h-1c0 1.422.643 2.695 1.652 3.543l.643-.766zM2.612 9.91l.349-1.513-.975-.224-.349 1.512.975.225zm.79.51a.5.5 0 01-.79-.51l-.975-.225c-.316 1.369 1.255 2.382 2.372 1.53l-.607-.796zm2.052-1.567l-2.052 1.566.607.795 2.052-1.567-.607-.794zm2.421-.103H5.758v1h2.117v-1zM11.5 5.125A3.625 3.625 0 017.875 8.75v1A4.625 4.625 0 0012.5 5.125h-1zM7.875 1.5A3.625 3.625 0 0111.5 5.125h1A4.625 4.625 0 007.875.5v1zm-2.75 0h2.75v-1h-2.75v1z'
                fill='#6979F8'
              />
            </svg>
            <text y={21} x={32} fontSize='13px' fontWeight='600'>
              {commentCount}
            </text>
          </svg>
        </Tooltip>
      )}
    </svg>
  );
}
