import React, { useState } from "react";
import {
  Input,
  FormLabel,
  FormControl,
  FormErrorMessage
} from "@chakra-ui/core";

export default function FloatLabelInput({
  name = "email",
  type = "email",
  label = "Email:",
  error,
  register,
  ...props
}) {
  const [hasFocus, setHasFocus] = useState(false);
  return (
    <FormControl position="relative" isInvalid={Boolean(error)} {...props}>
      <FormLabel
        position="absolute"
        transform={`scale(${hasFocus ? 0.75 : 1}) translateY(${
          hasFocus ? "-12px" : "0px"
        })`}
        opacity={hasFocus ? 1 : 0.5}
        transition="all .3s ease-in-out"
        transformOrigin="top left"
        zIndex="-1"
        htmlFor={name}
      >
        {label}
      </FormLabel>
      <Input
        onFocus={() => setHasFocus(true)}
        onBlur={({ target }) => {
          if (!target.value) setHasFocus(false);
        }}
        variant="flushed"
        name={name}
        type={type}
        ref={register}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}
