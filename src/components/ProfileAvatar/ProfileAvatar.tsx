import {Avatar, Grid, IconButton, Typography} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {useLocation} from "react-router-dom";
import {useMyProfile} from "../../contexts/MyProfile.context";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useUser} from "../../contexts/User.context";

const ProfileAvatar = () => {
  const location = useLocation();
  const { user } = useUser();
  const { width } = useWindowDimensions();
  const { myProfile, changeAvatar } = useMyProfile();

  return (
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
  );
};

export default ProfileAvatar;