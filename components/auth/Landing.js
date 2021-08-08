import React from "react";
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";

export default function LandingScreen({ navigation }) {
  return (
    <ImageBackground
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
      }}
      source={require("../../assets/splash.png")}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.text}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: "#b3c0fb",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    opacity: 0.9,
  },
  text: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "bold",
  },
});
