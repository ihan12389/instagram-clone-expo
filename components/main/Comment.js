import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";

import firebase from "firebase";
require("firebase/firestore");

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";

function Comment(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }

        const user = props.users.find((x) => x.uid === comments[i].creator);
        if (user == undefined) {
          props.fetchUsersData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }

    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .orderBy("creation", "desc")
        .onSnapshot((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.users]);

  const onCommentSend = () => {
    if (text === "") {
      return;
    }

    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
      .collection("comments")
      .add({
        creator: firebase.auth().currentUser.uid,
        text,
        creation: Date.now(),
      });

    setText("");
  };

  const onCommentDelete = (commentId) => {
    console.log(commentId);
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
      .collection("comments")
      .doc(commentId)
      .delete();
  };

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <View style={styles.profileBar}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: "http://kwakhyunjoo.co.kr/web/product/big/201805/712_shop1_15266383201366.jpg",
                }}
              />
              {item.user !== undefined ? (
                <Text style={styles.name}>{item.user.name}</Text>
              ) : null}
              <Text style={styles.text}>{item.text}</Text>
            </View>
            <Text
              style={styles.cancel}
              onPress={() => onCommentDelete(item.id)}
            >
              ❌
            </Text>
          </View>
        )}
      />

      <View style={styles.inputBar}>
        <Image
          style={styles.profileImage}
          source={{
            uri: "http://kwakhyunjoo.co.kr/web/product/big/201805/712_shop1_15266383201366.jpg",
          }}
        />
        <TextInput
          style={styles.input}
          placeholder={`${props.currentUser.name}(으)로 댓글 달기...`}
          value={text}
          onChangeText={(text) => setText(text)}
        />
        {text !== "" ? (
          <Text style={styles.send} onPress={() => onCommentSend()}>
            Send
          </Text>
        ) : (
          <Text style={styles.sendNone} onPress={() => onCommentSend()}>
            Send
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  comment: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingBottom: 15,
  },

  profileBar: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 100,
    marginRight: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
    marginRight: 5,
    paddingBottom: 6,
  },
  text: {},
  cancel: {
    marginRight: 10,
  },
  inputBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  send: {
    color: "#2196f3",
    marginRight: 5,
  },
  sendNone: {
    color: "#2196f3",
    opacity: 0.5,
    marginRight: 5,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  users: store.usersState.users,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);
