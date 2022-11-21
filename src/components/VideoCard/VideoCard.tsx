import {ShortFormVideo} from "../../@types/video";
import {Avatar, Card, CardActionArea, CardHeader, CardMedia, Tooltip, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useSize} from "../../contexts/Size.context";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const VideoCard = ({ video }: { video: ShortFormVideo }) => {
  const navigate = useNavigate();
  const {size} = useSize();

  return (
    <Card
      sx={{
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/videos/${video.id}`)}
    >
      <CardActionArea>
        <CardMedia
          component={"img"}
          image={`https://udatube-thumbnails-dev.s3.amazonaws.com/${video.id}.png`}
          alt={video.title}
        />
        <CardHeader
          sx={{ alignItems: 'flex-start' }}
          avatar={
            <Avatar
              src={`https://udatube-avatars-dev.s3.amazonaws.com/${video.userId}.png`}
            />
          }
          title={
            <Tooltip title={video.title} arrow>
              <Typography
                variant="h6"
                component="div"
              >
                {video.title.substring(0, size.textLength)} {video.title.length > size.textLength && '...'}
              </Typography>
            </Tooltip>
          }
          subheader={
            <>
              <Typography
                variant={'subtitle1'}
                component={'p'}
              >
                {video.username?.substring(0, size.textLength)} {video.username!!.length > size.textLength && '...'}
              </Typography>
              <Typography variant={'subtitle1'} component={'p'}>{video.totalViews} views</Typography>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ThumbUpIcon style={{ marginRight: '5px' }} />
                <Typography variant={'subtitle1'} component={'p'} sx={{ pr: '20px' }}>{video.likes}</Typography>
                <ThumbDownIcon style={{ marginRight: '5px' }} />
                <Typography variant={'subtitle1'} component={'p'}>{video.dislikes}</Typography>
              </div>
            </>
          }
        />
      </CardActionArea>
    </Card>
  );
};

export default VideoCard;