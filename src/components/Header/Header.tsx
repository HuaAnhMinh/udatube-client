import './Header.scss';
import {Grid} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import Logo from "../Logo/Logo";
import SearchBar from "../SearchBar/SearchBar";
import LoginButton from "../LoginButton/LoginButton";
import AvatarButton from "../AvatarButton/AvatarButton";

const Header = () => {
  const {
    isLoading,
    isAuthenticated,
  } = useAuth0();

  return (
    <Grid container justifyContent={'space-between'} className={"Header"} alignItems={'center'}>
      <Grid item xs={3}>
        <div>
          <Logo />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div>
          <SearchBar />
        </div>
      </Grid>

      {
        !isAuthenticated &&
        <Grid item xs={3}>
          <div className={'Header__Login'}>
            <LoginButton />
          </div>
        </Grid>
      }

      {
        isAuthenticated && !isLoading &&
        <Grid item xs={3}>
          <div className={'Header__Login'}>
            <AvatarButton />
          </div>
        </Grid>
      }
    </Grid>
  );
};

export default Header;