import {ShortFormVideo} from "../../@types/video";
import {Avatar, Card, CardHeader, CardMedia, Tooltip, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useSize} from "../../contexts/Size.context";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import {useEffect, useState} from "react";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import './VideoCard.scss';

const VideoCard = ({ video }: { video: ShortFormVideo }) => {
  const navigate = useNavigate();
  const {size} = useSize();
  const { width } = useWindowDimensions();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const cardWidth = document.getElementsByClassName("VideoCard")[0]?.clientWidth;
    if (cardWidth) {
      setHeight((cardWidth * 9 / 16) + 175);
    }
  }, [width]);

  return (
    <Card
      className={'VideoCard'}
      sx={{
        cursor: 'pointer',
        boxShadow: 'none',
        borderRadius: '15px',
        height,
      }}
      onClick={() => navigate(`/videos/${video.id}`)}
    >
      <div className={'VideoCard__CardActionArea'} style={{ height: '100%' }}>
        <CardMedia
          component={"img"}
          image={`https://udatube-thumbnails-dev.s3.amazonaws.com/${video.id}.png`}
          alt={video.title}
          sx={{ width: '100%', aspectRatio: '16/9', borderRadius: '15px' }}
        />
        <CardHeader
          sx={{ alignItems: 'flex-start', paddingLeft: 0, paddingRight: 0 }}
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
                sx={{
                  lineHeight: '1.5em',
                  maxHeight: '3em',
                  overflow: 'hidden',
                  axWidth: '20rem',
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-word'
                }}
              >
                {video.title}
              </Typography>
            </Tooltip>
          }
          subheader={
            <div style={{ paddingTop: '5px' }}>
              <Typography
                variant={'subtitle1'}
                component={'p'}
                sx={{ lineHeight: '1.5em' }}
              >
                {video.username?.substring(0, size.textLength)} {video.username!!.length > size.textLength && '...'}
              </Typography>
              <Typography
                variant={'subtitle1'}
                component={'p'}
                sx={{ lineHeight: '1.5em' }}
              >
                {video.totalViews} views
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ThumbUpIcon style={{ marginRight: '5px' }} />
                <Typography
                  variant={'subtitle1'}
                  component={'p'}
                  sx={{ pr: '20px' }}
                >
                  {video.likes}
                </Typography>
                <ThumbDownIcon style={{ marginRight: '5px' }} />
                <Typography
                  variant={'subtitle1'}
                  component={'p'}
                >
                  {video.dislikes}
                </Typography>
              </div>
            </div>
          }
        />
      </div>
    </Card>
  );
};

export default VideoCard;