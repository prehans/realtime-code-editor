import React, { useState } from 'react';

import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PreLoader from "../components/PreLoader";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(true);
  const [roomId , setRoomId] =useState('');
  const [username , setUsername] =useState('');
  useEffect(() => {
      
    setTimeout(()=>{

          setLoading(false);
    },3000)
    
}, []);
  
  const createNewRoom=(e)=>{ 
    e.preventDefault();
    const id =uuidV4();
    setRoomId(id);
    console.log(id);
    toast.success('created a new room');
  };
  const joinRoom =()=>{
    if(!roomId || !username)
    {
      toast.error('Room ID and username is required');
      return;
    }
    //redirect
    navigate(`/editor/${roomId}`,{
      state:{
        username,
      },
    });

  };
  const handleInputEnter=(e)=>{
    // console.log('event',e.code);
    if(e.code=='Enter'){
      joinRoom();
    }

  }
  if(Loading){
  return <PreLoader/>
  }
  else{
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img className='homePageLogo' src="/logo1.png" alt="editor-logo"/>
        <h4 className='mainLabel'> Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input type='text' className='inputBox' placeholder='ROOM ID' onChange={(e)=>setRoomId(e.target.value)} value={roomId} onKeyUp={handleInputEnter}/>
          <input type='text' className='inputBox' placeholder='USERNAME' onChange={(e)=>setUsername(e.target.value)} value={username} onKeyUp={handleInputEnter}/>
          <button className='btn joinBtn' onClick={joinRoom}>Join</button>
          <span className='createInfo'>If you don't have an invite then create&nbsp; 
          <a onClick={createNewRoom} href='' className='createNewBtn'>new room</a></span>
        </div>
      </div>
      <footer>Created by <a href="https://www.linkedin.com/in/prehansgupta2024/"><u>Prehans Gupta ❤</u></a></footer>
    </div>
  )
}
}


export default Home
