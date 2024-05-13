import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Header } from '@react-navigation/stack';
import * as DocumentPicker from 'expo-document-picker';


const AboutScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Navigate to the login screen
    navigation.navigate('Login');
  };

  

  const CustomHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('./logo2.png')} style={styles.logo} />
        </TouchableOpacity>
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => navigation.navigate('About')}>
            <Text style={styles.tabText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.tabText}>Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.tabText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={require('./bckend.avif')} style={styles.background}>
      <View style={styles.container}>
        <CustomHeader />
        
        <Image source={require('./about.jpeg')} style={styles.image} />
        <View style={styles.content}>
          <Text style={[styles.text, styles.purpleText]}>
            About Us
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: Header.HEIGHT,
    backgroundColor: '#333333', // Background color of the header
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Border color
  },
  logo: {
    width: 65, // Adjust the width of the logo as needed
    height: 50, 
    borderRadius: 10,// Adjust the height of the logo as needed
  },
  tabs: {
    flexDirection: 'row',
  },
  tabText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#fff', // Color of the tab text
  },
  image: {
    width: '100%', // Adjust the width of the image as needed
    height: 200, // Adjust the height of the image as needed
    resizeMode: 'cover', // Adjust the image resizing mode as needed
  },
  purpleText: {
    color: '#800080', // Purple color code
    fontWeight: 'bold',
    fontSize: 22, // Optionally, make the text bold
  },
  text: {
    marginBottom: 15,
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 15,
    marginHorizontal: 15,
    textAlign: 'justify',
  },
  uploadButton: {
    backgroundColor: '#800080', // Purple color code
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    margin: 20,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default AboutScreen;