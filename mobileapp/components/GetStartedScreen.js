import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const GetStartedScreen = ({ navigation }) => {
  const handleGetStarted = () => {
    // Navigate to the login screen or any other screen
    navigation.navigate('Login');
  };

  return (
    <ImageBackground source={require('./bckend.avif')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.heading}>Welcome to Expo Hub</Text>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started {'\u2192'}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    color: '#004080',
  },
  getStartedButton: {
    backgroundColor: '#ff69b4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '50%',
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

export default GetStartedScreen;
