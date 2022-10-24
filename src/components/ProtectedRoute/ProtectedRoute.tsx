import React from "react";
import {withAuthenticationRequired} from "@auth0/auth0-react";

const ProtectedRoute = ({component, ...args}: { component: React.ComponentType<object> }) => {
  const Component = withAuthenticationRequired(component, args);
  return <Component />;
};

export default ProtectedRoute;