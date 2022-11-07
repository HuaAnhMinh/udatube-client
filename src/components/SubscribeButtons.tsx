import {Button, Menu, Tooltip, Typography} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import {useMyProfile} from "../contexts/MyProfile.context";
import {ShortFormUser, User} from "../@types/user";
import {useNavigate} from "react-router-dom";
import {MouseEvent, useState} from "react";

const SubscribeButtons = ({ user }: { user: ShortFormUser | User }) => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  const { myProfile, subscribeChannel, unsubscribeChannel } = useMyProfile();
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (isAuthenticated && myProfile.user.id === user.id) {
      return navigate('/users/me');
    }
    return navigate(`/users/${user.id}`);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {
        (isLoading || (isAuthenticated && !myProfile.user.id)) &&
        <Button disabled variant={"outlined"}>
          Checking subscription...
        </Button>
      }

      {
        isAuthenticated &&
        !isLoading &&
        myProfile.user.subscribedChannels.includes(user.id) &&
        !myProfile.isUnsubscribing.includes(user.id) &&
        <Button variant={"outlined"} color={"error"} onClick={() => unsubscribeChannel(user.id)}>
          Unsubscribe
        </Button>
      }

      {
        isAuthenticated &&
        !isLoading &&
        myProfile.user.id &&
        !myProfile.user.subscribedChannels.includes(user.id) &&
        myProfile.user.id !== user.id &&
        !myProfile.isSubscribing.includes(user.id) &&
        <Button variant={"contained"} color={"error"} onClick={() => subscribeChannel(user.id)}>
          Subscribe
        </Button>
      }

      {
        isAuthenticated &&
        !isLoading &&
        myProfile.user.id === user.id &&
        <Button variant={"outlined"} color={"error"} onClick={handleNavigate}>
          My channel
        </Button>
      }

      {
        !isAuthenticated && !isLoading &&
        <>
          <Tooltip title={"You must login first to subscribe to a channel"}>
            <Button variant={"contained"} color={"error"} onClick={handleClick}>
              Subscribe
            </Button>
          </Tooltip>
          <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
            <div style={{ padding: '6px 16px' }}>
              <Typography sx={{ pb: '5px' }} component={"p"}>You must login first to subscribe to a channel</Typography>
              <Button onClick={loginWithRedirect} variant={"contained"} color={"error"}>Login</Button>
            </div>
          </Menu>
        </>
      }

      {
        myProfile.isSubscribing.includes(user.id) &&
        <Button disabled variant={"outlined"}>
          Subscribing...
        </Button>
      }

      {
        myProfile.isUnsubscribing.includes(user.id) &&
        <Button disabled variant={"outlined"}>
          Unsubscribing...
        </Button>
      }
    </>
  );
};

export default SubscribeButtons;