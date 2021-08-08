import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Button,
  Dimensions,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addLikes, deleteLikes } from "../../redux/actions";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";

function Feed(props) {
  const [posts, setPosts] = useState([]);

  // 피드 변화 생길 때마다 state 업데이트
  useEffect(() => {
    if (
      props.usersFollowingLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      // 피드 정렬
      props.feed.sort(function (x, y) {
        return x.creation - y.creation;
      });
      // 피드를 State에 저장
      setPosts(props.feed);
    }
  }, [props.usersFollowingLoaded, props.feed, props.feed.likesCount]);

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
    console.log(props.feed);
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
    console.log(props.feed);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>Hanstagram</Text>
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => {
            return (
              <View style={styles.containerImage}>
                <View style={styles.containerMenuBar}>
                  <View style={styles.containerMenyProfileBar}>
                    <Image
                      style={styles.containerMenuImage}
                      source={{
                        uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXlVi4dFArx-iLHtok8pFLKoSxaeDYh6R-zw&usqp=CAU",
                      }}
                    />
                    <Text style={styles.containerMenuText}>
                      {item.user.name}
                    </Text>
                  </View>
                  <Text style={styles.containerMenuButton}>❌</Text>
                </View>
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
                <View style={styles.containerUnderBar}>
                  {item.currentUserLike ? (
                    <Ionicons
                      style={styles.like}
                      name="heart-sharp"
                      size={24}
                      color="red"
                      onPress={() => onDislikePress(item.user.uid, item.id)}
                    />
                  ) : (
                    <Ionicons
                      style={styles.like}
                      name="heart-outline"
                      size={24}
                      color="black"
                      onPress={() => onLikePress(item.user.uid, item.id)}
                    />
                  )}
                  <Fontisto
                    name="comment"
                    size={19}
                    color="black"
                    onPress={() =>
                      props.navigation.navigate("Comment", {
                        postId: item.id,
                        uid: item.user.uid,
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
}

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

// 스토어에 state 가져오기
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser, // 현재유저
  following: store.userState.following, // 팔로윙유저
  feed: store.usersState.feed, // 피드
  usersFollowingLoaded: store.usersState.usersFollowingLoaded, // 로드된 팔로윙 유저 수
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      addLikes,
      deleteLikes,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Feed);
