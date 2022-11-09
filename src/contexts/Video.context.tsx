import {Video} from "../@types/video";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";

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
    default:
      return state;
  }
};

export type VideoState = {
  video: Video | null;
  videoModifier: {
    title: string;
    description?: string;
    videoFile: File | null;
  };
};

export type VideoActionsMap = {
  updateTitle: string;
  updateDescription: string;
  updateVideoFile: File;
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
  videoModifier: {
    title: "",
    description: "",
    videoFile: null,
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

  const updateTitleLocal = useCallback((title: string) => {
    dispatch("updateTitle", title);
  }, [dispatch]);

  const updateDescriptionLocal = useCallback((description: string) => {
    dispatch("updateDescription", description);
  }, [dispatch]);

  const updateVideoFileLocal = useCallback((videoFile: File) => {
    dispatch("updateVideoFile", videoFile);
  }, [dispatch]);

  return {
    video,
    updateTitleLocal,
    updateDescriptionLocal,
    updateVideoFileLocal,
  };
};