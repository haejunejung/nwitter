import React, { useCallback, useEffect, useState } from "react";
import { auth, firestore } from "../fire-base";
import { signOut, updateProfile } from "firebase/auth";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

const Profile = ({ userObj, refreshUser }) => {
  const [displayName, setDisplayName] = useState(userObj.displayName);
  const history = useHistory();

  const onLogOutClick = () => {
    signOut(auth);
    history.push("/");
  };

  const getMyNweets = useCallback(async () => {
    const q = query(
      collection(firestore, "/nweets"),
      orderBy("createdAt"),
      where("creatorId", "==", userObj.uid)
    );
    const querySnapShot = await getDocs(q);
    querySnapShot.forEach((doc) => {
      // console.log(doc.id, doc.data());
    });
  }, [userObj.uid]);

  useEffect(() => {
    getMyNweets();
  }, [getMyNweets]);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (userObj.displayName !== displayName) {
      await updateProfile(userObj, {
        displayName: displayName,
      });

      refreshUser();
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setDisplayName(value);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder={displayName}
          value={displayName}
          onChange={onChange}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
