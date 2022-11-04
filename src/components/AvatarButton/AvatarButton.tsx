import {useAuth0} from "@auth0/auth0-react";
import {Avatar, IconButton, ListItem, ListItemButton, Menu, MenuItem} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {useState, MouseEvent, useEffect} from "react";
import {Link} from "react-router-dom";
import {useMyProfile} from "../../contexts/MyProfile.context";
import useWindowDimensions from "../../utils/useWindowDimensions.config";

const AvatarButton = () => {
  const { isAuthenticated, logout } = useAuth0();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {myProfile, fetchMyProfile} = useMyProfile();

  useEffect(() => {
    const _fetchMyProfile = async () => {
      await fetchMyProfile();
    };

    void _fetchMyProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { width } = useWindowDimensions();

  if (isAuthenticated && myProfile.user.id) {
    if (width >= 900) {
      return (
        <>
          <IconButton
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <Avatar alt={myProfile.user.username} src={`https://udatube-avatars-dev.s3.amazonaws.com/${myProfile.user.id}.png?${myProfile.cacheTimestamp}`} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <Link className={'Link'} to={"/users/me"}><MenuItem><AccountCircleIcon /> &nbsp; My profile</MenuItem></Link>
            <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>
              <LogoutIcon /> &nbsp; Logout
            </MenuItem>
          </Menu>
        </>
      );
    }

    return (
      <>
        <Link className={'Link'} to={"/users/me"}>
          <ListItem>
            <ListItemButton sx={{ pl: '0px' }}>
              <AccountCircleIcon /> &nbsp; My profile
            </ListItemButton>
          </ListItem>
        </Link>
        <ListItem>
          <ListItemButton sx={{ pl: '0px' }} onClick={() => logout({ returnTo: window.location.origin })}>
            <LogoutIcon /> &nbsp; Logout
          </ListItemButton>
        </ListItem>
      </>
    );
  }

  return null;
};

export default AvatarButton;