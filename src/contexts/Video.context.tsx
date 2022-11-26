import {Video} from "../@types/video";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";
import {useNetwork} from "./Network.context";
import getVideoApi from "../apis/getVideo.api";
import {SuccessResponse} from "../utils/response.util";
import {useMyProfile} from "./MyProfile.context";
import likeVideoApi from "../apis/likeVideo.api";
import {useAuth0} from "@auth0/auth0-react";
import dislikeVideoApi from "../apis/dislikeVideo.api";
import unlikeVideoApi from "../apis/unlikeVideo.api";
import undislikeVideoApi from "../apis/undislikeVideo.api";

export const videoReducer = (video: VideoState, action: VideoAction) => {
  switch (action.type) {
    case "setVideo":
      return {
        ...video,
        video: action.payload,
      };
    case "setIsFetchingVideo":
      return {
        ...video,
        isFetchingVideo: action.payload,
      };
    case "setErrorNotFound":
      return {
        ...video,
        errorNotFound: action.payload,
      };
    case "clearVideo":
      return {
        ...initialState,
      };
    case "likeVideo":
      if (video.video) {
        return {
          ...video,
          video: {
            ...video.video,
            likes: [...video.video.likes, action.payload]
          },
        };
      }

      return video;
    case "dislikeVideo":
      if (video.video) {
        return {
          ...video,
          video: {
            ...video.video,
            dislikes: [...video.video.dislikes, action.payload],
          },
        };
      }

      return video;
    case "unlikeVideo":
      if (video.video) {
        return {
          ...video,
          video: {
            ...video.video,
            likes: video.video.likes.filter((like) => like !== action.payload),
          },
        };
      }

      return video;
    case "undislikeVideo":
      if (video.video) {
        return {
          ...video,
          video: {
            ...video.video,
            dislikes: video.video.dislikes.filter((dislike) => dislike !== action.payload),
          },
        };
      }

      return video;
    case "setIsReacting":
      return {
        ...video,
        isReacting: action.payload,
      };
    default:
      return video;
  }
};

export type VideoState = {
  video: Video | null;
  isFetchingVideo: boolean;
  errorNotFound: boolean;
  isReacting: boolean;
};

export type VideoActionsMap = {
  setVideo: Video | null;
  setIsFetchingVideo: boolean;
  setErrorNotFound: boolean;
  clearVideo: any;
  likeVideo: string;
  dislikeVideo: string;
  unlikeVideo: string;
  undislikeVideo: string;
  setIsReacting: boolean;
};

export type VideoAction = {
  [Key in keyof VideoActionsMap]: {
    type: Key;
    payload: VideoActionsMap[Key];
  };
}[keyof VideoActionsMap];

export type VideoDispatcher = <Type extends VideoAction['type'], Payload extends VideoActionsMap[Type]>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined] : [Payload]
) => void;

type VideoContextInterface = readonly [VideoState, VideoDispatcher];

const initialState: VideoState = {
  video: null,
  isFetchingVideo: true,
  errorNotFound: false,
  isReacting: false,
};

export const VideoContext = createContext<VideoContextInterface>([initialState, () => {}]);

export const VideoProvider = ({children}: {children: ReactNode}) => {
  const [state, _dispatch] = useReducer(videoReducer, initialState);

  const dispatch: VideoDispatcher = useCallback((type, ...payload) => {
    _dispatch({ type, payload: payload[0] } as VideoAction);
  }, []);

  return (
    <VideoContext.Provider value={[state, dispatch]}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const [video, dispatch] = useContext(VideoContext);
  const {network} = useNetwork();
  const {myProfile} = useMyProfile();
  const {getIdTokenClaims} = useAuth0();

  const fetchVideo = useCallback(async (videoId: string) => {
    dispatch('setIsFetchingVideo', true);
    dispatch('setErrorNotFound', false);
    if (network.isOnline) {
      const response = await getVideoApi(videoId);
      if (response.statusCode === 200) {
        dispatch('setVideo', (response as SuccessResponse).data.video as Video);
      }
      if (response.statusCode === 404) {
        dispatch('setErrorNotFound', true);
      }
    }
    dispatch('setIsFetchingVideo', false);
  }, [dispatch, network.isOnline]);

  const clearVideo = useCallback(() => {
    dispatch('clearVideo', undefined);
  }, [dispatch]);

  const likeVideo = useCallback(async () => {
    if (network.isOnline) {
      dispatch('setIsReacting', true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const response = await likeVideoApi(accessToken, video.video!!.id);
      if (response.statusCode === 200) {
        dispatch('likeVideo', myProfile.user.id);
        dispatch('undislikeVideo', myProfile.user.id);
      }
      dispatch('setIsReacting', false);
    }
  }, [dispatch, getIdTokenClaims, myProfile.user.id, network.isOnline, video.video]);
  
  const unlikeVideo = useCallback(async () => {
    if (network.isOnline) {
      dispatch('setIsReacting', true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const response = await unlikeVideoApi(accessToken, video.video!!.id);
      if (response.statusCode === 200) {
        dispatch('unlikeVideo', myProfile.user.id);
      }
      dispatch('setIsReacting', false);
    }
  }, [dispatch, getIdTokenClaims, myProfile.user.id, network.isOnline, video.video]);

  const dislikeVideo = useCallback(async () => {
    if (network.isOnline) {
      dispatch('setIsReacting', true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const response = await dislikeVideoApi(accessToken, video.video!!.id);
      if (response.statusCode === 200) {
        dispatch('dislikeVideo', myProfile.user.id);
        dispatch('unlikeVideo', myProfile.user.id);
      }
      dispatch('setIsReacting', false);
    }
  }, [dispatch, getIdTokenClaims, myProfile.user.id, network.isOnline, video.video]);
  
  const undislikeVideo = useCallback(async () => {
    if (network.isOnline) {
      dispatch('setIsReacting', true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const response = await undislikeVideoApi(accessToken, video.video!!.id);
      if (response.statusCode === 200) {
        dispatch('undislikeVideo', myProfile.user.id);
      }
      dispatch('setIsReacting', false);
    }
  }, [dispatch, getIdTokenClaims, myProfile.user.id, network.isOnline, video.video]);

  return {
    video,
    fetchVideo,
    clearVideo,
    likeVideo,
    unlikeVideo,
    dislikeVideo,
    undislikeVideo,
  };
};