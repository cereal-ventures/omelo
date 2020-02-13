import React from "react";
import { useForm } from "react-hook-form";
import { Grid, Input } from "@chakra-ui/core";

import { addProject } from "../services/data";

export default function ZeroState({ userId }: { userId: string | undefined }) {
  const { register, handleSubmit } = useForm();

  const submit = handleSubmit(({ firstProjectTitle }) => {
    if (userId) {
      addProject({ name: firstProjectTitle, userId });
    }
  });
  return (
    <Grid width="100%" height='100vh' alignItems="center" justifyItems="center">
      <form onBlur={submit} onSubmit={submit}>
        <Input
          ref={register({ required: true })}
          name="firstProjectTitle"
          focusBorderColor="purple.800"
          variant="flushed"
          placeholder="Enter a project name to get started"
          width="240px"
        />
      </form>
    </Grid>
  );
}
