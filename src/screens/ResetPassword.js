import React, { useState } from 'react';
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
import { resetPassword } from '../app/features/authSlice';
import { showMessage } from '../app/features/messageSlice';
const { width, height } = Dimensions.get('window');
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const route = useRoute();
    const data = route?.params?.Data;

    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { loading, user, mesg } = useSelector((state) => state.auth);
    const [hasAttemptedResetPassword, setHasAttemptedResetPassword] = useState(false);
    const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '', samePasswordError: '' });

    var validateNewPassword = (text, field) => {
        if (!text.trim()) {
            return `New Password is required`;
        }
        if (text.length < 6) {
            return `New Password must be at least 6 characters`;
        }
        return '';
    };

    var validateConfirmPassword = (text, field) => {
        if (!text.trim()) {
            return `Confirm Password is required`;
        }
        if (text.length < 6) {
            return `Confirm Password must be at least 6 characters`;
        }
        return '';
    };

    const handleNewPasswordChange = (text) => {
        setNewPassword(text);
        if (hasAttemptedResetPassword) {
            setErrors(prev => ({
                ...prev,
                newPassword: validateNewPassword(text, "New Password"),
                samePasswordError: confirmPassword !== text
                    ? "New Password and Confirm Password should be same."
                    : ""
            }));
        }
    };

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        if (hasAttemptedResetPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: validateConfirmPassword(text, "Confirm Password"),
                samePasswordError: newPassword !== text
                    ? "New Password and Confirm Password should be same."
                    : ""
            }));
        }
    };

    const handleResetPassword = async () => {
        setHasAttemptedResetPassword(true);

        const newPasswordError = validateNewPassword(newPassword);
        const confirmPasswordError = validateConfirmPassword(confirmPassword);

        const samePasswordError =
            newPassword !== confirmPassword ? "New Password and Confirm Password should be same." : "";

        setErrors({
            newPassword: newPasswordError,
            confirmPassword: confirmPasswordError,
            samePasswordError: samePasswordError,
        });

        if (newPasswordError || confirmPasswordError || samePasswordError) {
            return;
        }
        console.log("data from reset password:", data);
        const userData = {
            userType: data.userType,
            resetToken: data.resetToken,
            newPassword: newPassword.trim(),
        };
        try {
            // let response;
            // if (scheme === 'admin') {
            //     response = await dispatch(forgotPasswordAdmin(userData)).unwrap();
            // } else {
            const response = await dispatch(resetPassword(userData)).unwrap();
            // }
            dispatch(
                showMessage({
                    type: 'success',
                    text: response?.message || 'Reset Password Successfully.',
                })
            );

            navigation.navigate('Login');

        } catch (err) {
            console.log('Reset Password error:', err?.message);
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                err?.error ||
                'Reset Password Failed';
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

                        <Text style={styles.subtitle}>Reset Password</Text>

                        <View style={{ marginTop: 40 }}>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>New Password</Text>
                                <CustomInput
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChangeText={handleNewPasswordChange}
                                    secureTextEntry
                                />
                                {errors.newPassword && (
                                    <Text style={styles.errorText}>{errors.newPassword}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <CustomInput
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={handleConfirmPasswordChange}
                                    secureTextEntry
                                />
                                {errors.confirmPassword && (
                                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                )}
                                {errors.samePasswordError && (
                                    <Text style={styles.errorText}>{errors.samePasswordError}</Text>
                                )}
                            </View>

                        </View>

                    </View>

                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={handleResetPassword}
                    >
                        <Text style={styles.signInButtonText}>Submit</Text>
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

export default ResetPasswordScreen;