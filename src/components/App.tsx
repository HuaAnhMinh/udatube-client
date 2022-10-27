import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from "./Home/Home";
import Page404 from "./Page404/Page404";
import Header from "./Header/Header";
import Auth0Provider from "./Auth0Provider/Auth0Provider";
import {MyProfileProvider} from "../contexts/MyProfile.context";
import Profile from "./Profile/Profile";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import {useError} from "../contexts/Error.context";
import Page500 from "./Page500/Page500";
import Users from "./Users/Users";
import {UsersProvider} from "../contexts/Users.context";
import Body from "./Body/Body";

function App() {
  const { error } = useError();

  if (error.message) {
    return (
      <Page500 />
    );
  }

  return (
    <Router basename={'/'}>
      <Auth0Provider>
        <MyProfileProvider>
          <UsersProvider>
            <Header />
            <Body>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/me" element={<ProtectedRoute component={Profile} />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </Body>
          </UsersProvider>
        </MyProfileProvider>
      </Auth0Provider>
    </Router>
  );
}

export default App;
