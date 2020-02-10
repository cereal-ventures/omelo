import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, FormControl, Heading, Link } from "@chakra-ui/core";
import FloatingLabelInput from "./FloatLabelInput";
import { createUser, getCurrentUser } from "../services";

export default function SignupForm({ loading }: { loading: boolean }) {
  const { handleSubmit, register } = useForm();
  const history = useHistory();

  return (
    <form
      onSubmit={handleSubmit(({ email, password, name }) => {
        createUser(email, password)
          .then(() => {
            return getCurrentUser()?.updateProfile({
              displayName: name
            });
          })
          .then(() => {
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
      <FloatingLabelInput
        name="name"
        type="text"
        label="Name:"
        my={8}
        error={null}
        register={register}
      />
      <FloatingLabelInput
        name="email"
        type="email"
        label="Email:"
        my={8}
        error={null}
        register={register}
      />
      <FloatingLabelInput
        name="password"
        type="password"
        label="Password:"
        mb={8}
        error={null}
        register={register}
      />
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
