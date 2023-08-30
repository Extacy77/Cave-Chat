import React, { useContext, useState } from "react";
import Img from "../images/img.png";
import Attach from "../images/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { 
  arrayUnion,
  serverTimestamp,
  Timestamp,
   doc, 
   updateDoc 
  } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";


const Input = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if(image){
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        (error)=> {
          //TODO: HandleError
        },
        ()=> {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                data: Timestamp.now(),
                image: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),   
      });
    };

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

   setText("");
   setImage(null);
  };
  return (
    <div className="input">
    <input 
    type="text" 
    placeholder="Type something..."
    onChange={e=> {setText(e.target.value)}}
    value={text}/>
    <div className="send">
    <img src={Attach} alt="" />
    <input 
    type="file" 
    style={{display:"none"}} 
    id="file" 
    onChange={(e)=>setImage(e.target.files[0])}/>
    <label htmlFor="file"
    ><img src={Img} alt="" />
    </label>
    <button onClick={handleSend}>Send</button>
    </div>
    </div>
  );
};

export default Input;
