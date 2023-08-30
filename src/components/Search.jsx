import React, { useState, useContext } from 'react'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  setDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../config/firebase";
import {AuthContext } from "../context/AuthContext";

const Search = () => {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const {currentUser} = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", userName));

    try {
      const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUser(doc.data());
      });
    }  catch(err){
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    // Check whether the group(chats in firestore) exists or not. If not create 
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid: user.id + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if(!res.exists()){
        // create a chat in chats collection
        await setDoc(doc (db, "chats", combinedId), { messages: []});

        //create user chats
         /* Structure would be like
        userChats:{
          janesId: {
            combinedId: {
              userInfo{ displayName, img, id },
                lastMessage:"",
                date:
            }
          }
        }
        */
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId +".userInfo"]: {
            uid:user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId+".date"]: serverTimestamp()
        });


        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId +".userInfo"]: {
            uid:currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId+".date"]: serverTimestamp()
        });
      }
    } catch(err){
      setErr(true);
    };
    // Create user chats between 2 users

    // close search bar
    setUser(null);
    setUserName("");

  };

  return (
    <div className="search">
      <div className="searchForm">
        <input 
        type="text" 
        placeholder="Find a user" 
        onKeyDown={handleKey}
        onChange={(e)=>setUserName(e.target.value)}
        value={userName}/>
      </div>
      {err && <span>User not found!</span>}
      {user && (<div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL} alt="" />
        <div className="useChatInfo">
            <span>{user.displayName}</span>
        </div>
      </div>)}
    </div>
  );
};

export default Search;
