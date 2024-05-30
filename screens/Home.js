import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { auth } from "../config/firebase";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { fetchUsers } from "../utils/firebaseUtils";
const profilePicture = require("../assets/profilePicture.webp");

export default function Home() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { email: currentUserEmail, uid: authenticatedUserUid } =
    auth.currentUser;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "black",
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      fetchUserList(currentUserEmail);
    }
  }, [isFocused]);

  const fetchUserList = useCallback((email) => {
    const unsubscribe = fetchUsers(email, setUsers);
    return () => unsubscribe();
  }, []);

  const handleChat = useCallback(
    (userReceiver) => {
      const {
        uid: userReceiverUid,
        username: userReceiverUsername,
        email: userEmail,
      } = userReceiver;
      console.log(
        "Navigating to Chat with:",
        userReceiverUid,
        authenticatedUserUid
      );
      navigation.navigate("Chat", {
        userReceiverUid,
        userReceiverUsername,
        authenticatedUserUid,
        title: userReceiverUsername,
      });
    },
    [authenticatedUserUid, navigation]
  );

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleChat(item)}>
    <View style={styles.userContainer}>
      <Image source={profilePicture} style={styles.profilePicture} />
      <View style={styles.userItem}>
        <Text style={styles.userText}>{item.username}</Text>
      </View>
    </View>
  </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.title}>Users</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by email..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={users.filter((userReceiver) =>
          userReceiver.email.toLowerCase().includes(searchText.toLowerCase())
        )}
        renderItem={renderUserItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchContainer: {
    alignItems: "center",
  },
  searchInput: {
    width: "90%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userText: {
    fontSize: 18,
  },
  logoutButton: {
    marginRight: 10,
  },
  logoutIcon: {
    width: 35,
    height: 35,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 20,
    height: 40,
  },
});
