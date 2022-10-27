import {useAuth0} from "@auth0/auth0-react";
import {Button, IconButton} from "@mui/material";

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
      <IconButton
        style={{
          height: '56px',
          width: '56px',
          borderRadius: '50%',
          backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)',
          textAlign: 'right',
        }}
      />
    );
  }

  return null;
};

export default LoginButton;