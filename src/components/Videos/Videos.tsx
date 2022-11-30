import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useVideos} from "../../contexts/Videos.context";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import InfiniteScroll from "react-infinite-scroll-component";
import {Grid} from "@mui/material";
import VideoCard from "../VideoCard/VideoCard";
import VideoCardLoading from "../VideoCardLoading/VideoCardLoading";

const Videos = () => {
  const location = useLocation();
  const {videos, getVideos} = useVideos();
  const { height } = useWindowDimensions();
  
  useEffect(() => {
    const title = location.search.split('?title=')[1] || '';
    void getVideos('', title, true);
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const scroll = document.getElementById('scroll-videos');
    if (scroll && scroll.clientHeight < height && videos.nextKey) {
      void getVideos('', location.search.split('?title=')[1] || '', false);
    }
  }, [height, videos.nextKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div id={"scroll-videos"}>
        <InfiniteScroll
          next={() => getVideos('', location.search.split('?title=')[1] || '', false)}
          hasMore={!!videos.nextKey}
          loader={<></>}
          dataLength={videos.videos.length}
        >
          <Grid container spacing={2} columns={60} alignItems={'center'} sx={{ padding: '2px' }}>
            {
              videos.videos.map((video) => (
                <Grid key={video.id} item xs={60} sm={30} md={20} lg={15} xl={12} sx={{ padding: '2px' }}>
                  <VideoCard video={video} />
                </Grid>
              ))
            }
          </Grid>
        </InfiniteScroll>
      </div>
      {
        videos.isFetchingVideos &&
        <Grid container spacing={2} columns={60} alignItems={'center'} sx={{ padding: '2px' }}>
          {
            [0, 1, 2, 3, 4].map((i) => (
              <Grid key={i} item xs={60} sm={30} md={20} lg={15} xl={12} sx={{ padding: '2px' }}>
                <VideoCardLoading />
              </Grid>
            ))
          }
        </Grid>
      }
    </>
  );
};

export default Videos;