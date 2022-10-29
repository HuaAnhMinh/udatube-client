import {User} from "../@types/user";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";
import getUserApi from "../apis/getUser.api";
import {useAuth0} from "@auth0/auth0-react";
import {SuccessResponse} from "../utils/response.util";
import {useMyProfile} from "./MyProfile.context";

export const userReducer = (state: UserState, action: UserAction) => {
  switch (action.type) {
    case "setUser":
      return {
        ...state,
        user: action.payload,
        isFailed: false,
      };
    case "setFailed":
      return {
        ...state,
        isFailed: action.payload,
      };
    case "setIsFetching":
      return {
        ...state,
        isFetching: action.payload,
      };
    default:
      return state;
  }
};

export type UserState = {
  user: User;
  isFailed: boolean;
  isFetching: boolean;
};

export type UserActionsMap = {
  setUser: User;
  setFailed: boolean;
  setIsFetching: boolean;
};

export type UserAction = {
  [Key in keyof UserActionsMap]: {
    type: Key;
    payload: UserActionsMap[Key];
  }
}[keyof UserActionsMap];

export type UserDispatcher = <Type extends UserAction['type'], Payload extends UserActionsMap[Type]>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined] : [Payload]
) => void;

type UserContextInterface = readonly [UserState, UserDispatcher];

const initialState: UserState = {
  user: {
    id: "",
    username: "",
    subscribedChannels: [],
    videos: [],
    totalSubscribers: 0,
  },
  isFailed: false,
  isFetching: false,
};

export const UserContext = createContext<UserContextInterface>([initialState, () => {}]);

export const UserProvider = ({children}: {children: ReactNode}) => {
  const [state, _dispatch] = useReducer(userReducer, initialState);

  const dispatch: UserDispatcher = useCallback((type, ...payload) => {
    _dispatch({ type, payload: payload[0]} as UserAction);
  }, []);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const [user, dispatch] = useContext(UserContext);

  const {
    isAuthenticated,
    getIdTokenClaims,
  } = useAuth0();
  
  const {
    myProfile,
  } = useMyProfile();
  
  const fetchUser = useCallback(async (id: string) => {
    if (isAuthenticated) {
      dispatch("setIsFetching", true);
      const accessToken = (await getIdTokenClaims())!!.__raw;
      const response = await getUserApi(accessToken, id);
      if (response.statusCode === 200) {
        dispatch("setUser", (response as SuccessResponse).data.user);
      }
      else if (response.statusCode === 404) {
        dispatch("setFailed", true);
      }
      dispatch("setIsFetching", false);
    }
  }, [dispatch, getIdTokenClaims, isAuthenticated]);
  
  const mapMyProfileToUser = useCallback(() => {
    if (isAuthenticated && myProfile.user.id) {
      dispatch("setUser", myProfile.user);
    }
  }, [dispatch, isAuthenticated, myProfile.user]);
  
  return {
    fetchUser,
    mapMyProfileToUser,
    user,
  }
};