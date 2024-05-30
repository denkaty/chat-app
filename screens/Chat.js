import React, { useEffect, useState } from "react";
import { IconButton } from "react-native-paper";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";
import { auth } from "../config/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
const deleteImage = require("../assets/deleteImage.jpg");
const sendImage = require("../assets/sendImage.png");

const getChatKey = (uid1, uid2) => {
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

export default function Chat({ route, navigation }) {
  const { userReceiverUid, userReceiverUsername, authenticatedUserUid, title } =
    route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleChatDelete}
        >
          <Image source={deleteImage} style={styles.deleteIcon} />
        </TouchableOpacity>
      ),
      headerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "black",
      },
    });

    const db = getDatabase();
    const chatKey = getChatKey(authenticatedUserUid, userReceiverUid);
    const messagesRef = ref(db, `chats/${chatKey}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(Object.values(data));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [authenticatedUserUid, userReceiverUsername, userReceiverUid, title]);

  const handleChatDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this chat?",
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: () => {
            const db = getDatabase();
            const chatKey = getChatKey(authenticatedUserUid, userReceiverUid);
            const chatRef = ref(db, `chats/${chatKey}`);
            remove(chatRef)
              .then(() => {
                Alert.alert("Chat Deleted", "Chat deleted successfully");
                navigation.goBack();
              })
              .catch((error) => {
                Alert.alert("Error", error.message);
              });
          },
        },
      ]
    );
  };
  const handleSend = () => {
    if (!newMessage.trim()) return;

    const db = getDatabase();
    const chatKey = getChatKey(authenticatedUserUid, userReceiverUid);
    const messageRef = ref(db, `chats/${chatKey}/messages`);
    const message = {
      senderId: authenticatedUserUid,
      message: newMessage,
      timestamp: Date.now(),
    };
    push(messageRef, message);

    setNewMessage("");
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = item.senderId === authenticatedUserUid;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        <Text style={styles.messageSender}>
          {isCurrentUser ? "You" : userReceiverUsername}
        </Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message"
        />
        <TouchableOpacity onPress={handleSend}>
          <Image source={sendImage} style={styles.sendImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    maxWidth: "80%",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#f1f1f1",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
  },
  messageSender: {
    fontWeight: "bold",
  },
  messageText: {
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#6f5aed",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  deleteButton: {
    marginRight: 10,
  },
  deleteIcon: {
    width: 30,
    height: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    fontWeight: "bold",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendImage: {
    width: 35,
    height: 35,
  },
});
