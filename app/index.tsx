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
// import * as Clipboard from "expo-clipboard"; i have to rebuild the dev client later
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

const { width, height } = Dimensions.get("screen");

export default function HomeScreen() {
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
  const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
  const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity);
  const AnimatedTxt = Animated.createAnimatedComponent(Text);
  const [roomId, setRoomId] = useState<string | null>(null);
  const router = useRouter();
  const [showTip, setShowTip] = useState(false);
  const onCallOrJoin = () => {
    if (roomId !== null) {
      // navigation.navigate("call", { roomId });
    }
  };

  const checkMeeting = async () => {
    if (roomId) {
      const roomRef = doc(db, "room", roomId);
      const roomSnapshot = await getDoc(roomRef);

      if (!roomSnapshot.exists() || roomId === "") {
        console.log(`Room ${roomId} does not exist.`);
        Alert.alert("Wait for your instructor to start the meeting.");
        return;
      }
    } else {
      Alert.alert("Please enter a room Id");
    }
  };

  const copy = async () => {
    if (roomId !== null) {
      await Clipboard.setStringAsync(roomId);
      setShowTip(true);
    }
    Alert.alert("Please enter a roomId to copy");
  };

  useEffect(() => {
    const generateRoomId = nanoid();
    setRoomId(generateRoomId);
  }, []);

  return (
    <View style={styles.main}>
      <AnimatedTxt
        style={styles.roomTitle}
        entering={FadeIn.duration(4000).mass(2)}
      >
        Enter Room ID
      </AnimatedTxt>
      <View style={styles.row}>
        <AnimatedTextInput
          style={styles.input}
          value={roomId}
          onChangeText={(text: string) => setRoomId(text)}
          entering={ZoomIn.duration(2000)}
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
          <AnimatedIcon
            name="copy-outline"
            style={styles.icon}
            size={20}
            onPress={() => copy()}
            entering={SlideInRight.duration(2000).springify()}
          />
        </Tooltip>
      </View>

      <View style={styles.btnView}>
        <AnimatedBtn
          style={styles.btn}
          onPress={() =>
            router.push({ pathname: "/call", params: { id: roomId } })
          }
          entering={SlideInDown.duration(2000)}
        >
          <Text style={styles.btnTxt}>Start meeting</Text>
        </AnimatedBtn>
        <AnimatedBtn
          style={styles.btn}
          onPress={() => checkMeeting()}
          entering={SlideInDown.duration(2000)}
        >
          <Text style={styles.btnTxt}>Join meeting</Text>
        </AnimatedBtn>
      </View>
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
