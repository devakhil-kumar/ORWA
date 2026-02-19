import React from 'react';
import { Text, TouchableOpacity, Linking, Image, View } from 'react-native';
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
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Image
          source={imagePath.cyberbellsLogo}
          style={{
            width: 50,
            height: 50,
          }}
          resizeMode="contain"
        />

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',

          }}
        >
          <Text
            style={{
              color: 'black',
              fontSize: 12,
              fontWeight: '400',
            }}

          >
            POWERED BY
          </Text>

          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontWeight: '700',
            }}
          >
            Cyberbells ITES Services Pvt Ltd
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Footer;
