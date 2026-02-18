import React from 'react';
import { Text, TouchableOpacity, Linking } from 'react-native';

const Footer = () => {
  
  const openLink = () => {
    Linking.openURL("https://cyberbells.com"); 
  };

  return (
    <TouchableOpacity 
      onPress={openLink}
      style={{
        backgroundColor: '#fff',
        paddingVertical: 8,
      }}
    >
      <Text 
        style={{
          alignSelf:'center',
          textAlign: 'center',
          color: 'blue',
          fontSize: 12,
          fontWeight:'500',
        }}
      >
        Managed by Cyberbells ITES Services Pvt Ltd.
      </Text>
    </TouchableOpacity>
  );
};

export default Footer;

