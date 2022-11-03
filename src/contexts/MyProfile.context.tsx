import {User} from "../@types/user";
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
    default:
      return state;
  }
};

export type MyProfileState = {
  user: User;
  isSubscribing: string[];
  isUnsubscribing: string[];
  isFetching: boolean;
};

export type MyProfileActionsMap = {
  setMyProfile: User;
  subscribe: string;
  unsubscribe: string;
  setIsSubscribing: string;
  setIsUnsubscribing: string;
  setIsFetching: boolean;
  setUsername: string;
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
  const {
    isAuthenticated,
    getIdTokenClaims,
  } = useAuth0();
  
  const {
    increaseSubscribers,
    decreaseSubscribers,
  } = useUsers();

  const { setError } = useError();
  
  const fetchMyProfile = useCallback(async () => {
    if (isAuthenticated) {
      dispatch("setIsFetching", true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      let response = await getMyProfileApi(accessToken);
      if (response.statusCode === 200) {
        dispatch('setMyProfile', (response as SuccessResponse).data.user);
      }
      else if (response.statusCode === 404) {
        response = await registerApi(accessToken);
        if (response.statusCode === 201) {
          await fetchMyProfile();
        }
      }
      else {
        setError(response.statusCode, (response as ErrorResponse).message);
      }
      dispatch("setIsFetching", false);
    }
  }, [dispatch, getIdTokenClaims, isAuthenticated, setError]);
  
  const subscribeChannel = useCallback(async (userId: string) => {
    if (isAuthenticated) {
      dispatch('setIsSubscribing', userId);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const result = await subscribeApi(accessToken, userId);
      if (result.statusCode === 200) {
        dispatch('subscribe', userId);
        increaseSubscribers(userId);
      }
      else {
        dispatch('setIsSubscribing', '');
      }
    }
  }, [dispatch, getIdTokenClaims, increaseSubscribers, isAuthenticated]);

  const unsubscribeChannel = useCallback(async (userId: string) => {
    if (isAuthenticated) {
      dispatch('setIsUnsubscribing', userId);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const result = await unsubscribeApi(accessToken, userId);
      if (result.statusCode === 200) {
        dispatch('unsubscribe', userId);
        decreaseSubscribers(userId);
      }
      else {
        dispatch('setIsUnsubscribing', '');
      }
    }
  }, [decreaseSubscribers, dispatch, getIdTokenClaims, isAuthenticated]);

  const updateUsername = useCallback(async (username: string) => {
    if (isAuthenticated) {
      dispatch("setIsFetching", true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const response = await updateUsernameApi(accessToken, username);
      if (response.statusCode === 200) {
        dispatch('setUsername', username);
      }
      else {
        setError(response.statusCode, (response as ErrorResponse).message);
      }
      dispatch("setIsFetching", false);
    }
  }, [dispatch, getIdTokenClaims, isAuthenticated, setError]);
  
  return {
    myProfile,
    fetchMyProfile,
    subscribeChannel,
    unsubscribeChannel,
    updateUsername,
  };
};