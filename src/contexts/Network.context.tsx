import {createContext, ReactNode, useCallback, useContext, useEffect, useReducer} from "react";
import {useError} from "./Error.context";

export const networkReducer = (state: NetworkState, action: NetworkAction) => {
  switch (action.type) {
    case "setIsOnline":
      return {
        ...state,
        isOnline: action.payload,
      };
    default:
      return state;
  }
};

export type NetworkState = {
  isOnline: boolean;
};

export type NetworkActionsMap = {
  setIsOnline: boolean;
};

export type NetworkAction = {
  [Key in keyof NetworkActionsMap]: {
    type: Key;
    payload: NetworkActionsMap[Key];
  }
}[keyof NetworkActionsMap];

export type NetworkDispatcher = <Type extends NetworkAction['type'], Payload extends NetworkActionsMap[Type]>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined] : [Payload]
) => void;

type NetworkContextInterface = readonly [NetworkState, NetworkDispatcher];

const initialState: NetworkState = {
  isOnline: navigator.onLine,
};

export const NetworkContext = createContext<NetworkContextInterface>([initialState, () => {}]);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [state, _dispatch] = useReducer(networkReducer, initialState);

  const dispatch: NetworkDispatcher = useCallback((type, ...payload) => {
    _dispatch({ type, payload: payload[0]} as NetworkAction);
  }, []);

  return (
    <NetworkContext.Provider value={[state, dispatch]}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const [network, dispatch] = useContext(NetworkContext);
  
  const { setError } = useError();

  useEffect(() => {
    const handleStatusChange = () => {
      dispatch('setIsOnline', navigator.onLine);
    };

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [dispatch, network.isOnline]);
  
  useEffect(() => {
    if (!network.isOnline) {
      setError(503, 'Service Unavailable');
    }
  }, [network.isOnline, setError]);

  return {
    network,
  };
};