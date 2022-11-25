import {Video} from "../@types/video";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";
import {useNetwork} from "./Network.context";
import getVideoApi from "../apis/getVideo.api";
import {SuccessResponse} from "../utils/response.util";

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
    default:
      return video;
  }
};

export type VideoState = {
  video: Video | null;
  isFetchingVideo: boolean;
  errorNotFound: boolean;
};

export type VideoActionsMap = {
  setVideo: Video | null;
  setIsFetchingVideo: boolean;
  setErrorNotFound: boolean;
  clearVideo: any;
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
  
  return {
    video,
    fetchVideo,
    clearVideo,
  };
};