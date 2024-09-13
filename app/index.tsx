import {
  Image,
  StyleSheet,
  Platform,
  View,
  Alert,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "@/Config/Firebase";
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
import * as Clipboard from "expo-clipboard";
import { nanoid } from "nanoid/non-secure";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  BounceInDown,
  BounceInUp,
  FadeIn,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  ZoomIn,
} from "react-native-reanimated";
import Tooltip from "react-native-walkthrough-tooltip";
import InlineAd from "./InlineAd";

const { width, height } = Dimensions.get("screen");

export default function HomeScreen() {
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
  const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
  const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity);
  const AnimatedTxt = Animated.createAnimatedComponent(Text);
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();
  const [showTip, setShowTip] = useState(false);
  const onCallOrJoin = () => {
    if (roomId !== null) {
      // navigation.navigate("call", { roomId });
    }
  };

  const checkMeeting = async () => {
    if (roomId.length > 0) {
      const roomRef = doc(db, "room", roomId);
      const roomSnapshot = await getDoc(roomRef);

      if (!roomSnapshot.exists() || roomId === "") {
        console.log(`Room ${roomId} does not exist.`);
        Alert.alert("Wait for your instructor to start the meeting.");
        return;
      } else if (roomSnapshot.exists()) {
        router.push({ pathname: "/join", params: { id: roomId } });
      }
    } else {
      Alert.alert("Please enter a room Id");
    }
  };

  const copy = async () => {
    if (roomId !== "") {
      await Clipboard.setStringAsync(roomId);
      setShowTip(true);
    } else if (roomId == "") {
      Alert.alert("Please enter a room Id to copy");
    }
  };

  useEffect(() => {
    const generateRoomId = nanoid();
    setRoomId(generateRoomId);
  }, []);

  return (
    <View style={styles.main}>
      <Text style={styles.roomTitle}>Enter Room ID</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={roomId}
          onChangeText={(text: string) => setRoomId(text)}
        />
        <Tooltip
          isVisible={showTip}
          content={<Text>Copied!</Text>}
          onClose={() => setShowTip(false)}
          closeOnBackgroundInteraction={true}
          placement="bottom"
          showChildInTooltip={false}
          disableShadow
        >
          <Ionicons
            name="copy-outline"
            style={styles.icon}
            size={20}
            onPress={() => copy()}
          />
        </Tooltip>
      </View>

      <View style={styles.btnView}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            router.push({ pathname: "/call", params: { id: roomId } })
          }
        >
          <Text style={styles.btnTxt}>Start meeting</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => checkMeeting()}>
          <Text style={styles.btnTxt}>Join meeting</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }} />
      <InlineAd />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: width * 0.6,
  },
  btnView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 20,
  },
  btn: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
  },
  btnTxt: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    left: 15,
  },
});
