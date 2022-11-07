import {Button, Grid, Typography} from "@mui/material";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useSize} from "../../contexts/Size.context";
import {useUser} from "../../contexts/User.context";

const OtherProfileUsername = () => {
  const { width } = useWindowDimensions();
  const { size } = useSize();
  const { user } = useUser();

  return (
    <Grid
      item
      style={{
        flexGrow: width <= size.width.md ? 1 : 0,
        width: width <= size.width.md ? 'auto' : '600px',
      }}
    >
      <Typography component={'div'} variant={'h5'}>
        {user.user.username}
      </Typography>
      <Typography component={'div'} variant={'subtitle1'}>{user.user.totalSubscribers} subscribers</Typography>
      <Button variant={'contained'} color={'error'}>
        Subscribe
      </Button>
    </Grid>
  );
};

export default OtherProfileUsername;