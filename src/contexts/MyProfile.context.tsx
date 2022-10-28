import {User} from "../@types/user";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";
import getMyProfileApi from "../apis/getMyProfile.api";
import {useAuth0} from "@auth0/auth0-react";
import {ErrorResponse, SuccessResponse} from "../utils/response.util";
import registerApi from "../apis/register.api";
import {useError} from "./Error.context";
import {useUsers} from "./Users.context";

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
        }
      };
    case 'unsubscribe':
      return {
        ...state,
        user: {
          ...state.user,
          subscribedChannels: state.user.subscribedChannels.filter(channel => channel !== action.payload),
        }
      }
    default:
      return state;
  }
};

export type MyProfileState = {
  user: User;
  isSubscribing: boolean;
  isUnsubscribing: boolean;
};

export type MyProfileActionsMap = {
  setMyProfile: User;
  subscribe: string;
  unsubscribe: string;
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
  isSubscribing: false,
  isUnsubscribing: false,
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
    }
  }, [dispatch, getIdTokenClaims, isAuthenticated, setError]);
  
  const subscribeChannel = useCallback(async (userId: string) => {
    dispatch('subscribe', userId);
    increaseSubscribers(userId);
  }, [dispatch, increaseSubscribers]);

  const unsubscribeChannel = useCallback(async (userId: string) => {
    dispatch('unsubscribe', userId);
    decreaseSubscribers(userId);
  }, [decreaseSubscribers, dispatch]);

  return {
    myProfile,
    fetchMyProfile,
    subscribeChannel,
    unsubscribeChannel,
  };
};