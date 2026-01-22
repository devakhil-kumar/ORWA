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
    Image
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
import ImageCropPicker from 'react-native-image-crop-picker';

const ContactUs = () => {
    const [message, setMessage] = useState('');
    const [complaintType, setComplaintType] = useState('');
    const navigation = useNavigation();

    const dispatch = useDispatch();

    const { admin, adminLoading, user } = useSelector((state) => state.profile);
    const { loading: contactLoading } = useSelector((state) => state.contact);
    const [complaintProof, setcomplaintProof] = useState(null);

    const handleSubmit = async () => {


        if (!message.trim()) {
            dispatch(
                showMessage({
                    type: 'error',
                    text: 'Please write your message.',
                })
            );
            return;
        }

        if (!complaintType.trim()) {
            dispatch(
                showMessage({
                    type: 'error',
                    text: 'Please write your complaint type.',
                })
            );
            return;
        }
        const formData = new FormData();
        formData.append('name', user?.name);
        formData.append('email', user?.email);
        formData.append('phone', user?.phone);
        formData.append('message', message);
        formData.append('complaintType', complaintType);
        formData.append('complaintFile', complaintProof);

        // const paylaod = {
        //     name: user?.name,
        //     email: user?.email,
        //     phone: user?.phone,
        //     message: message,
        //     complaintType : complaintType,
        //     complaintFile :complaintProof
        // }
        
        console.log("vjhgvkjvkjhbv", formData, 'payload')

        try {
            if (user) {
                const results = await dispatch(submitUserContactUs(formData)).unwrap();
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
    const pickAndCrop = async (setter, options = {}) => {
        try {
            const image = await ImageCropPicker.openPicker({
                width: options.width || 800,
                height: options.height || 800,
                cropping: true,
                cropperCircleOverlay: options.circle || false,
                freeStyleCropEnabled: true,
                compressImageQuality: 0.8,
                includeBase64: false,
            });
            setter({
                uri: image.path,
                type: image.mime,
                name: image.path.split('/').pop(),
            });
        } catch (err) {
            if (err.code !== 'E_PICKER_CANCELLED') {
                Alert.alert('Error', 'Could not select image');
            }
        }
    };

    const UploadBox = ({ title, file, onPress, hint }) => (
        <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
            {file ? (
                <Image source={{ uri: file.uri }} style={styles.uploadedImage} resizeMode="cover" />
            ) : (
                <>
                    <Ionicons name='cloud-upload-outline' size={40} color={'#666'} />
                    <Text style={styles.hint}>{hint || title}</Text>
                    <Text style={styles.uploadText}>JPG,PNG or PDF (Max 5MB)</Text>
                </>
            )}
            {file && <Text style={styles.fileName}>{file.name}</Text>}
        </TouchableOpacity>
    );

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
                <Text style={styles.headerTitle}>{user ? "Help Desk" : "Contact us"}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Contact Info */}
                {/* <View style={styles.contactInfo}>
                    <Text style={styles.contactTitle}>Contact us at:</Text>
                    <Text style={styles.contactText}>Call: +91 {admin?.phone || user?.phone}</Text>
                    <Text style={styles.contactText}>Email: {admin?.email || user?.email}</Text>
                </View> */}

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


                {/* Complaint type */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Complaint Type</Text>
                    <CustomInput
                        value={complaintType}
                        onChangeText={setComplaintType}
                        placeholder="Enter your complaint type"
                        style={styles.contentTypeInput}
                        editable={!contactLoading}
                    />
                </View>
                {/* Complaint screenshot */}

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={[styles.label, { fontSize: moderateScale(16) }]}>
                        Complaint Screenshot
                    </Text>
                </View>
                <UploadBox title="Tap to upload screenshot" file={complaintProof} onPress={() => pickAndCrop(setcomplaintProof)} />

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
    contactInfo: {
        marginBottom: moderateScale(20),
    },
    contactTitle: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#000',
        marginBottom: moderateScale(16),
    },
    contactText: {
        fontSize: moderateScale(16),
        fontWeight: 400,
        color: '#000',

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
    input: {
        width: "100%",
        height: 180,
        borderWidth: 1,
        borderColor: '#CFCFCF',
        borderRadius: 16,
        padding: 5,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
    },
    contentTypeInput: {
        width: "100%",
        borderWidth: 1,
        borderColor: '#CFCFCF',
        borderRadius: 16,
        padding: 5,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
    },
    uploadBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 30, alignItems: 'center', borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed', marginTop: 12 },
    uploadedImage: { width: 120, height: 120, borderRadius: 12, marginBottom: 10 },
    hint: { fontSize: 14, color: '#000', marginTop: 10, fontWeight: 500 },
    uploadText: { fontSize: 12, color: '#838383', fontWeight: 500 },

});