import {Video} from "../@types/video";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {useNetwork} from "./Network.context";
import getVideoApi from "../apis/getVideo.api";
import {ErrorResponse, SuccessResponse} from "../utils/response.util";
import createVideoApi from "../apis/createVideo.api";
import getLinkToUploadThumbnailApi from "../apis/getLinkToUploadThumbnail.api";
import uploadThumbnailApi from "../apis/uploadThumbnail.api";
import getLinkToUploadVideoApi from "../apis/getLinkToUploadVideo.api";
import uploadVideoApi from "../apis/uploadVideo.api";

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
          videoFile: action.payload?.file,
          videoUrl: action.payload?.url || '',
        }
      }
    case "updateThumbnail":
      return {
        ...state,
        videoModifier: {
          ...state.videoModifier,
          thumbnailFile: action.payload?.file,
          thumbnailUrl: action.payload?.url || '',
        },
      };
    case "clearModifier":
      return {
        ...state,
        video: null,
        errorNotFound: false,
        isFetchingVideo: false,
        videoModifier: {
          title: "",
          description: "",
          videoFile: null,
          videoUrl: "",
          thumbnailFile: null,
          thumbnailUrl: "",
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
    case "setNotFoundVideo":
      return {
        ...state,
        errorNotFound: action.payload,
      };
    case "setError":
      return {
        ...state,
        error: action.payload,
      };
    case "setIsUploading":
      return {
        ...state,
        isUploading: action.payload,
      };
    case "setMessage":
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
};

export type VideoState = {
  video: Video | null;
  isFetchingVideo: boolean;
  errorNotFound: boolean;
  error: string | null;
  isUploading: boolean;
  message: string | null;
  videoModifier: {
    title: string;
    description: string;
    videoFile: File | undefined | null;
    videoUrl: string;
    thumbnailFile: File | undefined | null;
    thumbnailUrl: string;
  };
};

export type VideoActionsMap = {
  updateTitle: string;
  updateDescription: string;
  updateVideoFile: { file: File | null; url: string; } | null;
  updateThumbnail: { file: File | null; url: string; } | null;
  clearModifier: any;
  setIsFetchingVideo: boolean;
  setVideo: Video | null;
  setNotFoundVideo: boolean;
  setError: string | null;
  setIsUploading: boolean;
  setMessage: string | null;
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
  errorNotFound: false,
  error: null,
  message: null,
  isUploading: false,
  videoModifier: {
    title: "",
    description: "",
    videoFile: null,
    videoUrl: "",
    thumbnailFile: null,
    thumbnailUrl: "",
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
        dispatch("updateThumbnail", {
          file: null,
          url: `https://udatube-thumbnails-dev.s3.amazonaws.com/${video.id}.png?${Date.now()}`,
        });
        dispatch("updateVideoFile", {
          file: null,
          url: `https://udatube-videos-dev.s3.amazonaws.com/${video.id}.mp4?${Date.now()}`,
        });
        dispatch("setIsFetchingVideo", false);
      }
      else if (response.statusCode === 404) {
        dispatch("setNotFoundVideo", true);
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
    try {
      const url = URL.createObjectURL(videoFile);
      dispatch("updateVideoFile", {
        file: videoFile,
        url,
      });
    }
    catch { /** ignored */ }
  }, [dispatch]);

  const updateThumbnailLocal = useCallback((thumbnail: File) => {
    try {
      const url = URL.createObjectURL(thumbnail);
      dispatch("updateThumbnail", {
        file: thumbnail,
        url,
      });
    }
    catch { /** ignored */ }
  }, [dispatch]);

  const clearVideoModifier = useCallback(() => {
    dispatch("clearModifier", undefined);
  }, [dispatch]);

  const createVideo = useCallback(async () => {
    if (isAuthenticated && network.isOnline) {
      if (!video.videoModifier.title.trim()) {
        return dispatch("setError", "Title is required");
      }
      if (!video.videoModifier.videoFile) {
        return dispatch("setError", "Video is required");
      }
      if (!video.videoModifier.thumbnailFile) {
        return dispatch("setError", "Thumbnail is required");
      }
      dispatch("setIsUploading", true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      let response = await createVideoApi(accessToken, video.videoModifier.title, video.videoModifier.description);
      if (response.statusCode !== 201) {
        dispatch("setError", (response as ErrorResponse).message);
        return dispatch("setIsUploading", false);
      }
      const newVideo = (response as SuccessResponse).data.video as Video;
      response = await getLinkToUploadThumbnailApi(accessToken, newVideo.id);
      if (response.statusCode !== 200) {
        dispatch("setError", (response as ErrorResponse).message);
        return dispatch("setIsUploading", false);
      }
      const linkToUploadThumbnail = (response as SuccessResponse).data.url as string;
      response = await uploadThumbnailApi(linkToUploadThumbnail, video.videoModifier.thumbnailFile);
      if (response.statusCode !== 200) {
        dispatch("setError", "error when uploading thumbnail");
        return dispatch("setIsUploading", false);
      }
      response = await getLinkToUploadVideoApi(accessToken, newVideo.id);
      if (response.statusCode !== 200) {
        dispatch("setError", (response as ErrorResponse).message);
        return dispatch("setIsUploading", false);
      }
      const linkToUploadVideo = (response as SuccessResponse).data.url as string;
      response = await uploadVideoApi(linkToUploadVideo, video.videoModifier.videoFile);
      if (response.statusCode !== 200) {
        dispatch("setError", "error when uploading video");
        return dispatch("setIsUploading", false);
      }
      dispatch("setIsUploading", false);
      dispatch("setMessage", "Video created successfully");
      const hideMessage = setTimeout(() => {
        dispatch("setMessage", null);
        clearTimeout(hideMessage);
      }, 5000);
    }
  }, [dispatch, getIdTokenClaims, isAuthenticated, network.isOnline, video.videoModifier.description, video.videoModifier.thumbnailFile, video.videoModifier.title, video.videoModifier.videoFile]);

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