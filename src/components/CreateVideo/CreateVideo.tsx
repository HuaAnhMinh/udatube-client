import {Button, Grid, TextField} from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {useNavigate} from "react-router-dom";
import {useVideo} from "../../contexts/Video.context";

const CreateVideo = () => {
  const navigate = useNavigate();
  const { video, updateTitleLocal, updateDescriptionLocal, updateVideoFileLocal } = useVideo();

  return (
    <div>
      {
        video.videoModifier.videoFile &&
        <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
          <Grid item xs={12} md={6}>
            <video src={URL.createObjectURL(video.videoModifier.videoFile)} controls style={{ width: '100%' }} />
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
          <Button variant={'contained'} color={'error'} fullWidth sx={{ p: '8px 0' }}>Create video</Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button variant={'outlined'} fullWidth sx={{ p: '8px 0' }} onClick={() => navigate(-1)}>Cancel</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateVideo;