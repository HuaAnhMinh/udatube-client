import {ShortFormVideo} from "../@types/video";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";
import {useNetwork} from "./Network.context";
import getVideosApi from "../apis/getVideos.api";
import {SuccessResponse} from "../utils/response.util";
import {useError} from "./Error.context";

export const videosReducer = (state: VideosState, action: VideosAction): VideosState => {
  switch (action.type) {
    case "setVideos":
      return {
        ...state,
        videos: action.payload,
      };
    case "addVideos":
      return {
        ...state,
        videos: [...state.videos, ...action.payload],
      };
    case "setIsFetchingVideos":
      return {
        ...state,
        isFetchingVideos: action.payload,
      };
    case "setError":
      return {
        ...state,
        error: action.payload,
      };
    case "setNextKey":
      return {
        ...state,
        nextKey: action.payload,
      };
    default:
      return state;
  }
};

export type VideosState = {
  isFetchingVideos: boolean;
  videos: ShortFormVideo[];
  error: string | null;
  nextKey: string | null;
};

export type VideosActionsMap = {
  setVideos: ShortFormVideo[];
  addVideos: ShortFormVideo[];
  setIsFetchingVideos: boolean;
  setError: string | null;
  setNextKey: string | null;
};

export type VideosAction = {
  [Key in keyof VideosActionsMap]: {
    type: Key;
    payload: VideosActionsMap[Key];
  };
}[keyof VideosActionsMap];

export type VideosDispatcher = <Type extends VideosAction['type'], Payload extends VideosActionsMap[Type]>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined] : [Payload]
) => void;

type VideosContextInterface = readonly [VideosState, VideosDispatcher];

const initialState: VideosState = {
  videos: [],
  isFetchingVideos: false,
  error: null,
  nextKey: null,
};

export const VideosContext = createContext<VideosContextInterface>([initialState, () => {}]);

export const VideosProvider = ({children}: {children: ReactNode}) => {
  const [state, _dispatch] = useReducer(videosReducer, initialState);

  const dispatch: VideosDispatcher = useCallback((type, ...payload) => {
    _dispatch({type, payload: payload[0]} as VideosAction);
  }, []);

  return (
    <VideosContext.Provider value={[state, dispatch]}>
      {children}
    </VideosContext.Provider>
  );
};

export const useVideos = () => {
  const [videos, dispatch] = useContext(VideosContext);
  const {network} = useNetwork();
  const {setError} = useError();

  const getVideos = useCallback(async (
    userId: string,
    title: string,
    fetchFromStart: boolean,
    exclusiveVideoId?: string,
  ) => {
    dispatch('setIsFetchingVideos', true);
    if (network.isOnline) {
      let actionType: 'setVideos' | 'addVideos';
      if (fetchFromStart) {
        actionType = 'setVideos';
        dispatch(actionType, []);
        dispatch('setNextKey', null);
      }
      else {
        actionType = 'addVideos';
      }
      
      const response = await getVideosApi(userId, title, 32, videos.nextKey);
      if (response.statusCode === 200) {
        const data = (response as SuccessResponse).data;
        let videos: ShortFormVideo[] = data.videos.filter((video: ShortFormVideo) => video.id !== exclusiveVideoId);
        dispatch(actionType, videos);
        dispatch('setNextKey', data.nextKey);
      }
      else {
        setError(500, 'Internal Server Error');
      }
    }
    dispatch('setIsFetchingVideos', false);
  }, [dispatch, network.isOnline, setError, videos.nextKey]);

  return {
    videos,
    getVideos,
  };
};