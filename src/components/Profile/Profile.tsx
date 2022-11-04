import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {useUser} from "../../contexts/User.context";
import Page404 from "../Page404/Page404";
import './Profile.scss';
import {Avatar, Button, Grid, IconButton, TextField, Typography} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useMyProfile} from "../../contexts/MyProfile.context";
import CircularProgress from '@mui/material/CircularProgress';

const Profile = () => {
  const location = useLocation();
  const { width } = useWindowDimensions();
  const { user, fetchUser } = useUser();
  const { myProfile, updateUsernameToDB, changeUsername, changeAvatar } = useMyProfile();
  const [openEditUsername, setOpenEditUsername] = useState(false);

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
      <Grid container alignItems={"center"} justifyContent={"center"}>
        <Grid item xs={12} lg={6}>
          <Grid container direction={"column"} justifyContent={"center"} alignItems={"center"}>
            <Grid item>
              {
                location.pathname.split('/')[2] === 'me' && myProfile.error &&
                <Typography variant={"h6"} color={"error"}>{myProfile.error}</Typography>
              }
              {
                ((location.pathname.split('/')[2] === 'me' && !myProfile.user.id) ||
                  (location.pathname.split('/')[2] !== 'me' && user.isFetching)) &&
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
                location.pathname.split('/')[2] !== 'me' && !user.isFetching &&
                <Avatar
                  alt={user.user.username}
                  src={`https://udatube-avatars-dev.s3.amazonaws.com/${user.user.id}.png`}
                  sx={width <= 900 ? { width: 150, height: 150 } : { width: 200, height: 200 }}
                />
              }
              {
                location.pathname.split('/')[2] === 'me' && myProfile.user.id && !myProfile.isUploadingAvatar &&
                <IconButton component={"label"}>
                  <input
                    type={"file"}
                    accept=".png"
                    hidden
                    onChange={(e) => {
                      console.log(e.target.files);
                      void changeAvatar(e.target.files!![0]);
                    }}
                  />
                  <Avatar
                    alt={myProfile.user.username}
                    src={`https://udatube-avatars-dev.s3.amazonaws.com/${myProfile.user.id}.png?${myProfile.cacheTimestamp}`}
                    sx={width <= 900 ? { width: 150, height: 150 } : { width: 200, height: 200 }}
                  />
                </IconButton>
              }
              {
                location.pathname.split('/')[2] === 'me' && myProfile.user.id && myProfile.isUploadingAvatar &&
                <CircularProgress color={'error'} size={150} />
              }
            </Grid>
            <Grid item width="100%" style={{ textAlign: 'center' }}>
              {
                ((location.pathname.split('/')[2] === 'me' && !myProfile.user.id) ||
                  (location.pathname.split('/')[2] !== 'me' && user.isFetching)) &&
                <div
                  style={{
                    height: '100%',
                    width: '200px',
                    backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)',
                  }}
                />
              }
              {
                ((location.pathname.split('/')[2] === 'me' && myProfile.user.id && !myProfile.isFetching) ||
                  (location.pathname.split('/')[2] !== 'me' && !user.isFetching)) && !openEditUsername &&
                <Typography
                  component={"h1"}
                  variant={width <= 900 ? 'h5' : 'h4'}
                  sx={{ padding: '15px 0' }}
                >
                  {location.pathname.split('/')[2] === 'me' ? myProfile.user.username : user.user.username}
                  {
                    location.pathname.split('/')[2] === 'me' &&
                    <IconButton
                      sx={{ ml: '6px', position: 'absolute' }}
                      onClick={() => setOpenEditUsername(true)}
                      disabled={myProfile.isFetching}
                    >
                      <EditIcon/>
                    </IconButton>
                  }
                </Typography>
              }
              {
                location.pathname.split('/')[2] === 'me' && myProfile.user.id && myProfile.isFetching &&
                <CircularProgress color={"error"} sx={{ fontSize: '20px', mt: '15px' }} />
              }
              {
                location.pathname.split('/')[2] === 'me' && myProfile.user.id && openEditUsername &&
                <>
                  <Grid container justifyContent={"center"} alignItems={"center"}>
                    <Grid item sx={{ mt: '5px', p: '0 5px' }} xs={12} md={10}>
                      <TextField
                        fullWidth
                        variant={"outlined"}
                        value={myProfile.newUsername}
                        onChange={(e) => changeUsername(e.target.value)}
                      />
                    </Grid>
                    <Grid item sx={{ mt: '5px', p: '0 5px' }} xs={6} md={5}>
                      <Button
                        variant={"contained"}
                        color={"error"}
                        fullWidth
                        onClick={() => {
                          void updateUsernameToDB();
                          setOpenEditUsername(false);
                        }}
                        disabled={myProfile.isFetching}
                      >
                        Accept
                      </Button>
                    </Grid>
                    <Grid item sx={{ mt: '5px', p: '0 5px' }} xs={6} md={5}>
                      <Button
                        variant={"outlined"}
                        color={"primary"}
                        fullWidth
                        onClick={() => setOpenEditUsername(false)}
                        disabled={myProfile.isFetching}
                      >
                        Decline
                      </Button>
                    </Grid>
                  </Grid>
                </>
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;