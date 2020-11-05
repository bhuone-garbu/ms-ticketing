import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  // console.log(currentUser);
  // axios.get('/api/users/currentuser');
  console.log(currentUser);

  return <h1>Landing Page 2</h1>;
};

LandingPage.getInitialProps = async () => {
  const path = '/api/users/currentuser';
  if (typeof window === 'undefined') {
    // we are on the server!

    // Note: 
    // can be found via: kubectl get services -n 'namespace'
    // cross namespace service communication
    // in order to reach the ingress-nginx controller service
    // external name service domain template:
    // `http://${servicename}.{namespace}.svc.cluster.local`
    const { data } = await axios.get(
      `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local${path}`,
      {
        headers: {
          Host: 'ticketing.dev'
        }
      }
    );

    return data;
  } else {
    // we are on the browser!
    // requests can be made with a base url of ''
    const { data } = await axios.get(path);

    return data;
  }
};

export default LandingPage;

