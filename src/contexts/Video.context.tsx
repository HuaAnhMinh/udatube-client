import {Video} from "../@types/video";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {useNetwork} from "./Network.context";
import getVideoApi from "../apis/getVideo.api";
import {SuccessResponse} from "../utils/response.util";

export const videoReducer = (state: VideoState, action: VideoAction): VideoState => {
  switch (action.type) {
    case "updateTitle":
      return {
        ...state,
        videoModifier: {
          ...state.videoModifier,
          title: action.payload,
        },
      };
    case "updateDescription":
      return {
        ...state,
        videoModifier: {
          ...state.videoModifier,
          description: action.payload,
        },
      };
    case "updateVideoFile":
      return {
        ...state,
        videoModifier: {
          ...state.videoModifier,
          videoFile: action.payload,
        }
      }
    case "updateThumbnail":
      return {
        ...state,
        videoModifier: {
          ...state.videoModifier,
          thumbnail: action.payload,
        },
      };
    case "clearModifier":
      return {
        ...state,
        videoModifier: {
          title: "",
          description: "",
          videoFile: null,
          thumbnail: null,
        },
      };
    case "setIsFetchingVideo":
      return {
        ...state,
        isFetchingVideo: action.payload,
      };
    case "setVideo":
      return {
        ...state,
        video: action.payload,
      };
    default:
      return state;
  }
};

export type VideoState = {
  video: Video | null;
  isFetchingVideo: boolean;
  videoModifier: {
    title: string;
    description?: string;
    videoFile: File | null;
    thumbnail: File | null;
  };
};

export type VideoActionsMap = {
  updateTitle: string;
  updateDescription: string;
  updateVideoFile: File;
  updateThumbnail: File;
  clearModifier: any;
  setIsFetchingVideo: boolean;
  setVideo: Video | null;
};

export type VideoAction = {
  [Key in keyof VideoActionsMap]: {
    type: Key;
    payload: VideoActionsMap[Key];
  }
}[keyof VideoActionsMap];

export type VideoDispatcher = <Type extends VideoAction['type'], Payload extends VideoActionsMap[Type]>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined] : [Payload]
) => void;

type VideoContextInterface = readonly [VideoState, VideoDispatcher];

const initialState: VideoState = {
  video: null,
  isFetchingVideo: false,
  videoModifier: {
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  },
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
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const { network } = useNetwork();
  
  const getVideo = useCallback(async (videoId: string) => {
    if (isAuthenticated && network.isOnline) {
      dispatch("setIsFetchingVideo", true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const response = await getVideoApi(accessToken, videoId);
      if (response.statusCode === 200) {
        const video = (response as SuccessResponse).data.video as Video;
        dispatch("updateTitle", video.title);
        dispatch("updateDescription", video.description);
        dispatch("setVideo", video);
        dispatch("setIsFetchingVideo", false);
      }
    }
  }, [dispatch, getIdTokenClaims, isAuthenticated, network.isOnline]);

  const updateTitleLocal = useCallback((title: string) => {
    dispatch("updateTitle", title);
  }, [dispatch]);

  const updateDescriptionLocal = useCallback((description: string) => {
    dispatch("updateDescription", description);
  }, [dispatch]);

  const updateVideoFileLocal = useCallback((videoFile: File) => {
    dispatch("updateVideoFile", videoFile);
  }, [dispatch]);

  const updateThumbnailLocal = useCallback((thumbnail: File) => {
    dispatch("updateThumbnail", thumbnail);
  }, [dispatch]);

  const clearVideoModifier = useCallback(() => {
    dispatch("clearModifier", undefined);
  }, [dispatch]);

  const createVideo = useCallback(async () => {

  }, []);

  const updateVideo = useCallback(async () => {

  }, []);

  return {
    video,
    getVideo,
    updateTitleLocal,
    updateDescriptionLocal,
    updateVideoFileLocal,
    updateThumbnailLocal,
    clearVideoModifier,
    createVideo,
    updateVideo,
  };
};