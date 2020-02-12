import React from "react";
import { User } from "firebase";

import { useHistory, useRouteMatch } from "react-router-dom";
import {
  Box,
  Button,
  Link,
  Heading,
  Grid,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody
} from "@chakra-ui/core";

import { addProject, removeProject } from "../services/data";
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
      <Box mt={8} width="100%">
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

        <Box mt={8}>
          {projects.map(({ name, id }: any) => {
            const isActive = id === projectId;
            return (
              <Flex
                key={id}
                mb={4}
                alignItems="center"
                justifyContent="space-between"
              >
                <Link
                  color="purple.800"
                  as="button"
                  display="flex"
                  alignItems="center"
                  fontSize="sm"
                  minHeight="auto"
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

                <Popover>
                  <PopoverTrigger>
                    <Button
                      position="relative"
                      top="-4px"
                      height="auto"
                      minWidth="auto"
                      variant="unstyled"
                    >
                      &#8230;
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent zIndex={4} width="200px">
                    <PopoverArrow />
                    <PopoverHeader>Project Settings</PopoverHeader>
                    <PopoverBody>
                      <Link
                        as="button"
                        color="red.400"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this project?"
                            )
                          ) {
                            removeProject(id)?.then(() => {
                              history.push("/");
                            });
                          }
                        }}
                      >
                        Delete Project
                      </Link>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
            );
          })}
        </Box>
      </Box>
      {logoEl}
    </Grid>
  );
}
