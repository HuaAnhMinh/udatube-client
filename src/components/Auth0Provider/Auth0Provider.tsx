import React from 'react';
import {AppState, Auth0Provider as Auth0} from '@auth0/auth0-react';
import {useNavigate} from "react-router-dom";
import auth0Config from "../../configs/auth0.config";

const Auth0Provider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState?: AppState | undefined) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };
  return (
    <Auth0
      onRedirectCallback={onRedirectCallback}
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      redirectUri={window.location.origin}
    >
      {children}
    </Auth0>
  );
};

export default Auth0Provider;