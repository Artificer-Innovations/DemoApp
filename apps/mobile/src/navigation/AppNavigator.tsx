import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useFeatureFlags } from '../config/featureFlags';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const navigationRef = React.useRef<any>(null);
  const { showNativeHeader } = useFeatureFlags();

  // Expose navigation to global scope for debugging (dev only)
  if (__DEV__ && typeof global !== 'undefined') {
    React.useEffect(() => {
      global.navigationRef = navigationRef;
    }, []);
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: false, // Disable swipe-back gestures
          animation: 'none', // Disable screen transition animations
          headerShown: showNativeHeader, // Control native header visibility via feature flag
          headerBackVisible: showNativeHeader, // Control back button visibility
        }}
      >
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{ headerShown: false }} // Home always uses custom header
        />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Signup' component={SignupScreen} />
        <Stack.Screen name='Dashboard' component={DashboardScreen} />
        <Stack.Screen name='Profile' component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
