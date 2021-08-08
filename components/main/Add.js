import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export default function Add({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState("granted");
  const [hasCameraPermission, setHasCameraPermission] = useState("granted");
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const cancel = () => {
    return console.log(setImage(null));
  };

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }

  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>no Permission</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        {isFocused && (
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.fixedRatio}
            type={type}
            ratio={"1:1"}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Ionicons
                size={40}
                style={styles.icon}
                name="md-camera-reverse"
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              />
              <Ionicons
                size={40}
                style={styles.icon}
                name="images-outline"
                onPress={() => pickImage()}
              />
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Ionicons
                size={70}
                style={styles.iconMain}
                name="camera"
                onPress={() => takePicture()}
              />
            </View>
          </Camera>
        )}
      </View>
      {/* {image && (
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => cancel()}
        >
          <Text style={styles.buttonText}>Cancle</Text>
        </TouchableOpacity>
      )} */}
      {image ? (
        <View
          style={{ flex: 1, alignItems: "center", backgroundColor: "black" }}
        >
          <Image
            source={{ uri: image }}
            style={{
              // flex: 1,
              aspectRatio: 1 / 1,
              width: "100%",
              margin: 0,
              padding: 0,
            }}
          />
          <View
            style={{
              width: "100%",
              position: "absolute",
              bottom: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Feather
              name="delete"
              size={50}
              color="#0330f4"
              style={{
                opacity: 0.4,
                margin: 20,
              }}
              onPress={() => cancel()}
            />
            <AntDesign
              name="arrowright"
              size={50}
              color="#0330f4"
              style={{
                opacity: 0.4,
                margin: 20,
              }}
              onPress={() => {
                setImage(null);
                navigation.navigate("Save", { image });
              }}
            />
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Image
            style={{ flex: 1 }}
            source={{
              uri: "https://png.pngtree.com/png-vector/20190116/ourlarge/pngtree-camera-line-filled-icon-png-image_321284.jpg",
            }}
            style={{
              flex: 1,
            }}
          />
          <AntDesign
            name="arrowright"
            size={50}
            color="#0330f4"
            style={{
              position: "absolute",
              right: 10,
              bottom: 10,
              opacity: 0.4,
            }}
            onPress={() => {
              setImage(null);
              navigation.navigate("Save", { image });
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: Constants.statusBarHeight,
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "space-between",
  },
  buttonContainer: {
    width: "100%",
    backgroundColor: "pink",
    padding: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  icon: {
    color: "white",
    opacity: 0.4,
    margin: 10,
  },
  iconMain: {
    color: "white",
    opacity: 0.8,
    margin: 10,
  },
});
