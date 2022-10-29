import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {useUser} from "../../contexts/User.context";
import Page404 from "../Page404/Page404";
import './Profile.scss';
import {Avatar, Grid, IconButton, Typography} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useMyProfile} from "../../contexts/MyProfile.context";
import CircularProgress from '@mui/material/CircularProgress';

const Profile = () => {
  const location = useLocation();
  const { width } = useWindowDimensions();
  const { user, fetchUser, mapMyProfileToUser } = useUser();
  const { myProfile } = useMyProfile();

  useEffect(() => {
    if (location.pathname !== '/users/me') {
      void fetchUser(location.pathname.split('/')[2]);
    }
    else {
      void mapMyProfileToUser();
    }
  }, [fetchUser, location.pathname, mapMyProfileToUser]);

  useEffect(() => {
    console.log(user.isFetching);
  }, [user.isFetching]);

  if (user.isFailed) {
    return <Page404 />
  }

  return (
    <div className={"Profile"}>
      <Grid container alignItems={"center"} justifyContent={"center"}>
        <Grid item xs={12} lg={6}>
          <Grid container direction={"column"} justifyContent={"center"} alignItems={"center"}>
            <Grid item>
              {
                (user.isFetching) &&
                <div>
                  <CircularProgress color={'error'} style={
                    width <= 900 ? {
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                    } : {
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                    }
                  } />
                </div>
              }
              {
                !user.isFetching && user.user.id && user.user.id !== myProfile.user.id &&
                <Avatar
                  alt={user.user.username}
                  src={`https://udatube-avatars-dev.s3.amazonaws.com/${user.user.id}.png`}
                  sx={width <= 900 ? { width: 150, height: 150 } : { width: 200, height: 200 }}
                />
              }
              {
                !user.isFetching && user.user.id === myProfile.user.id &&
                <IconButton>
                  <Avatar
                    alt={user.user.username}
                    src={`https://udatube-avatars-dev.s3.amazonaws.com/${user.user.id}.png`}
                    sx={width <= 900 ? { width: 150, height: 150 } : { width: 200, height: 200 }}
                  />
                </IconButton>
              }
            </Grid>
            <Grid item width="100%" style={{ textAlign: 'center' }}>
              {
                user.isFetching &&
                <div
                  style={{
                    height: '100%',
                    width: '200px',
                    backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)',
                  }}
                />
              }
              {
                !user.isFetching &&
                <Typography
                  component={"h1"}
                  variant={width <= 900 ? 'h5' : 'h4'}
                  sx={{ padding: '15px 0' }}
                >
                  {user.user.username}
                  {
                    user.user.id === myProfile.user.id &&
                    <>&nbsp;<IconButton><EditIcon/></IconButton></>
                  }
                </Typography>
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;