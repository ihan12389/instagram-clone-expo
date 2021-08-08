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
  Platform,
  ImagePickerIOS,
} from "react-native";
import { connect } from "react-redux";
import { firebase } from "@firebase/app";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { bindActionCreators } from "redux";
import { updateProfile } from "../../redux/actions";

require("firebase/firestore");

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [image, setImage] = useState("");

  // 초기화 작업
  useEffect(() => {
    const { currentUser, posts } = props;

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);

      if (currentUser.photoURL == "") {
        setImage(
          "https://us.123rf.com/450wm/rainart123/rainart1231610/rainart123161000003/64244338-%EB%B0%94%EB%82%98%EB%82%98-%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8-%EB%B2%A1%ED%84%B0.jpg?ver=6"
        );
      } else {
        setImage(currentUser.photoURL);
      }
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let obj = snapshot.data();
            if (obj.photoURL == "" || obj.photoURL == null) {
              setImage(
                "https://us.123rf.com/450wm/rainart123/rainart1231610/rainart123161000003/64244338-%EB%B0%94%EB%82%98%EB%82%98-%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8-%EB%B2%A1%ED%84%B0.jpg?ver=6"
              );
            } else {
              setImage(obj.photoURL);
            }
            setUser(obj);
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

  // 갤러리 허가 요청
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
    })();
  }, []);

  // 프로필 사진 변경 기능
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      await firebase
        .auth()
        .currentUser.updateProfile({
          photoURL: image,
        })
        .then(() => {
          updateProfile(props.route.params.uid);
        })
        .catch((error) => {
          console.log(error);
        });
      await firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .update({ photoURL: result.uri })
        .then(() => {
          console.log("upload Successful");
        })
        .catch((error) => console.log(error));
    }
  };

  // 팔로우 기능
  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
  };

  // 언팔로우 기능
  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
  };

  // 로그아웃 기능
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
          {props.route.params.uid !== firebase.auth().currentUser.uid ? (
            <Image
              style={styles.profileImage}
              source={{
                uri: image,
              }}
            />
          ) : (
            <TouchableOpacity onPress={() => pickImage()}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: image,
                }}
              />
            </TouchableOpacity>
          )}
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
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("Post", {
                    uid: props.route.params.uid,
                    postId: item.id,
                    post: userPosts,
                  })
                }
              >
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
              </TouchableOpacity>
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

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateProfile,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Profile);
