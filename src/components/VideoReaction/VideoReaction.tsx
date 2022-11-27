import {Button, Menu, Tooltip, Typography} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import {useAuth0} from "@auth0/auth0-react";
import {MouseEvent, useState} from "react";
import { useVideo } from "../../contexts/Video.context";
import { useMyProfile } from "../../contexts/MyProfile.context";
import CircularProgress from "@mui/material/CircularProgress";

const VideoReaction = () => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const { video, likeVideo, dislikeVideo, unlikeVideo, undislikeVideo } = useVideo();
  const { myProfile } = useMyProfile();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const likeButtonHandler = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isAuthenticated) {
      handleClick(event);
    }
    else if (!video.video!!.likes.includes(myProfile.user.id)) {
      void likeVideo();
    }
    else {
      void unlikeVideo();
    }
  };

  const dislikeButtonHandler = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isAuthenticated) {
      handleClick(event);
    }
    else if (!video.video!!.dislikes.includes(myProfile.user.id)) {
      void dislikeVideo();
    }
    else {
      void undislikeVideo();
    }
  };

  if (isLoading || (isAuthenticated && !myProfile.user.id)) {
    return (
      <>
        <CircularProgress color={'error'} />
      </>
    );
  }

  return (
    <>
      <Tooltip title={isAuthenticated ? 'Like this video' : 'You must login first to like a video'} arrow>
        <Button disabled={video.isReacting} color={"error"} onClick={likeButtonHandler}>
          {video.video!!.likes.includes(myProfile.user.id) ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />} &nbsp; Like
        </Button>
      </Tooltip>

      <Tooltip title={isAuthenticated ? 'Dislike this video' : 'You must login first to dislike a video'} arrow>
        <Button disabled={video.isReacting} onClick={dislikeButtonHandler}>
          {video.video!!.dislikes.includes(myProfile.user.id) ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />} &nbsp; Dislike
        </Button>
      </Tooltip>

      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <div style={{ padding: '6px 16px' }}>
          <Typography sx={{ pb: '5px' }} component={"p"}>You must login first to like/dislike a video</Typography>
          <Button onClick={loginWithRedirect} variant={"contained"} color={"error"}>Login</Button>
        </div>
      </Menu>
    </>
  );
};

export default VideoReaction;