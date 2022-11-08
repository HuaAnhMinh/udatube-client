import {Box, Button, Card, CardContent, Grid} from "@mui/material";
import {useSize} from "../../contexts/Size.context";

const UserCardLoading = () => {
  const { size } = useSize();

  return (
    <Grid item xs={12} md={6} xl={4} sx={{ padding: '2px' }}>
      <Card sx={{ display: 'flex', padding: '20px', cursor: 'pointer', alignItems: 'center' }}>
        <Box sx={{
          width: size.loadingSizeLarge,
          height: size.loadingSizeLarge,
          borderRadius: '50%',
          backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)'
        }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, pr: '15px' }}>
          <CardContent sx={{ flex: '1 0 auto', width: '100%' }}>
            <Box
              sx={{
                backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)',
                height: '100%',
                width: '100%'
              }}
            />
          </CardContent>
          <Box sx={{ pl: '16px', pb: 1 }}>
            <Button variant={"outlined"} disabled>
              Loading...
            </Button>
          </Box>
        </Box>
      </Card>
    </Grid>
  );
};

export default UserCardLoading;