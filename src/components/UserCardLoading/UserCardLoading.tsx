import {Box, Button, Card, CardContent, Grid} from "@mui/material";

const UserCardLoading = () => {
  return (
    <Grid item xs={12} md={6} lg={4} xl={3} sx={{ padding: '2px' }}>
      <Card sx={{ display: 'flex', padding: '20px', cursor: 'pointer' }}>
        <Box sx={{
          width: '150px',
          height: '150px',
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