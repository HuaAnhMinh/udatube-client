import {Button, Grid, TextField} from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {useNavigate} from "react-router-dom";

const CreateVideo = () => {
  const navigate = useNavigate();

  return (
    <div>
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
          <input type={'file'} hidden id={'video-upload-input'} accept=".mp4" />
        </Grid>
      </Grid>

      <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
        <Grid item xs={12} md={6}>
          <TextField label={'Enter a title for this video'} fullWidth required />
        </Grid>
      </Grid>

      <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: '10px 0' }}>
        <Grid item xs={12} md={6}>
          <TextField label={'Enter description'} fullWidth multiline rows={8} />
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