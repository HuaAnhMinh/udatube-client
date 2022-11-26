import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Grid,
  Tooltip,
  Typography
} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useVideo} from "../../contexts/Video.context";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useSize} from "../../contexts/Size.context";
import Page404 from "../Page404/Page404";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import VideoReaction from "../VideoReaction/VideoReaction";

const Video = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {size} = useSize();
  const {width} = useWindowDimensions();
  const {video, fetchVideo, clearVideo} = useVideo();

  useEffect(() => {
    const id = location.pathname.split('/')[2];
    console.log(id);
    void fetchVideo(id);
    return () => {
      clearVideo();
    };
  }, [clearVideo, fetchVideo, location.pathname]);

  if (video.isFetchingVideo) {
    return (
      <div style={{ textAlign: 'center' }}>
        <CircularProgress
          color={'error'}
          style={{
            width: size.loadingSizeLarge,
            height: size.loadingSizeLarge,
            borderRadius: '50%',
          }}
        />
      </div>
    );
  }

  if (video.errorNotFound) {
    return <Page404 />;
  }

  return (
    <Grid container spacing={2} alignItems={'flex-start'} sx={{ padding: '2px' }}>
      <Grid item xs={12} md={8} lg={9}>
        <div>
          <video
            controls src={`https://udatube-videos-dev.s3.amazonaws.com/${video.video!!.id}.mp4`}
            style={{ maxWidth: '100%', width: '100%', borderRadius: '4px' }}
          />
        </div>
        <div>
          <Typography
            variant={'h5'}
            sx={{ fontWeight: 500 }}
            gutterBottom
          >
            {video.video!!.title}
          </Typography>
        </div>
        <Grid container sx={{ justifyContent: 'space-between' }}>
          <Grid item xs={12} md={9} sx={{ padding: '5px 0' }}>
            <Grid container sx={{ alignItems: 'center' }}>
              <Avatar
                src={`https://udatube-avatars-dev.s3.amazonaws.com/${video.video!!.userId}.png?${Date.now()}`}
                alt={video.video!!.username}
                sx={{ width: 50, height: 50, cursor: 'pointer' }}
                onClick={() => navigate(`/user/${video.video!!.userId}`)}
              />
              <Tooltip title={video.video!!.username} arrow>
                <Typography
                  sx={{ paddingLeft: '10px', fontWeight: 500, cursor: 'pointer' }}
                  component={'div'}
                  onClick={() => navigate(`/users/${video.video!!.userId}`)}
                >
                  {video.video!!.username}
                </Typography>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid item xs={12} md={3} sx={{ padding: '5px 0'}}>
            <Grid container sx={{ justifyContent: width >= size.width.md ? 'flex-end' : 'flex-start' }}>
              <VideoReaction />
            </Grid>
          </Grid>
        </Grid>
        <Accordion
          sx={{ marginTop: '10px' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography
              sx={{ fontWeight: 500 }}
            >
              {video.video!!.totalViews} views {video.video!!.likes.length} likes {video.video!!.dislikes.length} dislikes
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{video.video!!.description}</Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Typography variant={'h6'} component={'div'}>Other videos of {video.video!!.username}</Typography>
      </Grid>
    </Grid>
  );
};

export default Video;