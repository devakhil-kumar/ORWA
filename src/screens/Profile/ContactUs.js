// ContactUs.js

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
import { submitContactUs } from '../../app/features/contactSlice'; // path adjust kar lena
import { showMessage } from '../../app/features/messageSlice';
import { useNavigation } from '@react-navigation/native';
import { submitUserContactUs } from '../../app/features/userContactSlice';

const ContactUs = () => {
    const [message, setMessage] = useState('');
    const navigation = useNavigation();

    const dispatch = useDispatch();

    const { admin, adminLoading, user } = useSelector((state) => state.profile);
    const { loading: contactLoading } = useSelector((state) => state.contact);

    const handleSubmit = async () => {
        if (!message.trim()) {
            dispatch(
                showMessage({
                    type: 'error',
                    text: 'Please write your message',
                })
            );
            return;
        }

        const paylaod = {
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
            message: message
        }
        console.log(paylaod, 'payload')

        try {
            if (user) {
                const results = await dispatch(submitUserContactUs(paylaod)).unwrap();
                console.log(results, 'cldhcjdscbc')
                dispatch(
                    showMessage({
                        type: 'success',
                        text: results?.message || 'Thank you! Your message has been sent successfully.',
                    })
                );
                setMessage('')
            } else {
                const result = await dispatch(submitContactUs({ message: message.trim() })).unwrap();
                dispatch(
                    showMessage({
                        type: 'success',
                        text: result?.message || 'Thank you! Your message has been sent successfully.',
                    })
                );
                setMessage('');
            }
            navigation.goBack();
        } catch (error) {
            dispatch(
                showMessage({
                    type: 'error',
                    text: error?.message || 'Failed to send message. Please try again.',
                })
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={28} color="#519377" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{user ? "Help Desk" : "Contact us"}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Contact Info */}
                <View style={styles.contactInfo}>
                    <Text style={styles.contactTitle}>Contact us at:</Text>
                    <Text style={styles.contactText}>Call: +91 {admin?.phone || user?.phone}</Text>
                    <Text style={styles.contactText}>Email: {admin?.email || user?.email}</Text>
                </View>

                {/* Message Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Write to us</Text>
                    <CustomInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Write your message here..."
                        multiline
                        textAlignVertical="top"
                        style={styles.input}
                        editable={!contactLoading}
                    />
                </View>

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.updateButton,
                            contactLoading && styles.updateButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={contactLoading}
                    >
                        {contactLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.updateButtonText}>Submit</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ContactUs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(12),
        backgroundColor: '#fff',
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
    contactInfo: {
        marginBottom: moderateScale(20),
    },
    contactTitle: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        color: '#000',
        marginBottom: moderateScale(20),
    },
    contactText: {
        fontSize: moderateScale(16),
        color: '#333',
        marginBottom: moderateScale(8),
    },
    inputGroup: {
        marginBottom: moderateScale(15),
        // marginTop: moderateScale(10),
    },
    label: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#000',
        marginBottom: moderateScale(8),
    },
    buttonContainer: {
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(20),
        backgroundColor: '#fff',
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
    input: {
        height: 180,
        borderWidth: 1,
        borderColor: '#CFCFCF',
        borderRadius: 16,
        padding: 5,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
    },
});