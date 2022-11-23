import {useAuth0, withAuthenticationRequired} from "@auth0/auth0-react";
import CircularProgress from "@mui/material/CircularProgress";
import {SizeState} from "../../contexts/Size.context";
import {ComponentType} from "react";

const ProtectedRoute = ({component, size, ...args}: { component: ComponentType<object>, size: SizeState }) => {
  const { isLoading } = useAuth0();

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

  const Component = withAuthenticationRequired(component, args);
  return <Component />;
};

export default ProtectedRoute;