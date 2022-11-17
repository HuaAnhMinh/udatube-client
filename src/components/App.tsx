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
import {UserProvider} from "../contexts/User.context";
import {useNetwork} from "../contexts/Network.context";
import {SizeProvider} from "../contexts/Size.context";
import CreateEditVideo from "./CreateEditVideo/CreateEditVideo";
import {VideoProvider} from "../contexts/Video.context";

function App() {
  const { error } = useError();
  useNetwork();

  if (error.statusCode === 500) {
    return (
      <Page500 />
    );
  }

  return (
    <Router basename={'/'}>
      <Auth0Provider>
        <MyProfileProvider>
          <UsersProvider>
            <UserProvider>
              <SizeProvider>
                <VideoProvider>
                  <Header />
                  <Body>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/users/me" element={<ProtectedRoute component={Profile} />} />
                      <Route path="/users/:id" element={<ProtectedRoute component={Profile} />} />
                      <Route path="/create-video" element={<ProtectedRoute component={CreateEditVideo} />} />
                      <Route path="/edit-video/:id" element={<ProtectedRoute component={CreateEditVideo} />} />
                      <Route path="*" element={<Page404 />} />
                    </Routes>
                  </Body>
                </VideoProvider>
              </SizeProvider>
            </UserProvider>
          </UsersProvider>
        </MyProfileProvider>
      </Auth0Provider>
    </Router>
  );
}

export default App;
