import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import imagePath from '../contests/imagePath';

const SplashScreen = ({ navigation }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#519377" barStyle="light-content" />
      <Image
        source={imagePath.loginImage} // change path
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 140,
      height: 140,
      marginBottom: 20,
    },
    appName: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    tagline: {
      fontSize: 14,
      color: '#EAF5F0',
      marginTop: 6,
    },
  });
  
