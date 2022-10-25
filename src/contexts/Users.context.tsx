import {ShortFormUser} from "../@types/user";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";

export const usersReducer = (state: UsersState, action: UsersAction) => {
  switch (action.type) {
    case "setUsers":
      return action.payload;
    default:
      return state;
  }
};

export type UsersState = ShortFormUser[];

export type UsersActionsMap = {
  setUsers: UsersState;
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

const initialState: UsersState = [];

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

  const setUsers = useCallback(async (username: string) => {
    dispatch('setUsers', []);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    users,
    setUsers,
  };
};