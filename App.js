import React, { useState, useEffect, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, ActivityIndicator, Image } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Chat from "./screens/Chat";
import Home from "./screens/Home";
import MyProfile from "./screens/MyProfile";

const usersImage = require("./assets/users.png");
const profileImage = require("./assets/profile.png");

const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
    });

    return unsubscribeAuth;
  }, []);

  return (
    <AuthenticatedUserContext.Provider value={{ user }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

const AuthScreens = () => {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

const App = () => {
  const { user } = React.useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AuthenticatedTabs /> : <AuthScreens />}
    </NavigationContainer>
  );
};

const AuthenticatedTabs = () => {
  return (
    <Tab.Navigator initialRouteName="Users">
      <Tab.Screen
        name="Users"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={usersImage}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={profileImage}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const HomeStack = () => {
  return (
    <AuthStack.Navigator initialRouteName="Home">
      <AuthStack.Screen name="Home" component={Home} />
      <AuthStack.Screen name="Chat" component={Chat} />
    </AuthStack.Navigator>
  );
};

export default function AppWithProviders() {
  return (
    <AuthenticatedUserProvider>
      <App />
    </AuthenticatedUserProvider>
  );
}
