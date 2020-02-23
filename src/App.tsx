import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Grid, Box } from '@chakra-ui/core';
import { useAuth } from './components/useAuth';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import { logo } from './components/icons';
import { loadingScreen } from './components/loadingScreen';

const Main = React.lazy(() => import('./components/Main'));

function PrivateRoute({ children, ...rest }: any) {
  const { user, loading } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (loading) {
          return loadingScreen;
        }
        return user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
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
      <Box position='absolute' top={5} left={5}>
        {logo}
      </Box>
      <Grid templateColumns={['1fr', '1fr', '6fr 4fr']} height='100vh'>
        {children}
      </Grid>
    </>
  );
}

function SignupPage({ loading }: { loading: boolean }) {
  return (
    <Layout>
      <Box mx='auto' alignSelf='center' width='320px'>
        <SignupForm loading={loading} />
      </Box>
      <Box
        display={{ xs: 'none', md: 'block' }}
        bg='brand.primary'
        width='100%'
        height='100%'
      />
    </Layout>
  );
}

function LoginPage({ loading }: { loading: boolean }) {
  return (
    <Layout>
      <Box mx='auto' alignSelf='center' width='320px'>
        <LoginForm loading={loading} />
      </Box>
      <Box
        display={{ xs: 'none', md: 'block' }}
        bg='brand.primary'
        width='100%'
        height='100%'
      />
    </Layout>
  );
}

function App() {
  const { user, loading } = useAuth();

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/signup'>
          <SignupPage loading={loading} />
        </Route>
        <Route exact path='/login'>
          <LoginPage loading={loading} />
        </Route>
        <PrivateRoute path='/'>
          <Suspense fallback={loadingScreen}>
            <Main user={user} />
          </Suspense>
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
