import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useUser} from "../../contexts/User.context";
import Page404 from "../Page404/Page404";
import './Profile.scss';
import {Box, Grid, Tab, Tabs, Typography} from "@mui/material";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";
import MyProfileUsername from "../MyProfileUsername/MyProfileUsername";
import CircularProgress from "@mui/material/CircularProgress";
import {useMyProfile} from "../../contexts/MyProfile.context";
import {useSize} from "../../contexts/Size.context";
import UserCard from "../UserCard/UserCard";
import UserCardLoading from "../UserCardLoading/UserCardLoading";

const Profile = () => {
  const location = useLocation();
  const { user, fetchUser, fetchUserSubscribedChannels } = useUser();
  const { myProfile, fetchMineSubscribedChannels } = useMyProfile();
  const { size } = useSize();
  const navigate = useNavigate();

  const [profileTabValue, setProfileTabValue] = useState(0);

  useEffect(() => {
    if (location.pathname.split('/')[2] !== 'me') {
      void fetchUser(location.pathname.split('/')[2]);
    }
  }, [fetchUser, location.pathname]);

  useEffect(() => {
    const tabName = location.search.split('?tab=')[1];
    if (tabName === 'subscribe-channels') {
      setProfileTabValue(0);
    }
    else if (tabName === 'videos') {
      setProfileTabValue(1);
    }
  }, [location.search]);
  
  useEffect(() => {
    if (profileTabValue === 0 && location.pathname.split('/')[2] === 'me' && myProfile.user.id) {
      void fetchMineSubscribedChannels();
    }
  }, [fetchMineSubscribedChannels, location.pathname, myProfile.user.id, profileTabValue]);

  useEffect(() => {
    if (profileTabValue === 0 && location.pathname.split('/')[2] !== 'me' && !user.isFetching) {
      void fetchUserSubscribedChannels();
    }
  }, [fetchUserSubscribedChannels, location.pathname, profileTabValue, user.isFetching]);

  if (user.isFailed) {
    return <Page404 />
  }

  return (
    <div className={"Profile"}>
      {
        location.pathname.split('/')[2] === 'me' && myProfile.error &&
        <Typography style={{ textAlign: 'center' }} variant={'subtitle1'} color={"error"}>{myProfile.error}</Typography>
      }
      {
        ((location.pathname.split('/')[2] === 'me' && !myProfile.user.id) ||
          (location.pathname.split('/')[2] !== 'me' && user.isFetching)) &&
        <div style={{ textAlign: 'center' }}>
          <CircularProgress color={'error'} style={{
              width: size.loadingSizeLarge,
              height: size.loadingSizeLarge,
              borderRadius: '50%'
            }}
          />
        </div>
      }
      <Grid container justifyContent={"flex-start"} alignItems={"center"} spacing={1}>
        {
          location.pathname.split('/')[2] === 'me' && myProfile.user.id &&
          <ProfileAvatar />
        }
        {
          location.pathname.split('/')[2] === 'me' && myProfile.user.id &&
          <MyProfileUsername />
        }
        {
          location.pathname.split('/')[2] !== 'me' && !user.isFetching &&
          <UserCard user={user.user} />
        }
      </Grid>
      {
        ((location.pathname.split('/')[2] === 'me' && myProfile.user.id) ||
          (location.pathname.split('/')[2] !== 'me' && !user.isFetching)) &&
        <Box sx={{ p: 2, border: '1px solid #dddddd', borderRadius: '5px' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={profileTabValue} onChange={(_, newValue) => {
              if (newValue === 0) {
                navigate(`/users/${location.pathname.split('/')[2]}?tab=subscribe-channels`);
              }
              else if (newValue === 1) {
                navigate(`/users/${location.pathname.split('/')[2]}?tab=videos`);
              }
            }}>
              <Tab label={'Subscribe channels'} id={'profile-tab-0'} />
              <Tab label={'Videos'} id={'profile-tab-1'} />
            </Tabs>
          </Box>
          <div
            hidden={profileTabValue !== 0}
          >
            <Box sx={{ p: 3, overflowY: 'auto' }} id={'list-subscribed-channels'}>
              {
                (myProfile.isFetchingSubscribedChannels || user.isFetchingSubscribedChannels) &&
                <Grid container spacing={4} alignItems={'center'} sx={{ padding: '2px' }}>
                  <UserCardLoading />
                  <UserCardLoading />
                  <UserCardLoading />
                </Grid>
              }
              {
                (!myProfile.isFetchingSubscribedChannels && !user.isFetchingSubscribedChannels) &&
                <Grid container spacing={4} alignItems={'center'} sx={{ padding: '2px' }}>
                  {
                    location.pathname.split('/')[2] === 'me' &&
                    myProfile.subscribedChannels.map((user) => (
                      <Grid key={user.id} item xs={12} md={6} xl={4} sx={{ padding: '2px' }}>
                        <UserCard user={user} hasBoxShadow />
                      </Grid>
                    ))
                  }
                  {
                    location.pathname.split('/')[2] !== 'me' &&
                    user.subscribedChannels.map((user) => (
                      <Grid key={user.id} item xs={12} md={6} xl={4} sx={{ padding: '2px' }}>
                        <UserCard user={user} hasBoxShadow />
                      </Grid>
                    ))
                  }
                </Grid>
              }
            </Box>
          </div>
          <div
            hidden={profileTabValue !== 1}
          >
            <Box sx={{ p: 3 }}>
              <Typography>Videos</Typography>
            </Box>
          </div>
        </Box>
      }
    </div>
  );
};

export default Profile;