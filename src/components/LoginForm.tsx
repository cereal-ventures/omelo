import React from "react";
import { useForm } from "react-hook-form";
import { Button, Input, FormLabel, FormControl } from "@chakra-ui/core";
import { signIn } from "../services";

export default function LoginForm() {
  const { handleSubmit, register } = useForm();

  return (
    <form
      onSubmit={handleSubmit(({ email, password }) => {
        signIn(email, password);
      })}
    >
      <FormControl>
        <FormLabel htmlFor="email">Email:</FormLabel>
        <Input name="email" placeholder="Email" ref={register} />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="password">Password:</FormLabel>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          ref={register}
        />
      </FormControl>
      <Button mt={4} variantColor="teal" type="submit">
        Submit
      </Button>
    </form>
  );
}
