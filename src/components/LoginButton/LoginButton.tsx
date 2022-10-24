import {useAuth0} from "@auth0/auth0-react";
import {Button} from "@mui/material";

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  if (!isAuthenticated && !isLoading) {
    return (
      <Button
        onClick={loginWithRedirect}
        variant={'outlined'}
      >
        Login
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Button
        variant={'outlined'}
        disabled
      >
        Loading...
      </Button>
    );
  }

  return null;
};

export default LoginButton;