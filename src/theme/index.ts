import { theme } from '@chakra-ui/core';

const colors = {
  brand: {
    primary: '#7C6FFF',
    secondary: '#394AB6',
    tertiary: '#00B9DF',
    highlight1: '#50E3C2',
    highlight2: '#BB3FA0',
    highlight3: '#FFC500'
  },
  extended: {
    blue1: '#46539E',
    blue2: '#02A4DD'
  },
  system: {
    positive: '#9CBD3B',
    alert: '#F14965',
    black: '#000000'
  },
  neutral: {
    1: '#DDDDDD', // TypeNeutral
    2: '#D3D5E0', // deadline
    3: '#C4C9E9', // inactive
    4: '#DCDFF2', // separator
    5: '#F5F6FC', // timeline,
    6: '#F9FAFD'
  }
};

export default {
  ...theme,
  colors: {
    ...theme.colors,
    green: {
      ...theme.colors.green,
      500: '#9CBD3B',
      600: '#96B63A'
    },
    teal: {
      ...theme.colors.teal,
      400: colors.brand.highlight1,
      500: '#41C9BF'
    },
    purple: {
      ...theme.colors.purple,
      400: colors.brand.secondary,
      500: colors.brand.secondary,
      600: colors.brand.primary
    },
    ...colors
  }
};
