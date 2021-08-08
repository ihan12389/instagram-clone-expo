import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { firebase } from "@firebase/app";
import Constants from "expo-constants";
import { DebugInstructions } from "react-native/Libraries/NewAppScreen";

require("firebase/firestore");

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const { currentUser, posts } = props;

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("does not exist");
          }
        });
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }
    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
  };

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
  };

  const onLogout = () => {
    firebase.auth().signOut();
  };

  if (user === null) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text style={styles.name}>{user.name}</Text>
        <View style={styles.profileBar}>
          <Image
            style={styles.profileImage}
            source={{
              uri: "https://t1.daumcdn.net/cfile/tistory/99C85D3E5D33046624",
            }}
          />
          <Text style={styles.email}>{user.email}</Text>
        </View>
        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View style={styles.middleBar}>
            {following ? (
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={() => onUnfollow()}>
                  Following
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={() => onFollow()}>
                  Follow
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.middleBar}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText} onPress={() => onLogout()}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: "#ffffff",
  },
  containerInfo: {},
  profileBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: Dimensions.get("window").width / 4.3,
    height: Dimensions.get("window").width / 4.3,
    borderRadius: 100,
    marginRight: 10,
  },
  name: {
    fontSize: Dimensions.get("window").width / 15,
    fontWeight: "bold",
    paddingBottom: 5,
    paddingLeft: Dimensions.get("window").width / 30,
  },
  email: {
    fontSize: 20,
    marginLeft: 25,
  },
  middleBar: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderColor: "#dddddd",
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: Dimensions.get("window").width / 3,
    paddingVertical: Dimensions.get("window").height / 120,
    marginTop: Dimensions.get("window").height / 30,
    marginBottom: Dimensions.get("window").height / 10,
  },
  buttonText: {
    fontSize: 16,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
    margin: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(Profile);
