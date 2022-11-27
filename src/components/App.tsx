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
import {SizeProvider, useSize} from "../contexts/Size.context";
import CreateEditVideo from "./CreateEditVideo/CreateEditVideo";
import {VideoModifierProvider} from "../contexts/VideoModifier.context";
import Videos from "./Videos/Videos";
import {VideosProvider} from "../contexts/Videos.context";
import Video from "./Video/Video";
import {VideoProvider} from "../contexts/Video.context";
import {CommentsProvider} from "../contexts/Comments.context";

function App() {
  const { error } = useError();
  const { size } = useSize();
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
                <VideoModifierProvider>
                  <VideosProvider>
                    <VideoProvider>
                      <CommentsProvider>
                        <Header />
                        <Body>
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/users/me" element={<ProtectedRoute component={Profile} size={size} />} />
                            <Route path="/users/:id" element={<ProtectedRoute component={Profile} size={size} />} />
                            <Route path="/create-video" element={<ProtectedRoute component={CreateEditVideo} size={size} />} />
                            <Route path="/edit-video/:id" element={<ProtectedRoute component={CreateEditVideo} size={size} />} />
                            <Route path="/videos" element={<Videos />} />
                            <Route path="/videos/:id" element={<Video />} />
                            <Route path="*" element={<Page404 />} />
                          </Routes>
                        </Body>
                      </CommentsProvider>
                    </VideoProvider>
                  </VideosProvider>
                </VideoModifierProvider>
              </SizeProvider>
            </UserProvider>
          </UsersProvider>
        </MyProfileProvider>
      </Auth0Provider>
    </Router>
  );
}

export default App;
