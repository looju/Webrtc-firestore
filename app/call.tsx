import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "@/Config/Firebase";
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteField,
} from "firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import CallActionBox from "@/components/CallActionBox";

const { width, height } = Dimensions.get("screen");

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const Call = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
  const [cachedLocalPc, setCachedLocalPc] =
    useState<RTCPeerConnection | null>();
  const [isMuted, setIsMuted] = useState<boolean>();
  const [isOffCam, setIsOffCam] = useState<boolean>(false);
  const { id } = useLocalSearchParams();

  const startLocalStream = async () => {
    let isFront = true;
    const devices = await mediaDevices.getDisplayMedia();
    const facingMode = isFront == true ? "user" : "environment";
    // const videoSourceId = devices.find(
    //   (device) => device.kind === "videoinput" && device.facing === facingMode
    // );
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500,
          minHeight: 300,
          minFrameRate: 30,
        },
      },
      facingMode,
    };
    const stream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(stream);
  };

  const startCall = async (id: any) => {
    const roomRef = doc(db, "room", id);
    const callerCandidatesCollection = collection(roomRef, "callerCandidates");
    const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");
    const localPc = new RTCPeerConnection(configuration);
    localStream?.getTracks().forEach((track) => {
      localPc.addTrack(track, localStream);
    });
    localPc.addEventListener("icecandidate", (e) => {
      if (!e.candidate) {
        console.log("No candidate yet");
      }
      addDoc(callerCandidatesCollection, e.candidate.toJSON());
    });
    localPc.ontrack = (e: any) => {
      const newStream = new MediaStream();
      e.streams[0].getTracks().forEach((track) => {
        newStream.addTrack(track);
      });
      setRemoteStream(newStream);
    };
    const offer = await localPc.createOffer();
    await localPc.setLocalDescription(offer);
    await setDoc(roomRef, { offer, connected: false }, { merge: true });

    onSnapshot(roomRef, (doc) => {
      const data = doc.data();
      if (!localPc.remoteDescription && data.answer) {
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        localPc.setRemoteDescription(rtcSessionDescription);
      } else {
        const stream = new MediaStream();
        setRemoteStream(stream);
      }
    });

    onSnapshot(calleeCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let data = change.doc.data();
          localPc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    setCachedLocalPc(localPc);
  };

  const endCall = async () => {
    if (cachedLocalPc) {
      const senders = cachedLocalPc.getSenders();
      senders.forEach((sender) => {
        cachedLocalPc.removeTrack(sender);
      });
      cachedLocalPc.close();
    }
    const roomRef = doc(db, "room", id);
    await updateDoc(roomRef, { answer: deleteField() });

    setLocalStream(null);
    setRemoteStream(null);
    setCachedLocalPc(null);
    router.back();
  };

  const switchCamera = () => {
    localStream?.getVideoTracks().forEach((track) => track._switchCamera());
  };

  const toggleMute = () => {
    if (!localStream) return;

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const toggleCamera = () => {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsOffCam(!track.enabled);
    });
  };

  useEffect(() => {
    startLocalStream();
  }, []);

  useEffect(() => {
    if (id.length > 0 && localStream !== null) {
      startCall(id);
    }
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      {!remoteStream && (
        <RTCView
          className="flex-1"
          streamURL={localStream && localStream.toURL()}
          objectFit={"cover"}
        />
      )}

      {remoteStream && (
        <>
          <RTCView
            style={{ flex: 1 }}
            streamURL={remoteStream && remoteStream.toURL()}
            objectFit={"cover"}
          />
          {!isOffCam && (
            <RTCView
              className="w-32 h-48 absolute right-6 top-8"
              streamURL={localStream && localStream.toURL()}
            />
          )}
        </>
      )}
      <View style={{ width: "100%", bottom: 0, position: "absolute" }}>
        <CallActionBox
          switchCamera={switchCamera}
          toggleMute={toggleMute}
          toggleCamera={toggleCamera}
          endCall={endCall}
        />
      </View>
    </View>
  );
};

export default Call;

const styles = StyleSheet.create({});
