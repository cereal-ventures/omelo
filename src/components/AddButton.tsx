import React from "react";
import { useHistory } from "react-router-dom";
import { Icon, Box, Button } from "@chakra-ui/core";

export default function AddButton() {
  const history = useHistory();
  return (
    <Box position="absolute" bottom="40px" right="40px">
      <Button
        variantColor="purple"
        backgroundColor="#394AB6"
        width="40px"
        height="40px"
        borderRadius={100}
        onClick={() => history.push("/add-event")}
      >
        <Icon name="add" />
      </Button>
    </Box>
  );
}
