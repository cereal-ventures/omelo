import React from 'react';
import { Tooltip, Box, Text, Grid, Flex } from '@chakra-ui/core';
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
  y?: number;
  date: Date;
  title: string;
  completed: boolean;
  isOverdue: boolean;
  commentCount?: number;
  assetCount?: number;
  handleClick: () => void;
}

export default function Event({
  y,
  date,
  title,
  completed,
  isOverdue,
  handleClick = () => alert('this worked'),
  commentCount = 0,
  assetCount = 0
}: EventProps) {
  const statusKey = completed ? 'completed' : isOverdue ? 'overdue' : 'default';
  const hasComments = Boolean(commentCount);

  return (
    <Box
      className='event-wrapper'
      style={{ cursor: 'pointer' }}
      position='relative'
      ml='calc(50% - 118px)'
      mr='auto'
      top='2px'
      px='16px'
      overflow='hidden'
    >
      <Grid
        gridTemplateColumns='86px 18px auto'
        gap='8px'
        onClick={handleClick}
      >
        <Text
          fontSize='12px'
          fontWeight='bold'
          textAlign='right'
          className='event-date'
          textTransform='uppercase'
          color='black'
        >
          {formatDate(date)}
        </Text>
        <Tooltip
          aria-label={fillMap[statusKey].tooltipText}
          label={fillMap[statusKey].tooltipText}
          placement='left'
          hasArrow
        >
          <Box
            width='16px'
            height='16px'
            borderRadius='full'
            border='2px solid'
            backgroundColor={fillMap[statusKey].fill}
            borderColor={fillMap[statusKey].border}
          />
        </Tooltip>
        <Text
          style={{ fontWeight: completed ? 600 : 500 }}
          position='relative'
          top='-4px'
          className='event-label'
          color={fillMap[statusKey].textColor}
        >
          {title}
        </Text>
      </Grid>
      <Flex
        alignItems='center'
        left='120px'
        width='100%'
        position='relative'
        onClick={handleClick}
      >
        {hasComments && (
          <Tooltip
            hasArrow
            placement='left'
            aria-label='Comment Count'
            label={`${commentCount} ${
              commentCount === 1 ? 'comment' : 'comments'
            }`}
          >
            <Flex
              px='8px'
              py='4px'
              alignItems='center'
              border='2px solid'
              borderRadius='100px'
              borderColor='#E2EDF1'
            >
              <svg x={9} y={9} height={16} fill='none' viewBox='0 0 13 12'>
                <path
                  d='M2.473 8.285l.488.112.069-.298-.235-.197-.322.383zm-.348 1.512l.487.113-.487-.113zm1.58 1.02l.304.397-.303-.397zM5.759 9.25v-.5h-.17l-.134.103.304.397zM1.5 5.125A3.625 3.625 0 015.125 1.5v-1A4.625 4.625 0 00.5 5.125h1zm1.295 2.777A3.616 3.616 0 011.5 5.125h-1c0 1.422.643 2.695 1.652 3.543l.643-.766zM2.612 9.91l.349-1.513-.975-.224-.349 1.512.975.225zm.79.51a.5.5 0 01-.79-.51l-.975-.225c-.316 1.369 1.255 2.382 2.372 1.53l-.607-.796zm2.052-1.567l-2.052 1.566.607.795 2.052-1.567-.607-.794zm2.421-.103H5.758v1h2.117v-1zM11.5 5.125A3.625 3.625 0 017.875 8.75v1A4.625 4.625 0 0012.5 5.125h-1zM7.875 1.5A3.625 3.625 0 0111.5 5.125h1A4.625 4.625 0 007.875.5v1zm-2.75 0h2.75v-1h-2.75v1z'
                  fill='#6979F8'
                />
              </svg>
              <Text fontSize='13px' fontWeight='semibold' ml='4px'>
                {commentCount}
              </Text>
            </Flex>
          </Tooltip>
        )}

        {Boolean(assetCount) && (
          <Tooltip
            hasArrow
            placement='left'
            aria-label='Attachment Count'
            label={`${assetCount} ${
              assetCount === 1 ? 'attachment' : 'attachments'
            }`}
          >
            <Flex
              px='8px'
              py='4px'
              alignItems='center'
              border='2px solid'
              borderRadius='100px'
              borderColor='#E2EDF1'
              cursor='pointer'
              ml={2}
            >
              <svg
                x={8}
                y={8}
                width={16}
                height={18}
                viewBox='0 0 12 14'
                fill='none'
              >
                <path
                  d='M3.5 9.503H6'
                  stroke='#8A9295'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  clipRule='evenodd'
                  d='M7.667 12.83H1.833A.833.833 0 011 11.998V4.502c0-.46.373-.832.833-.832h5.834c.46 0 .833.373.833.832v7.496c0 .46-.373.832-.833.832z'
                  stroke='#8A9295'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M3.5 7.003H6M3.5 1.17h6.667c.46 0 .833.373.833.832v8.328'
                  stroke='#8A9295'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <Text fontSize='13px' fontWeight='semibold' ml='4px'>
                {assetCount}
              </Text>
            </Flex>
          </Tooltip>
        )}
      </Flex>
    </Box>
  );
}
