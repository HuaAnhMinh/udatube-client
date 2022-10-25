import {useAuth0} from "@auth0/auth0-react";
import {Button} from "@mui/material";

const LoginButton = ({ maxWidth }: { maxWidth?: boolean }) => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  if (!isAuthenticated && !isLoading) {
    return (
      <Button
        onClick={loginWithRedirect}
        variant={'outlined'}
        style={{ width: maxWidth ? '100%' : 'inherit' }}
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
        style={{ width: maxWidth ? '100%' : 'inherit' }}
      >
        Loading...
      </Button>
    );
  }

  return null;
};

export default LoginButton;