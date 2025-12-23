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
import { loginAdmin, LoginUser } from '../app/features/authSlice';
import { showMessage } from '../app/features/messageSlice';
const { width, height } = Dimensions.get('window');
const schemes = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
];

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openScheme, setOpenScheme] = useState(false);
    const [scheme, setScheme] = useState('admin');
    const dispatch = useDispatch();
    const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const { loading, user, mesg } = useSelector((state) => state.auth);

    const validateEmail = (text) => {
        if (!text.trim()) {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePassword = (text) => {
        if (!text.trim()) {
            return 'Password is required';
        }
        if (text.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return '';
    };

    const handleEmailChange = (text) => {
        setEmail(text);
        if (hasAttemptedLogin) {
            setErrors(prev => ({ ...prev, email: validateEmail(text) }));
        }
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        if (hasAttemptedLogin) {
            setErrors(prev => ({ ...prev, password: validatePassword(text) }));
        }
    };

    const handleSignIn = async () => {
        setHasAttemptedLogin(true);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        setErrors({
            email: emailError,
            password: passwordError,
        });
        if (emailError || passwordError) {
            return;
        }
        const userData = {
            email: email.trim(),
            password: password.trim(),
        };
        try {
            let response;
            if (scheme === 'admin') {
                response = await dispatch(loginAdmin(userData)).unwrap();
            } else {
                console.log(userData, 'vndhlsfbvldnbbg')
                response = await dispatch(LoginUser(userData)).unwrap();
            }
            dispatch(
                showMessage({
                    type: 'success',
                    text: response?.message || 'Login successful!',
                })
            );
        } catch (err) {
            console.log('Login error:', err?.message);
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                err?.error ||
                'Login Failed';
            dispatch(
                showMessage({
                    type: 'error',
                    text: String(errorMessage),
                })
            );
        }
    };

    if (loading) {
        return <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#519377" />
        </View>
    }

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

                        <Text style={styles.subtitle}>Sign In</Text>

                        <View style={{ marginTop: 40 }}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Choose the role</Text>
                                <DropDownPicker
                                    open={openScheme}
                                    value={scheme}
                                    items={schemes}
                                    setOpen={setOpenScheme}
                                    setValue={setScheme}
                                    style={styles.dropdown}
                                    dropDownContainerStyle={styles.dropdownList}
                                    listMode="SCROLLVIEW"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Enter Email</Text>
                                <CustomInput
                                    placeholder="Enter Your email Address"
                                    value={email}
                                    onChangeText={handleEmailChange}
                                    keyboardType="email-address"
                                />
                                {errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <CustomInput
                                    placeholder="Enter Your Password"
                                    value={password}
                                    onChangeText={handlePasswordChange}
                                    secureTextEntry
                                />
                                {errors.password && (
                                    <Text style={styles.errorText}>{errors.password}</Text>
                                )}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={handleSignIn}
                    >
                        <Text style={styles.signInButtonText}>Login</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

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

export default LoginScreen;