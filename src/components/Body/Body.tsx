import {ReactNode} from "react";
import './Body.scss';
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useError} from "../../contexts/Error.context";
import {Alert, Snackbar} from "@mui/material";
import {useSize} from "../../contexts/Size.context";

const Body = ({ children }: { children: ReactNode }) => {
  const { width } = useWindowDimensions();
  const { error, setError } = useError();
  const { size } = useSize();

  return (
    <div className={`Body ${width < size.width.md && 'Body--mobile'}`}>
      {children}
      {
        error.statusCode !== 500 && error.message &&
        <Snackbar
          open={!!error.message}
          onClose={() => setError(0, '')}
        >
          <Alert severity={'error'}>{error.message}</Alert>
        </Snackbar>
      }
    </div>
  );
};

export default Body;