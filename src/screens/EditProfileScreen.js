import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchProfile, updateUserProfile } from '../app/features/getprofileSlice';
import ImagePicker from 'react-native-image-crop-picker';
import Signature from 'react-native-signature-canvas';
import DropDownPicker from 'react-native-dropdown-picker';
import { showMessage } from '../app/features/messageSlice';
import RNFS from 'react-native-fs';

const signatureTypes = [
    { label: "Signature Pad", value: "Signature Pad" },
    { label: "Upload Image", value: "Upload Image" }
];

// Upload Component
const UploadBox = ({ file, onPress }) => (
    <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
        {file?.uri ? (
            <Image
                source={{ uri: file.uri }}
                style={styles.uploadedImage}
                resizeMode="cover"
            />
        ) : (
            <>
                <Ionicons name='cloud-upload-outline' size={40} color={'#666'} />
                <Text style={styles.uploadText}>Choose File</Text>
            </>
        )}
    </TouchableOpacity>
);

// Signature Pad Component
const SignatureBox = forwardRef(({ onSave, onBeginSigning, onEndSigning }, ref) => {
    const signRef = useRef(null);

    useImperativeHandle(ref, () => ({
        clearSignature: () => {
            signRef.current?.clearSignature();
            onSave(null);
        },
    }));

    const handleOK = (signatureBase64) => {
        onSave(signatureBase64);
    };

    const handleStrokeEnd = () => {
        signRef.current?.readSignature();
        onEndSigning();
    };

    const signatureStyle = `
        .m-signature-pad { box-shadow: none; border: none; margin: 0; width: 100%; height: 100%; }
        .m-signature-pad--body { border: none; background-color: white; }
        .m-signature-pad--footer { display: none !important; }
        .m-signature-pad--body canvas { width: 100% !important; height: 100% !important; }
    `;

    return (
        <View style={styles.containerSing}>
            <Signature
                ref={signRef}
                onOK={handleOK}
                onBegin={onBeginSigning}
                onEnd={handleStrokeEnd}
                descriptionText="Sign here"
                autoClear={false}
                penColor="#000"
                imageType="image/png"
                webStyle={signatureStyle}
            />
        </View>
    );
});

// Main Screen
const EditProfileScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const signatureRef = useRef(null);

    const { user, loading } = useSelector((state) => state.profile);

    const [openSignatureType, setOpenSignatureType] = useState(false);
    const [signatureType, setSignatureType] = useState("Signature Pad");
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const [profileImage, setProfileImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [signature, setSignature] = useState(null);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            console.log("User : ", user);
            setFirstName(user.firstName || '');
            setMiddleName(user.middleName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
            // These come as plain URL strings from the server
            setProfileImage(user.profileImage || null);
            setSignature(user.signature || null);
        }
    }, [user]);

    const handlegoBack = () => navigation.goBack();

    // Helper to get URI from either a string or object
    const getUri = (value) => {
        if (!value) return null;
        if (typeof value === 'string') return value;
        return value?.uri || null;
    };

    const handleSubmit = async () => {

        const profileImageUri = getUri(profileImage);
        const signatureUri = getUri(signature);

        // Validation
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !phone.trim() ||
            !address.trim() ||
            !profileImageUri ||
            !signatureUri
        ) {
            Alert.alert("Validation Error", "Please fill all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("middleName", middleName);
        formData.append("lastName", lastName);
        formData.append("phone", phone);
        formData.append("address", address);

        // Profile Image — only append if user picked a new one (object), skip if still a URL string
        if (typeof profileImage === 'object' && profileImage?.uri) {
            formData.append("profileImage", {
                uri: profileImage.uri,
                type: profileImage.type,
                name: profileImage.name,
            });
        }

        // Signature
        if (signatureType === "Signature Pad") {
            // signature is a base64 string from the pad
            if (typeof signature === 'string' && signature.startsWith('data:')) {
                try {
                    const base64Data = signature.replace(/^data:image\/[a-z]+;base64,/, "");
                    const filePath = `${RNFS.CachesDirectoryPath}/signature.png`;
                    await RNFS.writeFile(filePath, base64Data, "base64");
                    formData.append("signature", {
                        uri: `file://${filePath}`,
                        type: "image/png",
                        name: "signature.png",
                    });
                } catch (err) {
                    Alert.alert("Error", "Failed to process signature.");
                    return;
                }
            }
            // else: signature is still the original server URL string, no need to re-upload
        } else {
            // Upload Image type — only append if user picked a new one (object)
            if (typeof signature === 'object' && signature?.uri) {
                formData.append("signature", {
                    uri: signature.uri,
                    type: signature.type,
                    name: signature.name,
                });
            }
        }

        try {
            console.log("FormData being submitted:", formData);
            const response = await dispatch(updateUserProfile(formData)).unwrap();
            dispatch(
                showMessage({
                    type: 'success',
                    text: response?.message || 'Profile updated successfully!',
                })
            );
            dispatch(fetchProfile());
            navigation.goBack();
        } catch (err) {
            dispatch(
                showMessage({
                    type: 'error',
                    text: err?.message || "Profile Updation Failed!",
                })
            );
        }
    };

    const pickAndCrop = async (setter, options = {}) => {
        try {
            const img = await ImagePicker.openPicker({
                width: 600,
                height: 600,
                cropping: true,
                cropperCircleOverlay: options.cropperCircleOverlay || false,
                compressImageQuality: 0.8,
            });

            console.log("PICKED:", img);

            const realPath = img.path || img.sourceURL || img.uri;

            setter({
                uri: realPath,
                type: img.mime || 'image/jpeg',
                name: img.filename || 'image.jpg',
            });

        } catch (e) {
            console.log("Picker error =>", e);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", paddingBottom: 80 }} edges={['top']}>
            <ScrollView
                style={styles.container}
                scrollEnabled={scrollEnabled}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handlegoBack} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Profile Image */}
                <View style={styles.profileWrapper}>
                    <View style={{ position: 'relative' }}>
                        <Image
                            source={{ uri: getUri(profileImage) }}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity
                            style={styles.editImageBtn}
                            onPress={() => pickAndCrop(setProfileImage, { cropperCircleOverlay: true })}
                        >
                            <Ionicons name="camera" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form */}
                <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
                    <Text style={styles.label}>First Name *</Text>
                    <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First Name" />

                    <Text style={styles.label}>Middle Name</Text>
                    <TextInput style={styles.input} value={middleName} onChangeText={setMiddleName} placeholder="Middle Name" />

                    <Text style={styles.label}>Last Name *</Text>
                    <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last Name" />

                    <Text style={styles.label}>Email *</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />

                    <Text style={styles.label}>Phone *</Text>
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />

                    <Text style={styles.label}>Address *</Text>
                    <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Address" />

                    <Text style={styles.label}>Select Signature Type</Text>

                    <View style={{ zIndex: 2000, marginTop: 8 }}>
                        <DropDownPicker
                            listMode="SCROLLVIEW"
                            open={openSignatureType}
                            value={signatureType}
                            setOpen={setOpenSignatureType}
                            setValue={(val) => {
                                setSignatureType(val);
                                // Reset signature when switching type
                                setSignature(null);
                                signatureRef.current?.clearSignature();
                            }}
                            items={signatureTypes}
                            style={styles.dropdown}
                            dropDownContainerStyle={[styles.dropdownList, { height: 80 }]}
                            zIndex={2000}
                            zIndexInverse={2000}
                        />
                    </View>

                    <Text style={styles.label}>
                        {signatureType === "Upload Image" ? "Signature Photo" : "Signature"} *
                    </Text>

                    {signatureType === "Upload Image" && (
                        <UploadBox
                            title="Signature"
                            file={typeof signature === 'object' ? signature : null}
                            onPress={() => pickAndCrop(setSignature)}
                        />
                    )}

                    {signatureType === "Signature Pad" && (
                        <>
                            {/* Preview: base64 from pad or URL string from server */}
                            {getUri(signature) && (
                                <View style={{ marginVertical: 10 }}>
                                    <Image
                                        source={{ uri: getUri(signature) }}
                                        style={{ width: '100%', height: 100, borderRadius: 12 }}
                                        resizeMode="contain"
                                    />
                                </View>
                            )}

                            <SignatureBox
                                ref={signatureRef}
                                onSave={setSignature}
                                onBeginSigning={() => setScrollEnabled(false)}
                                onEndSigning={() => setScrollEnabled(true)}
                            />

                            <TouchableOpacity
                                style={styles.clearBtn}
                                onPress={() => signatureRef.current?.clearSignature()}
                            >
                                <Text style={styles.clearText}>Clear Signature</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.btnSuccess} onPress={handleSubmit}>
                        <Text style={styles.btnTextWhite}>
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfileScreen;

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },

    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },

    backBtn: { width: 28 },

    headerTitle: { fontSize: 20, fontWeight: '600', color: '#000', flex: 1, textAlign: 'center' },

    profileWrapper: { alignItems: 'center', marginTop: 10 },

    profileImage: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#E0E0E0' },

    editImageBtn: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#1E88E5',
        padding: 6,
        borderRadius: 20,
    },

    label: { marginTop: 20, fontSize: 16, fontWeight: '500', color: '#333' },

    input: {
        marginTop: 8,
        backgroundColor: '#FFF',
        borderRadius: 12,
        height: 56,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#C4C4C4',
    },

    dropdown: { marginTop: 8, borderRadius: 12 },

    dropdownList: { borderRadius: 12, borderColor: '#C4C4C4' },

    uploadBox: {
        marginTop: 10,
        height: 140,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#FFF",
    },

    uploadedImage: { width: "100%", height: "100%", borderRadius: 12 },

    uploadText: { color: "#666", marginTop: 8 },

    containerSing: {
        height: 200,
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 12,
        overflow: 'hidden',
        marginVertical: 10,
    },

    clearBtn: {
        alignSelf: 'flex-end',
        marginTop: 8,
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#DADADA',
    },

    buttonRow: { margin: 20 },

    clearText: { fontSize: 13, color: '#333' },
    btnSuccess: { backgroundColor: '#519377', padding: 16, borderRadius: 12 },
    btnTextWhite: { textAlign: 'center', fontWeight: '600', color: '#FFF', fontSize: 16 },
});