// PaymentHistoryScreen.js

import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
    Dimensions,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import CustomInput from '../../../components/CustomInput';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent } from '../../../app/features/eventAdminSlice';
import { showMessage } from '../../../app/features/messageSlice';
const { width, height } = Dimensions.get('window');



const AddUpdates = ({ navigation }) => {
    const [societyName, setSocietyName] = useState('');
    const [societyDescription, setSocietyDescription] = useState('');
    const [addressProof, setAddressProof] = useState(null);
    const dispatch = useDispatch();
    const { addloading } = useSelector((state) => state.eventAdmin)

    const pickAndCrop = async (setter, options = {}) => {
        try {
            const image = await ImageCropPicker.openPicker({
                width: options.width || 1000,
                height: options.height || 800,
                cropping: true,
                cropperCircleOverlay: options.circle || false,
                freeStyleCropEnabled: true,
                compressImageQuality: 0.8,
                includeBase64: false,
                ...options,
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

    const handleSubmit = async () => {
        if (!societyName.trim()) {
            Alert.alert('Validation Error', 'Please enter a title');
            return;
        }
        if (!societyDescription.trim()) {
            Alert.alert('Validation Error', 'Please enter a description');
            return;
        }
        if (!addressProof) {
            Alert.alert('Validation Error', 'Please select an image');
            return;
        }
        const formData = new FormData();
        formData.append('title', societyName.trim());
        formData.append('description', societyDescription.trim());
        formData.append('image', {
            uri: addressProof.uri,
            type: addressProof.type,
            name: addressProof.name,
        });
        console.log(formData, 'formdata+++++++++++++')
        try {
            const result = await dispatch(addEvent(formData)).unwrap();
            console.log('Event added successfully:', result);
            dispatch(
                showMessage({
                    type: 'success',
                    text: result?.message || 'Announcements Add successful!',
                })
            );
            setAddressProof(null)
            setSocietyName('')
            setSocietyDescription('')
            navigation.goBack();
        } catch (error) {
            dispatch(
                showMessage({
                    type: 'error',
                    text: error?.message || 'Add Announcements failed ',
                })
            );
        }
    };

    const UploadBox = ({ title, file, onPress, hint }) => (
        <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
            {file ? (
                <Image source={{ uri: file.uri }} style={styles.uploadedImage} resizeMode="cover" />
            ) : (
                <>
                    <Ionicons name='cloud-upload-outline' size={20} color={'#666'} />
                    <Text style={styles.uploadText}>Choose File</Text>
                </>
            )}
            {file && <Text style={styles.fileName}>{file.name}</Text>}
            <Text style={styles.hint}>{hint || title}</Text>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor="#519377" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={28} color="#519377" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Announcement</Text>
                <View style={styles.placeholder} />
            </View>
            <View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Add Title *</Text>
                    <CustomInput
                        value={societyName}
                        onChangeText={setSocietyName}
                        keyboardType="email-address"
                        style={styles.normalInput}
                        placeholder="Title goes here"
                        textAlignVertical={"top"}
                        multiline
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Write Description *</Text>
                    <CustomInput
                        value={societyDescription}
                        onChangeText={setSocietyDescription}
                        keyboardType="email-address"
                        style={styles.input}
                        placeholder="Write here"
                        textAlignVertical={"top"}
                        multiline
                    />
                </View>
                <View>
                    <Text style={styles.label}>Announcement Image *</Text>
                    <UploadBox title="Upload Image" file={addressProof} onPress={() => pickAndCrop(setAddressProof)} />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.updateButton}
                        activeOpacity={0.8}
                        onPress={handleSubmit}
                    >
                        {addloading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.updateButtonText}>Submit</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AddUpdates;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: moderateScale(12),
    },
    backButton: {
        padding: moderateScale(4),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: '600',
        color: '#000',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: moderateScale(34),
    },
    filterContainer: {
        paddingVertical: moderateScale(16),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterScroll: {
        paddingHorizontal: moderateScale(16),
        gap: moderateScale(12),
    },
    filterButton: {
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(10),
        borderRadius: moderateScale(20),
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D0D0D0',
    },
    filterButtonActive: {
        backgroundColor: '#9E9E9E',
        borderColor: '#9E9E9E',
    },
    filterButtonText: {
        fontSize: moderateScale(15),
        color: '#666',
        fontWeight: '500',
    },
    filterButtonTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(20),
        paddingBottom: moderateScale(0),
    },
    section: {
        marginBottom: moderateScale(30),
    },
    sectionTitle: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        color: '#000',
        marginBottom: moderateScale(16),
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginBottom: moderateScale(12),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: moderateScale(60),
        height: moderateScale(60),
        borderRadius: moderateScale(30),
        backgroundColor: '#FFD54F',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: {
        marginLeft: moderateScale(14),
        flex: 1,
    },
    residentName: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#000',
        marginBottom: moderateScale(4),
    },
    residentAddress: {
        fontSize: moderateScale(14),
        color: '#666',
        fontWeight: '400',
    },
    receiptIconContainer: {
        marginLeft: moderateScale(10),
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 20,
        padding: 10
    },
    receiptIcon: {
        width: moderateScale(40),
        height: moderateScale(50),
    },
    inputGroup: {
        marginBottom: moderateScale(15),
        marginTop: moderateScale(5)
    },
    label: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#000',
        marginBottom: moderateScale(0),
    },
    input: {
        width: '100%',
        height: 100,
        borderWidth: 1,
        borderColor: '#CFCFCF',
        borderRadius: 16,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
    },
    normalInput: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#CFCFCF',
        borderRadius: 16,
        // paddingTop: 10,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
    },
    buttonContainer: {
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(20),
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
    updateButtonText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#fff',
    },
    uploadBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 25, alignItems: 'center', borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed', marginTop: 5 },
    uploadedImage: { width: 200, height: 120, borderRadius: 12, marginBottom: 10 },
    uploadText: { fontSize: 14, color: '#666' },
    fileName: { color: '#0066CC', fontSize: 12, marginTop: 8 },
    hint: { fontSize: 12, color: '#999', marginTop: 10 },
});