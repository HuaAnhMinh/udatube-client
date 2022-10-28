import {Typography} from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const Page500 = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Typography
        variant={'h1'}
        component={'h1'}
        sx={{ fontWeight: 500 }}
      >
        500 <SentimentVeryDissatisfiedIcon fontSize={'inherit'} />
      </Typography>
      <Typography
        variant={'h5'}
        component={'h2'}
      >
        Internal Server Error. Please try access again later.
      </Typography>
    </div>
  );
};

export default Page500;