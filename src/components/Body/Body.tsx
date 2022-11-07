import {ReactNode} from "react";
import './Body.scss';
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useError} from "../../contexts/Error.context";
import {Snackbar} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import CircularProgress from '@mui/material/CircularProgress';
import {useSize} from "../../contexts/Size.context";

const Body = ({ children }: { children: ReactNode }) => {
  const { width } = useWindowDimensions();
  const { error, setError } = useError();
  const { isLoading } = useAuth0();
  const { size } = useSize();

  return (
    <div className={`Body ${width < size.width.md && 'Body--mobile'}`}>
      {
        isLoading &&
        <div style={{ textAlign: 'center' }}>
          <CircularProgress color={'error'} style={{
            width: size.loadingSizeLarge,
            height: size.loadingSizeLarge,
            borderRadius: '50%',
          }} />
        </div>
      }
      { !isLoading && children }
      {
        error.statusCode !== 500 && error.message &&
        <Snackbar
          open={!!error.message}
          onClose={() => setError(0, '')}
          message={error.message}
        />
      }
    </div>
  );
};

export default Body;