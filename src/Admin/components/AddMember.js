import React, { forwardRef, useImperativeHandle, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import imagePath from '../../contests/imagePath';
import Signature from 'react-native-signature-canvas';
import RNFS from 'react-native-fs';
import { useDispatch, useSelector } from 'react-redux';
import { addMember, resetAddMemberState, updateMember } from '../../app/features/addMemberSlice';
import { showMessage } from '../../app/features/messageSlice';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SignatureBox = forwardRef(({ onSave, onBeginSigning, onEndSigning }, ref) => {
  const signRef = useRef(null);

  useImperativeHandle(ref, () => ({
    clearSignature: () => {
      signRef.current?.clearSignature();
      onSave(null);
    },
  }));

  const handleOK = (signature) => {
    onSave(signature);
  };

  const handleStrokeEnd = () => {
    signRef.current?.readSignature(); // Auto-save on stroke end
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
        onEnd={handleStrokeEnd}
        onBegin={onBeginSigning}
        descriptionText="Sign here"
        autoClear={false}
        imageType="image/png"
        webStyle={signatureStyle}
        backgroundColor="#ffffff"
        penColor="#000000"
        dotSize={2} // Slightly reduced to minimize isolated dots
        minWidth={1}
        maxWidth={4}
        minDistance={0} // Connect points immediately for smoother lines
        throttle={0} // No delay in processing strokes
        webviewProps={{
          androidHardwareAccelerationDisabled: true,
          androidLayerType: 'software',
          cacheEnabled: false,
        }}
      />
    </View>
  );
});

// Captcha Generator
// const generateCaptcha = () => {
//   const num1 = Math.floor(Math.random() * 20) + 1;
//   const num2 = Math.floor(Math.random() * 20) + 1;
//   const operators = ['+', '-', '*'];
//   const operator = operators[Math.floor(Math.random() * operators.length)];

//   let answer;
//   switch (operator) {
//     case '+': answer = num1 + num2; break;
//     case '-': answer = num1 - num2; break;
//     case '*': answer = num1 * num2; break;
//     default: answer = 0;
//   }
//   if (num1 > num2) {
//     return { num1, num2, operator, answer };
//   } else {
//     return { num2, num1, operator, answer };
//   }

// };
const generateCaptcha = () => {
  let num1 = Math.floor(Math.random() * 20) + 1;
  let num2 = Math.floor(Math.random() * 20) + 1;

  // Ensure num1 is always the greater number
  if (num2 > num1) {
    [num1, num2] = [num2, num1];
  }

  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let answer;
  switch (operator) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      answer = num1 - num2;
      break;
    case '*':
      answer = num1 * num2;
      break;
    default:
      answer = 0;
  }

  return { num1, num2, operator, answer };
};


export default function MembershipForm() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.addmember);
  const navigation = useNavigation();
  const route = useRoute();
  const { member, isEdit = false } = route.params || {};

  const [step, setStep] = useState(1);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const scrollRef = useRef(null);
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }

  }, [step]);

  React.useEffect(() => {
    setSignature(""); // clear signature
  }, [signatureType]);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [relativeName, setRelativeName] = useState('');
  const [relativemiddleName, setrelativeMiddleName] = useState('');
  const [relativelastName, setrelativeLastName] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [floor, setFloor] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [scheme, setScheme] = useState('');
  const [livingHere, setLivingHere] = useState(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
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
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [idProofType, setIdProofType] = useState(null);
  const [addressProofType, setAddressProofType] = useState(null);
  const [ownershipProofType, setOwnershipProofType] = useState(null);
  const [signatureType, setSignatureType] = useState("Signature Pad");
  const [captcha, setCaptcha] = useState('');
  const [openScheme, setOpenScheme] = useState(false);
  const [openIdType, setOpenIdType] = useState(false);
  const [openAddrType, setOpenAddrType] = useState(false);
  const [openOwnType, setOpenOwnType] = useState(false);
  const [openSignatureType, setOpenSignatureType] = useState(false);

  const [membershipNos, setMembershipNos] = useState('');

  const signatureRef = useRef(null);
  const captchaData = useMemo(() => generateCaptcha(), [step === 6]);



  // set data 
  React.useEffect(() => {
    if (isEdit && member) {
      console.log("MEmber:", member);
      console.log("Data from edit : ", member._id)
      console.log("Data from edit : ", member)

      //membership Nos
      setMembershipNos(member.membershipNos);

      setFirstName(member.firstName);
      setMiddleName(member.middleName);
      setLastName(member.lastName);
      setRelativeName(member.relationName);
      setrelativeMiddleName(member.relationMiddleName);
      setrelativeLastName(member.relationLastName);
      setLivingHere(member.livingHere);
      const dateOfBirth = new Date(member.dateOfBirth);
      console.log(dateOfBirth.toDateString);
      setDob(dateOfBirth);
      setOccupation(member.occupation);
      setPhone(member.phone);
      setEmail(member.email);
      setFlatNo(member.flatNumber);
      setFloor(member.floor);
      setBlockNumber(member.blockNumber);
      setScheme(member.scheme);
      const address = member.correspondenceAddress || "";
      const [address1, ...rest] = address.split(" ");
      setAddress1(address1);
      setAddress2(rest.join(" "));
      setCity(member.city);
      setState(member.state);
      setPostalCode(member.postalCode);
      setCountry(member.country);
      setFamilyMembers(member.familyMembersCount.toString());
      setHobbies(member.hobbiesAndSkills);
      setIdProof(member.identityProofDocument);
      setAddressProof(member.addressProofDocument);
      setOwnershipProof(member.ownershipProofDocument);
      setPhoto(member.applicantPhoto);
      setIdProofType(member.identityProofType);
      setAddressProofType(member.addressProofType);
      setOwnershipProofType(member.ownershipProofType);
      setSignature(member.signature);
    }
  }, [isEdit, member]);

  React.useEffect(() => {
    if (scheme === 'Plot' || scheme === 'Mulberry Villas') {
      setFloor('No Floor');
    } else {
      setFloor('');
    }
  }, [scheme]);

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

  const signatureTypes = [
    { label: "Signature Pad", value: "Signature Pad" },
    { label: "Upload Image", value: "Upload Image" }
  ];
  const pickAndCrop = async (setter, options = {}) => {
    try {
      const image = await ImagePicker.openPicker({
        width: options.width || 1200,
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


  const nextStep = () => {
    let missing = [];
    if (step === 1) missing = validateStep1();
    else if (step === 2) missing = validateStep2();
    // else if (step === 4) missing = validateStep4();
    // else if (step === 5) missing = validateStep5();
    else if (step === 6) missing = validateStep6();
    if (missing.length > 0) {
      Alert.alert(
        'Missing Fields in This Step',
        'Please complete:\n\n' + missing.join('\n'),
        [{ text: 'OK' }]
      );
      return;
    }

    setStep(Math.min(step + 1, 6));
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

  const validateStep1 = () => {
    const missing = [];
    if (!firstName.trim()) missing.push('• First Name');
    if (!lastName.trim()) missing.push('• Last Name');
    if (!relativeName.trim()) missing.push('• Relative First Name');
    if (!relativelastName.trim()) missing.push('• Relative Last Name');
    // if (livingHere === null) missing.push('• Are you living here?');
    // if (!dob) missing.push('• Date of Birth');
    // if (!occupation.trim()) missing.push('• Occupation');
    // Phone validation
    if (!phone.trim()) {
      missing.push('• Phone Number');
    } else if (!/^[0-9]{10}$/.test(phone.trim())) {
      missing.push('• Phone Number: Must be exactly 10 digits');
    }

    // Email validation
    if (!email.trim()) {
      missing.push('• Email');
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      missing.push('• Email: Invalid format');
    }

    return missing;
  };

  const validateStep2 = () => {
    const missing = [];
    if (!flatNo.trim()) missing.push('• Flat/Villa/Plot No.');
    if (scheme === 'Plot' || scheme === 'Mulberry Villas') {
      setFloor('No Floor'); // auto-set
    } else {
      if (!floor.trim()) missing.push('• Floor No.');
    }
    // if (!city.trim()) missing.push('• City');
    // if (!state.trim()) missing.push('• State');
    // if (!postalCode.trim()) {
    //   missing.push('• Postal Code');
    // } else 
    // Check Postal Code only if it's provided
    if (postalCode.trim()) {
      if (!/^\d{6}$/.test(postalCode.trim())) {
        missing.push('• Postal Code: Must be exactly 6 digits (e.g., 400001)');
      }
    }


    // Check Family Members only if it's provided
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



    // if (!familyMembers.trim()) {
    //   missing.push('• No. of Family Members');
    // } else
    // if (!/^\d+$/.test(familyMembers.trim())) {
    //   missing.push('• No. of Family Members: Only numbers allowed');
    // } else if (parseInt(familyMembers.trim(), 10) === 0) {
    //   missing.push('• No. of Family Members: Must be at least 1');
    // } else if (parseInt(familyMembers.trim()) > 15) {
    //   missing.push('• No. of Family Members: Must be minimum than 15');
    // }
    if (!scheme) {
      missing.push('• Scheme');
    }

    return missing;
  };

  const validateStep4 = () => {
    const missing = [];
    if (!idProof) missing.push('• Identity Proof Document');
    if (!addressProof) missing.push('• Address Proof Document');
    if (!ownershipProof) missing.push('• Ownership Proof Document');
    if (!photo) missing.push('• Applicant Photo');
    return missing;
  };

  const validateStep5 = () => {
    const missing = [];
    if (!idProofType) missing.push('• ID Proof Type');
    if (!addressProofType) missing.push('• Address Proof Type');
    if (!ownershipProofType) missing.push('• Ownership Proof Type');
    return missing;
  };

  const validateStep6 = () => {
    const missing = [];
    const userAnswer = parseInt(captcha, 10);
    if (isNaN(userAnswer) || userAnswer !== captchaData.answer) {
      missing.push('• Incorrect Captcha Answer');
    }
    if (!signature) missing.push('• Signature');
    return missing;
  };

  const handleSubmit = async () => {
    const userAnswer = parseInt(captcha, 10);
    if (isNaN(userAnswer) || userAnswer !== captchaData.answer) {
      Alert.alert('Error', 'Incorrect captcha answer. Please try again.');
      return;
    }

    const allMissing = [
      ...validateStep1(),
      ...validateStep2(),
      // ...validateStep4(),
      // ...validateStep5(),
      ...validateStep6(),
    ];

    if (allMissing.length > 0) {
      Alert.alert(
        'Cannot Submit',
        'Some required fields are missing:\n\n' + allMissing.join('\n'),
        [{ text: 'OK' }]
      );
      return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    //membership Nos
    formData.append('membershipNos', membershipNos);

    formData.append('middleName', middleName || '');
    formData.append('lastName', lastName);
    formData.append('relationName', relativeName);
    formData.append('relationMiddleName', relativemiddleName || '');
    formData.append('relationLastName', relativelastName || '');
    formData.append('livingHere', livingHere ? 'true' : 'false');
    formData.append('dateOfBirth', formatDate(dob));
    formData.append('occupation', occupation || '');
    formData.append('email', email || '');
    formData.append('phone', phone || '');
    formData.append('flatNumber', flatNo);
    formData.append('floor', floor || '');
    formData.append('scheme', scheme);
    formData.append('blockNumber', blockNumber || '');
    formData.append('correspondenceAddress', `${address1} ${address2}`.trim());
    formData.append('city', city);
    formData.append('state', state);
    formData.append('country', country);
    formData.append('postalCode', postalCode);
    formData.append('address', `${flatNo}${floor ? `, Floor ${floor}` : ''}, ${scheme}`);
    formData.append('familyMembersCount', familyMembers || '0');
    formData.append('hobbiesAndSkills', hobbies || '');
    if (idProofType) formData.append('identityProofType', idProofType);
    if (addressProofType) formData.append('addressProofType', addressProofType);
    if (ownershipProofType) formData.append('ownershipProofType', ownershipProofType);

    formData.append('chosenFlatVilla', flatNo);
    formData.append('requestSource', 'mobile');

    if (idProof) formData.append('identityProofDocument', idProof);
    if (addressProof) formData.append('addressProofDocument', addressProof);
    if (ownershipProof) formData.append('ownershipProofDocument', ownershipProof);
    if (photo) formData.append('applicantPhoto', photo);
    if (signature) {
      if (signatureType === "Signature Pad") {
        try {
          const base64Data = signature.replace(/^data:image\/[a-z]+;base64,/, '');
          const filePath = `${RNFS.CachesDirectoryPath}/signature.png`;
          await RNFS.writeFile(filePath, base64Data, 'base64');

          formData.append('signature', {
            uri: Platform.OS === 'android' ? `file://${filePath}` : `file://${filePath}`,
            type: 'image/png',
            name: 'signature.png',
          });
        } catch (err) {
          Alert.alert('Error', 'Failed to process signature. Please try again.');
          return;
        }
      } else if (signatureType === "Upload Image") {
        formData.append('signature', { uri: signature.uri, type: signature.type, name: 'signature.png' });
      }
    }
    try {
      let response;
      if (isEdit) {
        console.log("id from update member api call :", member._id)
        response = await dispatch(updateMember({ id: member._id, formData })).unwrap();
      } else {
        response = await dispatch(addMember(formData)).unwrap();
      }
      // const response = await dispatch(addMember(formData)).unwrap();
      console.log(response, 'bivlnfdvfdnvh')
      dispatch(
        showMessage({
          type: 'success',
          text:
            response?.message ||
            (isEdit ? 'Member updated successfully!' : 'Member added successfully!'),
        })
      );
      dispatch(resetAddMemberState());
      navigation.goBack();
    } catch (err) {
      dispatch(
        showMessage({
          type: 'error',
          text: err?.message || 'Application Failed!',
        })
      );
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigation?.goBack?.();
    } else {
      setStep(step - 1);
      setScrollEnabled(true);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={28} color="#519377" />

        </TouchableOpacity>
        <View style={{ width: '95%', justifyContent: 'center', marginTop: 20 }}>
          <Image source={imagePath.loginImage} style={{ height: height / 9, width: width / 5, alignSelf: 'center' }} />
          <Text style={{ alignSelf: 'center', color: "#519377", fontSize: 20, fontWeight: '600', marginTop: 15 }}>{isEdit ? 'Update Member' : 'Add Member'}</Text>
        </View>
      </View>
      <View style={{ justifyContent: 'space-between', flexDirection: "row", marginTop: 15 }}>
        <Text style={styles.headerTitle}>
          {step === 1 && 'Membership Application'}
          {step === 2 && 'Address & Family Details'}
          {step === 3 && 'Hobbies & Skills'}
          {step === 4 && 'Document Uploads'}
          {step === 5 && 'Proofs & Signature'}
          {step === 6 && 'Final Details'}
        </Text>
        <Text style={styles.stepIndicator}>Step <Text style={{ color: '#519377' }}>{step}</Text>/6</Text>
      </View>
    </View>
  );

  const UploadBox = ({ title, file, onPress, hint }) => (
    <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
      {file ? (
        <Image source={{ uri: isEdit ? file : file.uri }} style={styles.uploadedImage} resizeMode="cover" />
      ) : (
        <>
          <Ionicons name='cloud-upload-outline' size={40} color={'#666'} />
          <Text style={styles.uploadText}>Choose File</Text>
        </>
      )}
      {file && <Text style={styles.fileName}>{file.name}</Text>}
      <Text style={styles.hint}>{hint || title}</Text>
    </TouchableOpacity>
  );

  const onBeginSigning = () => setScrollEnabled(false);
  const onEndSigning = () => setScrollEnabled(true);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {renderHeader()}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={scrollEnabled}
            ref={scrollRef}
          >
            {step === 1 && (
              <>
                <Text style={styles.label}>Name *</Text>
                <TextInput style={styles.input} placeholder="First" value={firstName} onChangeText={setFirstName} placeholderTextColor={'#E0E0E0'} />
                <Text style={styles.label}>Middle Name </Text>
                <TextInput style={styles.input} placeholder="Middle" value={middleName} onChangeText={setMiddleName} placeholderTextColor={'#E0E0E0'} />
                <Text style={styles.label}>Last Name *</Text>
                <TextInput style={styles.input} placeholder="Last" value={lastName} onChangeText={setLastName} placeholderTextColor={'#E0E0E0'} />

                <Text style={styles.label}>Father/Husband/Mother/Wife's Name *</Text>
                <TextInput style={styles.inputFull} placeholder="First" placeholderTextColor={'#E0E0E0'} value={relativeName} onChangeText={setRelativeName} />
                <Text style={styles.label}>Middle Name </Text>
                <TextInput style={styles.input} placeholder="Middle" value={relativemiddleName} onChangeText={setrelativeMiddleName} placeholderTextColor={'#E0E0E0'} />
                <Text style={styles.label}>Last Name *</Text>
                <TextInput style={styles.input} placeholder="Last" value={relativelastName} onChangeText={setrelativeLastName} placeholderTextColor={'#E0E0E0'} />

                <Text style={styles.label}>Membership Nos *</Text>
                <TextInput style={styles.input} placeholder="Membership Nos" value={membershipNos} onChangeText={setMembershipNos} placeholderTextColor={'#E0E0E0'} />


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
                    style={styles.inputFull}
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
                <TextInput style={styles.inputFull} placeholder="Occupation" placeholderTextColor={'#E0E0E0'} value={occupation} onChangeText={setOccupation} />

                <Text style={styles.label}>Phone Number *</Text>
                <TextInput style={styles.input} placeholder="Phone *" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={'#E0E0E0'} />

                <Text style={styles.label}>Email *</Text>
                <TextInput style={styles.input} placeholder="Email *" value={email} onChangeText={setEmail} keyboardType="email-address" placeholderTextColor={'#E0E0E0'} />
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.label}>Flat/Villa/Plot No. *</Text>
                <TextInput style={styles.inputFull} placeholder="Flat/Villa/Plot No." placeholderTextColor={'#E0E0E0'} value={flatNo} onChangeText={setFlatNo} />

                <Text style={styles.label}>Floor *</Text>
                {/* <TextInput style={styles.inputFull} placeholder="Floor" placeholderTextColor={'#E0E0E0'} value={floor} onChangeText={setFloor} /> */}
                <TextInput
                  style={styles.inputFull}
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
                <TextInput style={styles.inputFull} placeholder="Block Number" placeholderTextColor={'#E0E0E0'} value={blockNumber} onChangeText={setBlockNumber} />

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
                <TextInput style={styles.inputFull} placeholder="Address Line 1" value={address1} onChangeText={setAddress1} />
                <TextInput style={styles.inputFull} placeholder="Address Line 2" value={address2} onChangeText={setAddress2} />

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>City</Text>
                    <TextInput style={styles.input} placeholder="City" placeholderTextColor={'#E0E0E0'} value={city} onChangeText={setCity} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.label}>State</Text>
                    <TextInput style={styles.input} placeholder="State" placeholderTextColor={'#E0E0E0'} value={state} onChangeText={setState} />
                  </View>
                </View>

                <Text style={styles.label}>Postal Code</Text>
                <TextInput style={styles.inputFull} placeholder="Postal Code" placeholderTextColor={'#E0E0E0'} value={postalCode} onChangeText={setPostalCode} keyboardType="numeric" />

                <Text style={styles.label}>Country</Text>
                <TextInput style={styles.inputFull} placeholder="Country" placeholderTextColor={'#E0E0E0'} value={country} onChangeText={setCountry} />

                <Text style={styles.label}>No. of family members</Text>
                <TextInput style={styles.inputFull} placeholder="No. of family members" placeholderTextColor={'#E0E0E0'} value={familyMembers} onChangeText={setFamilyMembers} keyboardType="numeric" />
              </>
            )}

            {step === 3 && (
              <>
                <Text style={styles.label}>Hobbies/Skills</Text>
                <TextInput style={styles.inputFull} placeholder="Hobbies/Skills" placeholderTextColor={'#E0E0E0'} value={hobbies} onChangeText={setHobbies} multiline />
              </>
            )}

            {step === 4 && (
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
            )}

            {step === 5 && (
              <>
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
              </>
            )}

            {step === 6 && (
              <>
                <Text style={styles.label}>Captcha *</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                  <View style={styles.captchaBox}>
                    <Text style={styles.captchaText}>
                      {captchaData.num1} {captchaData.operator} {captchaData.num2} =
                    </Text>
                  </View>
                  <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 10 }]}
                    placeholder="Answer"
                    value={captcha}
                    onChangeText={setCaptcha}
                    keyboardType="numeric"
                    placeholderTextColor={'#E0E0E0'}
                  />
                </View>
                <Text style={styles.label}>Select Signature type</Text>
                <DropDownPicker
                  open={openSignatureType}
                  value={signatureType}
                  setOpen={setOpenSignatureType}
                  setValue={setSignatureType}
                  items={signatureTypes}
                  style={styles.dropdown}
                  dropDownContainerStyle={[styles.dropdownList, { height: 80 }]}
                  listMode="SCROLLVIEW"
                  zIndex={1000}
                  zIndexInverse={3000}
                />
                <Text style={styles.label}>{signatureType === "Upload Image" ? "Signature Photo" : "Signature"} *</Text>

                {signatureType === "Upload Image" && (
                  <UploadBox title="Signature Photo" file={signature} onPress={() => pickAndCrop(setSignature, { cropperCircleOverlay: true })} />
                )}
                {signatureType === "Signature Pad" && (
                  <>
                    {signature && (
                      <View style={{ marginVertical: 10 }}>
                        <Image source={{ uri: signature }} style={{ width: '100%', height: 100, borderRadius: 12 }} resizeMode="contain" />
                        <Text style={{ textAlign: 'center', color: 'green', marginTop: 5 }}>✓ Signature captured</Text>
                      </View>
                    )}
                    <SignatureBox
                      onSave={setSignature}
                      ref={signatureRef}
                      onBeginSigning={onBeginSigning}
                      onEndSigning={onEndSigning}
                    />
                    <TouchableOpacity
                      style={styles.clearBtn}
                      onPress={() => signatureRef.current?.clearSignature()}
                    >
                      <Text style={styles.clearText}>Clear Signature</Text>
                    </TouchableOpacity>
                  </>
                )}


              </>
            )}

            <View style={styles.buttonRow}>
              {step < 6 ? (
                <TouchableOpacity style={styles.btnPrimary} onPress={nextStep}>
                  <Text style={styles.btnTextWhite}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.btnSuccess} onPress={handleSubmit} disabled={loading}>
                  <Text style={styles.btnTextWhite}>
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC', padding: 16 },
  header: {
    width: '100%',
    // paddingHorizontal: 16,
    height: height / 3.75,
    backgroundColor: '#F7F9FC',
  },
  headerTitle: { fontSize: 14, fontWeight: '600', color: '#519377', textAlign: 'left', marginTop: 10 },
  stepIndicator: { fontSize: 14, color: '#666', fontWeight: '500', alignSelf: 'flex-end' },
  content: { padding: 0 },
  label: { fontSize: 16, fontWeight: '600', marginVertical: 10, color: '#1A1A1A' },
  row: { flexDirection: 'row', marginBottom: 10 },
  input: { backgroundColor: '#FFF', borderRadius: 12, height: 56, paddingHorizontal: 15, borderColor: '#C4C4C4', borderWidth: 1 },
  inputFull: { backgroundColor: '#FFF', borderRadius: 12, height: 56, paddingHorizontal: 15, marginBottom: 10, borderColor: '#C4C4C4', borderWidth: 1 },
  dropdown: { borderRadius: 12, height: 56, borderColor: '#C4C4C4', backgroundColor: '#FFF' },
  dropdownList: { borderRadius: 12, borderColor: '#C4C4C4', height: 120, alignSelf: 'center' },
  radioRow: { flexDirection: 'row', justifyContent: 'center', gap: 50, marginVertical: 20 },
  radioBtn: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  radioCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#666' },
  radioFilled: { backgroundColor: '#519377', borderColor: '#519377' },
  radioLabel: { fontSize: 16 },
  uploadGrid: { gap: 20 },
  uploadBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 30, alignItems: 'center', borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed' },
  uploadedImage: { width: 200, height: 120, borderRadius: 12, marginBottom: 10 },
  uploadText: { fontSize: 14, color: '#666', marginTop: 10 },
  fileName: { color: '#519377', fontSize: 12, marginTop: 8 },
  hint: { fontSize: 12, color: '#999', marginTop: 10 },
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
  clearText: { fontSize: 13, color: '#333' },
  captchaBox: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#C4C4C4',
  },
  captchaText: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  buttonRow: { marginVertical: 10 },
  btnPrimary: { backgroundColor: '#519377', padding: 16, borderRadius: 12 },
  btnSuccess: { backgroundColor: '#519377', padding: 16, borderRadius: 12 },
  btnTextWhite: { textAlign: 'center', fontWeight: '600', color: '#FFF', fontSize: 16 },
});