import {Button, Grid, IconButton, TextField, Typography} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useMyProfile} from "../../contexts/MyProfile.context";
import {useState} from "react";
import {useSize} from "../../contexts/Size.context";

const MyProfileUsername = () => {
  const { width } = useWindowDimensions();
  const { myProfile, updateUsernameToDB, changeUsername } = useMyProfile();
  const [openEditUsername, setOpenEditUsername] = useState(false);
  const { size } = useSize();

  return (
    <Grid
      item
      style={{
        flexGrow: width <= size.width.md ? 1 : 0,
        width: width <= size.width.md ? 'auto' : '600px',
      }}
    >
      {
        !openEditUsername && !myProfile.isFetching &&
        <Typography component={'div'} variant={'h5'} sx={{ position: 'relative' }}>
          {myProfile.user.username}
          <IconButton sx={{ position: 'absolute', pl: '10px', top: '-15%' }} onClick={() => setOpenEditUsername(true)}>
            <EditIcon />
          </IconButton>
        </Typography>
      }
      {
        myProfile.isFetching && !openEditUsername &&
        <CircularProgress color={'error'} sx={{ fontSize: `${size.loadingSizeSmall}px`, mt: '15px' }} />
      }
      {
        !openEditUsername &&
        <Typography component={'div'} variant={'subtitle1'}>{myProfile.user.totalSubscribers} subscribers</Typography>
      }
      {
        openEditUsername &&
        <TextField value={myProfile.newUsername} onChange={(e) => changeUsername(e.target.value)} fullWidth />
      }
      {
        openEditUsername && !myProfile.isFetching &&
        <Grid container justifyContent={'space-between'} alignItems={'center'} spacing={1} sx={{ pt: '5px' }}>
          <Grid item xs={6}>
            <Button
              variant={'contained'}
              color={'error'}
              fullWidth
              onClick={() => {
                setOpenEditUsername(false);
                void updateUsernameToDB();
              }}
            >
              Accept
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant={'outlined'}
              fullWidth
              onClick={() => {
                setOpenEditUsername(false);
                changeUsername(myProfile.user.username);
              }}
            >
              Decline
            </Button>
          </Grid>
        </Grid>
      }
    </Grid>
  );
};

export default MyProfileUsername;