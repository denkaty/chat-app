// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useLayoutEffect,
// } from "react";
// import {
//   View,
//   TextInput,
//   Button,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import { auth } from "../config/firebase";
// import { Text } from "react-native-paper";
// import { child, get, getDatabase, ref, set } from "firebase/database";
// import { signOut, updateEmail } from "firebase/auth";
// import { useNavigation } from "@react-navigation/native";
// const logoutImage = require("../assets/logout.webp");
// const defaultProfilePicture = require("../assets/profilePicture.webp");

// const MyProfile = () => {
//   const [user, setUser] = useState(null);
//   const [newEmail, setNewEmail] = useState("");
//   const [profilePicture, setProfilePicture] = useState(null);
//   const navigation = useNavigation();

//   const handleLogout = () => {
//     Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
//       {
//         text: "Cancel",
//       },
//       {
//         text: "OK",
//         onPress: () => {
//           signOut(auth)
//             .then(() => {
//               Alert.alert(
//                 "Logged Out",
//                 "You have been successfully logged out"
//               );
//             })
//             .catch((error) => {
//               Alert.alert("Error", error.message);
//             });
//         },
//       },
//     ]);
//   };

//   const handleUpdateEmail = () => {
//     if (newEmail.trim() === "") {
//       Alert.alert("Error", "The new email can not be an empty string");
//       return;
//     }

//     if (user.email === newEmail) {
//       Alert.alert(
//         "Error",
//         "The new email address is the same as your current one"
//       );
//       return;
//     }

//     Alert.alert(
//       "Confirm Email Update",
//       "Are you sure you want to update your email?",
//       [
//         {
//           text: "Cancel",
//         },
//         {
//           text: "OK",
//           onPress: async () => {
//             try {
//               const currentUser = auth.currentUser;
//               const userId = currentUser.uid;

//               await updateEmail(currentUser, newEmail);

//               const updatedUser = { ...user, email: newEmail };
//               setUser(updatedUser);

//               const db = getDatabase();
//               const emailRef = ref(db, `users/${userId}/email`);
//               console.log("Email reference:", emailRef);

//               await set(emailRef, newEmail);

//               Alert.alert("Success", "Email updated successfully");
//             } catch (error) {
//               Alert.alert("Error", error.message);
//             }
//           },
//         },
//       ]
//     );
//   };

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Image source={logoutImage} style={styles.logoutIcon} />
//         </TouchableOpacity>
//       ),
//       headerStyle: {
//         borderBottomWidth: 1,
//         borderBottomColor: "black",
//       },
//     });
//   }, [navigation, handleLogout]);

//   useEffect(() => {
//     const unsubscribeAuth = auth.onAuthStateChanged((authenticatedUser) => {
//       setUser(authenticatedUser);
//     });
//     return unsubscribeAuth;
//   }, []);

//   if (!user) {
//     return (
//       <View>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.profilePictureContainer}>
//         {profilePicture ? (
//           <Image
//             source={{ profilePicture }}
//             style={styles.profilePicture}
//           />
//         ) : (
//           <Image
//             source={defaultProfilePicture}
//             style={styles.defaultProfilePicture}
//           />
//         )}
//       </View>
//       <View style={styles.emailContainer}>
//         <Text style={styles.emailLabel}>Email: {user.email}</Text>
//       </View>
//       <View style={styles.emailContainer}>
//         <Text style={styles.emailLabel}>Username: {}</Text>
//       </View>
//       <TextInput
//         style={styles.input}
//         placeholder="New Email"
//         onChangeText={setNewEmail}
//         value={newEmail}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
//         <Text style={styles.buttonText}>Update Email</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     padding: 20,
// //   },
// //   emailContainer: {
// //     marginBottom: 20,
// //     alignItems: "center",
// //   },
// //   emailLabel: {
// //     fontSize: 20,
// //     fontWeight: "bold",
// //     marginBottom: 5,
// //   },
// //   input: {
// //     height: 40,
// //     width: 300,
// //     borderColor: "#ccc",
// //     borderWidth: 1,
// //     marginBottom: 20,
// //     paddingHorizontal: 10,
// //   },
// //   logoutButton: {
// //     marginRight: 10,
// //   },
// //   logoutIcon: {
// //     width: 35,
// //     height: 35,
// //   },
// //   button: {
// //     backgroundColor: "#3b407a",
// //     height: 48,
// //     borderRadius: 10,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginTop: 10,
// //     width: 150,
// //   },
// //   buttonText: {
// //     fontWeight: "bold",
// //     color: "#fff",
// //     fontSize: 18,
// //   },
// // });
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   profilePictureContainer: {
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   profilePicture: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//   },
//   defaultProfilePicture: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//   },
//   emailContainer: {
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   emailLabel: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   input: {
//     height: 40,
//     width: 300,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   logoutButton: {
//     marginRight: 10,
//   },
//   logoutIcon: {
//     width: 35,
//     height: 35,
//   },
//   button: {
//     backgroundColor: "#3b407a",
//     height: 48,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 10,
//     width: 150,
//   },
//   buttonText: {
//     fontWeight: "bold",
//     color: "#fff",
//     fontSize: 18,
//   },
// });
// export default MyProfile;

import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { auth } from "../config/firebase";
import { Text } from "react-native-paper";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { signOut, updateEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
const logoutImage = require("../assets/logout.webp");
const defaultProfilePicture = require("../assets/profilePicture.webp");
const applyImage = require("../assets/apply.png");

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
      },
      {
        text: "OK",
        onPress: () => {
          signOut(auth)
            .then(() => {
            })
            .catch((error) => {
              Alert.alert("Error", error.message);
            });
        },
      },
    ]);
  };

  const handleUpdateEmail = () => {
    if (newEmail.trim() === "") {
      Alert.alert("Error", "The new email can not be an empty string");
      return;
    }

    if (user.email === newEmail) {
      Alert.alert(
        "Error",
        "The new email address is the same as your current one"
      );
      return;
    }

    Alert.alert(
      "Confirm Email Update",
      "Are you sure you want to update your email?",
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const currentUser = auth.currentUser;
              const userId = currentUser.uid;

              await updateEmail(currentUser, newEmail);

              const updatedUser = { ...user, email: newEmail };
              setUser(updatedUser);

              const db = getDatabase();
              const emailRef = ref(db, `users/${userId}/email`);
              console.log("Email reference:", emailRef);

              await set(emailRef, newEmail);

              Alert.alert("Success", "Email updated successfully");
              setNewEmail("");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };
  const handleUpdateUsername = async () => {
    if (newUsername.trim() === "") {
      Alert.alert("Error", "The new username cannot be an empty string");
      return;
    }

    if (username === newUsername) {
      Alert.alert("Error", "The new username is the same as your current one");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      const userId = currentUser.uid;

      const db = getDatabase();
      const usernameRef = ref(db, `users/${userId}/username`);

      await set(usernameRef, newUsername);

      setUsername(newUsername);

      Alert.alert("Success", "Username updated successfully");
      setNewUsername("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const fetchUserData = async (uid) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${uid}`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setProfilePicture(userData.profilePicture);
        setUsername(userData.username);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Image source={logoutImage} style={styles.logoutIcon} />
        </TouchableOpacity>
      ),
      headerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "black",
      },
    });
  }, [navigation, handleLogout]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((authenticatedUser) => {
      setUser(authenticatedUser);
      if (authenticatedUser) {
        fetchUserData(authenticatedUser.uid);
      }
    });
    return unsubscribeAuth;
  }, []);

  if (!user) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
        ) : (
          <Image
            source={defaultProfilePicture}
            style={styles.defaultProfilePicture}
          />
        )}
      </View>
      <View style={styles.emailContainer}>
        <Text style={styles.emailLabel}>Email: {user.email}</Text>
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Email"
            onChangeText={setNewEmail}
            value={newEmail}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdateEmail}
          >
            <Image source={applyImage} style={styles.saveImage} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.emailContainer}>
        <Text style={styles.emailLabel}>Username: {username}</Text>
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Username"
            onChangeText={setNewUsername}
            value={newUsername}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdateUsername}
          >
            <Image source={applyImage} style={styles.saveImage} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profilePictureContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  defaultProfilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  emailContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  emailLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 40,
    width: 250,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  saveButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  saveImage: {
    width: 30,
    height: 30,
  },
  logoutButton: {
    marginRight: 10,
  },
  logoutIcon: {
    width: 35,
    height: 35,
  },
  button: {
    backgroundColor: "#3b407a",
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    width: 150,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 18,
  },
});

export default MyProfile;
