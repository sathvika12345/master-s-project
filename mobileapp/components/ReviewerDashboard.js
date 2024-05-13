import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ImageBackground } from 'react-native';
import { Header } from '@react-navigation/stack';
import * as DocumentPicker from 'expo-document-picker';

const ReviewerDashboard = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [abstractRequests, setAbstractRequests] = useState([]);

  const handleLogout = () => {
    // Navigate to the login screen
    navigation.navigate('Login');
  };


  const handleSearch = () => {
    // Implement your search functionality here
    console.log('Search Query:', searchQuery);
  };

  // Mock data for abstract requests (replace with actual data)
  const mockAbstractRequests = [
    { id: 1, title: 'Abstract Request 1', author: 'Author 1' },
    { id: 2, title: 'Abstract Request 2', author: 'Author 2' },
    { id: 3, title: 'Abstract Request 3', author: 'Author 3' },
  ];

  // Function to fetch abstract requests (replace with actual API call)
  const fetchAbstractRequests = () => {
    // Simulate fetching abstract requests
    setTimeout(() => {
      setAbstractRequests(mockAbstractRequests);
    }, 1000); // Simulating 1 second delay
  };

  // Fetch abstract requests when the component mounts
  React.useEffect(() => {
    fetchAbstractRequests();
  }, []);

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
        
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              value={searchQuery}
            />
            <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
          
         
          
          {/* Display Abstract Requests */}
          <View style={styles.abstractRequestsContainer}>
            <Text style={styles.abstractRequestsHeading}>Abstract Requests</Text>
            {abstractRequests.map((request) => (
              <View key={request.id} style={styles.abstractRequest}>
                <Text>Title: {request.title}</Text>
                <Text>Author: {request.author}</Text>
              </View>
            ))}
          </View>
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
    height: 50, // Adjust the height of the logo as needed
    borderRadius: 10,
  },
  tabs: {
    flexDirection: 'row',
  },
  tabText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#fff', // Color of the tab text
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff', // Background color of the search bar
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#800080', // Purple color code
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10, // Add left margin for spacing
  },
  searchButtonText: {
    color: '#fff', // Text color
    fontSize: 16, // Font size
    fontWeight: 'bold', // Font weight
  },
  image: {
    width: '100%', // Adjust the width of the image as needed
    height: 200, // Adjust the height of the image as needed
    resizeMode: 'cover', // Adjust the image resizing mode as needed
    marginBottom: 10,
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
  abstractRequestsContainer: {
    marginTop: 20,
  },
  abstractRequestsHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 15,
    color: '#800080', // Purple color code
  },
  abstractRequest: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  uploadInfoText: {
    marginBottom: 15,
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 5,
    marginHorizontal: 15,
    textAlign: 'justify',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default ReviewerDashboard;
