import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, theme, CSSReset, Button } from "@chakra-ui/core";
import { useAuth } from "./components/Auth";

interface Props {
  children: React.ReactNode;
}

function App() {
  const user = useAuth();
  console.log(user)
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <BrowserRouter>
      <Button variantColor="green">Hello World</Button>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
