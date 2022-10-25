import {ErrorResponse} from "../utils/response.util";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";

export const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case "setError":
      return action.payload;
    default:
      return state;
  }
};

export type ErrorState = ErrorResponse;

export type ErrorActionsMap = {
  setError: ErrorState;
};

export type ErrorAction = {
  [Key in keyof ErrorActionsMap]: {
    type: Key;
    payload: ErrorActionsMap[Key];
  }
}[keyof ErrorActionsMap];

export type ErrorDispatcher = <Type extends ErrorAction['type'], Payload extends ErrorActionsMap[Type]>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined] : [Payload]
) => void;

type ErrorContextInterface = readonly [ErrorState, ErrorDispatcher];

const initialState: ErrorState = {
  statusCode: 0,
  message: '',
};

export const ErrorContext = createContext<ErrorContextInterface>([initialState, () => {}]);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [state, _dispatch] = useReducer(errorReducer, initialState);

  const dispatch: ErrorDispatcher = useCallback((type, ...payload) => {
    _dispatch({ type, payload: payload[0]} as ErrorAction);
  }, []);

  return (
    <ErrorContext.Provider value={[state, dispatch]}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const [error, dispatch] = useContext(ErrorContext);

  const setError = useCallback((statusCode: number, message: string) => {
    dispatch('setError', {
      statusCode,
      message,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    error,
    setError,
  };
};