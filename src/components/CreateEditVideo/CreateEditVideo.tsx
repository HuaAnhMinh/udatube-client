import {Alert, Button, Grid, Snackbar, TextField, Tooltip} from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {useLocation, useNavigate} from "react-router-dom";
import {useVideoModifier} from "../../contexts/VideoModifier.context";
import {useEffect, useState} from "react";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import CircularProgress from "@mui/material/CircularProgress";
import {useSize} from "../../contexts/Size.context";
import Page404 from "../Page404/Page404";
import ProgressBar from "../ProgressBar/ProgressBar";

const CreateEditVideo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {width} = useWindowDimensions();
  const {size} = useSize();
  const {
    video,
    getVideo,
    updateTitleLocal,
    updateDescriptionLocal,
    updateVideoFileLocal,
    updateThumbnailLocal,
    clearVideoModifier,
    createVideo,
    updateVideo,
  } = useVideoModifier();
  const [mediaHeight, setMediaHeight] = useState(0);

  useEffect(() => {
    clearVideoModifier(location.pathname !== '/create-video');
  }, [clearVideoModifier, location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/create-video') {
      const videoId = location.pathname.split('/')[2];
      void getVideo(videoId);
    }
  }, [getVideo, location.pathname]);

  useEffect(() => {
    if (!video.isFetchingVideo) {
      const imageWidth = document.getElementById("create-video-component-width")?.clientWidth;
      if (imageWidth) {
        setMediaHeight((imageWidth * 9) / 16);
      }
    }
  }, [width, video.isFetchingVideo]);

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
    <div>
      {
        video.videoUrl &&
        <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
          <Grid item xs={12} md={6} sx={{ border: '1px solid #eeeeee', height: `${mediaHeight}px`, borderRadius: '4px' }}>
            <video
              src={video.videoUrl}
              controls
              style={{ width: '100%', height: `${mediaHeight}px`, borderRadius: '4px' }}
            />
          </Grid>
        </Grid>
      }

      <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
        <Grid item xs={12} md={6}>
          <Button
            variant={'outlined'}
            color={'error'}
            fullWidth sx={{ p: '8px 0' }}
            onClick={() => document.getElementById('video-upload-input')?.click()}
          >
            <FileUploadIcon /> &nbsp; Upload video (.mp4)
          </Button>
          <input
            type={'file'}
            hidden
            id={'video-upload-input'}
            accept=".mp4"
            onChange={(e) => updateVideoFileLocal(e.target.files!![0])}
          />
        </Grid>
      </Grid>

      {
        video.thumbnailUrl &&
        <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
          <Grid item xs={12} md={6} sx={{ border: '1px solid #eeeeee', height: `${mediaHeight}px`, borderRadius: '4px' }}>
            <img
              alt={""}
              src={video.thumbnailUrl}
              width={"100%"}
              height={`${mediaHeight}px`}
              style={{ borderRadius: '4px' }}
            />
          </Grid>
        </Grid>
      }

      <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
        <Grid item xs={12} md={6} id={"create-video-component-width"}>
          <Tooltip title={'Thumbnail will be resized to 16:9 aspect ratio'} arrow>
            <Button
              variant={'outlined'}
              color={'error'}
              fullWidth sx={{ p: '8px 0' }}
              onClick={() => document.getElementById('thumbnail-upload-input')?.click()}
            >
              <FileUploadIcon /> &nbsp; Upload thumbnail (.png)
            </Button>
          </Tooltip>
          <input
            type={'file'}
            hidden
            id={'thumbnail-upload-input'}
            accept=".png"
            onChange={(e) => updateThumbnailLocal(e.target.files!![0])}
          />
        </Grid>
      </Grid>

      <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
        <Grid item xs={12} md={6}>
          <TextField
            label={'Enter a title for this video'}
            fullWidth
            required
            value={video.title}
            onChange={(e) => updateTitleLocal(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
        <Grid item xs={12} md={6}>
          <TextField
            label={'Enter description'}
            fullWidth
            multiline
            rows={8}
            value={video.description}
            onChange={(e) => updateDescriptionLocal(e.target.value)}
          />
        </Grid>
      </Grid>

      {
        video.isUploadingVideo &&
        <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
          <Grid item xs={12} md={6}>
            <ProgressBar value={video.uploadingProgress} label={'Uploading video...'} />
          </Grid>
        </Grid>
      }

      <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }} spacing={1}>
        <Grid item xs={6} md={3}>
          <Button
            variant={'contained'}
            color={'error'}
            fullWidth
            sx={{ p: '8px 0' }}
            onClick={location.pathname === '/create-video' ? createVideo : updateVideo}
            disabled={video.isUploading}
          >
            {location.pathname === '/create-video' ? 'CREATE VIDEO' : 'UPDATE VIDEO'} &nbsp; {video.isUploading && <CircularProgress size={size.loadingSizeSmall} />}
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button
            variant={'outlined'}
            fullWidth
            sx={{ p: '8px 0' }}
            onClick={() => navigate(-1)}
            disabled={video.isUploading}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={!!video.message}
      >
        <Alert severity={'success'}>{video.message}</Alert>
      </Snackbar>
      <Snackbar
        open={!!video.error}
      >
        <Alert severity={'error'}>{video.error}</Alert>
      </Snackbar>
    </div>
  );
};

export default CreateEditVideo;