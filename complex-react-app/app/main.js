import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";

Axios.defaults.baseURL = "http://localhost:8080";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

//Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
    },
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token);
      localStorage.setItem("complexappUsername", state.user.username);
      localStorage.setItem("complexappAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("complexappToken");
      localStorage.removeItem("complexappUsername");
      localStorage.removeItem("complexappAvatar");
    }
  }, [state.loggedIn]);

  // const [loggedIn, setLoggedIn] = useState(
  //   Boolean(localStorage.getItem("complexappToken"))
  // );
  // const [flashMessages, setFlashMessages] = useState([]);

  // function addFlashMessage(msg) {
  //   setFlashMessages((prev) => prev.concat(msg));
  // }
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />

          <Routes>
            <Route
              path="/"
              element={state.loggedIn ? <Home /> : <HomeGuest />}
            />
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>

          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
