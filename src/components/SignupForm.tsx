import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Button,
  Input,
  FormLabel,
  FormControl,
  Heading,
  Link
} from "@chakra-ui/core";
import { createUser } from "../services";

export default function SignupForm({ loading }: { loading: boolean }) {
  const { handleSubmit, register } = useForm();
  const history = useHistory();

  return (
    <form
      onSubmit={handleSubmit(({ email, password }) => {
        createUser(email, password).then(() => {
          history.push("/");
        });
      })}
    >
      <Heading as="h2" size="lg" fontWeight="light" textAlign="center">
        Let's get you powered up
      </Heading>
      <Heading as="h6" size="sm" fontWeight="light" textAlign="center" my="2">
        Unlimited project timelines, for $9/month
      </Heading>
      <FormControl my={8}>
        <FormLabel htmlFor="email">Email:</FormLabel>
        <Input
          variant="flushed"
          name="email"
          placeholder="Email"
          ref={register}
        />
      </FormControl>
      <FormControl mb={8}>
        <FormLabel htmlFor="password">Password:</FormLabel>
        <Input
          variant="flushed"
          type="password"
          name="password"
          placeholder="Password"
          ref={register}
        />
      </FormControl>
      <FormControl textAlign="center" my={4}>
        <Button variantColor="teal" type="submit" isLoading={loading}>
          Sign Up
        </Button>
      </FormControl>
      <Link
        as="button"
        color="teal.500"
        textAlign="center"
        display="inline-block"
        width="100%"
        onClick={() => history.push("/login")}
      >
        Already have an account?
      </Link>
    </form>
  );
}
