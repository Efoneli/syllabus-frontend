import { Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/router';

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const onRedirectCallback = (appState) => {
    router.push(appState?.returnTo || '/');
  };

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      redirectUri={typeof window !== 'undefined' ? window.location.origin : ''}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
