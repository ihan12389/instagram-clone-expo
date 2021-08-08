import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import { firebase } from "@firebase/app";
import { NavigationContainer } from "@react-navigation/native";

require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(props.route.params.image);

  const uploadImage = async () => {
    const uri = props.route.params.image;
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred : ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,
        likesCount: 0,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.replace("Main");
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
      keyboardVerticalOffset="0"
    >
      <ScrollView style={{ flex: 1 }}>
        {image && (
          <Image source={{ uri: image }} style={{ aspectRatio: 1 / 1 }} />
        )}
        <TextInput
          style={{
            fontSize: 16,
            marginTop: 10,
          }}
          placeholder="Write a Caption . . . "
          onChangeText={(caption) => setCaption(caption)}
          multiline={true}
        />
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 20,
              paddingVertical: 5,
              marginTop: 30,
              marginBottom: 30,
              borderWidth: 3,
              borderColor: "#555555",
              width: Dimensions.get("window").width / 1.8,
            }}
            onPress={() => uploadImage()}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#777777" }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
