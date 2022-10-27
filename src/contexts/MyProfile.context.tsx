import {User} from "../@types/user";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";
import getMyProfileApi from "../apis/getMyProfile.api";
import {useAuth0} from "@auth0/auth0-react";
import {ErrorResponse, SuccessResponse} from "../utils/response.util";
import registerApi from "../apis/register.api";
import {useError} from "./Error.context";

export const myProfileReducer = (state: MyProfileState, action: MyProfileAction): MyProfileState => {
  switch (action.type) {
    case "setMyProfile":
      return action.payload;
    default:
      return state;
  }
};

export type MyProfileState = User;

export type MyProfileActionsMap = {
  setMyProfile: MyProfileState;
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
  id: '',
  username: '',
  subscribedChannels: [],
  videos: [],
  totalSubscribers: 0,
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    myProfile,
    fetchMyProfile,
  };
};