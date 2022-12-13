import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";
import {useVideo} from "./Video.context";
import {useNetwork} from "./Network.context";
import createCommentApi from "../apis/createComment.api";
import {useAuth0} from "@auth0/auth0-react";
import {SuccessResponse} from "../utils/response.util";
import getCommentsApi from "../apis/getComments.api";
import {Comment} from '../@types/comment';

export const commentsReducer = (comments: CommentsState, action: CommentsAction) => {
  switch (action.type) {
    case "setContent":
      return {
        ...comments,
        content: action.payload,
      };
    case "setIsFetchingComments":
      return {
        ...comments,
        isFetchingComments: action.payload,
      };
    case "setIsModifyingComment":
      return {
        ...comments,
        isModifyingComment: action.payload,
      };
    case "setComments":
      return {
        ...comments,
        comments: action.payload,
      };
    case "addComments":
      return {
        ...comments,
        comments: [action.payload, ...comments.comments],
      };
    case "setNextKey":
      return {
        ...comments,
        nextKey: action.payload,
      };
    default:
      return comments;
  }
};

export type CommentsState = {
  isFetchingComments: boolean;
  isModifyingComment: boolean;
  comments: Comment[];
  content: string;
  nextKey: string | null;
};

export type CommentsActionsMap = {
  setContent: string;
  setIsFetchingComments: boolean;
  setIsModifyingComment: boolean;
  setComments: Comment[];
  addComments: Comment;
  setNextKey: string | null;
};

export type CommentsAction = {
  [Key in keyof CommentsActionsMap]: {
    type: Key;
    payload: CommentsActionsMap[Key];
  };
}[keyof CommentsActionsMap];

export type CommentsDispatcher = <Type extends CommentsAction['type'], Payload extends CommentsActionsMap[Type]>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined] : [Payload]
) => void;

type CommentsContextInterface = readonly [CommentsState, CommentsDispatcher];

const initialState: CommentsState = {
  isFetchingComments: true,
  isModifyingComment: false,
  comments: [],
  content: '',
  nextKey: null,
};

export const CommentsContext = createContext<CommentsContextInterface>([initialState, () => {}]);

export const CommentsProvider = ({ children }: { children: ReactNode }) => {
  const [state, _dispatch] = useReducer(commentsReducer, initialState);

  const dispatch: CommentsDispatcher = useCallback((type, ...payload) => {
    _dispatch({ type, payload: payload[0] } as CommentsAction);
  }, []);

  return (
    <CommentsContext.Provider value={[state, dispatch]}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const [comments, dispatch] = useContext(CommentsContext);
  const {video} = useVideo();
  const {network} = useNetwork();
  const {getIdTokenClaims} = useAuth0();
  
  const clearAllComments = useCallback(() => {
    dispatch('setComments', []);
    dispatch('setNextKey', null);
  }, [dispatch]);

  const changeCommentContent = useCallback((content: string) => {
    dispatch('setContent', content);
  }, [dispatch]);

  const createComment = useCallback(async () => {
    if (network.isOnline && comments.content.trim()) {
      dispatch("setIsModifyingComment", true);
      const videoId = video.video?.id;
      if (!videoId) {
        return dispatch("setIsModifyingComment", false);
      }
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const response = await createCommentApi(accessToken, videoId, comments.content.trim());
      if (response.statusCode === 201) {
        dispatch('addComments', (response as SuccessResponse).data.comment);
        dispatch('setContent', '');
      }
      dispatch("setIsModifyingComment", false);
    }
  }, [comments.content, dispatch, getIdTokenClaims, network.isOnline, video.video?.id]);

  const getComments = useCallback(async (fetchFromStart: boolean) => {
    if (network.isOnline && video.video?.id) {
      dispatch('setIsFetchingComments', true);
      let actionType: 'setComments' | 'addComments';
      if (fetchFromStart) {
        actionType = 'setComments';
      }
      else {
        actionType = 'addComments';
      }
      const response = await getCommentsApi(video.video.id, 8, comments.nextKey);
      if (response.statusCode === 200) {
        dispatch(actionType, (response as SuccessResponse).data.comments);
        dispatch('setNextKey', (response as SuccessResponse).data.nextKey);
      }
      dispatch('setIsFetchingComments', false);
    }
  }, [comments.nextKey, dispatch, network.isOnline, video.video?.id]);

  return {
    comments,
    changeCommentContent,
    createComment,
    getComments,
    clearAllComments,
  };
};