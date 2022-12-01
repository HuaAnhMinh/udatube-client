import {useVideos} from "../../contexts/Videos.context";
import {Grid} from "@mui/material";
import VideoCardLoading from "../VideoCardLoading/VideoCardLoading";
import {ReactNode, useEffect} from "react";
import VideoCard from "../VideoCard/VideoCard";
import InfiniteScroll from "react-infinite-scroll-component";
import useWindowDimensions from "../../utils/useWindowDimensions.config";

const MyGridSmall = ({ children }: { children: ReactNode }) => (
  <Grid item xs={60} >
    {children}
  </Grid>
)

const MyGridFull = ({ children }: { children: ReactNode }) => (
  <Grid item xs={60} sm={30} md={20} lg={15} xl={12} sx={{ padding: '2px' }}>
    {children}
  </Grid>
);

const VideosByUserId = ({ singleCol, userId, modify, exclusiveVideoId }: {
  singleCol?: boolean,
  userId: string,
  modify?: boolean,
  exclusiveVideoId?: string
}) => {
  const { videos, getVideos } = useVideos();
  const { height } = useWindowDimensions();

  useEffect(() => {
    void getVideos(userId, '', true, exclusiveVideoId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const scroll = document.getElementById('scroll-videos-userId');
    if (scroll && scroll.clientHeight < height && videos.nextKey) {
      void getVideos(userId, '', false, exclusiveVideoId);
    }
  }, [height, videos.nextKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div id={"scroll-videos-userId"}>
        <InfiniteScroll
          next={() => getVideos(userId, '', false, exclusiveVideoId)}
          hasMore={!!videos.nextKey}
          loader={<></>}
          dataLength={videos.videos.length}
        >
          <Grid container spacing={2} columns={60} alignItems={'center'} sx={{ padding: '2px' }}>
            {
              videos.videos.map((video) => {
                if (singleCol) {
                  return (
                    <MyGridSmall key={video.id}>
                      <VideoCard video={video} modify={modify} />
                    </MyGridSmall>
                  )
                }

                return (
                  <MyGridFull key={video.id}>
                    <VideoCard video={video} modify={modify} />
                  </MyGridFull>
                );
              })
            }
          </Grid>
        </InfiniteScroll>
      </div>
      {
        videos.isFetchingVideos &&
        <Grid container spacing={2} columns={60} alignItems={'center'} sx={{padding: '2px'}}>
          {
            [0, 1, 2, 3, 4].map((i) => {
              if (singleCol) {
                return (
                  <MyGridSmall key={i}>
                    <VideoCardLoading />
                  </MyGridSmall>
                );
              }

              return (
                <MyGridFull key={i}>
                  <VideoCardLoading />
                </MyGridFull>
              );
            })
          }
        </Grid>
      }
    </>
  );
};

export default VideosByUserId;