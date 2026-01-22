import React, { memo, useState, useCallback, forwardRef } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const CustomInput = forwardRef((props, ref) => {
  const {
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    style,
    placeholderTextColor = '#999',
    iconColor = '#000',
    textInput,
    textAlignVertical,
    multiline = false,
    maxLength
  } = props;
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = secureTextEntry;

  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        ref={ref}
        style={[styles.input, textInput]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPasswordField && !showPassword}
        keyboardType={keyboardType}
        textAlignVertical={textAlignVertical}
        multiline={multiline}
        maxLength={maxLength}
        autoCapitalize="none"
      />
      {isPasswordField && (
        <TouchableOpacity onPress={handleTogglePassword}>
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={22}
            color={iconColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

export default memo(CustomInput);

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1.4,
    borderColor: '#999',
    height: windowHeight / 16,
    borderRadius: 8,
    paddingHorizontal: windowWidth * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    width: '95%',
    alignSelf: 'center'
  },
  input: {
    color: '#000',
    fontSize: moderateScale(12),
    height: '100%',
    width: '90%',
  },
  icon: {
    padding: 5
  },
});
