import {Avatar, Grid, IconButton, Tooltip} from "@mui/material";
import {useLocation} from "react-router-dom";
import {useMyProfile} from "../../contexts/MyProfile.context";
import {useUser} from "../../contexts/User.context";
import {useSize} from "../../contexts/Size.context";

const ProfileAvatar = () => {
  const location = useLocation();
  const { user } = useUser();
  const { myProfile, changeAvatar } = useMyProfile();
  const { size } = useSize();

  return (
    <Grid item>
      { // avatar for other users
        location.pathname.split('/')[2] !== 'me' &&
        <Avatar
          alt={user.user.username}
          src={`https://udatube-avatars-dev.s3.amazonaws.com/${user.user.id}.png`}
          sx={{ width: size.loadingSizeLarge, height: size.loadingSizeLarge, m: '8px' }}
        />
      }

      { // avatar for my profile
        location.pathname.split('/')[2] === 'me' && !myProfile.isUploadingAvatar &&
        <Tooltip title={"Click to change avatar, your avatar will be scaled to square"} arrow>
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
              sx={{ width: size.loadingSizeLarge, height: size.loadingSizeLarge }}
            />
          </IconButton>
        </Tooltip>
      }

      { // loading icon when uploading new avatar
        location.pathname.split('/')[2] === 'me' && myProfile.isUploadingAvatar &&
        <div style={{
          width: size.loadingSizeLarge,
          height: size.loadingSizeLarge,
          borderRadius: '50%',
          backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)',
        }} />
      }
    </Grid>
  );
};

export default ProfileAvatar;