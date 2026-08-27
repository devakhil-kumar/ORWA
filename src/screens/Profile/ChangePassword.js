// ChangePassword.js

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import CustomInput from '../../components/CustomInput';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from '../../app/features/messageSlice';
import { changePasswordAdmin, changePasswordResedential } from '../../app/features/authSlice';
import { getUserData } from '../../units/asyncStorageManager';

const ChangePassword = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.profile);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validate = () => {
        if (!oldPassword.trim()) {
            dispatch(showMessage({ type: 'error', text: 'Please enter your current password.' }));
            return false;
        }
        if (!newPassword.trim()) {
            dispatch(showMessage({ type: 'error', text: 'Please enter a new password.' }));
            return false;
        }
        if (newPassword.length < 6) {
            dispatch(showMessage({ type: 'error', text: 'New password must be at least 6 characters.' }));
            return false;
        }
        if (newPassword === oldPassword) {
            dispatch(showMessage({ type: 'error', text: 'New password must be different from the current password.' }));
            return false;
        }
        if (!confirmPassword.trim()) {
            dispatch(showMessage({ type: 'error', text: 'Please confirm your new password.' }));
            return false;
        }
        if (newPassword !== confirmPassword) {
            dispatch(showMessage({ type: 'error', text: 'New password and confirm password do not match.' }));
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const userData = await getUserData();
            const role = userData.userRole;

            let result;
            if (role === "admin") {
                result = await dispatch(
                    changePasswordAdmin({
                        oldPassword: oldPassword.trim(),
                        newPassword: newPassword.trim(),
                        confirmPassword: confirmPassword.trim()
                    })
                ).unwrap();
            } else {
                result = await dispatch(
                    changePasswordResedential({
                        oldPassword: oldPassword.trim(),
                        newPassword: newPassword.trim(),
                        confirmPassword: confirmPassword.trim()
                    })
                ).unwrap();
            }

            dispatch(
                showMessage({
                    type: 'success',
                    text: result?.message || 'Password changed successfully.',
                })
            );

            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            navigation.goBack();
        } catch (error) {
            dispatch(
                showMessage({
                    type: 'error',
                    text: error?.message || 'Could not change password. Please try again.',
                })
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#519377" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={28} color="#519377" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Change Password</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Current Password *</Text>
                    <CustomInput
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        placeholder="Enter current password"
                        secureTextEntry
                        style={styles.input}
                        editable={!loading}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>New Password *</Text>
                    <CustomInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        secureTextEntry
                        style={styles.input}
                        editable={!loading}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm New Password *</Text>
                    <CustomInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Re-enter new password"
                        secureTextEntry
                        style={styles.input}
                        editable={!loading}
                    />
                </View>

                <Text style={styles.hintText}>
                    Password must be at least 6 characters long.
                </Text>

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.updateButton,
                            loading && styles.updateButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.updateButtonText}>Update Password</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(12),
        backgroundColor: '#F9FAFB',
    },
    backButton: {
        marginTop: 2,
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: '600',
        color: '#000',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: moderateScale(36),
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: moderateScale(14),
        paddingTop: moderateScale(20),
        paddingBottom: moderateScale(20),
    },
    inputGroup: {
        marginBottom: moderateScale(15),
    },
    label: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#000',
        marginBottom: moderateScale(8),
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: '#CFCFCF',
        borderRadius: 16,
        padding: 5,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
    },
    hintText: {
        fontSize: moderateScale(12),
        color: '#838383',
        fontWeight: '500',
        marginTop: moderateScale(4),
    },
    buttonContainer: {
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(20),
        backgroundColor: '#F9FAFB',
    },
    updateButton: {
        backgroundColor: '#519377',
        paddingVertical: moderateScale(12),
        borderRadius: moderateScale(15),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    updateButtonDisabled: {
        backgroundColor: '#A5C9B8',
    },
    updateButtonText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#fff',
    },
});