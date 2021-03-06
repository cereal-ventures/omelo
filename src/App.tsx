import React, { Suspense } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { Grid, Box, Image, Heading, Flex, Text } from '@chakra-ui/core';
import { useAuth } from './components/hooks/useAuth';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Page404 from './components/404';
import { logo } from './components/icons';
import { skeletonTimeline, loadingScreen } from './components/loadingScreen';
import projectImg from './images/devices@2x.png';
import mountains from './images/Mountain-illustration@2x.png';
import confetti from './images/Confetti@2x.png';
import history from './services/history';

const Main = React.lazy(() => import('./components/Main'));
const PublicTimeline = React.lazy(() => import('./components/PublicTimeline'));

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
              pathname: `/login`,
              search: location?.search,
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

function SignUpPanel({ quote, author }: { quote: string; author: string }) {
  return (
    <Grid
      display={{ xs: 'none', md: 'grid' }}
      bg='brand.primary'
      width='100%'
      height='100%'
      position='relative'
      alignItems='center'
      justifyItems='start'
    >
      <Box pt={32} px={16} color='white' textAlign='center'>
        <Flex
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          position='relative'
        >
          <Image
            src={confetti}
            alt='project illustration'
            position='absolute'
            top='-20px'
          />
          <Heading size='lg' maxWidth='90%' mb={4}>
            {quote}
          </Heading>
          <Text>{author}</Text>
          <Image
            mt={8}
            height='200px'
            src={projectImg}
            alt='project illustration'
            position='relative'
            zIndex={2}
          />
        </Flex>
      </Box>
      <Image src={mountains} alt='mountain illustration' zIndex={1} />
    </Grid>
  );
}

function SignupPage() {
  return (
    <Layout>
      <Box mx='auto' alignSelf='center' width='320px'>
        <SignupForm />
      </Box>
      <SignUpPanel
        quote={`"Omelo has enabled me to push code and not deadlines"`}
        author='- Moe A.'
      />
    </Layout>
  );
}

function LoginPage() {
  return (
    <Layout>
      <Box mx='auto' alignSelf='center' width='320px'>
        <LoginForm />
      </Box>
      <SignUpPanel
        quote={`"I got 99 problems but scope creep ain't one"`}
        author='- Moe A.'
      />
    </Layout>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/404'>
          <Page404 />
        </Route>
        <Route exact path='/signup'>
          <SignupPage />
        </Route>
        <Route exact path='/login'>
          <LoginPage />
        </Route>
        <Route path='/public/:id'>
          <Suspense fallback={skeletonTimeline}>
            <PublicTimeline />
          </Suspense>
        </Route>
        <PrivateRoute path='/'>
          <Suspense fallback={skeletonTimeline}>
            <Main user={user} />
          </Suspense>
        </PrivateRoute>
      </Switch>
    </Router>
  );
}

export default App;
