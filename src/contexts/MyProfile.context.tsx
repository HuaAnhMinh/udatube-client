import {ShortFormUser, User} from "../@types/user";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";
import getMyProfileApi from "../apis/getMyProfile.api";
import {useAuth0} from "@auth0/auth0-react";
import {ErrorResponse, SuccessResponse} from "../utils/response.util";
import registerApi from "../apis/register.api";
import {useError} from "./Error.context";
import {useUsers} from "./Users.context";
import subscribeApi from "../apis/subscribe.api";
import unsubscribeApi from "../apis/unsubscribe.api";
import updateUsernameApi from "../apis/updateUsername.api";
import {useNetwork} from "./Network.context";
import getLinkToUploadAvatarApi from "../apis/getLinkToUploadAvatar.api";
import updateAvatarApi from "../apis/updateAvatar.api";
import {useUser} from "./User.context";
import getSubscribedChannelsApi from "../apis/getSubscribedChannels.api";

export const myProfileReducer = (state: MyProfileState, action: MyProfileAction): MyProfileState => {
  switch (action.type) {
    case "setMyProfile":
      return {
        ...state,
        user: action.payload,
      };
    case 'subscribe':
      return {
        ...state,
        user: {
          ...state.user,
          subscribedChannels: [...state.user.subscribedChannels, action.payload],
        },
        isSubscribing: state.isSubscribing.filter(id => id !== action.payload),
      };
    case 'unsubscribe':
      return {
        ...state,
        user: {
          ...state.user,
          subscribedChannels: state.user.subscribedChannels.filter(channel => channel !== action.payload),
        },
        isUnsubscribing: state.isUnsubscribing.filter(id => id !== action.payload),
      }
    case "setIsSubscribing":
      if (state.isSubscribing.includes(action.payload)) {
        return {
          ...state,
          isSubscribing: state.isSubscribing.filter(id => id !== action.payload),
        }
      }
      return {
        ...state,
        isSubscribing: [...state.isSubscribing, action.payload],
      };
    case "setIsUnsubscribing":
      if (state.isUnsubscribing.includes(action.payload)) {
        return {
          ...state,
          isUnsubscribing: state.isUnsubscribing.filter(id => id !== action.payload),
        };
      }
      return {
        ...state,
        isUnsubscribing: [...state.isUnsubscribing, action.payload],
      };
    case "setIsFetching":
      return {
        ...state,
        isFetching: action.payload,
      };
    case "setUsername":
      return {
        ...state,
        user: {
          ...state.user,
          username: action.payload,
        },
      };
    case "setNewUsername":
      return {
        ...state,
        newUsername: action.payload,
      };
    case "setError":
      return {
        ...state,
        error: action.payload,
      };
    case "setCacheTimestamp":
      return {
        ...state,
        cacheTimestamp: action.payload,
      };
    case "setIsUploadingAvatar":
      return {
        ...state,
        isUploadingAvatar: action.payload,
      };
    case 'setSubscribedChannels':
      return {
        ...state,
        subscribedChannels: action.payload,
      };
    case 'setIsFetchingSubscribedChannels':
      return {
        ...state,
        isFetchingSubscribedChannels: action.payload,
      };
    default:
      return state;
  }
};

export type MyProfileState = {
  user: User;
  isSubscribing: string[];
  isUnsubscribing: string[];
  isFetching: boolean;
  newUsername: string;
  error: string | null | undefined;
  cacheTimestamp: number;
  isUploadingAvatar: boolean;
  subscribedChannels: ShortFormUser[];
  isFetchingSubscribedChannels: boolean;
};

export type MyProfileActionsMap = {
  setMyProfile: User;
  subscribe: string;
  unsubscribe: string;
  setIsSubscribing: string;
  setIsUnsubscribing: string;
  setIsFetching: boolean;
  setUsername: string;
  setNewUsername: string;
  setError: string;
  setCacheTimestamp: number;
  setIsUploadingAvatar: boolean;
  setSubscribedChannels: ShortFormUser[];
  setIsFetchingSubscribedChannels: boolean;
};

export type MyProfileAction = {
  [Key in keyof MyProfileActionsMap]: {
    type: Key;
    payload: MyProfileActionsMap[Key];
  }
}[keyof MyProfileActionsMap];

export type MyProfileDispatcher = <Type extends MyProfileAction["type"], Payload extends MyProfileActionsMap[Type]>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined] : [Payload]
) => void;

type MyProfileContextInterface = readonly [MyProfileState, MyProfileDispatcher];

const initialState: MyProfileState = {
  user: {
    id: '',
    username: '',
    subscribedChannels: [],
    videos: [],
    totalSubscribers: 0,
  },
  isSubscribing: [],
  isUnsubscribing: [],
  isFetching: false,
  newUsername: '',
  error: null,
  cacheTimestamp: 0,
  isUploadingAvatar: false,
  subscribedChannels: [],
  isFetchingSubscribedChannels: false,
};

export const MyProfileContext = createContext<MyProfileContextInterface>([initialState, () => {}]);

export const MyProfileProvider = ({ children }: { children: ReactNode }) => {
  const [state, _dispatch] = useReducer(myProfileReducer, initialState);

  const dispatch: MyProfileDispatcher = useCallback((type, ...payload) => {
    _dispatch({ type, payload: payload[0] } as MyProfileAction);
  }, []);

  return (
    <MyProfileContext.Provider value={[state, dispatch]}>
      {children}
    </MyProfileContext.Provider>
  );
};

export const useMyProfile = () => {
  const [myProfile, dispatch] = useContext(MyProfileContext);
  const { network } = useNetwork();

  const {
    isAuthenticated,
    getIdTokenClaims,
  } = useAuth0();
  
  const {
    increaseSubscribers,
    decreaseSubscribers,
  } = useUsers();
  
  const {
    user,
    increaseSubscribers: increaseSubscribersForUser,
    decreaseSubscribers: decreaseSubscribersForUser,
  } = useUser();

  const { setError } = useError();
  
  const fetchMyProfile = useCallback(async () => {
    if (isAuthenticated) {
      dispatch("setIsFetching", true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      let response = await getMyProfileApi(accessToken);
      if (response.statusCode === 200) {
        dispatch('setMyProfile', (response as SuccessResponse).data.user);
        dispatch('setNewUsername', (response as SuccessResponse).data.user.username);
      }
      else if (response.statusCode === 404) {
        response = await registerApi(accessToken);
        if (response.statusCode === 201) {
          await fetchMyProfile();
        }
      }
      else {
        setError(500, 'Internal Server Error');
      }
      dispatch("setIsFetching", false);
    }
  }, [dispatch, getIdTokenClaims, isAuthenticated, setError]);
  
  const subscribeChannel = useCallback(async (userId: string) => {
    if (isAuthenticated && network.isOnline) {
      dispatch('setIsSubscribing', userId);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const result = await subscribeApi(accessToken, userId);
      if (result.statusCode === 200) {
        dispatch('subscribe', userId);
        increaseSubscribers(userId);
        if (user.user.id === userId) {
          increaseSubscribersForUser();
        }
      }
      else {
        dispatch('setIsSubscribing', '');
      }
    }
  }, [dispatch, getIdTokenClaims, increaseSubscribers, increaseSubscribersForUser, isAuthenticated, network.isOnline, user.user.id]);

  const unsubscribeChannel = useCallback(async (userId: string) => {
    if (isAuthenticated && network.isOnline) {
      dispatch('setIsUnsubscribing', userId);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const result = await unsubscribeApi(accessToken, userId);
      if (result.statusCode === 200) {
        dispatch('unsubscribe', userId);
        decreaseSubscribers(userId);
        if (user.user.id === userId) {
          decreaseSubscribersForUser();
        }
      }
      else {
        dispatch('setIsUnsubscribing', '');
      }
    }
  }, [decreaseSubscribers, decreaseSubscribersForUser, dispatch, getIdTokenClaims, isAuthenticated, network.isOnline, user.user.id]);

  const updateUsernameToDB = useCallback(async () => {
    dispatch('setError', '');
    if (!myProfile.newUsername.trim()) {
      return dispatch('setError', 'Username cannot be empty');
    }
    if (isAuthenticated && network.isOnline && myProfile.newUsername.trim() && myProfile.newUsername !== myProfile.user.username) {
      dispatch("setIsFetching", true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const response = await updateUsernameApi(accessToken, myProfile.newUsername.trim());
      if (response.statusCode === 200) {
        dispatch('setUsername', myProfile.newUsername.trim());
      }
      else {
        setError(response.statusCode, (response as ErrorResponse).message);
      }
      dispatch("setIsFetching", false);
    }
  }, [dispatch, getIdTokenClaims, isAuthenticated, myProfile.newUsername, myProfile.user.username, network.isOnline, setError]);

  const changeUsername = useCallback((newUsername: string) => {
    dispatch('setNewUsername', newUsername);
  }, [dispatch]);

  const changeAvatar = useCallback(async (image: File) => {
    if (isAuthenticated && network.isOnline) {
      dispatch("setIsUploadingAvatar", true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      let response = await getLinkToUploadAvatarApi(accessToken);
      if (response.statusCode === 200) {
        const presignedUrl = (response as SuccessResponse).data.url;
        response = await updateAvatarApi(presignedUrl, image);
        if (response.statusCode === 200) {
          dispatch("setCacheTimestamp", Date.now());
        }
      }
      else {
        setError(response.statusCode, (response as ErrorResponse).message);
      }
      dispatch("setIsUploadingAvatar", false);
    }
  }, [dispatch, getIdTokenClaims, isAuthenticated, network.isOnline, setError]);
  
  const fetchMineSubscribedChannels = useCallback(async () => {
    if (isAuthenticated && network.isOnline) {
      dispatch("setIsFetchingSubscribedChannels", true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const response = await getSubscribedChannelsApi(accessToken, 'me');
      if (response.statusCode === 200) {
        dispatch("setSubscribedChannels", (response as SuccessResponse).data.users);
      }
      else {
        setError(response.statusCode, (response as ErrorResponse).message);
      }
      dispatch("setIsFetchingSubscribedChannels", false);
    }
  }, [dispatch, getIdTokenClaims, isAuthenticated, network.isOnline, setError]);

  return {
    myProfile,
    fetchMyProfile,
    subscribeChannel,
    unsubscribeChannel,
    updateUsernameToDB,
    changeUsername,
    changeAvatar,
    fetchMineSubscribedChannels,
  };
};