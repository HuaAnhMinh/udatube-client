import {createContext, ReactNode, useCallback, useContext, useEffect, useReducer} from "react";
import useWindowDimensions from "../utils/useWindowDimensions.config";

export const sizeReducer = (state: SizeState, action: SizeAction) => {
  switch (action.type) {
    case "setLoadingSizeLarge":
      return {
        ...state,
        loadingSizeLarge: action.payload,
      };
    case "setLoadingSizeSmall":
      return {
        ...state,
        loadingSizeSmall: action.payload,
      };
    case "setTextLength":
      return {
        ...state,
        textLength: action.payload,
      };
    default:
      return state;
  }
};

export type SizeState = {
  loadingSizeLarge: number | string;
  loadingSizeSmall: number | string;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  width: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  textLength: number;
};

export type SizeActionsMap = {
  setLoadingSizeLarge: number | string;
  setLoadingSizeSmall: number | string;
  setTextLength: number;
};

export type SizeAction = {
  [Key in keyof SizeActionsMap]: {
    type: Key;
    payload: SizeActionsMap[Key];
  }
}[keyof SizeActionsMap];

export type SizeDispatcher = <Type extends SizeAction['type'], Payload extends SizeActionsMap[Type]>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined] : [Payload]
) => void;

type SizeContextInterface = readonly [SizeState, SizeDispatcher];

const initialState: SizeState = {
  loadingSizeLarge: 150,
  loadingSizeSmall: '20px',
  spacing: {
    xs: 5,
    sm: 10,
    md: 30,
    lg: 70,
    xl: 120,
  },
  width: {
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
  textLength: 20,
};

export const SizeContext = createContext<SizeContextInterface>([initialState, () => {}]);

export const SizeProvider = ({ children }: { children: ReactNode }) => {
  const [state, _dispatch] = useReducer(sizeReducer, initialState);

  const dispatch: SizeDispatcher = useCallback((type, ...payload) => {
    _dispatch({ type, payload: payload[0]} as SizeAction);
  }, []);

  return (
    <SizeContext.Provider value={[state, dispatch]}>
      {children}
    </SizeContext.Provider>
  );
};

export const useSize = () => {
  const [size, dispatch] = useContext(SizeContext);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width < size.width.sm) {
      dispatch('setLoadingSizeLarge', 80);
      dispatch('setLoadingSizeSmall', 10);
      dispatch('setTextLength', 20);
    }
    else if (width < size.width.md) {
      dispatch('setLoadingSizeLarge', 100);
      dispatch('setLoadingSizeSmall', 12);
      dispatch('setTextLength', 25);
    }
    else if (width < size.width.lg) {
      dispatch('setLoadingSizeLarge', 120);
      dispatch('setLoadingSizeSmall', 14);
      dispatch('setTextLength', 30);
    }
    else {
      dispatch('setLoadingSizeLarge', 150);
      dispatch('setLoadingSizeSmall', 16);
      dispatch('setTextLength', 35);
    }
  }, [dispatch, size.width.lg, size.width.md, size.width.sm, width]);

  return {
    size,
  };
};