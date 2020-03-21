import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext
} from 'react';
import {
  Grid,
  Button,
  Box,
  Flex,
  Heading,
  Icon,
  FormLabel
} from '@chakra-ui/core';
import {
  useDatepicker,
  useMonth,
  useDay,
  START_DATE
} from '@datepicker-react/hooks';

const DatepickerContext = createContext({
  focusedDate: null,
  isDateFocused: () => false,
  isDateSelected: () => false,
  isDateHovered: () => false,
  isDateBlocked: () => false,
  isFirstOrLastSelectedDate: () => false,
  onDateFocus: () => {},
  onDateHover: () => {},
  onDateSelect: () => {}
});

function Month({ year, month, firstDayOfWeek, nextMonth, prevMonth }) {
  const { days, weekdayLabels, monthLabel } = useMonth({
    monthLabelFormat: date =>
      date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      }),
    year,
    month,
    firstDayOfWeek
  });

  return (
    <Box>
      <Flex justifyContent='space-between' align='center'>
        <Heading ml={2} size='xs' textAlign='center' my='16px'>
          {monthLabel}
        </Heading>
        <Flex align='center' justify='space-between'>
          <Button
            variant='unstyled'
            display='inline-flex'
            p={0}
            onClick={prevMonth}
          >
            <Icon name='chevron-left' />
          </Button>

          <Button
            variant='unstyled'
            display='inline-flex'
            p={0}
            onClick={nextMonth}
          >
            <Icon name='chevron-right' />
          </Button>
        </Flex>
      </Flex>
      <Grid
        gridTemplateColumns='repeat(7, 1fr)'
        my={4}
        fontSize='12px'
        textTransform='uppercase'
        justifyContent='center'
      >
        {weekdayLabels.map(dayLabel => (
          <FormLabel p={0} fontSize='xs' textAlign='center' key={dayLabel}>
            {dayLabel}
          </FormLabel>
        ))}
      </Grid>
      <Grid
        gridTemplateColumns='repeat(7, 1fr)'
        fontSize='10px'
        justifyContent='center'
        rowGap={4}
      >
        {days.map((day, index) => {
          if (typeof day === 'object') {
            return (
              <Day
                date={day.date}
                key={day.date.toString()}
                dayLabel={day.dayLabel}
              />
            );
          }

          return <Box key={index} />;
        })}
      </Grid>
    </Box>
  );
}

function Day({ dayLabel, date }) {
  const dayRef = useRef(null);
  const {
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateSelect,
    onDateFocus,
    onDateHover
  } = useContext(DatepickerContext);
  const {
    isSelectedStartOrEnd: isSelected,
    onClick,
    onKeyDown,
    onMouseEnter,
    tabIndex
  } = useDay({
    date,
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateFocus,
    onDateSelect,
    onDateHover,
    dayRef
  });

  if (!dayLabel) {
    return <div />;
  }

  return (
    <Button
      fontWeight='light'
      size='sm'
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      tabIndex={tabIndex}
      type='button'
      ref={dayRef}
      color={isSelected ? '#fff' : 'black'}
      background={isSelected ? '#394AB6' : '#F7FAFC'}
      _focus={{ boxShadow: 'none' }}
      _hover={{
        backgroundColor: isSelected ? '#394AB6' : '#F7FAFC'
      }}
      _active={{}}
    >
      {dayLabel}
    </Button>
  );
}

function Datepicker({ onChange, date }) {
  const [state, setState] = useState({
    startDate: date,
    focusedInput: START_DATE
  });

  function handleDateChange(data) {
    if (!data.focusedInput) {
      setState({ ...data, focusedInput: START_DATE });
    } else {
      setState(data);
    }
  }

  useEffect(() => {
    if (state.startDate) {
      onChange(state.startDate);
    }
  }, [onChange, state.startDate]);

  const { startDate, focusedInput } = state;
  const {
    firstDayOfWeek,
    activeMonths,
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onDateHover,
    onDateSelect,
    onDateFocus,
    goToPreviousMonths,
    goToNextMonths
  } = useDatepicker({
    startDate,
    focusedInput: focusedInput,
    onDatesChange: handleDateChange,
    firstDayOfWeek: 0,
    numberOfMonths: 1,
    minBookingDays: 1,
    exactMinBookingDays: true
  });

  return (
    <DatepickerContext.Provider
      value={{
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover
      }}
    >
      <Grid
        gridTemplateColumns={`repeat(${activeMonths.length}, 1fr)`}
        gap={8}
        backgroundColor='gray.50'
        p={2}
        borderRadius={4}
      >
        {activeMonths.map(month => (
          <Month
            nextMonth={goToNextMonths}
            prevMonth={goToPreviousMonths}
            key={`${month.year}-${month.month}`}
            year={month.year}
            month={month.month}
            firstDayOfWeek={firstDayOfWeek}
          />
        ))}
      </Grid>
    </DatepickerContext.Provider>
  );
}

export default Datepicker;
