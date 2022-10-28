import {ShortFormUser} from "../../@types/user";
import {Box, Button, Card, CardContent, CardMedia, Grid, Tooltip, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useEffect, useState} from "react";

const UserCard = ({ user }: { user: ShortFormUser }) => {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

  const [imageSize, setImageSize] = useState(150);
  const [textLength, setTextLength] = useState(25);

  useEffect(() => {
    if (width < 600) {
      setImageSize(80);
      setTextLength(20);
    }
    else if (width < 900) {
      setImageSize(100);
      setTextLength(25);
    }
    else if (width < 1200) {
      setImageSize(120);
      setTextLength(30);
    }
    else {
      setImageSize(150);
      setTextLength(35);
    }
  }, [width]);

  return (
    <Grid item xs={12} md={6} xl={4} sx={{ padding: '2px' }}>
      <Card
        sx={{
          display: 'flex',
          padding: '20px',
          cursor: 'pointer',
          alignItems: 'center',
        }}
        onClick={() => navigate(`/users/${user.id}`)}
      >
        <CardMedia
          component={"img"}
          sx={{ width: `${imageSize}px`, height: `${imageSize}px`, borderRadius: '50%' }}
          alt={user.username}
          image={`https://udatube-avatars-dev.s3.amazonaws.com/${user.id}.png`}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Tooltip title={user.username}>
              <Typography
                component="div"
                variant={width < 900 ? 'h6' : 'h5'}
                sx={{ fontWeight: 500 }}
                noWrap
              >
                {user.username.substring(0, textLength)} {user.username.length > textLength && '...'}
              </Typography>
            </Tooltip>
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