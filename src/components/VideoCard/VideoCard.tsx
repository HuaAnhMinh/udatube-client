import {ShortFormVideo} from "../../@types/video";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardMedia,
  Tooltip,
  Typography,
  Grid,
  Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useSize} from "../../contexts/Size.context";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import {useEffect, useState} from "react";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import './VideoCard.scss';
import {useVideos} from "../../contexts/Videos.context";
import CircularProgress from "@mui/material/CircularProgress";

const VideoCard = ({ video, modify }: { video: ShortFormVideo, modify?: boolean }) => {
  const navigate = useNavigate();
  const {size} = useSize();
  const { width } = useWindowDimensions();
  const [height, setHeight] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteVideo, videos } = useVideos();

  useEffect(() => {
    const cardWidth = document.getElementsByClassName("VideoCard")[0]?.clientWidth;
    if (cardWidth) {
      setHeight((cardWidth * 9 / 16) + 175);
    }
  }, [modify, width]);

  return (
    <>
      <Card
        className={'VideoCard'}
        sx={{
          cursor: 'pointer',
          boxShadow: 'none',
          borderRadius: '15px',
          height,
        }}
        onClick={() => !modify && navigate(`/videos/${video.id}`)}
      >
        <div className={'VideoCard__CardActionArea'} style={{ height: '100%' }}>
          <CardMedia
            component={"img"}
            image={`https://udatube-thumbnails-dev.s3.amazonaws.com/${video.id}.png`}
            alt={video.title}
            sx={{ width: '100%', aspectRatio: '16/9', borderRadius: '15px' }}
            onClick={() => modify && navigate(`/videos/${video.id}`)}
          />
          <CardHeader
            onClick={() => modify && navigate(`/videos/${video.id}`)}
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
    {
      modify &&
      <Grid container justifyContent={'center'} spacing={1}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={'contained'}
            color={'error'}
            onClick={() => navigate(`/edit-video/${video.id}`)}
          >edit</Button>
        </Grid>
        <Grid item xs={6}>
          <Button fullWidth variant={'outlined'} color={'error'} onClick={ () => setShowDeleteDialog(true) }>delete</Button>
        </Grid>
      </Grid>
    }
    <Dialog open={showDeleteDialog} onClose={videos.isRemoving ? () => {} : () => setShowDeleteDialog(false)}>
      <DialogTitle>
        Remove video {video.title}?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This video will be removed completely. There is no undo!!!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant={'outlined'}
          color={'error'}
          onClick={() => setShowDeleteDialog(false)}
          disabled={videos.isRemoving}
        >
          Disagree
        </Button>
        <Button
          variant={'contained'}
          color={'error'}
          onClick={() => {
            void deleteVideo(video.id, () => setShowDeleteDialog(false));
          }}
          autoFocus
          disabled={videos.isRemoving}
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  </>
  );
};

export default VideoCard;