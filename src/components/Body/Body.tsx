import {ReactNode} from "react";
import './Body.scss';
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useError} from "../../contexts/Error.context";
import {Snackbar} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import CircularProgress from '@mui/material/CircularProgress';

const Body = ({ children }: { children: ReactNode }) => {
  const { width } = useWindowDimensions();
  const { error, setError } = useError();
  const { isLoading } = useAuth0();

  if (width >= 900) {
    return (
      <div className={"Body"}>
        {
          isLoading &&
          <div style={{ textAlign: 'center' }}>
            <CircularProgress color={'error'} style={{
              width: 200,
              height: 200,
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
  }

  return (
    <div className={"Body Body--mobile"}>
      {
        isLoading &&
        <div style={{ textAlign: 'center' }}>
          <CircularProgress color={'error'} style={{
            width: 150,
            height: 150,
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