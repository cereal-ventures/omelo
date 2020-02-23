import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/core';

export default function PrimaryButton(props: ButtonProps) {
  return <Button px={8} borderRadius='full' variantColor='green' {...props} />;
}
