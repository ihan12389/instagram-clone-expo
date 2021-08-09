import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import Constants from "expo-constants";
import { firebase } from "@firebase/app";
require("firebase/firestore");
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addLikes, deleteLikes } from "../../redux/actions";

const Post = (props) => {
  const [user, setUser] = useState(null); // 현재 유저 정보
  const [posts, setPosts] = useState([]); // 현재 유저의 포스트 정보
  const [init, setInit] = useState(false); // 초기화 유무 정보

  const flatlistRef = useRef();

  // 초기화 함수
  useEffect(() => {
    matchLikesPosts();
  }, [props.route.params.uid, props.route.params.postId.likesCount]);

  async function matchLikesPosts() {
    const current_id = firebase.auth().currentUser.uid;
    const own_id = props.route.params.uid;
    const post_id = props.route.params.post.id;

    await firebase
      .firestore()
      .collection("posts")
      .doc(own_id)
      .collection("userPosts")
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          let data = doc.data();
          console.log(data);

          firebase
            .firestore()
            .collection("posts")
            .doc(own_id)
            .collection("userPosts")
            .doc(data.id)
            .collection("likes")
            .doc(current_id)
            .get()
            .then((like) => {
              console.log("df");
            });
        });
      });
  }

  // 자동 스크롤 함수
  const scrollToIndex = (index) => {
    console.log("scroll to index called !");
    flatlistRef.current.scrollToIndex({ animated: true, index: index });
  };

  // 좋아요 기능
  const onLikePress = async (userId, postId) => {
    await firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
    props.addLikes(userId, postId);
  };

  // 좋아요 취소 기능
  const onDislikePress = async (userId, postId) => {
    await firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete();
    props.deleteLikes(userId, postId);
  };

  if (user == null) {
    return null;
  }

  if (posts == []) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          keyExtractor={(item, index) => index.toString()}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatlistRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
          data={posts}
          ref={flatlistRef}
          renderItem={({ item, index }) => {
            // console.log(item);
            return (
              <View style={styles.containerImage}>
                {item.id === props.route.params.postId ? (
                  <View
                    style={styles.containerMenuBar}
                    onLayout={() => scrollToIndex(index)}
                  >
                    <View style={styles.containerMenyProfileBar}>
                      <Image
                        style={styles.containerMenuImage}
                        source={{
                          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXlVi4dFArx-iLHtok8pFLKoSxaeDYh6R-zw&usqp=CAU",
                        }}
                      />
                      <Text style={styles.containerMenuText}>{user.name}?</Text>
                    </View>
                    <Text style={styles.containerMenuButton}>❌</Text>
                  </View>
                ) : (
                  <View style={styles.containerMenuBar}>
                    <View style={styles.containerMenyProfileBar}>
                      <Image
                        style={styles.containerMenuImage}
                        source={{
                          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXlVi4dFArx-iLHtok8pFLKoSxaeDYh6R-zw&usqp=CAU",
                        }}
                      />
                      <Text style={styles.containerMenuText}>{user.name}!</Text>
                    </View>
                    <Text style={styles.containerMenuButton}>❌</Text>
                  </View>
                )}
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
                <Text>{item.caption}</Text>
                <View style={styles.containerUnderBar}>
                  {item.currentUserLike ? (
                    <Ionicons
                      style={styles.like}
                      name="heart-sharp"
                      size={24}
                      color="red"
                      onPress={() =>
                        onDislikePress(props.route.params.uid, item.id)
                      }
                    />
                  ) : (
                    <Ionicons
                      style={styles.like}
                      name="heart-outline"
                      size={24}
                      color="black"
                      onPress={() =>
                        onLikePress(props.route.params.uid, item.id)
                      }
                    />
                  )}
                  <Fontisto
                    name="comment"
                    size={19}
                    color="black"
                    onPress={() =>
                      props.navigation.navigate("Comment", {
                        postId: item.id,
                        uid: props.route.params.uid,
                      })
                    }
                  />
                </View>
                {item.likesCount !== 0 && (
                  <Text style={styles.likeText}>
                    좋아요 {item.likesCount}개
                  </Text>
                )}
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    marginTop: Constants.statusBarHeight,
    backgroundColor: "#fefefe",
    borderBottomWidth: 0.5,
    borderBottomColor: "#adadad",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    marginVertical: Dimensions.get("window").height / 60,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  containerMenuBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  containerMenyProfileBar: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  containerMenuImage: {
    width: 35,
    height: 35,
    borderRadius: 100,
    marginRight: 10,
  },
  containerMenuText: {
    fontWeight: "bold",
  },
  containerMenuButton: {
    backgroundColor: "white",
    marginRight: 10,
  },
  containerUnderBar: {
    flexDirection: "row",
    padding: 7,
  },
  like: {
    marginRight: 10,
  },
  likeText: {
    padding: 5,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      addLikes,
      deleteLikes,
    },
    dispatch
  );

export default connect(null, mapDispatchProps)(Post);
