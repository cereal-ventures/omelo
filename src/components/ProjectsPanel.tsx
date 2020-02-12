import React from "react";
import { User } from "firebase";

import { useHistory, useRouteMatch } from "react-router-dom";
import { Box, Button, Link, Heading, Grid, Flex } from "@chakra-ui/core";

import { addProject } from "../services/data";
import UserDropdown from "./UserDropdown";

import { logo } from "./icons";

interface Props {
  user: User | null;
  projects: any[];
}

const logoEl = (
  <Flex width="100%" justifyContent="center" alignItems="center" p={4}>
    {logo}
  </Flex>
);

export default function ProjectsPanel({ user, projects = [] }: Props) {
  const history = useHistory();
  const projectId = useRouteMatch<{ id: string }>("/:id")?.params?.id;

  return (
    <Grid
      width={{ xs: "100%", md: "275px" }}
      gridTemplateRows="auto 1fr auto"
      gridTemplateColumns="100%"
      justifyItems="left"
      padding={8}
      borderRight={{ md: "1px solid lightgrey" }}
      height="100vh"
    >
      <UserDropdown user={user} />
      <Box my={8} width="100%">
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading
            color="purple.800"
            as="h4"
            size="xs"
            textTransform="uppercase"
          >
            Projects:
          </Heading>
          <Button
            variant="link"
            color="purple.800"
            textTransform="uppercase"
            size="xs"
            onClick={() => {
              addProject({ name: "My Project", userId: user?.uid });
            }}
          >
            Add
          </Button>
        </Flex>

        <Box mb={4}>
          {projects.map(({ name, id }: any) => {
            const isActive = id === projectId;
            return (
              <Link
                key={id}
                color="purple.800"
                as="button"
                display="flex"
                alignItems="center"
                fontSize="sm"
                mb={2}
                onClick={() => history.push(`/${id}`)}
              >
                <Box
                  display="inline-block"
                  width="24px"
                  height="24px"
                  borderRadius="50%"
                  backgroundColor="purple.800"
                  color="white"
                  opacity={isActive ? 1 : 0.4}
                  marginRight={2}
                />
                {name}
              </Link>
            );
          })}
        </Box>
      </Box>
      {logoEl}
    </Grid>
  );
}
