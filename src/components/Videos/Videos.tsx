import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useVideos} from "../../contexts/Videos.context";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import InfiniteScroll from "react-infinite-scroll-component";
import {Grid} from "@mui/material";
import VideoCard from "../VideoCard/VideoCard";

const Videos = () => {
  const location = useLocation();
  const {videos, getVideos} = useVideos();
  const { height } = useWindowDimensions();
  
  useEffect(() => {
    const title = location.search.split('?title=')[1] || '';
    void getVideos(title, true);
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const scroll = document.getElementById('scroll-videos');
    if (scroll && scroll.clientHeight < height && videos.nextKey) {
      void getVideos(location.search.split('?title=')[1] || '', false);
    }
  }, [height, videos.nextKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div id={"scroll-videos"}>
        <InfiniteScroll
          next={() => getVideos(location.search.split('?title=')[1] || '', false)}
          hasMore={!!videos.nextKey}
          loader={<></>}
          dataLength={videos.videos.length}
        >
          <Grid container spacing={4} columns={24} alignItems={'center'} sx={{ padding: '2px' }}>
            {
              videos.videos.map((video) => (
                <Grid key={video.id} item xs={24} md={12} lg={6} sx={{ padding: '2px' }}>
                  <VideoCard video={video} />
                </Grid>
              ))
            }
          </Grid>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default Videos;