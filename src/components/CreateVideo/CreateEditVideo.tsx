import {Button, Grid, TextField} from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {useLocation, useNavigate} from "react-router-dom";
import {useVideo} from "../../contexts/Video.context";
import {useEffect, useState} from "react";
import useWindowDimensions from "../../utils/useWindowDimensions.config";

const CreateEditVideo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {width} = useWindowDimensions();
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
  } = useVideo();
  const [mediaHeight, setMediaHeight] = useState(0);

  useEffect(() => {
    clearVideoModifier();
  }, [clearVideoModifier]);

  useEffect(() => {
    const videoId = location.pathname.split('/')[2];
    void getVideo(videoId);
  }, [getVideo, location.pathname]);

  useEffect(() => {
    const imageWidth = document.getElementById("create-video-component-width")?.clientWidth;
    if (imageWidth) {
      setMediaHeight((imageWidth * 47) / 84);
    }
  }, [width]);

  return (
    <div>
      {
        video.videoModifier.videoFile &&
        <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
          <Grid item xs={12} md={6}>
            <video src={URL.createObjectURL(video.videoModifier.videoFile)} controls style={{ width: '100%', height: `${mediaHeight}px` }} />
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
        video.videoModifier.thumbnail &&
        <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
          <Grid item xs={12} md={6}>
            <img
              alt={""}
              src={URL.createObjectURL(video.videoModifier.thumbnail)}
              width={"100%"}
              height={`${mediaHeight}px`}
            />
          </Grid>
        </Grid>
      }

      <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
        <Grid item xs={12} md={6} id={"create-video-component-width"}>
          <Button
            variant={'outlined'}
            color={'error'}
            fullWidth sx={{ p: '8px 0' }}
            onClick={() => document.getElementById('thumbnail-upload-input')?.click()}
          >
            <FileUploadIcon /> &nbsp; Upload thumbnail (.png)
          </Button>
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
            value={video.videoModifier.title}
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
            value={video.videoModifier.description}
            onChange={(e) => updateDescriptionLocal(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }} spacing={1}>
        <Grid item xs={6} md={3}>
          <Button
            variant={'contained'}
            color={'error'}
            fullWidth
            sx={{ p: '8px 0' }}
            onClick={location.pathname === 'create-video' ? createVideo : updateVideo}
          >
            Create video
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button variant={'outlined'} fullWidth sx={{ p: '8px 0' }} onClick={() => navigate(-1)}>Cancel</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateEditVideo;