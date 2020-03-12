import React, { useState, forwardRef } from 'react';
import {
  Input,
  FormLabel,
  FormControl,
  FormErrorMessage
} from '@chakra-ui/core';

interface Props {
  name: string;
  type: 'email' | 'password' | 'text';
  label: string;
  error?: any;
  [x: string]: any;
}

const FloatLabelInput = forwardRef(
  (
    {
      name = 'email',
      type = 'email',
      label = 'Email:',
      error,
      ...props
    }: Props,
    ref: any
  ) => {
    const [hasFocus, setHasFocus] = useState(false);
    return (
      <FormControl
        position='relative'
        isInvalid={Boolean(error?.message)}
        {...props}
      >
        <FormLabel
          position='absolute'
          transform={`scale(${hasFocus ? 0.75 : 1}) translateY(${
            hasFocus ? '-24px' : '0px'
          })`}
          top='8px'
          opacity={hasFocus ? 1 : 0.5}
          transition='all .3s ease-in-out'
          transformOrigin='top left'
          htmlFor={name}
        >
          {label}
        </FormLabel>
        <Input
          onFocus={() => setHasFocus(true)}
          onBlur={({ target }: React.FocusEvent<HTMLInputElement>) => {
            if (!target.value) setHasFocus(false);
          }}
          variant='flushed'
          name={name}
          type={type}
          ref={ref}
        />
        <FormErrorMessage>{error?.message}</FormErrorMessage>
      </FormControl>
    );
  }
);

export default FloatLabelInput;
