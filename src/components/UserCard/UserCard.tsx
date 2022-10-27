import {ShortFormUser} from "../../@types/user";
import {Box, Button, Card, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

const UserCard = ({ user }: { user: ShortFormUser }) => {
  const navigate = useNavigate();

  return (
    <Grid item xs={12} md={6} lg={4} xl={3} sx={{ padding: '2px' }}>
      <Card sx={{ display: 'flex', padding: '20px', cursor: 'pointer' }} onClick={() => navigate(`/users/${user.id}`)}>
        <CardMedia
          component={"img"}
          sx={{ width: '150px', borderRadius: '50%' }}
          alt={user.username}
          image={`https://udatube-avatars-dev.s3.amazonaws.com/${user.id}.png`}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography
              component="div"
              variant="h5"
            >
              {user.username}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {user.totalSubscribers} subscribers
            </Typography>
          </CardContent>
          <Box sx={{ pl: '16px', pb: 1 }}>
            <Button variant={"outlined"}>
              Subscribe
            </Button>
          </Box>
        </Box>
      </Card>
    </Grid>
  );
};

export default UserCard;