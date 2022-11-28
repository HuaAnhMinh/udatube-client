import {Typography} from "@mui/material";
import { Avatar } from '@mui/material';
import { Comment } from '../../@types/comment';
import {useNavigate} from "react-router-dom";
import {useMyProfile} from "../../contexts/MyProfile.context";

const CommentCard = ({ comment }: { comment: Comment }) => {
  const navigate = useNavigate();
  const {myProfile} = useMyProfile();

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
      <Avatar
        sx={{ cursor: 'pointer', marginRight: '10px' }}
        src={`https://udatube-avatars-dev.s3.amazonaws.com/${comment.userId}.png`}
        onClick={() => navigate(`/users/${myProfile.user.id === comment.userId ? 'me' : comment.userId}`)}
      />
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant={'subtitle1'}
            component={'div'}
            sx={{ fontSize: '0.9em', fontWeight: 500, marginRight: '5px', cursor: 'pointer' }}
            onClick={() => navigate(`/users/${myProfile.user.id === comment.userId ? 'me' : comment.userId}`)}
          >
            {comment.username}
          </Typography>
          <Typography
            variant={'subtitle1'}
            component={'div'}
            sx={{ fontSize: '0.8em'}}
          >
            {(new Date(comment.createdAt)).toLocaleString()}
          </Typography>
        </div>
        <Typography>{comment.content}</Typography>
      </div>
    </div>
  );
};

export default CommentCard;