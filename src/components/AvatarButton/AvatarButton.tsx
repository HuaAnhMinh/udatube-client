import {useAuth0} from "@auth0/auth0-react";
import {Avatar, Grid, IconButton, ListItem, ListItemButton, Menu, MenuItem} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {useState, MouseEvent, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import VideoCallIcon from '@mui/icons-material/VideoCall';
import {useMyProfile} from "../../contexts/MyProfile.context";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useSize} from "../../contexts/Size.context";

const AvatarButton = () => {
  const { isAuthenticated, logout } = useAuth0();
  const {size} = useSize();
  const navigate = useNavigate();
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
    if (width >= size.width.md) {
      return (
        <Grid container justifyContent={'flex-end'} alignItems={'center'} spacing={2}>
          <Grid item>
            <IconButton onClick={() => navigate('/videos/new')}>
              <VideoCallIcon fontSize={'large'} color={'error'} />
            </IconButton>
          </Grid>
          <Grid item>
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
              <Link className={'Link'} to={"/users/me"}>
                <MenuItem sx={{ pt: '10px', pb: '10px' }}>
                  <AccountCircleIcon /> &nbsp; My profile
                </MenuItem>
              </Link>
              <MenuItem sx={{ pt: '10px', pb: '10px' }} onClick={() => logout({ returnTo: window.location.origin })}>
                <LogoutIcon /> &nbsp; Logout
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
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
        <Link className={'Link'} to={'/videos/new'}>
          <ListItem>
            <ListItemButton sx={{ pl: '0px' }}>
              <VideoCallIcon /> &nbsp; Create video
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