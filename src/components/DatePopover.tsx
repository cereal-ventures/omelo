import React, { useState } from 'react';
import DatePicker from './DatePicker';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  PopoverFooter,
  PopoverBody,
  ButtonGroup,
  Icon,
  Box
} from '@chakra-ui/core';

export default function DatePopover({
  date = new Date(Date.now()),
  onChange
}: {
  date?: Date;
  onChange: (date: Date) => void;
}) {
  const [localDate, setLocalDate] = useState(date);
  return (
    <Popover usePortal>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Button variant='link' variantColor='purple'>
              <Icon name='calendar' size='.85em' mr={2} />
              <Box as='span' color='black' fontWeight='semibold' fontSize='sm'>
                Date: {date.toLocaleDateString('en-US')}
              </Box>
            </Button>
          </PopoverTrigger>
          <PopoverContent zIndex={4}>
            <PopoverBody p={2}>
              <DatePicker date={localDate} onChange={setLocalDate} />
            </PopoverBody>
            <PopoverFooter>
              <ButtonGroup spacing={4} display='flex' justifyContent='flex-end'>
                <Button variant='link' onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variantColor='purple'
                  onClick={() => {
                    onChange(localDate);
                    onClose && onClose();
                  }}
                >
                  Ok
                </Button>
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
