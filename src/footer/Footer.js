import React from 'react';
import { Text, TouchableOpacity, Linking, Image } from 'react-native';
import imagePath from '../contests/imagePath';
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
        alignItems:'center',
        justifyContent:'center',
        marginBottom:5
      }}
    >
      <Text
        style={{
          color: 'black',
          fontSize: 14,
          fontWeight: '500',
        }}
      >
        Managed by
       
      </Text>
       <Image
          source={imagePath.cyberbellsLogo}
          style={{
            width: 150,
            height: 50,
          }}
          resizeMode="contain"
        />
    </TouchableOpacity>
  );
};

export default Footer;

 {/* <Text
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            color: '#4287f5',
            fontSize: 13,
            fontWeight: '500',
          }}
        > Cyberbells ITES Services Pvt Ltd</Text> */}
       