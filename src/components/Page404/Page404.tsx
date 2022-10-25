import {Link} from "react-router-dom";
import {Typography} from "@mui/material";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import './Page404.scss';

const Page404 = () => {
  return (
    <div className={'Page404'}>
      <Typography
        variant={'h1'}
        component={'h1'}
        sx={{ fontWeight: 500 }}
      >
        404 <SentimentVeryDissatisfiedIcon fontSize={'inherit'} />
      </Typography>
      <Typography
        variant={'h5'}
        component={'h2'}
      >
        Oops! This is not the web page you are looking for.
      </Typography>
      <Typography
        variant={'h6'}
        component={'p'}
        sx={{ mt: '20px' }}
      >
        Back to <Link to={'/'}>Home</Link>
      </Typography>
    </div>
  );
};

export default Page404;