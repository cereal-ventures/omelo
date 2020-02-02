import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, theme, CSSReset, Button } from "@chakra-ui/core";
import { useAuth } from "./components/Auth";
import { signOut } from "./services";
import LoginForm from "./components/LoginForm";

function App() {
  const { user, loading } = useAuth();
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <BrowserRouter>
        <LoginForm />
        {loading && <div>loading...</div>}
        {user && <Button onClick={signOut}>Sign Out</Button>}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
