import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Hoverable,
  Dimensions,
} from "react-native";
import { firebase } from "@firebase/app";
import Constants from "expo-constants";

export default function Search(props) {
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    console.log(search);
    if (search == "") {
      return setUsers([]);
    }
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .where("name", "<=", search + "\uf8ff")
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;

          console.log(data);
          return { id, ...data };
        });
        setUsers(users);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="🔎   검색"
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.user}
            onPress={() =>
              props.navigation.navigate("Profile", { uid: item.id })
            }
          >
            <Image
              style={styles.image}
              source={{
                uri: "http://kwakhyunjoo.co.kr/web/product/big/201805/712_shop1_15266383201366.jpg",
              }}
            />
            <View style={styles.textBar}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "90%",
    marginTop: 20,
    backgroundColor: "#dddddd",
    fontSize: 16,
    padding: 7,
    paddingLeft: 15,
    borderRadius: 7,
    marginBottom: Dimensions.get("window").height / 20,
  },
  user: {
    width: Dimensions.get("window").width / 1.1,
    flexDirection: "row",
    marginBottom: 20,
  },
  image: {
    width: Dimensions.get("window").width / 10,
    height: Dimensions.get("window").width / 10,
    borderRadius: 100,
    marginRight: 20,
  },
  textBar: {},
  name: {
    fontSize: 16,
  },
  email: {
    fontSize: 14,
    color: "#777777",
  },
});
