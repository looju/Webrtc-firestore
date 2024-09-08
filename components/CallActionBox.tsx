import { View, Text, Pressable, Dimensions } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("screen");

type callActionsType = {
  switchCamera: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  endCall: () => void;
};

const CallActionBox = ({
  switchCamera,
  toggleMute,
  toggleCamera,
  endCall,
}: callActionsType) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const onToggleCamera = () => {
    toggleCamera();
    setIsCameraOn(!isCameraOn);
  };
  const onToggleMicrophone = () => {
    toggleMute();
    setIsMicOn(!isMicOn);
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#808080",
        backgroundColor: "#808080",
        width: width,
        borderRadius: 5,
        padding: 5,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Pressable
        onPress={switchCamera}
        style={{
          backgroundColor: "rgba(255,255,255,0.4)",
          padding: 3,
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 15,
        }}
      >
        <Text>
          <MaterialIcons name={"flip-camera-ios"} size={20} color={"red"} />
        </Text>
      </Pressable>
      <Pressable
        onPress={onToggleCamera}
        style={{
          backgroundColor: "rgba(255,255,255,0.4)",
          padding: 3,
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 15,
        }}
      >
        <Text>
          <MaterialIcons
            name={isCameraOn ? "videocam" : "videocam-off"}
            size={20}
            color={"red"}
          />
        </Text>
      </Pressable>
      <Pressable
        onPress={onToggleMicrophone}
        style={{
          backgroundColor: "rgba(255,255,255,0.4)",
          padding: 3,
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 15,
        }}
      >
        <Text>
          <MaterialIcons
            name={isMicOn ? "mic" : "mic-off"}
            size={20}
            color={"red"}
          />
        </Text>
      </Pressable>
      <Pressable
        onPress={endCall}
        style={{
          backgroundColor: "rgba(255,255,255,0.4)",
          padding: 3,
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 15,
        }}
      >
        <Text>
          <MaterialIcons name={"call-end"} size={20} color={"red"} />
        </Text>
      </Pressable>
    </View>
  );
};

export default CallActionBox;
