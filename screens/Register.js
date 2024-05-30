import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { createUserInDatabase } from "../utils/firebaseUtils";

const logo = require("../assets/vtu-logo.png");

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!email.trim()) {
      Alert.alert("Authentication error", "Email is required");
      return;
    }
    if (!password) {
      Alert.alert("Authentication error", "Password is required");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Authentication error", "Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password, username)
      .then((userCredential) => {
        const user = userCredential.user;
        createUserInDatabase(user.uid, user.email, username);
        Alert.alert(`Welcome`, `Welcome, ${username}!`);
      })
      .catch((error) => Alert.alert("Authentication error", error.message));
    
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.form}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={false}
          value={email.toLowerCase()}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          textContentType="username"
          autoFocus={false}
          value={username.toLowerCase()}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          secureTextEntry={true}
          textContentType="password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.signupTextContainer}>
          <Text style={styles.signupText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.signupText, { color: "#3b407a" }]}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 275,
    height: 275,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3b407a",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 15,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  button: {
    backgroundColor: "#3b407a",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 18,
  },
  signupTextContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  signupText: {
    color: "gray",
    fontWeight: "600",
    fontSize: 14,
  },
});
