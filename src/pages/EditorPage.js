import React ,{useState , useRef, useEffect} from 'react'
import Loader from "../components/Loader";
import toast from 'react-hot-toast'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { useLocation , useNavigate, Navigate, useParams} from 'react-router-dom';


const EditorPage = () => {
  const socketRef =useRef(null);
  const codeRef=useRef(null);
  const location= useLocation();
  const {roomId} =useParams();
  // console.log(params);
  const reactNavigator =useNavigate();
  const [Loading, SetLoading] = useState(true);
  const [clients ,setClients] =useState([]);
  useEffect(() => {
    let ding = new Audio('/ding.mp3');
    setTimeout(() => {
      SetLoading(false);
      ding.play();
    }, 3000);
  }, []);
  
  useEffect(() =>{
   const init = async()=>{
    socketRef.current = await initSocket();
    socketRef.current.on('connect_error',(err)=>handleErrors(err));
    socketRef.current.on('connect_failed',(err)=>handleErrors(err));

   function handleErrors(e){
    console.log('socket error',e);
    toast.error('Socket connection failed , try again later');
    reactNavigator('/');
   }


    socketRef.current.emit(ACTIONS.JOIN,{
      roomId,
      username: location.state?.username,
    });

    //listining for joined events
    socketRef.current.on(ACTIONS.JOINED,({clients,username , socketId})=>{
          if(username!== location.state?.username){
            let Join = new Audio('/Join.mp3');
            toast.success(`${username} joined the room.`);
            Join.play();
            // console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE,{code: codeRef.current, socketId});
    });
    socketRef.current.on("typing",({username})=>{
              
      if(username)
      {
        document.getElementById('type').innerHTML = `${username} is typing...`;
        console.log(`${username} is typing`);
      }
      else
      {
        document.getElementById('type').innerHTML = '';
        console.log(username);
      }
       
  });
    // listining for disconnected
    socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
     toast.success(`${username} left the room.`);
     setClients((prev)=>{
          return prev.filter((client)=> client.socketId!==socketId);
     });
    });

   };
   init();
   return ()=>{
      socketRef.current.disconnected();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
   };
  },[]);


  async function copyRoomId(){
    try{
       await navigator.clipboard.writeText(roomId);
       toast.success('Room ID has been copied to your clipboard');
    }catch(err){
           toast.error('could not copied');
           console.log(err);
    }
  }
  function leaveRoom(){
    reactNavigator('/');
  }
  

  if(!location.state){
    return <Navigate to="/"/>
  }

  if (Loading) {
    return <Loader />;}
    else{
  return ( <div className='mainWrap'>
    <div className='aside'>

      <div className='asideInner'>
        <div className='logo'><img  className ='logoImage'src="/logo1.png"></img></div>
        <h3>Connected</h3>
        <div className='clientsList'> {clients.map((client)=>(
          <Client key={client.socketId} username={client.username}/>
        ))}</div>
      </div>
      <button className='btn copyBtn' onClick={copyRoomId}>Copy ROOM ID</button>
      <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
    </div>
    <div className='editorWrap'>
      <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current=code;}}/>
    </div>
  </div>
  )
        }

};

export default EditorPage


