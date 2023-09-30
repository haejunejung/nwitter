import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { firestore, storage } from "../fire-base";
import { deleteObject, ref } from "firebase/storage";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");

    if (ok) {
      const nweetTextRef = doc(firestore, "/nweets", nweetObj.id);
      await deleteDoc(nweetTextRef);

      if (nweetObj.attachmentUrl !== "") {
        const storageRef = ref(storage, nweetObj.attachmentUrl);
        await deleteObject(storageRef);
      }
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const nweetTextRef = doc(firestore, "/nweets", nweetObj.id);
    await updateDoc(nweetTextRef, { text: newNweet });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setNewNweet(value);
  };

  return (
    <>
      {editing ? (
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Edit your nweet"
            value={newNweet}
            onChange={onChange}
            required
          />
          <input type="submit" value="Update Nweet" />
          <button onClick={toggleEditing}>Cancel</button>
        </form>
      ) : (
        <React.Fragment>
          {nweetObj.attachmentUrl && (
            <img
              src={nweetObj.attachmentUrl}
              alt="attachemnt"
              width="50px"
              height="50px"
            />
          )}
          <div>{nweetObj.text}</div>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </React.Fragment>
      )}
    </>
  );
};

export default Nweet;
