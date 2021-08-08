import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { firebase } from "@firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAsYt6-9VThEvgDEgRZROMGoF3huEV9dNQ",
  authDomain: "instagram-30f93.firebaseapp.com",
  projectId: "instagram-30f93",
  storageBucket: "instagram-30f93.appspot.com",
  messagingSenderId: "941329073280",
  appId: "1:941329073280:web:ee94b1690b0ef07b1e9265",
  measurementId: "G-HP8631LTQG",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./redux/reducers";

const store = createStore(rootReducer, applyMiddleware(thunk));

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/Save";
import CommentScreen from "./components/main/Comment";

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    // firebase.auth().signOut();
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>loading</Text>
        </View>
      );
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Add"
              component={AddScreen}
              navigation={this.props.navigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Save"
              component={SaveScreen}
              navigation={this.props.navigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Comment"
              component={CommentScreen}
              navigation={this.props.navigation}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

const style = StyleSheet.create({});
