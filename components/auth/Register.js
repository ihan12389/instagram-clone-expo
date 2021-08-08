import React, { Component } from "react";
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import firebase from "firebase";

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ``,
      password: ``,
      name: "",
      photoURL: "",
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    };
    this.onSignup = this.onSignup.bind(this);
  }

  onSignup() {
    const { email, password, name, photoURL } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({ name, email, photoURL });
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
        }}
      >
        <View
          style={{
            flex: 1,
            width: this.state.width,
            marginTop: this.state.height / 20,
            alignItems: "center",
          }}
        >
          <TextInput
            style={styles.input}
            placeholder="name"
            onChangeText={(name) => this.setState({ name })}
          />
          <TextInput
            style={styles.input}
            placeholder="email"
            onChangeText={(email) => this.setState({ email })}
          />
          <TextInput
            style={styles.input}
            placeholder="password"
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password })}
          />
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => this.onSignup()}
          >
            <Text style={styles.text}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: "80%",
    borderBottomColor: "#dddddd",
    borderBottomWidth: 2,
    fontSize: 18,
    marginBottom: 20,
    paddingLeft: 10,
    paddingBottom: 5,
  },
  touchable: {
    backgroundColor: "#b3c0fb",
    borderRadius: 10,
    padding: 10,
  },
  text: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
});
