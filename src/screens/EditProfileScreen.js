import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchProfile, updateUserProfile } from '../app/features/getprofileSlice';
import ImagePicker from 'react-native-image-crop-picker';
import Signature from 'react-native-signature-canvas';
import { showMessage } from '../app/features/messageSlice';
import RNFS from 'react-native-fs';
import { withDelay } from 'react-native-reanimated';

const signatureTypes = [
    { label: 'Signature Pad', value: 'Signature Pad' },
    { label: 'Upload Image', value: 'Upload Image' },
];

const schemes = [
    { label: 'Silver Birch', value: 'Silver Birch' },
    { label: 'Ambrosia', value: 'Ambrosia' },
    { label: 'Celestia Royale', value: 'Celestia Royale' },
    { label: 'Celestia Grande', value: 'Celestia Grande' },
    { label: 'Celestia Premiere', value: 'Celestia Premiere' },
    { label: 'Mulberry Villas', value: 'Mulberry Villas' },
    { label: 'Plot', value: 'Plot' },
];

const docTypes = [
    { label: 'Aadhaar Card', value: 'Aadhaar Card' },
    { label: 'Utility Bill', value: 'Utility Bill' },
    { label: 'Rent Agreement', value: 'Rent Agreement' },
    { label: 'Property Documents', value: 'Property Documents' },
    { label: 'Bank Statement', value: 'Bank Statement' },
    { label: 'Other', value: 'Other' },
];

const identityProofDocument = [
    { label: 'Aadhaar Card', value: 'Aadhaar Card' },
    { label: 'PAN Card', value: 'PAN Card' },
    { label: 'Passport', value: 'Passport' },
    { label: 'Driving License', value: 'Driving License' },
    { label: 'Voter ID', value: 'Voter ID' },
    { label: 'Other', value: 'Other' },
];

const ownershipTypes = [
    { label: 'Registry Documents', value: 'Registry Documents' },
    { label: 'Sale Deed', value: 'Sale Deed' },
    { label: 'Allotment Letter', value: 'Allotment Letter' },
    { label: 'Lease Agreement', value: 'Lease Agreement' },
    { label: 'Other', value: 'Other' },
];

// Upload Component
const UploadBox = ({ file, onPress }) => {
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [file?.uri]);

    return (
        <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
            {file?.uri && !imgError ? (
                <Image
                    source={{ uri: file.uri }}
                    style={styles.uploadedImage}
                    resizeMode="contain"
                    onError={() => setImgError(true)}
                />
            ) : (
                <>
                    <Ionicons name="cloud-upload-outline" size={40} color={'#666'} />
                    <Text style={styles.uploadText}>
                        {file?.uri && imgError ? 'Failed to load — tap to reselect' : 'Choose File'}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

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
    const [signatureType, setSignatureType] = useState('Signature Pad');
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const [profileImage, setProfileImage] = useState(null);
    const [profileImgError, setProfileImgError] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [signature, setSignature] = useState(null);

    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [relativeName, setRelativeName] = useState('');
    const [relativemiddleName, setrelativeMiddleName] = useState('');
    const [relativelastName, setrelativeLastName] = useState('');
    const [flatNo, setFlatNo] = useState('');
    const [floor, setFloor] = useState('');
    const [blockNumber, setBlockNumber] = useState('');
    const [scheme, setScheme] = useState('');
    const [livingHere, setLivingHere] = useState(null);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('India');
    const [dob, setDob] = useState(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [occupation, setOccupation] = useState('');
    const [familyMembers, setFamilyMembers] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [idProof, setIdProof] = useState(null);
    const [addressProof, setAddressProof] = useState(null);
    const [ownershipProof, setOwnershipProof] = useState(null);
    const [idProofType, setIdProofType] = useState(null);
    const [addressProofType, setAddressProofType] = useState(null);
    const [ownershipProofType, setOwnershipProofType] = useState(null);
    const [openScheme, setOpenScheme] = useState(false);
    const [openIdType, setOpenIdType] = useState(false);
    const [openAddrType, setOpenAddrType] = useState(false);
    const [openOwnType, setOpenOwnType] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [membershipNos, setMembershipNos] = useState('');

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    React.useEffect(() => {
        if (scheme === 'Plot' || scheme === 'Mulberry Villas') {
            setFloor('No Floor');
        }
    }, [scheme]);

    useEffect(() => {
        if (user) {
            console.log('User : ', user);
            setFirstName(user.firstName || '');
            setMiddleName(user.middleName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');

            setRelativeName(user.relationName);
            setrelativeMiddleName(user.relationMiddleName);
            setrelativeLastName(user.relationLastName);
            setLivingHere(user.livingHere);
            const dateOfBirth = new Date(user.dateOfBirth);
            console.log(dateOfBirth.toDateString);
            setDob(dateOfBirth);
            setOccupation(user.occupation);
            setFlatNo(user.flatNumber);
            setFloor(user.floor);
            setBlockNumber(user.blockNumber);
            setScheme(user.scheme);
            const address = user.correspondenceAddress || '';
            const [address1, ...rest] = address.split(' ');
            setAddress1(address1);
            setAddress2(rest.join(' '));
            setCity(user.city);
            setState(user.state);
            setPostalCode(user.postalCode);
            setCountry(user.country);
            setFamilyMembers(user.familyMembersCount?.toString() || '');
            setHobbies(user.hobbiesAndSkills);
            setIdProofType(user.identityProofType);
            setAddressProofType(user.addressProofType);
            setOwnershipProofType(user.ownershipProofType);

            if (user.signature) {
                setSignatureType(user.signatureType === 'Upload Image' ? 'Upload Image' : 'Signature Pad');
            }

            setProfileImage(user.profileImage);
            setProfileImgError(false);
            setSignature(user.signature);

            setIdProof(user.identityProofDocument ? { uri: user.identityProofDocument } : null);
            setPhoto(user.applicantPhoto ? { uri: user.applicantPhoto } : null);
            setAddressProof(user.addressProofDocument ? { uri: user.addressProofDocument } : null);
            setOwnershipProof(user.ownershipProofDocument ? { uri: user.ownershipProofDocument } : null);

            setMembershipNos(user.membershipNos);
        }
    }, [user]);

    const handlegoBack = () => navigation.goBack();

    const getUri = (value) => {
        if (!value) return null;
        if (typeof value === 'string') return value;
        return value?.uri || null;
    };

    const isRemoteUrl = (value) => {
        if (!value) return false;
        const uri = typeof value === 'string' ? value : value?.uri;
        return typeof uri === 'string' && (uri.startsWith('http://') || uri.startsWith('https://'));
    };

    const handleDateConfirm = (selectedDate) => {
        const today = new Date();
        const min18Date = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (selectedDate > min18Date) {
            Alert.alert('Age Restrictions', 'You should be atleast 18 to register.');
            setDatePickerVisible(false);
            return;
        }

        setDob(selectedDate);
        setDatePickerVisible(false);
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const validation = () => {
        const missing = [];
        if (!relativeName.trim()) missing.push('• Relative First Name');
        if (!relativelastName.trim()) missing.push('• Relative Last Name');
        if (!occupation.trim()) missing.push('• Occupation');

        if (dob) {
            const today = new Date();
            const birthDate = new Date(dob);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();
            const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

            if (actualAge < 18) {
                missing.push('• Date of Birth: Must be at least 18 years old');
            }
        }

        if (!phone.trim()) {
            missing.push('• Phone Number');
        } else if (!/^[6-9][0-9]{9}$/.test(phone.trim())) {
            missing.push('• Phone Number: Please enter a valid mobile number.');
        }

        if (!flatNo.trim()) missing.push('• Flat/Villa/Plot No.');
        if (!blockNumber.trim()) missing.push('• Block No.');

        if (scheme === 'Plot' || scheme === 'Mulberry Villas') {
            setFloor('No Floor');
        } else {
            if (!floor.trim()) missing.push('• Floor No.');
        }
        if (!address.trim()) missing.push('• Full Address');

        if (!city.trim()) missing.push('• City');
        if (!state.trim()) missing.push('• State');

        if (postalCode.trim()) {
            if (!/^\d{6}$/.test(postalCode.trim())) {
                missing.push('• Postal Code: Must be exactly 6 digits (e.g., 400001)');
            }
        }
        if (!country.trim()) missing.push('• Country');

        if (familyMembers.trim()) {
            if (!/^\d+$/.test(familyMembers.trim())) {
                missing.push('• No. of Family Members: Only numbers allowed');
            } else {
                const num = parseInt(familyMembers.trim(), 10);
                if (num === 0) {
                    missing.push('• No. of Family Members: Must be at least 1');
                } else if (num > 15) {
                    missing.push('• No. of Family Members: Must be less than or equal to 15');
                }
            }
        }

        if (!scheme) missing.push('• Scheme');
        if (!idProofType) missing.push('• ID Proof Type');
        if (!idProof) missing.push('• Identity Proof');
        if (!addressProofType) missing.push('• Address Proof Type');
        if (!addressProof) missing.push('• Address Proof');
        if (!ownershipProofType) missing.push('• Ownership Proof Type');
        if (!ownershipProof) missing.push('• Ownership Proof');
        if (!signature) missing.push('• Signature');

        return missing;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        withDelay(10);
        const missing = [...validation()];
        if (missing.length > 0) {
            Alert.alert(
                'Cannot Submit',
                'Some required fields are missing:\n\n' + missing.join('\n'),
                [{ text: 'OK' }]
            );
            setSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('phone', phone);
        formData.append('address', `${flatNo}${floor ? `, Floor ${floor}` : ''}, ${scheme}`);
        formData.append('relationName', relativeName);
        formData.append('relationMiddleName', relativemiddleName || '');
        formData.append('relationLastName', relativelastName || '');
        formData.append('livingHere', livingHere ? 'true' : 'false');
        formData.append('dateOfBirth', formatDate(dob));
        formData.append('occupation', occupation || '');
        formData.append('flatNumber', flatNo);
        formData.append('floor', floor || '');
        formData.append('scheme', scheme);
        formData.append('blockNumber', blockNumber || '');
        formData.append('correspondenceAddress', `${address}`.trim());
        formData.append('city', city);
        formData.append('state', state);
        formData.append('country', country);
        formData.append('postalCode', postalCode);
        formData.append('familyMembersCount', familyMembers || '');
        formData.append('hobbiesAndSkills', hobbies || '');
        if (idProofType) formData.append('identityProofType', idProofType);
        if (addressProofType) formData.append('addressProofType', addressProofType);
        if (ownershipProofType) formData.append('ownershipProofType', ownershipProofType);
        formData.append('chosenFlatVilla', flatNo);
        formData.append('requestSource', 'mobile');
        formData.append('signatureType', signatureType);

        const appendImage = (formData, key, file) => {
            if (!file) return;

            if (typeof file === 'string') {
                if (file.startsWith('http://') || file.startsWith('https://')) return;
                return;
            }

            if (typeof file === 'object' && file.uri) {
                const uri = file.uri;
                if (uri.startsWith('http://') || uri.startsWith('https://')) return;

                formData.append(key, {
                    uri: uri,
                    type: file.type || 'image/jpeg',
                    name: file.name || `${key}.jpg`,
                });
            }
        };

        appendImage(formData, 'identityProofDocument', idProof);
        appendImage(formData, 'addressProofDocument', addressProof);
        appendImage(formData, 'ownershipProofDocument', ownershipProof);
        appendImage(formData, 'applicantPhoto', photo);
        appendImage(formData, 'profileImage', profileImage);

        // Signature handling
        if (signatureType === 'Signature Pad') {
            // Only re-upload when user drew a new signature (base64 data URI)
            if (typeof signature === 'string' && signature.startsWith('data:')) {
                try {
                    const base64Data = signature.replace(/^data:image\/[a-z]+;base64,/, '');
                    const filePath = `${RNFS.CachesDirectoryPath}/signature.png`;
                    await RNFS.writeFile(filePath, base64Data, 'base64');
                    formData.append('signature', {
                        uri: `file://${filePath}`,
                        type: 'image/png',
                        name: 'signature.png',
                    });
                } catch (err) {
                    Alert.alert('Error', 'Failed to process signature.');
                    setSubmitting(false);
                    return;
                }
            }
        } else {
            if (typeof signature === 'object' && signature?.uri) {
                const uri = signature.uri;
                if (!uri.startsWith('http://') && !uri.startsWith('https://')) {
                    formData.append('signature', {
                        uri: uri,
                        type: signature.type || 'image/jpeg',
                        name: signature.name || 'signature.jpg',
                    });
                }
            }
        }

        try {
            console.log('FormData being submitted:', formData);
            await new Promise((resolve) => setTimeout(resolve, 5000));

            const response = await dispatch(updateUserProfile(formData)).unwrap();
            dispatch(
                showMessage({
                    type: 'success',
                    text: response?.message || 'Profile updated successfully!',
                })
            );
            dispatch(fetchProfile());
            setSubmitting(false);
            navigation.goBack();
        } catch (err) {
            setSubmitting(false);
            dispatch(
                showMessage({
                    type: 'error',
                    text: err?.message || 'Profile Updation Failed!',
                })
            );
        }
    };


    const normalizeFileUri = async (rawUri, filename) => {
        try {
            const sourcePath = rawUri.startsWith('file://') ? rawUri.replace('file://', '') : rawUri;
            const destPath = `${RNFS.CachesDirectoryPath}/${Date.now()}_${filename}`;
            await RNFS.copyFile(sourcePath, destPath);
            return `file://${destPath}`;
        } catch (e) {
            console.log('normalizeFileUri failed, falling back to original uri:', e);
            return rawUri; // fall back rather than blocking the user entirely
        }
    };

    const pickAndCrop = async (setter, options = {}) => {
        try {
            const isAvatar = !!options.cropperCircleOverlay;
            const isSignature = !!options.isSignature;

            const pickerOptions = {
                cropping: true,
                cropperToolbarTitle: isAvatar
                    ? 'Adjust Photo'
                    : isSignature
                        ? 'Adjust Signature'
                        : 'Adjust Document',
                cropperCircleOverlay: isAvatar,
            };

            if (isAvatar) {
                pickerOptions.width = 600;
                pickerOptions.height = 600;
                pickerOptions.compressImageQuality = 0.8;
            } else {
                pickerOptions.freeStyleCropEnabled = true;
                pickerOptions.compressImageMaxWidth = 1500;
                pickerOptions.compressImageMaxHeight = 1500;
                pickerOptions.compressImageQuality = 0.7;
            }

            const img = await ImagePicker.openPicker(pickerOptions);
            console.log('PICKED:', img);

            if (img.size && img.size > 5 * 1024 * 1024) {
                Alert.alert(
                    'Image too large',
                    'Please choose a smaller image or take a new photo — this one is over 5MB and may fail to upload.'
                );
                return;
            }

            const rawPath = img.path || img.sourceURL || img.uri;


            const mime = img.mime || 'image/jpeg';
            const extFromMime = mime.split('/')[1] === 'jpeg' ? 'jpg' : mime.split('/')[1];
            const filename = `image_${Date.now()}.${extFromMime}`;

            const normalizedUri = await normalizeFileUri(rawPath, filename);

            setter({
                uri: normalizedUri,
                type: mime,
                name: filename,
            });
        } catch (e) {
            console.log('Picker error =>', e);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', paddingBottom: 80 }} edges={['top']}>
            <ScrollView style={styles.container} scrollEnabled={scrollEnabled}>
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
                        {getUri(profileImage) && !profileImgError ? (
                            <Image
                                source={{ uri: getUri(profileImage) }}
                                style={styles.profileImage}
                                onError={() => setProfileImgError(true)}
                            />
                        ) : (
                            <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
                                <Ionicons name="person" size={48} color="#999" />
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.editImageBtn}
                            onPress={() =>
                                pickAndCrop(
                                    (val) => {
                                        setProfileImgError(false);
                                        setProfileImage(val);
                                    },
                                    { cropperCircleOverlay: true }
                                )
                            }
                        >
                            <Ionicons name="camera" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form */}
                <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
                    <Text style={styles.label}>First Name *</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        editable={false}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="First Name"
                    />

                    <Text style={styles.label}>Middle Name</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        editable={false}
                        value={middleName}
                        onChangeText={setMiddleName}
                        placeholder="Middle Name"
                    />

                    <Text style={styles.label}>Last Name *</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        editable={false}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Last Name"
                    />

                    <Text style={styles.label}>Father/Husband/Mother/Wife's Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="First"
                        placeholderTextColor={'#E0E0E0'}
                        value={relativeName}
                        onChangeText={setRelativeName}
                    />
                    <Text style={styles.label}>Middle Name </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Middle"
                        value={relativemiddleName}
                        onChangeText={setrelativeMiddleName}
                        placeholderTextColor={'#E0E0E0'}
                    />
                    <Text style={styles.label}>Last Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Last"
                        value={relativelastName}
                        onChangeText={setrelativeLastName}
                        placeholderTextColor={'#E0E0E0'}
                    />

                    <Text style={styles.label}>Membership No.</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        editable={false}
                        placeholder="Membership No"
                        value={membershipNos}
                        onChangeText={setMembershipNos}
                        placeholderTextColor={'#E0E0E0'}
                    />

                    <Text style={styles.label}>Are you living here? *</Text>
                    <View style={styles.radioRow}>
                        {['Yes', 'No'].map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={styles.radioBtn}
                                onPress={() => setLivingHere(item === 'Yes')}
                            >
                                <View
                                    style={[
                                        styles.radioCircle,
                                        livingHere === (item === 'Yes') && styles.radioFilled,
                                    ]}
                                />
                                <Text style={styles.radioLabel}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Date of Birth *</Text>
                    <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                        <TextInput
                            style={styles.input}
                            value={dob ? dob.toDateString() : ''}
                            placeholder="Select Date"
                            editable={false}
                            pointerEvents="none"
                            placeholderTextColor={'#E0E0E0'}
                        />
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleDateConfirm}
                        onCancel={() => setDatePickerVisible(false)}
                        maximumDate={new Date()}
                        minimumDate={new Date(1800, 0, 1)}
                        themeVariant="light"           // forces light theme text/controls
                        isDarkModeEnabled={false}      // some versions also read this
                        pickerContainerStyleIOS={{ backgroundColor: '#FFFFFF' }} // explicit bg to match
                    />
                    <Text style={styles.label}>Occupation *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Occupation"
                        placeholderTextColor={'#E0E0E0'}
                        value={occupation}
                        onChangeText={setOccupation}
                    />

                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        editable={false}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Phone *</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Phone"
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.label}>Flat/Villa/Plot No. *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Flat/Villa/Plot No."
                        placeholderTextColor={'#E0E0E0'}
                        value={flatNo}
                        onChangeText={setFlatNo}
                    />

                    <Text style={styles.label}>Floor *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={
                            scheme === 'Plot' || scheme === 'Mulberry Villas' ? 'No Floor' : 'Floor'
                        }
                        placeholderTextColor={'#E0E0E0'}
                        value={
                            scheme === 'Plot' || scheme === 'Mulberry Villas' ? 'No Floor' : floor
                        }
                        onChangeText={
                            scheme === 'Plot' || scheme === 'Mulberry Villas' ? undefined : setFloor
                        }
                        editable={!(scheme === 'Plot' || scheme === 'Mulberry Villas')}
                    />

                    <Text style={styles.label}>Block Number *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Block Number"
                        placeholderTextColor={'#E0E0E0'}
                        value={blockNumber}
                        onChangeText={setBlockNumber}
                    />

                    <Text style={styles.label}>Scheme *</Text>
                    <DropDownPicker
                        open={openScheme}
                        value={scheme}
                        items={schemes}
                        setOpen={setOpenScheme}
                        listMode="SCROLLVIEW"
                        setValue={setScheme}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownList}
                    />

                    <Text style={styles.label}>Address *</Text>
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Address"
                    />

                    <Text style={styles.label}>Correspondence Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Address Line 1"
                        placeholderTextColor={'#E0E0E0'}
                        value={address1}
                        onChangeText={setAddress1}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Address Line 2"
                        placeholderTextColor={'#E0E0E0'}
                        value={address2}
                        onChangeText={setAddress2}
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>City *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="City"
                                placeholderTextColor={'#E0E0E0'}
                                value={city}
                                onChangeText={setCity}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>State *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="State"
                                placeholderTextColor={'#E0E0E0'}
                                value={state}
                                onChangeText={setState}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Postal Code *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Postal Code"
                        placeholderTextColor={'#E0E0E0'}
                        value={postalCode}
                        onChangeText={setPostalCode}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Country *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Country"
                        placeholderTextColor={'#E0E0E0'}
                        value={country}
                        onChangeText={setCountry}
                    />

                    <Text style={styles.label}>No. of family members *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="No. of family members"
                        placeholderTextColor={'#E0E0E0'}
                        value={familyMembers}
                        onChangeText={setFamilyMembers}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Hobbies/Skills</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Hobbies/Skills"
                        placeholderTextColor={'#E0E0E0'}
                        value={hobbies}
                        onChangeText={setHobbies}
                        multiline
                    />

                    <View style={styles.uploadGrid}>
                        <Text style={styles.label}>ID Proof Type *</Text>
                        <DropDownPicker
                            open={openIdType}
                            value={idProofType}
                            setOpen={setOpenIdType}
                            setValue={setIdProofType}
                            items={identityProofDocument}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownList}
                            listMode="SCROLLVIEW"
                            zIndex={3000}
                            zIndexInverse={1000}
                        />
                        <View>
                            <Text style={styles.label}>Identity Proof *</Text>
                            <UploadBox
                                title="Identity Proof"
                                file={idProof}
                                onPress={() => pickAndCrop(setIdProof)}
                            />
                        </View>

                        <Text style={styles.label}>Address Proof Type *</Text>
                        <DropDownPicker
                            open={openAddrType}
                            value={addressProofType}
                            setOpen={setOpenAddrType}
                            setValue={setAddressProofType}
                            items={docTypes}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownList}
                            listMode="SCROLLVIEW"
                            zIndex={2000}
                            zIndexInverse={2000}
                        />
                        <View>
                            <Text style={styles.label}>Address Proof *</Text>
                            <UploadBox
                                title="Address Proof"
                                file={addressProof}
                                onPress={() => pickAndCrop(setAddressProof)}
                            />
                        </View>

                        <Text style={styles.label}>Ownership Proof Type *</Text>
                        <DropDownPicker
                            open={openOwnType}
                            value={ownershipProofType}
                            setOpen={setOpenOwnType}
                            setValue={setOwnershipProofType}
                            items={ownershipTypes}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownList}
                            listMode="SCROLLVIEW"
                            zIndex={1000}
                            zIndexInverse={3000}
                        />
                        <View>
                            <Text style={styles.label}>Ownership Proof *</Text>
                            <UploadBox
                                title="Ownership Proof"
                                file={ownershipProof}
                                onPress={() => pickAndCrop(setOwnershipProof)}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Photo *</Text>
                            <UploadBox
                                title="Photo"
                                file={photo}
                                onPress={() => pickAndCrop(setPhoto, { cropperCircleOverlay: true })}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Select Signature Type *</Text>
                    <View style={{ zIndex: 2000, marginTop: 8 }}>
                        <DropDownPicker
                            listMode="SCROLLVIEW"
                            open={openSignatureType}
                            value={signatureType}
                            setOpen={setOpenSignatureType}
                            setValue={(val) => {
                                setSignatureType(val);
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
                        {signatureType === 'Upload Image' ? 'Signature Photo' : 'Signature'} *
                    </Text>

                    {signatureType === 'Upload Image' && (
                        <UploadBox
                            title="Signature"
                            file={getUri(signature) ? { uri: getUri(signature) } : null}
                            onPress={() => pickAndCrop(setSignature, { isSignature: true })}
                        />
                    )}

                    {signatureType === 'Signature Pad' && (
                        <>
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
                            {submitting ? 'Submitting...' : 'Submit Application'}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    backBtn: { width: 28 },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        flex: 1,
        textAlign: 'center',
    },
    profileWrapper: { alignItems: 'center', marginTop: 10 },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#E0E0E0',
    },
    profileImagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
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
        color: '#000',
    },
    dropdown: { marginTop: 8, borderRadius: 12 },
    dropdownList: { borderRadius: 12, borderColor: '#C4C4C4' },
    uploadBox: {
        marginTop: 10,
        height: 200,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        overflow: 'hidden',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 11,
        backgroundColor: '#F5F5F5',
    },
    uploadText: { color: '#666', marginTop: 8 },
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
    btnTextWhite: {
        textAlign: 'center',
        fontWeight: '600',
        color: '#FFF',
        fontSize: 16,
    },
    radioRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 50,
        marginVertical: 20,
    },
    radioBtn: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    radioCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#666',
    },
    radioFilled: { backgroundColor: '#519377', borderColor: '#519377' },
    radioLabel: { fontSize: 16 },
    disabledInput: {
        backgroundColor: '#F5F5F5',
        color: '#666',
        borderColor: '#E0E0E0',
    },
    row: { flexDirection: 'row', gap: 12 },
    uploadGrid: {},
});