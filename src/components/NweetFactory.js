import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useRef, useState } from "react";
import { firestore, storage } from "../fire-base";
import { v4 as uuidv4 } from "uuid";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttchment] = useState("");

  const fileInput = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();
    const nweetsCollection = collection(firestore, "/nweets");
    let attachmentUrl = "";

    if (attachment) {
      const attachmentRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }

    await addDoc(nweetsCollection, {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl: attachmentUrl,
    });

    onClearAttachment();
    setNweet("");
  };

  const onClearAttachment = () => {
    setAttchment("");
    fileInput.current.value = "";
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttchment(result);
    };

    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={nweet}
        placeholder="what's on your mind?"
        maxLength={120}
        onChange={onChange}
      />
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileInput}
      />
      <input type="submit" value="nweet" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" alt="attachment" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
