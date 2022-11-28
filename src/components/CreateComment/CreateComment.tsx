import {useAuth0} from "@auth0/auth0-react";
import {Avatar, IconButton, TextField, Typography} from "@mui/material";
import {useMyProfile} from "../../contexts/MyProfile.context";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from '@mui/icons-material/Send';
import {useState} from "react";
import {useComments} from "../../contexts/Comments.context";

const CreateComment = () => {
  const { isLoading, isAuthenticated } = useAuth0();
  const { myProfile } = useMyProfile();
  const { comments, changeCommentContent, createComment } = useComments();
  const [showCommentButton, setShowCommentButton] = useState(false);

  if (!isAuthenticated) {
    return <Typography sx={{ margin: '20px 0' }}>You must login first to comment this video</Typography>
  }

  if (isLoading) {
    return <CircularProgress sx={{ margin: '20px 0' }} color={'error'} />;
  }

  return (
    <div style={{ display: 'flex', marginTop: '20px', marginBottom: '30px', alignItems: 'center' }}>
      <Avatar src={`https://udatube-avatars-dev.s3.amazonaws.com/${myProfile.user.id}.png`} />
      <div style={{ flexGrow: 1, paddingLeft: '10px', display: 'flex' }}>
        <TextField
          rows={5}
          variant={'standard'}
          fullWidth
          label={'Add a comment'}
          onFocus={() => setShowCommentButton(true)}
          value={comments.content}
          onChange={(e) => changeCommentContent(e.target.value)}
        />
        {
          showCommentButton && !comments.isModifyingComment &&
          <IconButton onClick={createComment} disabled={comments.isModifyingComment}>
            <SendIcon color={'error'} />
          </IconButton>
        }
        {
          comments.isModifyingComment &&
          <CircularProgress color={'error'} />
        }
      </div>
    </div>
  );
};

export default CreateComment;