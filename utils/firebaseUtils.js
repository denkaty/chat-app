import { getDatabase, ref, onValue, set, get } from "firebase/database";

export const fetchUsers = async (currentUserEmail, setUsers) => {
  const db = getDatabase();
  const usersRef = ref(db, "users");

  const unsubscribe = onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const usersArray = Object.keys(data)
        .map((key) => ({
          uid: key,
          ...data[key],
        }))
        .filter((user) => user.email !== currentUserEmail)
        .sort((a, b) => a.email.localeCompare(b.email));
      setUsers(usersArray);
    }
  });

  return unsubscribe;
};

export const createUserInDatabase = (uid, email, username) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${uid}`);
  return set(userRef, { email: email, username: username });
};

export const fetchUserData = async (uid) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${uid}`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
};
