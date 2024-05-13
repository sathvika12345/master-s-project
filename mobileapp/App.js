import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GetStartedScreen from './components/GetStartedScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import AboutScreen from './components/AboutScreen';
import ProfileScreen from './components/ProfileScreen';
import ExploreScreen from './components/ExploreScreen';
import ReviewerDashboard from './components/ReviewerDashboard';
import UploadProjectScreen from './components/UploadProjectScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GetStarted">
        <Stack.Screen name="GetStarted" component={GetStartedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="UploadProject" component={UploadProjectScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="ReviewerDashboard" component={ReviewerDashboard} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
