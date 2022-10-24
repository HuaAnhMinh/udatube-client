import {Box, Typography} from "@mui/material";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import {Link} from "react-router-dom";

const Logo = () => {
  return (
    <Link className={"Link"} to={'/'}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <SmartDisplayIcon sx={{ color: '#FF0000', mr: 1, my: 0.5 }} fontSize="large" />
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          UdaTube
        </Typography>
      </Box>
    </Link>
  );
};

export default Logo;