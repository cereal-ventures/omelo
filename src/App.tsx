import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import {
  ThemeProvider,
  theme,
  CSSReset,
  Grid,
  Box,
  Button
} from "@chakra-ui/core";
import { useAuth } from "./components/Auth";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { signOut, getCurrentUser } from "./services";
import { logo } from "./components/icons";

function PrivateRoute({ children, ...rest }: any) {
  const user = getCurrentUser();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function App() {
  const { user, loading } = useAuth();
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <BrowserRouter>
        <Box position="absolute" top={5} left={5}>
          {logo}
        </Box>
        <Switch>
          <Route exact path="/">
            <Grid templateColumns={["6fr 4fr"]} height="100vh">
              <Box mx="auto" alignSelf="center" width="320px">
                <SignupForm loading={loading} />
              </Box>
              <Box bg="purple.300" width="100%" height="100%" />
            </Grid>
          </Route>
          <Route exact path="/login">
            <Grid templateColumns={["6fr 4fr"]} height="100vh">
              <Box mx="auto" alignSelf="center" width="320px">
                <LoginForm loading={loading} />
              </Box>
              <Box bg="purple.500" width="100%" height="100%" />
            </Grid>
          </Route>

          <PrivateRoute path="/app">
            {user && `Logged in as ${user.email}`}
            <Button onClick={signOut}>Sign Out</Button>
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
