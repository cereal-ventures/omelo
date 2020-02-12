import React from "react";
import { Icon, Box, Button } from "@chakra-ui/core";

export default function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <Box position="fixed" bottom="40px" right="40px">
      <Button
        variantColor="purple"
        backgroundColor="#394AB6"
        color="white"
        width="40px"
        height="40px"
        borderRadius={100}
        onClick={onClick}
      >
        <Icon name="add" />
      </Button>
    </Box>
  );
}
