import React, { useEffect, useState } from "react";
import Router from "./Router";

import { auth } from "../fire-base";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [userObj, setUserObj] = useState(null);
  const [, setDisplayName] = useState("");

  const [init, setInit] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = async () => {
    setDisplayName(userObj.displayName);
  };

  return init ? (
    <Router
      isLoggedIn={Boolean(userObj)}
      userObj={userObj}
      refreshUser={refreshUser}
    />
  ) : (
    "initialzing..."
  );
}

export default App;
