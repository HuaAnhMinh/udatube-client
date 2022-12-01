import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useUser} from "../../contexts/User.context";
import Page404 from "../Page404/Page404";
import './Profile.scss';
import {Alert, Box, Grid, Snackbar, Tab, Tabs, Typography} from "@mui/material";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";
import MyProfileUsername from "../MyProfileUsername/MyProfileUsername";
import CircularProgress from "@mui/material/CircularProgress";
import {useMyProfile} from "../../contexts/MyProfile.context";
import {useSize} from "../../contexts/Size.context";
import UserCard from "../UserCard/UserCard";
import UserCardLoading from "../UserCardLoading/UserCardLoading";
import VideosByUserId from "../VideosByUserId/VideosByUserId";

const Profile = () => {
  const location = useLocation();
  const { user, fetchUser, fetchUserSubscribedChannels } = useUser();
  const { myProfile, fetchMineSubscribedChannels } = useMyProfile();
  const [profileTabValue, setProfileTabValue] = useState(0);
  const { size } = useSize();
  const navigate = useNavigate();

  useEffect(() => {
    if (!myProfile.user.id) {
      return;
    }
    const userId = location.pathname.split('/')[2];
    if (userId !== 'me') {
      if (userId !== myProfile.user.id) {
        void fetchUser(location.pathname.split('/')[2]);
      }
      else {
        navigate('/users/me');
      }
    }
  }, [fetchUser, location.pathname, myProfile.user.id, navigate]);
  
  useEffect(() => {
    if (profileTabValue === 0 &&
      location.pathname.split('/')[2] === 'me' &&
      !myProfile.isFetching) {
      void fetchMineSubscribedChannels();
    }
  }, [
    fetchMineSubscribedChannels,
    location.pathname,
    myProfile.isFetching,
    myProfile.user.id,
    profileTabValue
  ]);

  useEffect(() => {
    if (profileTabValue === 0 &&
      location.pathname.split('/')[2] !== 'me' &&
      !user.isFetching &&
      myProfile.user.id &&
      user.user.subscribedChannels.length !== 0) {
      void fetchUserSubscribedChannels();
    }
  }, [
    fetchUserSubscribedChannels,
    location.pathname,
    myProfile.user.id,
    profileTabValue,
    user.isFetching,
    user.user.subscribedChannels.length
  ]);

  if (user.isFailed) {
    return <Page404 />
  }

  if (user.isFetching || myProfile.isFetching) {
    return (
      <div style={{ textAlign: 'center' }}>
        <CircularProgress color={'error'} style={{
          width: size.loadingSizeLarge,
          height: size.loadingSizeLarge,
          borderRadius: '50%'
        }}
        />
      </div>
    );
  }

  return (
    <div className={"Profile"}>
      <Grid container justifyContent={"flex-start"} alignItems={"center"} spacing={1} sx={{ pb: '10px' }}>
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
            <Tabs value={profileTabValue} onChange={(_, newValue) => setProfileTabValue(newValue)}>
              <Tab label={'Subscribe channels'} id={'profile-tab-0'} />
              <Tab label={'Videos'} id={'profile-tab-1'} />
            </Tabs>
          </Box>
          <div
            hidden={profileTabValue !== 0}
            style={{ paddingTop: '10px' }}
          >
            <Box sx={{
                p: 1,
                overflowY: 'auto',
              }}
              id={'list-subscribed-channels'}
            >
              {
                ((location.pathname.split('/')[2] === 'me' && myProfile.isFetchingSubscribedChannels) ||
                  (location.pathname.split('/')[2] !== 'me' && user.isFetchingSubscribedChannels)) &&
                <Grid container spacing={4} alignItems={'center'} sx={{ padding: '2px' }}>
                  <UserCardLoading />
                  <UserCardLoading />
                  <UserCardLoading />
                </Grid>
              }
              {
                !myProfile.isFetchingSubscribedChannels && !user.isFetchingSubscribedChannels &&
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
              {
                ((location.pathname.split('/')[2] === 'me' &&
                  myProfile.user.subscribedChannels.length === 0) ||
                (location.pathname.split('/')[2] !== 'me' &&
                  user.user.subscribedChannels.length === 0)) &&
                <Typography style={{ textAlign: 'center', paddingTop: '35px' }} variant={'subtitle1'} color={"textSecondary"}>
                  There are no subscribed channels
                </Typography>
              }
            </Box>
          </div>
          <div
            hidden={profileTabValue !== 1}
          >
            <Box sx={{ p: 1 }}>
              {
                !user.isFetching && !myProfile.isFetching && profileTabValue === 1 &&
                <VideosByUserId
                  userId={location.pathname.split('/')[2] === 'me' ? myProfile.user.id : user.user.id}
                  modify={true}
                />
              }
            </Box>
          </div>
        </Box>
      }
      <Snackbar open={!!myProfile.error}>
        <Alert severity={'error'}>
          {myProfile.error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;