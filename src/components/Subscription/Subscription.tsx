import {Typography} from "@mui/material";
import {useMyProfile} from "../../contexts/MyProfile.context";
import {useEffect} from "react";

const Subscription = () => {
  const { myProfile, fetchSubscribedChannels } = useMyProfile();

  useEffect(() => {
    void fetchSubscribedChannels();
  }, [fetchSubscribedChannels]);

  return (
    <div className={'Subscription'}>
      <Typography component={'h1'} variant={'h4'} sx={{ pt: '10px' }}>My subscribe channels</Typography>
      <div>

      </div>
    </div>
  );
};

export default Subscription;