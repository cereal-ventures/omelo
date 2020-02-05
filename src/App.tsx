import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import {
  ThemeProvider,
  theme,
  CSSReset,
  Grid,
  Box,
  Button,
  Spinner
} from "@chakra-ui/core";
import { useAuth } from "./components/Auth";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { signOut } from "./services";
import { logo } from "./components/icons";

function PrivateRoute({ children, ...rest }: any) {
  const { user, loading } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (loading) {
          return (
            <Grid
              templateColumns="1fr"
              height="100vh"
              justifyItems="center"
              alignItems="center"
            >
              <Spinner color="purple.400" />
            </Grid>
          );
        }
        return user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        );
      }}
    />
  );
}

function Layout({ children }: any) {
  return (
    <>
      <Box position="absolute" top={5} left={5}>
        {logo}
      </Box>
      <Grid templateColumns={["6fr 4fr"]} height="100vh">
        {children}
      </Grid>
    </>
  );
}

function SignupPage({ loading }: { loading: boolean }) {
  return (
    <Layout>
      <Box mx="auto" alignSelf="center" width="320px">
        <SignupForm loading={loading} />
      </Box>
      <Box bg="purple.300" width="100%" height="100%" />
    </Layout>
  );
}

function LoginPage({ loading }: { loading: boolean }) {
  return (
    <Layout>
      <Box mx="auto" alignSelf="center" width="320px">
        <LoginForm loading={loading} />
      </Box>
      <Box bg="purple.300" width="100%" height="100%" />
    </Layout>
  );
}

function App() {
  const { user, loading } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <SignupPage loading={loading} />
          </Route>
          <Route exact path="/login">
            <LoginPage loading={loading} />
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
