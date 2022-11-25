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
import updateVideoApi from "../apis/updateVideo.api";
import {useMyProfile} from "./MyProfile.context";

export const videoModifierReducer = (state: VideoModifierState, action: VideoModifierAction): VideoModifierState => {
  switch (action.type) {
    case "updateTitle":
      return {
        ...state,
        title: action.payload,
      };
    case "updateDescription":
      return {
        ...state,
        description: action.payload,
      };
    case "updateVideoFile":
      return {
        ...state,
        videoFile: action.payload?.file,
        videoUrl: action.payload?.url || '',
      }
    case "updateThumbnail":
      return {
        ...state,
        thumbnailFile: action.payload?.file,
        thumbnailUrl: action.payload?.url || '',
      };
    case "clearModifier":
      return {
        ...state,
        error: '',
        message: '',
        errorNotFound: false,
        isFetchingVideo: action.payload,
        title: "",
        description: "",
        videoFile: null,
        videoUrl: "",
        thumbnailFile: null,
        thumbnailUrl: "",
      };
    case "setIsFetchingVideo":
      return {
        ...state,
        isFetchingVideo: action.payload,
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
    case "setOriginalTitle":
      return {
        ...state,
        originalTitle: action.payload,
      };
    case "setOriginalDescription":
      return {
        ...state,
        originalDescription: action.payload,
      };
    case "setVideoId":
      return {
        ...state,
        id: action.payload,
      };
    default:
      return state;
  }
};

export type VideoModifierState = {
  isFetchingVideo: boolean;
  errorNotFound: boolean;
  error: string | null;
  isUploading: boolean;
  message: string | null;
  id: string;
  title: string;
  description: string;
  videoFile: File | undefined | null;
  videoUrl: string;
  thumbnailFile: File | undefined | null;
  thumbnailUrl: string;
  originalTitle: string;
  originalDescription: string;
};

export type VideoModifierActionsMap = {
  updateTitle: string;
  updateDescription: string;
  updateVideoFile: { file: File | null; url: string; } | null;
  updateThumbnail: { file: File | null; url: string; } | null;
  clearModifier: boolean;
  setIsFetchingVideo: boolean;
  setNotFoundVideo: boolean;
  setError: string | null;
  setIsUploading: boolean;
  setMessage: string | null;
  setVideoId: string;
  setOriginalTitle: string;
  setOriginalDescription: string;
};

export type VideoModifierAction = {
  [Key in keyof VideoModifierActionsMap]: {
    type: Key;
    payload: VideoModifierActionsMap[Key];
  }
}[keyof VideoModifierActionsMap];

export type VideoModifierDispatcher = <Type extends VideoModifierAction['type'], Payload extends VideoModifierActionsMap[Type]>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined] : [Payload]
) => void;

type VideoModifierContextInterface = readonly [VideoModifierState, VideoModifierDispatcher];

const initialState: VideoModifierState = {
  isFetchingVideo: true,
  errorNotFound: false,
  error: null,
  message: null,
  isUploading: false,
  id: '',
  title: "",
  description: "",
  videoFile: null,
  videoUrl: "",
  thumbnailFile: null,
  thumbnailUrl: "",
  originalTitle: "",
  originalDescription: "",
};

export const VideoModifierContext = createContext<VideoModifierContextInterface>([initialState, () => {}]);

export const VideoModifierProvider = ({children}: {children: ReactNode}) => {
  const [state, _dispatch] = useReducer(videoModifierReducer, initialState);

  const dispatch: VideoModifierDispatcher = useCallback((type, ...payload) => {
    _dispatch({ type, payload: payload[0] } as VideoModifierAction);
  }, []);

  return (
    <VideoModifierContext.Provider value={[state, dispatch]}>
      {children}
    </VideoModifierContext.Provider>
  );
};

export const useVideoModifier = () => {
  const [video, dispatch] = useContext(VideoModifierContext);
  const { myProfile } = useMyProfile();
  const { getIdTokenClaims } = useAuth0();
  const { network } = useNetwork();
  
  const getVideo = useCallback(async (videoId: string) => {
    if (network.isOnline && myProfile.user.id) {
      const response = await getVideoApi(videoId, myProfile.user.id);
      if (response.statusCode === 200) {
        const video = (response as SuccessResponse).data.video as Video;
        dispatch("setVideoId", video.id);
        dispatch("updateTitle", video.title);
        dispatch("setOriginalTitle", video.title);
        dispatch("updateDescription", video.description);
        dispatch("setOriginalDescription", video.description);
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
  }, [dispatch, myProfile.user.id, network.isOnline]);

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

  const clearVideoModifier = useCallback((isUpdating: boolean) => {
    dispatch("clearModifier", isUpdating);
  }, [dispatch]);
  
  const uploadThumbnail = useCallback(async (accessToken: string, videoId: string, thumbnail: File) => {
    let response = await getLinkToUploadThumbnailApi(accessToken, videoId);
    if (response.statusCode !== 200) {
      return dispatch("setError", (response as ErrorResponse).message);
    }
    const linkToUploadThumbnail = (response as SuccessResponse).data.url as string;
    response = await uploadThumbnailApi(linkToUploadThumbnail, thumbnail);
    if (response.statusCode !== 200) {
      dispatch("setError", "error when uploading thumbnail");
    }
  }, [dispatch]);
  
  const uploadVideo = useCallback(async (accessToken: string, videoId: string, videoFile: File) => {
    let response = await getLinkToUploadVideoApi(accessToken, videoId);
    if (response.statusCode !== 200) {
      return dispatch("setError", (response as ErrorResponse).message);
    }
    const linkToUploadVideo = (response as SuccessResponse).data.url as string;
    response = await uploadVideoApi(linkToUploadVideo, videoFile);
    if (response.statusCode !== 200) {
      return dispatch("setError", "error when uploading video");
    }
  }, [dispatch]);

  const createVideo = useCallback(async () => {
    if (network.isOnline) {
      dispatch('setError', '');
      if (!video.title.trim()) {
        return dispatch("setError", "Title is required");
      }
      if (!video.videoFile) {
        return dispatch("setError", "Video is required");
      }
      if (!video.thumbnailFile) {
        return dispatch("setError", "Thumbnail is required");
      }
      dispatch("setIsUploading", true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      let response = await createVideoApi(accessToken, video.title, video.description);
      if (response.statusCode !== 201) {
        dispatch("setError", (response as ErrorResponse).message);
        return dispatch("setIsUploading", false);
      }
      const newVideo = (response as SuccessResponse).data.video as Video;
      
      await uploadThumbnail(accessToken, newVideo.id, video.thumbnailFile);
      if (video.error) {
        return dispatch("setIsUploading", false);
      }
      
      await uploadVideo(accessToken, newVideo.id, video.videoFile);
      if (video.error) {
        return dispatch("setIsUploading", false);
      }
      
      dispatch("setIsUploading", false);
      dispatch("setMessage", "Video created successfully");
      const hideMessage = setTimeout(() => {
        dispatch("setMessage", null);
        dispatch("clearModifier", false);
        clearTimeout(hideMessage);
      }, 5000);
    }
  }, [dispatch, getIdTokenClaims, network.isOnline, uploadThumbnail, uploadVideo, video.description, video.error, video.thumbnailFile, video.title, video.videoFile]);

  const updateVideo = useCallback(async () => {
    if (network.isOnline) {
      dispatch('setError', '');
      let success = false;

      if (video.title !== video.originalTitle || video.description !== video.originalDescription) {
        if (!video.title.trim()) {
          return dispatch("setError", "Title is required");
        }

         dispatch("setIsUploading", true);
         const accessToken = (await getIdTokenClaims())!!.__raw;
         const response = await updateVideoApi(accessToken, video.id, video.title, video.description);
         if (response.statusCode !== 200) {
           dispatch("setError", (response as ErrorResponse).message);
         }
         dispatch('setOriginalTitle', video.title);
         dispatch('setOriginalDescription', video.description);
         dispatch("setIsUploading", false);
         success = true;
      }
      
      if (video.thumbnailFile) {
        dispatch("setIsUploading", true);
        const accessToken = (await getIdTokenClaims())!!.__raw;
        await uploadThumbnail(accessToken, video.id, video.thumbnailFile);
        if (video.error) {
          return dispatch("setIsUploading", false);
        }
        dispatch("updateThumbnail", {
          file: null,
          url: `https://udatube-thumbnails-dev.s3.amazonaws.com/${video.id}.png?${Date.now()}`,
        });
        dispatch("setIsUploading", false);
        success = true;
      }
      
      if (video.videoFile) {
        dispatch("setIsUploading", true);
        const accessToken = (await getIdTokenClaims())!!.__raw;
        await uploadVideo(accessToken, video.id, video.videoFile);
        if (video.error) {
          return dispatch("setIsUploading", false);
        }
        dispatch("updateVideoFile", {
          file: null,
          url: `https://udatube-videos-dev.s3.amazonaws.com/${video.id}.mp4?${Date.now()}`,
        });
        dispatch("setIsUploading", false);
        success = true;
      }

      if (success) {
        dispatch("setMessage", "Video updated successfully");
        const hideMessage = setTimeout(() => {
          dispatch("setMessage", null);
          dispatch("setError", null);
          clearTimeout(hideMessage);
        }, 5000);
      }
    }
  }, [dispatch, getIdTokenClaims, network.isOnline, uploadThumbnail, uploadVideo, video.description, video.error, video.id, video.originalDescription, video.originalTitle, video.thumbnailFile, video.title, video.videoFile]);

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