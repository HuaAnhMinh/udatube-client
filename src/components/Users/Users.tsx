import {useCallback, useEffect} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {useUsers} from "../../contexts/Users.context";
import {useLocation} from "react-router-dom";
import {Grid} from "@mui/material";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import UserCard from "../UserCard/UserCard";
import UserCardLoading from "../UserCardLoading/UserCardLoading";

const Users = () => {
  const { users, fetchUsers } = useUsers();
  const location = useLocation();
  const { height } = useWindowDimensions();

  useEffect(() => {
    void fetchUsers(location.search.split('?username=')[1], true);
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const scroll = document.getElementById('scroll');
    if (scroll && scroll.clientHeight < height && users.nextKey) {
      void fetchUsers(location.search.split('?username=')[1], false);
    }
  }, [height]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollRef = useCallback((node: HTMLDivElement) => {
    if (node && node.clientHeight < height && users.nextKey) {
      void fetchUsers(location.search.split('?username=')[1], false);
    }
  }, [fetchUsers, height, location.search, users.nextKey]);

  return (
    <>
      <div id={"scroll"} ref={scrollRef}>
        <InfiniteScroll
          dataLength={users.users.length}
          next={() => fetchUsers(location.search.split('?username=')[1], false)}
          hasMore={!!users.nextKey}
          loader={<></>}
        >
          <Grid container spacing={4} alignItems={'center'} sx={{ padding: '2px' }}>
            {
              users.users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))
            }
          </Grid>
        </InfiniteScroll>
      </div>
      {
        users.isFetching &&
        <Grid container spacing={4} alignItems={'center'} sx={{ padding: '2px' }}>
          <UserCardLoading />
          <UserCardLoading />
          <UserCardLoading />
          <UserCardLoading />
        </Grid>
      }
    </>
  );
};

export default Users;