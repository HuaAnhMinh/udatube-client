import './Header.scss';
import {Box, Drawer, Grid, IconButton, List, ListItem} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import Logo from "../Logo/Logo";
import SearchBar from "../SearchBar/SearchBar";
import LoginButton from "../LoginButton/LoginButton";
import AvatarButton from "../AvatarButton/AvatarButton";
import MenuIcon from '@mui/icons-material/Menu';
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useState} from "react";

const Header = () => {
  const {
    isLoading,
    isAuthenticated,
  } = useAuth0();

  const { width } = useWindowDimensions();

  const [openDrawer, setOpenDrawer] = useState(false);

  if (width >= 900) {
    return (
      <Grid container justifyContent={'space-between'} className={"Header"} alignItems={'center'}>
        <Grid item xs={3}>
          <div>
            <Logo/>
          </div>
        </Grid>

        <Grid item xs={6}>
          <div>
            <SearchBar/>
          </div>
        </Grid>

        {
          !isAuthenticated &&
          <Grid item xs={3}>
            <div className={'Header__Login'}>
              <LoginButton/>
            </div>
          </Grid>
        }

        {
          isAuthenticated && !isLoading &&
          <Grid item xs={3}>
            <div className={'Header__Login'}>
              <AvatarButton/>
            </div>
          </Grid>
        }
      </Grid>
    );
  }

  return (
    <Grid container justifyContent={'space-between'} className={"Header Header--mobile"} alignItems={'center'}>
      <Grid item xs={1}>
        <div>
          <IconButton sx={{ p: '0px' }} onClick={() => setOpenDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor={'left'}
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={() => setOpenDrawer(false)}
              onKeyDown={() => setOpenDrawer(false)}
            >
              <List>
                <ListItem>
                  <Logo />
                </ListItem>
                {
                  !isAuthenticated &&
                  <ListItem>
                    <LoginButton maxWidth />
                  </ListItem>
                }
                {
                  isAuthenticated &&
                  <AvatarButton />
                }
              </List>
            </Box>
          </Drawer>
        </div>
      </Grid>

      <Grid item xs={11}>
        <div>
          <SearchBar/>
        </div>
      </Grid>
    </Grid>
  );
};

export default Header;