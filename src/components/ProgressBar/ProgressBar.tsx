import {Box, LinearProgress, LinearProgressProps, Typography} from "@mui/material";

const ProgressBar = (props: LinearProgressProps & { value: number, label?: string }) => {
  return (
    <>
      <Typography variant="body2">{props.label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} color={'error'} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    </>
  );
};

export default ProgressBar;