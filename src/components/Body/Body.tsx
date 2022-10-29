import {ReactNode, useEffect, useState} from "react";
import './Body.scss';
import useWindowDimensions from "../../utils/useWindowDimensions.config";
import {useError} from "../../contexts/Error.context";
import {Snackbar} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import CircularProgress from '@mui/material/CircularProgress';

const Body = ({ children }: { children: ReactNode }) => {
  const { width } = useWindowDimensions();
  const { error, setError } = useError();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { isLoading } = useAuth0();

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isOnline]);
  
  useEffect(() => {
    if (!isOnline) {
      setError(0, 'You are offline');
    }
  }, [isOnline, setError]);

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
          error.message === 'You are offline' &&
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
        error.message === 'You are offline' &&
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