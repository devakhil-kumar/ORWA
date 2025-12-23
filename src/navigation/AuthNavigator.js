import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="SplashScreen">
            <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          headerShown:false,
          contentStyle: {
            backgroundColor: '#1A1A1A',
            opacity: 1,
          },
          animationTypeForReplace: 'push',
        }}
      />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    headerShown: false,
                    animationDuration: 150,
                }}
            />
            <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{
                    headerShown: false,
                    animationDuration: 150,
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
