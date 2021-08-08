import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useFocusEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import Constants from "expo-constants";
import firebase from "firebase";
require("firebase/firestore");
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";

const Post = (props) => {
  const [yPosition, setYPosition] = useState(0);

  const [user, setUser] = useState(null);
  const [idx, setIdx] = useState(0);

  const flatlistRef = useRef();

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(props.route.params.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUser(doc.data());
        } else {
          console.log("Can't find user!");
        }
      })
      .catch((error) => console.log(error));
  }, [idx]);

  const scrollToIndex = () => {
    console.log("scroll to index called !");
    flatlistRef.current.scrollToIndex({ animated: true, index: idx });
  };

  if (user == null) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          initialScrollIndex={0}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatlistRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
          data={props.route.params.post}
          ref={flatlistRef}
          renderItem={({ item }) => {
            return (
              <View
                style={styles.containerImage}
                onLayout={() => setIdx(idx + 1)}
              >
                {item.id === props.route.params.postId ? (
                  <View
                    style={styles.containerMenuBar}
                    onLayout={() => scrollToIndex()}
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

export default Post;
