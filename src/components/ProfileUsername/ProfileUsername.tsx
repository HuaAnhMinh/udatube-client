import {Button, Grid, IconButton, TextField, Typography} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import {useLocation} from "react-router-dom";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useUser} from "../../contexts/User.context";
import {useMyProfile} from "../../contexts/MyProfile.context";
import {useState} from "react";

const ProfileUsername = () => {
  const location = useLocation();
  const { width } = useWindowDimensions();
  const { user } = useUser();
  const { myProfile, updateUsernameToDB, changeUsername } = useMyProfile();
  const [openEditUsername, setOpenEditUsername] = useState(false);

  return (
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
          component={"div"}
          variant={width <= 900 ? 'h5' : 'h4'}
          sx={{ padding: '15px 0', position: 'relative' }}
        >
          {location.pathname.split('/')[2] === 'me' ? myProfile.user.username : user.user.username}
          {
            location.pathname.split('/')[2] === 'me' &&
            <IconButton
              sx={{ ml: '6px', position: 'absolute', top: width <= 900 ? '10px' : '14px' }}
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
  );
};

export default ProfileUsername;