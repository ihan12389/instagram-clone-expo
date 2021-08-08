import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import firebase from "firebase";

export default class LoginScree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ``,
      password: ``,
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    };
    this.onSignup = this.onSignup.bind(this);
  }

  onSignup() {
    const { email, password, name } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
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
          backgroundColor: "#ffffff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            width: this.state.width,
            alignItems: "center",
            marginTop: this.state.height / 20,
          }}
        >
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
            <Text style={styles.text}>Log in</Text>
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
