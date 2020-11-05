import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/buildClient';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
  <div>
    <Header currentUser={currentUser} />
    <Component { ...pageProps } />
  </div>
  );
};

// this appContent on _app is different than the normal page context
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data
  }
};

export default AppComponent;
