import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground, Dimensions } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../apis";

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // // Check if the provided email and password match the credentials for the reviewer
    // if (email === 'reviewer@gmail.com' && password === 'password') {
    //   // Navigate to the homepage with the reviewer dashboard
    //   navigation.navigate('ReviewerDashboard');
    // } else if (email === 'vishnu@gmail.com' && password === 'password') {
    //   // Navigate to the HomeScreen component
    //   navigation.navigate('Home');
    // } else {
    //   // For other users, you can implement similar checks and navigate accordingly
    //   // For simplicity, let's navigate them to a generic homepage
    //   navigation.navigate('Home');
    // }

    const loginData={
      userEmail: email,
      password: password
    }

    api.login(loginData).then((res)=>{
      console.log("Login response",res.data);
      const token=res.data.token;
      console.log("token",token);

      const userData=res.data.userData;
      const {username,userId,role}=userData;

      console.log("username",username);
      console.log("userId",userId);
      console.log("role",role);
  

      
      // navigation.navigate('ReviewerDashboard');
      AsyncStorage.setItem('token',token);
      AsyncStorage.setItem('userId',userId.toString());
      AsyncStorage.setItem('role',role);
      AsyncStorage.setItem('username',username);
      navigation.navigate('Home');

    }).catch((err)=>{
        alert("Cannot Login Invalid Credentials");
        console.log("error loggin the user",err);
    });


  };
  

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('./bckend.avif')} 
        style={styles.background} 
        resizeMode="cover"
      >
        <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <Text style={styles.heading}>EXPO HUB</Text> 
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
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerButton}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  heading: {
    fontSize: 43,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
    color: '#004080',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%', // Adjust the width as needed
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#004080', // Change label color to navy blue
  },
  input: {
    height: 40,
    borderColor: '#004080', // Change border color to navy blue
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '100%',
    color: '#004080', // Change input text color to navy blue
  },
  loginButton: {
    backgroundColor: '#004080',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    width: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  registerButton: {
    backgroundColor: '#ff69b4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    width: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  getStartedButton: {
    backgroundColor: '#6b52ae',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    width: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fffdd0',
    fontSize: 16,
  },
});

export default LoginScreen;
