import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Header } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Navigate to the login screen
    navigation.navigate('Login');
  };

  const [profileImage, setProfileImage] = useState(null);

  const [userName,setUserName] = useState("");
  const [email,setEmail] = useState('');
  const [role,setRole] = useState("");
  const [userId,setuserId]=useState("");

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Please allow access to your photo library to upload a profile picture.');
      return;
    }

    const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!imagePickerResult.cancelled) {
      setProfileImage(imagePickerResult.uri);
    }
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


  // Retrieving the username
AsyncStorage.getItem('username')
.then(userName => {
  console.log('Retrieved username:', userName);
  setUserName(userName);
})
.catch(error => {
  console.error('Error retrieving username:', error);
});

AsyncStorage.getItem('role')
.then(userRole => {
  console.log('Retrieved username:', userRole);
  setRole(userRole);
})
.catch(error => {
  console.error('Error retrieving username:', error);
});

AsyncStorage.getItem('userId')
.then(userid => {
  console.log('Retrieved userID:', userid);
  setuserId(userid);
})
.catch(error => {
  console.error('Error retrieving UserID:', error);
});



  console.log("getitng usrname ",userName);
  return (
    <ImageBackground source={require('./bckend.avif')} style={styles.background}>
      <View style={styles.container}>
        <CustomHeader />
        
        <TouchableOpacity onPress={handleImageUpload}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image source={require('./profile.webp')} style={styles.profileImage} />
          )}
        </TouchableOpacity>
        
        <Text style={styles.profileName}>{userName}</Text>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
              UserID:{userId}
          </Text>
          <Text style={styles.descriptionText}>
              Role:{role}
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
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginTop: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  descriptionContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
