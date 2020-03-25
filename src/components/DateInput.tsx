import React from 'react';
import { FormControl } from '@chakra-ui/core';
import { updateEvent } from '../services/data';
import DatePopover from './DatePopover';
import { activityTypes } from '../constants';

export default function DateInput({
  eventId,
  projectId,
  date
}: {
  projectId: string;
  eventId: string;
  date: Date;
}) {
  const onSubmit = ({ date: updatedDate }: { [x: string]: any }) => {
    const newDate = new Date(updatedDate).toLocaleDateString('en-US', {
      timeZone: 'UTC'
    });
    updateEvent({
      type: activityTypes.UPDATE_DATE,
      projectId,
      eventId,
      payload: {
        date: newDate,
        prevDate: date
      }
    });
  };
  return (
    <FormControl>
      <DatePopover date={date} onChange={date => onSubmit({ date })} />
    </FormControl>
  );
}
