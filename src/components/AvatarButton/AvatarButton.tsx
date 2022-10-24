import {useAuth0} from "@auth0/auth0-react";
import {Avatar, IconButton, Menu, MenuItem} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {useState, MouseEvent, useEffect} from "react";
import {Link} from "react-router-dom";
import {useMyProfile} from "../../contexts/MyProfile.context";

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
  }, [fetchMyProfile]);

  if (isAuthenticated && myProfile.id) {
    return (
      <>
        <IconButton
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Avatar alt={myProfile.username} src={`https://udatube-avatars-dev.s3.amazonaws.com/${myProfile.id}.png`} />
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

  return null;
};

export default AvatarButton;