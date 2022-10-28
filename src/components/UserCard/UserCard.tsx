import {ShortFormUser} from "../../@types/user";
import {Box, Button, Card, CardContent, CardMedia, Grid, Menu, Tooltip, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {MouseEvent, useEffect, useState} from "react";
import {useMyProfile} from "../../contexts/MyProfile.context";
import {useAuth0} from "@auth0/auth0-react";

const UserCard = ({ user }: { user: ShortFormUser }) => {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { myProfile, subscribeChannel, unsubscribeChannel } = useMyProfile();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const [imageSize, setImageSize] = useState(150);
  const [textLength, setTextLength] = useState(25);

  useEffect(() => {
    if (width < 600) {
      setImageSize(80);
      setTextLength(20);
    }
    else if (width < 900) {
      setImageSize(100);
      setTextLength(25);
    }
    else if (width < 1200) {
      setImageSize(120);
      setTextLength(30);
    }
    else {
      setImageSize(150);
      setTextLength(35);
    }
  }, [width]);

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
    <Grid item xs={12} md={6} xl={4} sx={{ padding: '2px' }}>
      <Card
        sx={{
          display: 'flex',
          padding: '20px',
          cursor: 'pointer',
          alignItems: 'center',
        }}
      >
        <CardMedia
          component={"img"}
          sx={{ width: `${imageSize}px`, height: `${imageSize}px`, borderRadius: '50%' }}
          alt={user.username}
          image={`https://udatube-avatars-dev.s3.amazonaws.com/${user.id}.png`}
          onClick={handleNavigate}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }} onClick={handleNavigate}>
            <Tooltip title={user.username}>
              <Typography
                component="div"
                variant={width < 900 ? 'h6' : 'h5'}
                sx={{ fontWeight: 500 }}
                noWrap
              >
                {user.username.substring(0, textLength)} {user.username.length > textLength && '...'}
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
    </Grid>
  );
};

export default UserCard;