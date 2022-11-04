import {ShortFormUser} from "../@types/user";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";
import getUsersApi from "../apis/getUsers.api";
import { SuccessResponse } from "../utils/response.util";
import {useNetwork} from "./Network.context";

export const usersReducer = (state: UsersState, action: UsersAction) => {
  switch (action.type) {
    case "setUsers":
      return action.payload;
    case "addUsers":
      return {
        ...state,
        nextKey: action.payload.nextKey,
        users: [...state.users, ...action.payload.users],
        isFetching: false,
      };
    case "setIsFetching":
      return {
        ...state,
        isFetching: true,
      };
    case "increaseSubscribers":
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id === action.payload) {
            return {
              ...user,
              totalSubscribers: user.totalSubscribers + 1,
            };
          }
          return user;
        }),
      };
    case "decreaseSubscribers":
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id === action.payload) {
            return {
              ...user,
              totalSubscribers: user.totalSubscribers - 1,
            };
          }
          return user;
        }),
      };
    default:
      return state;
  }
};

export type UsersState = {
  users: ShortFormUser[];
  nextKey: string | null;
  isFetching: boolean;
};

export type UsersActionsMap = {
  setUsers: UsersState;
  addUsers: UsersState;
  setIsFetching: any;
  increaseSubscribers: string;
  decreaseSubscribers: string;
};

export type UsersAction = {
  [Key in keyof UsersActionsMap]: {
    type: Key;
    payload: UsersActionsMap[Key];
  }
}[keyof UsersActionsMap];

export type UsersDispatcher = <Type extends UsersAction['type'], Payload extends UsersActionsMap[Type]>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined] : [Payload]
) => void;

type UsersContextInterface = readonly [UsersState, UsersDispatcher];

const initialState: UsersState = {
  users: [],
  nextKey: null,
  isFetching: false,
};

export const UsersContext = createContext<UsersContextInterface>([initialState, () => {}]);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [state, _dispatch] = useReducer(usersReducer, initialState);

  const dispatch: UsersDispatcher = useCallback((type, ...payload) => {
    _dispatch({ type, payload: payload[0]} as UsersAction);
  }, []);

  return (
    <UsersContext.Provider value={[state, dispatch]}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const [users, dispatch] = useContext(UsersContext);
  
  const { network } = useNetwork();

  const fetchUsers = useCallback(async (username: string, fetchFromStart: boolean = true) => {
    if (network.isOnline) {
      let actionType: 'setUsers' | 'addUsers';
      if (fetchFromStart) {
        actionType = 'setUsers';
        dispatch(actionType, {
          users: [],
          nextKey: null,
          isFetching: false,
        });
      }
      else {
        actionType = 'addUsers';
      }

      dispatch('setIsFetching', {});

      const response = await getUsersApi(username, 8, users.nextKey);
      const data = (response as SuccessResponse).data;

      dispatch(actionType, {
        users: data.users,
        nextKey: data.nextKey,
        isFetching: false,
      }); 
    }
  }, [network.isOnline, dispatch, users.nextKey]);

  const increaseSubscribers = useCallback((userId: string) => {
    dispatch('increaseSubscribers', userId);
  }, [dispatch]);

  const decreaseSubscribers = useCallback((userId: string) => {
    dispatch('decreaseSubscribers', userId);
  }, [dispatch]);

  return {
    users,
    fetchUsers,
    increaseSubscribers,
    decreaseSubscribers,
  };
};