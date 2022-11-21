import {Video} from "../../@types/video";
import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";

const VideoCard = ({ video }: { video: Video }) => {
  return (
    <Card
      sx={{
        cursor: 'pointer',
      }}
    >
      <CardActionArea>
        <CardMedia
          component={"img"}
          image={`https://udatube-thumbnails-dev.s3.amazonaws.com/${video.id}.png`}
          alt={video.title}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
          }}>
            {video.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VideoCard;