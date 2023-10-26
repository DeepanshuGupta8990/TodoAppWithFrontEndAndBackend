import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import io from "socket.io-client";

  function Chat2() {   
    let socket = io("https://websocketchatapp.tanujagupta.repl.co");
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email");
    const senderEmail = searchParams.get("senderEmail");
    const peerIdValueFromUrl = searchParams.get("peerId");
    const [peer, setPeer] = useState(null);
    const [peerId,setPeerId] = useState("");
    const [currentCall, setCurrentCall] = useState(null);
    const [localVideoStream, setLocalVideoStream] = useState(null);
    const [remoteVideoStream, setRemoteVideoStream] = useState(null);
    const [isInCall, setIsInCall] = useState(false);
    const localVideo = useRef(null);
    const remoteVideo = useRef(null);
    const inputRef = useRef(null);
    const peerIdValuee = useRef("");
    const peerRef = useRef(null);

      
    const callUser = async (idValue) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
  
      localVideo.current.srcObject = stream;
      
      const call = await peer.call(idValue, stream);
  
      call.on("stream", (remoteStream) => {
        remoteVideo.current.srcObject = remoteStream;
      });
  
      call.on("error", (err) => {
        console.log(err);
      });
  
      setCurrentCall(call);
    };
  
    const endCall = () => {
  
      if (currentCall) {
        currentCall.close();
      }
  
      setLocalVideoStream(null);
      setRemoteVideoStream(null);
      setCurrentCall(null);
      setIsInCall(false);
    };
  
    useEffect(() => {
      const peerInstance = new Peer();
      peerInstance.on("open", (id) => {
        peerRef.current = peerInstance
        setPeer(peerInstance);
        setPeerId(id);
        console.log(id)
        peerIdValuee.current = id;
        if(email && senderEmail){
            socket.emit("sendingPeerID",{peerId:id,email:email,senderEmail:senderEmail});
        }
      });


      peerInstance.on("call", (call) => {
        if (window.confirm(`Accept call from ${call.peer}?`)) {
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              localVideo.current.srcObject = stream;
              call.answer(stream);
              setCurrentCall(call);
              call.on("stream", (remoteStream) => {
                remoteVideo.current.srcObject = remoteStream;
              });
            })
            .catch((err) => {
              console.log("Failed to get local stream:", err);
            });
        } else {
          call.close();
        }
      });
  
      return () => {
        peerInstance.destroy();
      };
    }, []);



    // useEffect(()=>{
    //   if(peerIdValueFromUrl){
      
    //     callUser(peerIdValueFromUrl);
    //   }
    // },[])

  
    return (
      <div className="App">
        {
          peerIdValueFromUrl ? <button onClick={()=>{alert(peerIdValuee.current); callUser(peerIdValueFromUrl);}}>Start</button> : ""

        }
        {(
         <div id="live">
         <video id="remote-video" ref={remoteVideo} autoPlay />
         <video id="local-video" ref={localVideo} muted autoPlay />
         <button id="end-call" onClick={endCall}>End Call</button>
       </div>
        )}
      </div>
    );
  }
  
  export default Chat2;