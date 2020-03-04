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
    tooltipText: 'Not yet completed'
  }
};

interface EventProps {
  y: number;
  date: Date;
  title: string;
  completed: boolean;
  isOverdue: boolean;
  handleClick: () => void;
}

export default function Event({
  y = 20,
  date,
  title,
  completed,
  isOverdue,
  handleClick = () => alert('this worked')
}: EventProps) {
  const statusKey = completed ? 'completed' : isOverdue ? 'overdue' : 'default';

  return (
    <g className='event-wrapper' onClick={handleClick}>
      <text
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
        textAnchor='end'
        x='-8'
        y={y + 2}
        alignmentBaseline='middle'
        className='event-date'
        fill='black'
      >
        {formatDate(date)}
      </text>
      <Tooltip
        aria-label={fillMap[statusKey].tooltipText}
        label={fillMap[statusKey].tooltipText}
        placement='left'
        hasArrow
      >
        <g>
          <circle fill={fillMap[statusKey].border} r={7} cx={10} cy={y} />
          <circle fill={fillMap[statusKey].fill} r={5} cx={10} cy={y} />

          <text
            x='28'
            y={y + 2}
            style={{ fontWeight: completed ? 600 : 500 }}
            className='event-label'
            alignmentBaseline='middle'
            fill={fillMap[statusKey].textColor}
          >
            {title}
          </text>
        </g>
      </Tooltip>
    </g>
  );
}
