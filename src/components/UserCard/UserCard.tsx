import {ShortFormUser} from "../../@types/user";
import {Box, Button, Card, CardContent, CardMedia, Menu, Tooltip, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {MouseEvent, useState} from "react";
import {useMyProfile} from "../../contexts/MyProfile.context";
import {useAuth0} from "@auth0/auth0-react";
import {useSize} from "../../contexts/Size.context";

const UserCard = ({ user, hasBoxShadow }: { user: ShortFormUser, hasBoxShadow?: boolean | undefined }) => {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { myProfile, subscribeChannel, unsubscribeChannel } = useMyProfile();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const { size } = useSize();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = () => {
    if (isAuthenticated && myProfile.user.id === user.id) {
      return navigate('/users/me');
    }
    return navigate(`/users/${user.id}`);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        padding: '20px',
        cursor: 'pointer',
        alignItems: 'center',
      }}
      style={!hasBoxShadow ? { boxShadow: 'none' } : {}}
    >
      <CardMedia
        component={"img"}
        sx={{ width: `${size.loadingSizeLarge}px`, height: `${size.loadingSizeLarge}px`, borderRadius: '50%' }}
        alt={user.username}
        image={`https://udatube-avatars-dev.s3.amazonaws.com/${user.id}.png`}
        onClick={handleNavigate}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CardContent sx={{ flex: '1 0 auto' }} onClick={handleNavigate}>
          <Tooltip title={user.username}>
            <Typography
              component="div"
              variant={width < 900 ? 'h6' : 'h5'}
              sx={{ fontWeight: 500 }}
              noWrap
            >
              {user.username.substring(0, size.textLength)} {user.username.length > size.textLength && '...'}
            </Typography>
          </Tooltip>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {user.totalSubscribers} subscribers
          </Typography>
        </CardContent>
        <Box sx={{ pl: '16px', pb: 1 }}>
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
        </Box>
      </Box>
    </Card>
  );
};

export default UserCard;