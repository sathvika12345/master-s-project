import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../apis";

const RegisterScreen = ({ navigation }) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [selectedRole, setSelectedRole] = useState("student");


  const handleRegister = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData={
       name:username,
       email,
       password,
       role:selectedRole,
       rollNo
    }

    api.createUser(userData).then((res)=>{
      console.log("getting respnse creating user",res);
    }).catch((err) => {
      console.log("logging error",err);
    })

    // Store registration details locally
    try {
      await AsyncStorage.setItem("userName", username);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);
      // Optionally, you can also store other registration details
    } catch (error) {
      console.error("Error storing registration details:", error);
      return;
    }

    // Navigate to login screen
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={require("./bckend.avif")}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.heading}>Register for Expo Hub</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUserName}
            autoCapitalize="words"
            placeholder="Enter your Name"
            placeholderTextColor="#fffdd0"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Roll No:</Text>
          <TextInput
            style={styles.input}
            value={rollNo}
            onChangeText={setRollNo}
            autoCapitalize="words"
            placeholder="Enter your RollNo."
            placeholderTextColor="#fffdd0"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter your Email"
            placeholderTextColor="#fffdd0"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Role:</Text>
          <Picker
            selectedValue={selectedRole}
            onValueChange={(itemValue, itemIndex) => setSelectedRole(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Reviewer" value="reviewer" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your Password"
            placeholderTextColor="#fffdd0"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password:</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirm your Password"
            placeholderTextColor="#fffdd0"
          />
        </View>
        <TouchableOpacity
          onPress={handleRegister}
          style={styles.registerButton}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.loginButton}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 20,
    color: "#004080",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: "#004080", // Change label color to navy blue
  },
  input: {
    height: 40,
    borderColor: "#004080", // Change border color to navy blue
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "100%",
    color: "#004080", // Change input text color to navy blue
  },
  registerButton: {
    backgroundColor: "#ff69b4",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    width: "70%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: "#004080",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    width: "70%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fffdd0",
    fontSize: 16,
  },
});

export default RegisterScreen;
