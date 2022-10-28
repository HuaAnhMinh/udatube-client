import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {useUser} from "../../contexts/User.context";
import Page404 from "../Page404/Page404";

const Profile = () => {
  const location = useLocation();
  const { user, fetchUser } = useUser();

  useEffect(() => {
    if (location.pathname !== '/users/me') {
      void fetchUser(location.pathname.split('/')[2]);
    }
  }, [fetchUser, location.pathname]);

  if (user.isFetching) {
    return <div>Loading...</div>;
  }

  if (user.isFailed) {
    return <Page404 />
  }

  return (
    <div>
      <div>Avatar</div>
      <div>{user.user.username}</div>
      <div>Subscribe channels</div>
    </div>
  );
};

export default Profile;