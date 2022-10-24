import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from "./Home/Home";
import Page404 from "./Page404/Page404";
import Header from "./Header/Header";
import Auth0Provider from "./Auth0Provider/Auth0Provider";
import {MyProfileProvider} from "../contexts/MyProfile.context";
import Profile from "./Profile/Profile";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Router basename={'/'}>
      <Auth0Provider>
        <MyProfileProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users/me" element={<ProtectedRoute component={Profile} />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </MyProfileProvider>
      </Auth0Provider>
    </Router>
  );
}

export default App;
