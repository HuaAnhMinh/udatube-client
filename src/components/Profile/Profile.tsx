import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {useUser} from "../../contexts/User.context";
import Page404 from "../Page404/Page404";
import './Profile.scss';
import {Grid} from "@mui/material";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";
import ProfileUsername from "../ProfileUsername/ProfileUsername";

const Profile = () => {
  const location = useLocation();
  const { user, fetchUser } = useUser();

  useEffect(() => {
    if (location.pathname.split('/')[2] !== 'me') {
      void fetchUser(location.pathname.split('/')[2]);
    }
  }, [fetchUser, location.pathname]);

  if (user.isFailed) {
    return <Page404 />
  }

  return (
    <div className={"Profile"}>
      <Grid container alignItems={"center"} justifyContent={"center"}>
        <Grid item xs={12} lg={6}>
          <Grid container direction={"column"} justifyContent={"center"} alignItems={"center"}>
            <ProfileAvatar />
            <ProfileUsername />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;