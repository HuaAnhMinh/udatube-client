import {useComments} from "../../contexts/Comments.context";
import {useEffect} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Grid} from "@mui/material";
import CommentCard from "../CommentCard/CommentCard";
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import CommentCardLoading from "../CommentCardLoading/CommentCardLoading";

const Comments = () => {
  const { getComments, comments } = useComments();
  const { height } = useWindowDimensions();

  useEffect(() => {
    void getComments(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    const scroll = document.getElementById('scroll-comments');
    if (scroll && scroll.clientHeight < height && comments.nextKey) {
      void getComments(false);
    }
  }, [comments.nextKey, height]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div id={'scroll-comments'}>
        <InfiniteScroll
          next={() => getComments(false)}
          hasMore={!!comments.nextKey}
          loader={<></>}
          dataLength={comments.comments.length}
        >
          <Grid container alignItems={'center'} sx={{ padding: '2px' }}>
            {
              comments.comments.map((comment) => (
                <Grid key={comment.id} item xs={12}>
                  <CommentCard comment={comment} />
                </Grid>
              ))
            }
          </Grid>
      </InfiniteScroll>
      </div>
      {
        comments.isFetchingComments &&
        <Grid container alignItems={'center'} sx={{ padding: '2px' }}>
          {
            [0, 1, 2, 3].map((i) => (
              <Grid key={i} item xs={12}>
                <CommentCardLoading />
              </Grid>
            ))
          }
        </Grid>
      }
    </>
  );
};

export default Comments;