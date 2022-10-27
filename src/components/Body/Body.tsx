import {ReactNode} from "react";
import './Body.scss';
import useWindowDimensions from "../../utils/useWindowDimensions.config";

const Body = ({ children }: { children: ReactNode }) => {
  const { width } = useWindowDimensions();

  if (width >= 900) {
    return (
      <div className={"Body"}>
        {children}
      </div>
    );
  }

  return (
    <div className={"Body Body--mobile"}>
      {children}
    </div>
  );
};

export default Body;