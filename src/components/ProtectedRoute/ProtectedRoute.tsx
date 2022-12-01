import {useAuth0, withAuthenticationRequired} from "@auth0/auth0-react";
import CircularProgress from "@mui/material/CircularProgress";
import {ComponentType, useMemo} from "react";
import {useSize} from "../../contexts/Size.context";

const ProtectedRoute = ({component, ...args}: { component: ComponentType<object> }) => {
  const { isLoading } = useAuth0();
  const {size} = useSize();
  const Component = useMemo(() => withAuthenticationRequired(component, args), []);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center' }}>
        <CircularProgress
          color={'error'}
          style={{
            width: size.loadingSizeLarge,
            height: size.loadingSizeLarge,
            borderRadius: '50%',
          }}
        />
      </div>
    );
  }


  return <Component />;
};

export default ProtectedRoute;