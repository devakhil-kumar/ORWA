import React, { useState, useRef,forwardRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    Dimensions,
    ActivityIndicator,
    Alert,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../components/CustomInput';
import imagePath from '../contests/imagePath';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../app/features/authSlice';
import { showMessage } from '../app/features/messageSlice';
const { width, height } = Dimensions.get('window');
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';


const OTPScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const data = route?.params?.userData;


    const [errors, setErrors] = useState({ otp: '' });
    const [hasAttemptedForgotPassword, setHasAttemptedForgotPassword] = useState(false);

    const inputs = useRef([]);
    const [otp, setOtp] = useState(['', '', '', '']);

    const handleOTPChange = (value, index) => {
        const newOTP = [...otp];
        newOTP[index] = value;
        setOtp(newOTP);

        // Move to next input automatically
        if (value && index < otp.length - 1) {
            inputs.current[index + 1].focus();
        }

        // If user presses backspace on empty field, go to previous input
        if (!value && index > 0) {
            inputs.current[index - 1].focus();
        }
    };


    const validateOtp = (text) => {
        if (!text.trim()) return 'OTP is required';
        if (!/^\d{4,6}$/.test(text)) return 'OTP must be 4 digits';
        return '';
    };

    const handleVerifyOtp = async () => {

        setHasAttemptedForgotPassword(true);
        console.log("Data:", data);
        const otpString = otp.join("");

        const otpError = validateOtp(otpString);

        setErrors({ otp: otpError });

        if (otpError) return;

        const userData = {
            email: data.email,
            otp: otpString,
            userType: data.userType
        };

        try {

            const response = await dispatch(verifyOtp(userData)).unwrap();
            console.log("Response from otp screen:", response);
            dispatch(
                showMessage({
                    type: 'success',
                    text: response?.message || 'OTP Verified Successfully.',
                })
            );
            const Data = {
                resetToken: response.resetToken,
                userType: data.userType
            };
            navigation.navigate('ResetPassword', { Data });

        } catch (err) {
            console.log('Incorrect OTP :', err);
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                err?.error ||
                'Incorrect OTP';
            dispatch(
                showMessage({
                    type: 'error',
                    text: String(errorMessage),
                })
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Ionicons name="chevron-back" size={28} color="#519377" />
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View style={{ marginTop: 40 }}>
                        <Image
                            source={imagePath.loginImage}
                            style={{
                                width: width / 4,
                                height: height / 8,
                                alignSelf: 'center',
                                resizeMode: 'contain'
                            }}
                        />

                        <Text style={styles.subtitle}>Forgot Password</Text>

                        <View style={{ marginTop: 40 }}>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Enter Code</Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignSelf: 'center', marginTop: 20 }}>
                                    {otp.map((digit, index) => (
                                        <CustomInput
                                            key={index}
                                            value={digit}
                                            onChangeText={(t) => handleOTPChange(t, index)}
                                            keyboardType="numeric"
                                            maxLength={1}
                                            style={{ width: 50, height: 50, borderRadius: 8 }}
                                            textInput={{ textAlign: 'center', fontSize: 18 }}
                                            ref={(ref) => (inputs.current[index] = ref)}
                                        />
                                    ))}
                                </View>


                                {errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}
                            </View>

                        </View>

                    </View>

                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={handleVerifyOtp}
                    >
                        <Text style={styles.signInButtonText}>Send Code</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 20
    },
    loaderOverlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FDB913',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#519377',
        textAlign: 'center',
        marginTop: 10
    },
    inputContainer: {
        marginTop: 20
    },
    label: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
        marginLeft: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        color: '#333',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        color: '#333',
    },
    eyeIcon: {
        paddingHorizontal: 16,
    },
    eyeText: {
        fontSize: 18,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 5
    },
    forgotPasswordText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600'
    },
    signInButton: {
        backgroundColor: '#519377',
        borderRadius: 20,
        paddingVertical: 14,
        alignItems: 'center',
        width: '93%',
        alignSelf: "center",
        marginTop: 40
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#999',
    },
    orText: {
        color: '#999',
        fontSize: 12,
        marginHorizontal: 16,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 20
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIcon: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#DB4437',
    },
    socialIconFb: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#4267B2',
    },
    dropdown: {
        borderWidth: 1.4,
        borderColor: '#999',
        height: height / 16,
        borderRadius: 8,
        paddingHorizontal: width * 0.02,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        width: '95%',
        alignSelf: 'center'
    },
    dropdownList: { borderRadius: 12, paddingHorizontal: width * 0.02, width: '95%', alignSelf: 'center' },
    errorText: {
        fontSize: 12,
        color: '#FF3B30',
        marginLeft: 8,
        marginTop: 4,
        fontWeight: '500',
    },
    scrollContent: {
        flexGrow: 1, // ← Allows content to expand and enable scrolling
        padding: 20,
        paddingBottom: 40,
    },
});

export default OTPScreen;