import React from "react";
import { signOut } from "../services";
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
  Text
} from "@chakra-ui/core";
import { logo } from "./icons";

import { User } from "firebase";

interface Props {
  user: User | null;
}

export default function ProjectsPanel({ user }: Props) {
  return (
    <Box
      width="275px"
      padding={8}
      borderRight="1px solid lightgrey"
      height="100vh"
      position="relative"
    >
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
      <Box
        position="absolute"
        bottom={8}
        left="50%"
        transform="translateX(-50%)"
      >
        {logo}
      </Box>
    </Box>
  );
}
