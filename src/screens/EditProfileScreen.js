import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, } from 'react-native';
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



const signatureTypes = [
    { label: "Signature Pad", value: "Signature Pad" },
    { label: "Upload Image", value: "Upload Image" }
];

const schemes = [
    { label: 'Silver Birch', value: 'Silver Birch' },
    { label: 'Ambrosia', value: 'Ambrosia' },
    { label: 'Celestia Royale', value: 'Celestia Royale' },
    { label: 'Celestia Grande', value: 'Celestia Grande' },
    { label: 'Celestia Premiere', value: 'Celestia Premiere' },
    { label: 'Mulberry Villas', value: 'Mulberry Villas' },
    { label: 'Plot', value: 'Plot' },
    // { label: 'Golden Oak', value: 'Golden Oak' },
    // { label: 'Platinum Heights', value: 'Platinum Heights' },
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

            console.log("User : ", user);
            setFirstName(user.firstName || '');
            setMiddleName(user.middleName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
            // // These come as plain URL strings from the server
            // setProfileImage(user.profileImage || null);
            // setSignature(user.signature || null);


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
            const address = user.correspondenceAddress || "";
            const [address1, ...rest] = address.split(" ");
            setAddress1(address1);
            setAddress2(rest.join(" "));
            setCity(user.city);
            setState(user.state);
            setPostalCode(user.postalCode);
            setCountry(user.country);
            setFamilyMembers(user.familyMembersCount.toString());
            setHobbies(user.hobbiesAndSkills);
            // setIdProof(user.identityProofDocument);
            // setPhoto(user.applicantPhoto);

            // setAddressProof(user.addressProofDocument);
            // setOwnershipProof(user.ownershipProofDocument);
            setIdProofType(user.identityProofType);
            setAddressProofType(user.addressProofType);
            setOwnershipProofType(user.ownershipProofType);

            // Converts both full URL or relative path into full usable URL
            const fixUrl = (path) => {
                if (!path) return null;
                if (path.startsWith("http")) return path;
                return `http://49.13.70.253:2424${path}`;
            };
            setProfileImage(fixUrl(user.profileImage));
            setSignature(fixUrl(user.signature));

            setIdProof(user.identityProofDocument ? { uri: fixUrl(user.identityProofDocument) } : null);
            setPhoto(user.applicantPhoto ? { uri: fixUrl(user.applicantPhoto) } : null);

            setAddressProof(user.addressProofDocument ? { uri: fixUrl(user.addressProofDocument) } : null);
            setOwnershipProof(user.ownershipProofDocument ? { uri: fixUrl(user.ownershipProofDocument) } : null);


            setMembershipNos(user.membershipNos);

        }
    }, [user]);

    const handlegoBack = () => navigation.goBack();

    // Helper to get URI from either a string or object
    const getUri = (value) => {
        if (!value) return null;
        if (typeof value === 'string') return value;
        return value?.uri || null;
    };

    const handleDateConfirm = (selectedDate) => {
        const today = new Date();
        const min18Date = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        if (selectedDate > min18Date) {
            Alert.alert('Age Restrictions', "You should be atleast 18 to register.");
            setDatePickerVisible(false);
            return;
        }

        setDob(selectedDate);
        setDatePickerVisible(false);
    };

    const formatDate = (date) => {
        if (!date) return '';

        // Convert string to Date if it's not already
        const d = typeof date === 'string' ? new Date(date) : date;

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const validation = () => {
        const missing = [];
        if (!firstName.trim()) missing.push('• First Name');
        if (!lastName.trim()) missing.push('• Last Name');
        if (!relativeName.trim()) missing.push('• Relative First Name');
        if (!relativelastName.trim()) missing.push('• Relative Last Name');
        if (dob) {
            const today = new Date();
            const birthDate = new Date(dob);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();

            // Adjust age if birthday hasn't occurred yet this year
            const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;

            if (actualAge < 18) {
                missing.push('• Date of Birth: Must be at least 18 years old');
            }
        }

        // Phone validation
        if (!phone.trim()) {
            missing.push('• Phone Number');
        } else if (!/^[6-9][0-9]{9}$/.test(phone.trim())) {
            missing.push('• Phone Number: Please enter a valid mobile number.');
        }

        // Email validation
        if (!email.trim()) {
            missing.push('• Email');
        } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            missing.push('• Email: Invalid format');
        }
        if (!flatNo.trim()) missing.push('• Flat/Villa/Plot No.');
        if (scheme === 'Plot' || scheme === 'Mulberry Villas') {
            setFloor('No Floor'); // auto-set
        } else {
            if (!floor.trim()) missing.push('• Floor No.');
        }
        if (postalCode.trim()) {
            if (!/^\d{6}$/.test(postalCode.trim())) {
                missing.push('• Postal Code: Must be exactly 6 digits (e.g., 400001)');
            }
        }
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
        if (!scheme) {
            missing.push('• Scheme');
        }

        if (!signature) missing.push('• Signature');
        return missing;
    }

    const handleSubmit = async () => {
        setSubmitting(true);
        const profileImageUri = getUri(profileImage);
        const signatureUri = getUri(signature);

        // Validation
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
        formData.append("firstName", firstName);
        formData.append("middleName", middleName);
        formData.append("lastName", lastName);
        formData.append("phone", phone);
        formData.append('address', `${flatNo}${floor ? `, Floor ${floor}` : ''}, ${scheme}`);

        formData.append('membershipNos', membershipNos);
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
        // Helper function – safely append images
        const appendImage = (formData, key, file) => {
            if (file && typeof file === 'object' && file.uri) {
                formData.append(key, {
                    uri: file.uri,
                    type: file.type || "image/jpeg",
                    name: file.name || `${key}.jpg`,
                });
            }
        };

        appendImage(formData, "identityProofDocument", idProof);
        appendImage(formData, "addressProofDocument", addressProof);
        appendImage(formData, "ownershipProofDocument", ownershipProof);
        appendImage(formData, "applicantPhoto", photo);
        appendImage(formData, "profileImage", profileImage);
        appendImage(formData, "signature", signature);

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
            setSubmitting(false);

            navigation.goBack();
        } catch (err) {
            setSubmitting(false);

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
                    <TextInput style={styles.input} editable={false} value={firstName} onChangeText={setFirstName} placeholder="First Name" />

                    <Text style={styles.label}>Middle Name</Text>
                    <TextInput style={styles.input} editable={false} value={middleName} onChangeText={setMiddleName} placeholder="Middle Name" />

                    <Text style={styles.label}>Last Name *</Text>
                    <TextInput style={styles.input} editable={false} value={lastName} onChangeText={setLastName} placeholder="Last Name" />

                    <Text style={styles.label}>Father/Husband/Mother/Wife's Name *</Text>
                    <TextInput style={styles.input} placeholder="First" placeholderTextColor={'#E0E0E0'} value={relativeName} onChangeText={setRelativeName} />
                    <Text style={styles.label}>Middle Name </Text>
                    <TextInput style={styles.input} placeholder="Middle" value={relativemiddleName} onChangeText={setrelativeMiddleName} placeholderTextColor={'#E0E0E0'} />
                    <Text style={styles.label}>Last Name *</Text>
                    <TextInput style={styles.input} placeholder="Last" value={relativelastName} onChangeText={setrelativeLastName} placeholderTextColor={'#E0E0E0'} />

                    <Text style={styles.label}>Membership No.</Text>
                    <TextInput style={styles.input} editable={false} placeholder="Membership No" value={membershipNos} onChangeText={setMembershipNos} placeholderTextColor={'#E0E0E0'} />

                    <Text style={styles.label}>Are you living here?</Text>
                    <View style={styles.radioRow}>
                        {['Yes', 'No'].map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={styles.radioBtn}
                                onPress={() => setLivingHere(item === 'Yes')}
                            >
                                <View style={[styles.radioCircle, livingHere === (item === 'Yes') && styles.radioFilled]} />
                                <Text style={styles.radioLabel}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.label}>Date of Birth</Text>
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
                    />

                    <Text style={styles.label}>Occupation</Text>
                    <TextInput style={styles.input} placeholder="Occupation" placeholderTextColor={'#E0E0E0'} value={occupation} onChangeText={setOccupation} />

                    <Text style={styles.label}>Email *</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />

                    <Text style={styles.label}>Phone *</Text>
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
                    <Text style={styles.label}>Flat/Villa/Plot No. *</Text>
                    <TextInput style={styles.input} placeholder="Flat/Villa/Plot No." placeholderTextColor={'#E0E0E0'} value={flatNo} onChangeText={setFlatNo} />

                    <Text style={styles.label}>Floor *</Text>
                    {/* <TextInput style={styles.inputFull} placeholder="Floor" placeholderTextColor={'#E0E0E0'} value={floor} onChangeText={setFloor} /> */}
                    <TextInput
                        style={styles.input}
                        placeholder={
                            scheme === 'Plot' || scheme === 'Mulberry Villas'
                                ? 'No Floor'
                                : 'Floor'
                        }
                        placeholderTextColor={'#E0E0E0'}
                        value={
                            scheme === 'Plot' || scheme === 'Mulberry Villas'
                                ? 'No Floor'
                                : floor
                        }
                        onChangeText={
                            scheme === 'Plot' || scheme === 'Mulberry Villas'
                                ? undefined
                                : setFloor
                        }
                        editable={!(scheme === 'Plot' || scheme === 'Mulberry Villas')}
                    />
                    <Text style={styles.label}>Block Number</Text>
                    <TextInput style={styles.input} placeholder="Block Number" placeholderTextColor={'#E0E0E0'} value={blockNumber} onChangeText={setBlockNumber} />

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

                    <Text style={styles.label}>Correspondence Address</Text>
                    <TextInput style={styles.input} placeholder="Address Line 1" placeholderTextColor={'#E0E0E0'} value={address1} onChangeText={setAddress1} />
                    <TextInput style={styles.input} placeholder="Address Line 2" placeholderTextColor={'#E0E0E0'} value={address2} onChangeText={setAddress2} />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>City</Text>
                            <TextInput style={styles.input} placeholder="City" placeholderTextColor={'#E0E0E0'} value={city} onChangeText={setCity} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>State</Text>
                            <TextInput style={styles.input} placeholder="State" placeholderTextColor={'#E0E0E0'} value={state} onChangeText={setState} />
                        </View>
                    </View>

                    <Text style={styles.label}>Postal Code</Text>
                    <TextInput style={styles.input} placeholder="Postal Code" placeholderTextColor={'#E0E0E0'} value={postalCode} onChangeText={setPostalCode} keyboardType="numeric" />

                    <Text style={styles.label}>Country</Text>
                    <TextInput style={styles.input} placeholder="Country" placeholderTextColor={'#E0E0E0'} value={country} onChangeText={setCountry} />

                    <Text style={styles.label}>No. of family members</Text>
                    <TextInput style={styles.input} placeholder="No. of family members" placeholderTextColor={'#E0E0E0'} value={familyMembers} onChangeText={setFamilyMembers} keyboardType="numeric" />
                    <Text style={styles.label}>Hobbies/Skills</Text>
                    <TextInput style={styles.input} placeholder="Hobbies/Skills" placeholderTextColor={'#E0E0E0'} value={hobbies} onChangeText={setHobbies} multiline />
                    <View style={styles.uploadGrid}>
                        <View>
                            <Text style={styles.label}>Identity Proof</Text>
                            <UploadBox title="Identity Proof" file={idProof} onPress={() => pickAndCrop(setIdProof)} />
                        </View>
                        <View>
                            <Text style={styles.label}>Address Proof</Text>
                            <UploadBox title="Address Proof" file={addressProof} onPress={() => pickAndCrop(setAddressProof)} />
                        </View>
                        <View>
                            <Text style={styles.label}>Ownership Proof</Text>
                            <UploadBox title="Ownership Proof" file={ownershipProof} onPress={() => pickAndCrop(setOwnershipProof)} />
                        </View>
                        <View>
                            <Text style={styles.label}>Photo</Text>
                            <UploadBox title="Photo" file={photo} onPress={() => pickAndCrop(setPhoto, { cropperCircleOverlay: true })} />
                        </View>
                    </View>


                    <Text style={styles.label}>ID Proof Type</Text>
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

                    <Text style={styles.label}>Address Proof Type</Text>
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

                    <Text style={styles.label}>Ownership Proof Type</Text>
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

    uploadedImage: { width: "100%", height: "100%", borderRadius: 11 },

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
    radioRow: { flexDirection: 'row', justifyContent: 'center', gap: 50, marginVertical: 20 },
    radioBtn: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    radioCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#666' },
    radioFilled: { backgroundColor: '#519377', borderColor: '#519377' },
    radioLabel: { fontSize: 16 },
});
