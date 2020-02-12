import React from "react";
import { useHistory } from "react-router-dom";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverTrigger,
  PopoverContent,
  Icon,
  Box,
  Button,
  Link,
  Heading,
  Text,
  Grid,
  Flex
} from "@chakra-ui/core";

import { addProject } from "../services/data";
import { signOut } from "../services";

import { logo } from "./icons";

import { User } from "firebase";

interface Props {
  user: User | null;
  projects: any[];
}

function UserPopover({ user }: { user: User | null }) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="unstyled" display="inline-flex" height="auto">
          <Text
            as="span"
            display="inline-block"
            fontSize="md"
            overflow="hidden"
            maxWidth="200px"
          >
            {user && (user.displayName || user.email)}
          </Text>
          <Icon name="chevron-down" />
        </Button>
      </PopoverTrigger>
      <PopoverContent zIndex={4} width="240px">
        <PopoverArrow />
        <PopoverBody>
          <Link as="button" onClick={() => signOut()}>
            Log out
          </Link>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const logoEl = (
  <Flex width="100%" justifyContent="center" alignItems="center" p={4}>
    {logo}
  </Flex>
);

export default function ProjectsPanel({ user, projects = [] }: Props) {
  const history = useHistory();
  return (
    <Grid
      width="275px"
      gridTemplateRows="auto 1fr auto"
      gridTemplateColumns="100%"
      justifyItems="left"
      padding={8}
      borderRight="1px solid lightgrey"
      height="100vh"
    >
      <UserPopover user={user} />
      <Box my={8} width="100%">
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h4" size="xs" textTransform="uppercase">
            Projects:
          </Heading>
          <Button
            variant="link"
            color="purple.800"
            textTransform="uppercase"
            size='xs'
            onClick={()=>{addProject({ name: 'My Project', userId: user?.uid})}}
          >
            Add
          </Button>
        </Flex>

        <Box mb={4}>
          {projects.map(({ name, id }: any) => {
            return (
              <Link
                key={id}
                as="button"
                display="block"
                mb={2}
                onClick={() => history.push(`/${id}`)}
              >
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
