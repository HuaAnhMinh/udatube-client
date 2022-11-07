import {useLocation} from "react-router-dom";
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

const Profile = () => {
  const location = useLocation();
  const { user, fetchUser } = useUser();
  const { myProfile } = useMyProfile();
  const { size } = useSize();

  const [profileTabValue, setProfileTabValue] = useState(0);

  useEffect(() => {
    if (location.pathname.split('/')[2] !== 'me') {
      void fetchUser(location.pathname.split('/')[2]);
    }
  }, [fetchUser, location.pathname]);

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
      <Box sx={{ p: 2, border: '1px solid #dddddd', borderRadius: '5px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={profileTabValue} onChange={(_, newValue) => setProfileTabValue(newValue)}>
            <Tab label={'Subscribe channels'} id={'profile-tab-0'} />
            <Tab label={'Videos'} id={'profile-tab-1'} />
          </Tabs>
        </Box>
        <div
          hidden={profileTabValue !== 0}
        >
          <Box sx={{ p: 3 }}>
            <Typography>Subscribe channels</Typography>
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
    </div>
  );
};

export default Profile;