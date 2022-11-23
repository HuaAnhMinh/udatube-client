import {Card, CardActionArea} from "@mui/material";

const VideoCardLoading = () => {


  return (
    <Card>
      <CardActionArea>
        <div style={{ width: '100%', aspectRatio: '16/9', backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)' }} />
      </CardActionArea>
    </Card>
  );
};

export default VideoCardLoading;