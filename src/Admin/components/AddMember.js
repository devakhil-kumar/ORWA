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
import { addMember, resetAddMemberState } from '../../app/features/addMemberSlice';
import { showMessage } from '../../app/features/messageSlice';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SignatureBox = forwardRef(({ onSave }, ref) => {
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

  const handleEnd = () => {
    signRef.current?.readSignature(); // Auto-save on stroke end
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
        onEnd={handleEnd}
        descriptionText="Sign here"
        autoClear={false}
        imageType="image/png"
        webStyle={signatureStyle}
        backgroundColor="#ffffff"
        penColor="#000000"
        dotSize={3}
        minWidth={2}
        maxWidth={4}
      />
    </View>
  );
});

// Captcha Generator
const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let answer;
  switch (operator) {
    case '+': answer = num1 + num2; break;
    case '-': answer = num1 - num2; break;
    case '*': answer = num1 * num2; break;
    default: answer = 0;
  }
  return { num1, num2, operator, answer };
};

export default function MembershipForm() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.addmember); // Adjust if reducer name is different
  const navigation = useNavigation();

  const [step, setStep] = useState(1);

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
  const [captcha, setCaptcha] = useState('');

  const [openScheme, setOpenScheme] = useState(false);
  const [openIdType, setOpenIdType] = useState(false);
  const [openAddrType, setOpenAddrType] = useState(false);
  const [openOwnType, setOpenOwnType] = useState(false);

  const signatureRef = useRef(null);
  const captchaData = useMemo(() => generateCaptcha(), [step === 6]);

  const schemes = [
    { label: 'true', value: 'true' },
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

  const pickAndCrop = async (setter, options = {}) => {
    try {
      const image = await ImagePicker.openPicker({
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

  const handleDateConfirm = (date) => {
    setDob(date);
    setDatePickerVisible(false);
  };

  const nextStep = () => {
    let missing = [];
    if (step === 1) missing = validateStep1();
    else if (step === 2) missing = validateStep2();
    else if (step === 4) missing = validateStep4();
    else if (step === 5) missing = validateStep5();
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const validateStep1 = () => {
    const missing = [];
    if (!firstName.trim()) missing.push('• First Name');
    if (!lastName.trim()) missing.push('• Last Name');
    if (!relativeName.trim()) missing.push('• Relative First Name');
    if (!relativelastName.trim()) missing.push('• Relative Last Name');
    if (livingHere === null) missing.push('• Are you living here?');
    if (!dob) missing.push('• Date of Birth');
    if (!occupation.trim()) missing.push('• Occupation');
    if (!phone.trim()) missing.push('• Phone Number');
    if (!email.trim()) missing.push('• Email');
    return missing;
  };

  const validateStep2 = () => {
    const missing = [];
    if (!flatNo.trim()) missing.push('• Flat/Villa/Plot No.');
    if (!city.trim()) missing.push('• City');
    if (!state.trim()) missing.push('• State');
    if (!postalCode.trim()) {
      missing.push('• Postal Code');
    } else if (!/^\d+$/.test(postalCode.trim())) {
      missing.push('• Postal Code: Only numbers allowed (e.g., 400001)');
    }
  
    if (!familyMembers.trim()) {
      missing.push('• No. of Family Members');
    } else if (!/^\d+$/.test(familyMembers.trim())) {
      missing.push('• No. of Family Members: Only numbers allowed');
    } else if (parseInt(familyMembers) === 0) {
      missing.push('• No. of Family Members: Must be at least 1');
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
      ...validateStep4(),
      ...validateStep5(),
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
    formData.append('identityProofType', idProofType);
    formData.append('addressProofType', addressProofType);
    formData.append('ownershipProofType', ownershipProofType);
    formData.append('chosenFlatVilla', flatNo);
    formData.append('requestSource', 'mobile');

    if (idProof) formData.append('identityProofDocument', idProof);
    if (addressProof) formData.append('addressProofDocument', addressProof);
    if (ownershipProof) formData.append('ownershipProofDocument', ownershipProof);
    if (photo) formData.append('applicantPhoto', photo);
    if (signature) {
      try {
        const base64Data = signature.replace(/^data:image\/[a-z]+;base64,/, '');
        const filePath = `${RNFS.CachesDirectoryPath}/signature.png`;
        await RNFS.writeFile(filePath, base64Data, 'base64');

        formData.append('signature', {
          uri: Platform.OS === 'android' ? filePath : `file://${filePath}`, 
          type: 'image/png',
          name: 'signature.png',
        });
      } catch (err) {
        Alert.alert('Error', 'Failed to process signature. Please try again.');
        return;
      }
    }
    try {
      const response = await dispatch(addMember(formData)).unwrap();
      console.log(response, 'bivlnfdvfdnvh')
      dispatch(
        showMessage({
          type: 'success',
          text: response?.message || 'Application Submit successful!',
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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => (step === 1 ? navigation?.goBack?.() : setStep(step - 1))}>
          <FontAwesome name="angle-left" size={28} color={'#000'} />
        </TouchableOpacity>
        <View style={{ width: '95%', justifyContent: 'center', marginTop: 20 }}>
          <Image source={imagePath.loginImage} style={{ height: height / 10, width: width / 5, alignSelf: 'center' }} />
          <Text style={{ alignSelf: 'center', color: "#519377", fontSize: 20, fontWeight: '600', marginTop: 15 }}>Add Member</Text>
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
        <Image source={{ uri: file.uri }} style={styles.uploadedImage} resizeMode="cover" />
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

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {renderHeader()}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <>
              <Text style={styles.label}>Name *</Text>
              <TextInput style={styles.input} placeholder="First" value={firstName} onChangeText={setFirstName} placeholderTextColor={'#E0E0E0'} />
              <Text style={styles.label}>Middle Name </Text>
              <TextInput style={styles.input} placeholder="Middle" value={middleName} onChangeText={setMiddleName} placeholderTextColor={'#E0E0E0'} />
              <Text style={styles.label}>Last Name *</Text>
              <TextInput style={styles.input} placeholder="Last" value={lastName} onChangeText={setLastName} placeholderTextColor={'#E0E0E0'} />

              <Text style={styles.label}>Father/Husband/Mother/Wife's Name *</Text>
              <TextInput style={styles.inputFull} value={relativeName} onChangeText={setRelativeName} />
              <Text style={styles.label}>Middle Name </Text>
              <TextInput style={styles.input} placeholder="Middle" value={relativemiddleName} onChangeText={setrelativeMiddleName} placeholderTextColor={'#E0E0E0'} />
              <Text style={styles.label}>Last Name *</Text>
              <TextInput style={styles.input} placeholder="Last" value={relativelastName} onChangeText={setrelativeLastName} placeholderTextColor={'#E0E0E0'} />
              <Text style={styles.label}>Are you living here? </Text>
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
              <Text style={styles.label}>Date of Birth *</Text>
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
              />
              <Text style={styles.label}>Occupation *</Text>
              <TextInput style={styles.inputFull} value={occupation} onChangeText={setOccupation} />

              <Text style={styles.label}>Phone Number *</Text>
              <TextInput style={styles.input} placeholder="Phone *" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={'#E0E0E0'} />

              <Text style={styles.label}>Email *</Text>
              <TextInput style={styles.input} placeholder="Email *" value={email} onChangeText={setEmail} keyboardType="email-address" placeholderTextColor={'#E0E0E0'} />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.label}>Flat/Villa/Plot No. *</Text>
              <TextInput style={styles.inputFull} value={flatNo} onChangeText={setFlatNo} />

              <Text style={styles.label}>Floor</Text>
              <TextInput style={styles.inputFull} value={floor} onChangeText={setFloor} />

              <Text style={styles.label}>Block Number</Text>
              <TextInput style={styles.inputFull} value={blockNumber} onChangeText={setBlockNumber} />

              <Text style={styles.label}>Scheme</Text>
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

              <Text style={styles.label}>Correspondence Address *</Text>
              <TextInput style={styles.inputFull} placeholder="Address Line 1" value={address1} onChangeText={setAddress1} />
              <TextInput style={styles.inputFull} placeholder="Address Line 2" value={address2} onChangeText={setAddress2} />

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>City *</Text>
                  <TextInput style={styles.input} value={city} onChangeText={setCity} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.label}>State *</Text>
                  <TextInput style={styles.input} value={state} onChangeText={setState} />
                </View>
              </View>

              <Text style={styles.label}>Postal Code *</Text>
              <TextInput style={styles.inputFull} value={postalCode} onChangeText={setPostalCode} keyboardType="numeric" />

              <Text style={styles.label}>Country</Text>
              <TextInput style={styles.inputFull} value={country} onChangeText={setCountry} />

              <Text style={styles.label}>No. of family members</Text>
              <TextInput style={styles.inputFull} value={familyMembers} onChangeText={setFamilyMembers} keyboardType="numeric" />
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.label}>Hobbies/Skills</Text>
              <TextInput style={styles.inputFull} value={hobbies} onChangeText={setHobbies} multiline />
            </>
          )}

          {step === 4 && (
            <View style={styles.uploadGrid}>
              <View>
                <Text style={styles.label}>Identity Proof *</Text>
                <UploadBox title="Identity Proof" file={idProof} onPress={() => pickAndCrop(setIdProof)} />
              </View>
              <View>
                <Text style={styles.label}>Address Proof *</Text>
                <UploadBox title="Address Proof" file={addressProof} onPress={() => pickAndCrop(setAddressProof)} />
              </View>
              <View>
                <Text style={styles.label}>Ownership Proof *</Text>
                <UploadBox title="Ownership Proof" file={ownershipProof} onPress={() => pickAndCrop(setOwnershipProof)} />
              </View>
              <View>
                <Text style={styles.label}>Photo *</Text>
                <UploadBox title="Photo" file={photo} onPress={() => pickAndCrop(setPhoto, { cropperCircleOverlay: true })} />
              </View>
            </View>
          )}

          {step === 5 && (
            <>
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

              <Text style={styles.label}>Signature *</Text>
              {signature && (
                <View style={{ marginVertical: 10 }}>
                  <Image source={{ uri: signature }} style={{ width: '100%', height: 150, borderRadius: 12 }} resizeMode="contain" />
                  <Text style={{ textAlign: 'center', color: 'green', marginTop: 5 }}>✓ Signature captured</Text>
                </View>
              )}
              <View style={styles.containerSing}>
                <SignatureBox onSave={setSignature} ref={signatureRef} />
              </View>

              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => signatureRef.current?.clearSignature()}
              >
                <Text style={styles.clearText}>Clear Signature</Text>
              </TouchableOpacity>
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  header: {
    width: '100%',
    paddingHorizontal: 16,
    height: height / 4.2,
    backgroundColor: '#F7F9FC',
  },
  headerTitle: { fontSize: 14, fontWeight: '600', color: '#519377', textAlign: 'left', marginTop: 10 },
  stepIndicator: { fontSize: 14, color: '#666', fontWeight: '500', alignSelf: 'flex-end' },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginVertical: 10, color: '#1A1A1A' },
  row: { flexDirection: 'row', marginBottom: 10 },
  input: { backgroundColor: '#FFF', borderRadius: 12, height: 56, paddingHorizontal: 15, borderColor: '#C4C4C4', borderWidth: 1 },
  inputFull: { backgroundColor: '#FFF', borderRadius: 12, height: 56, paddingHorizontal: 15, marginBottom: 10, borderColor: '#C4C4C4', borderWidth: 1 },
  dropdown: { borderRadius: 12, height: 56, borderColor: '#C4C4C4', backgroundColor: '#FFF' },
  dropdownList: { borderRadius: 12 },
  radioRow: { flexDirection: 'row', justifyContent: 'center', gap: 50, marginVertical: 20 },
  radioBtn: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  radioCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#666' },
  radioFilled: { backgroundColor: '#519377', borderColor: '#519377' },
  radioLabel: { fontSize: 16 },
  uploadGrid: { gap: 20 },
  uploadBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 30, alignItems: 'center', borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed' },
  uploadedImage: { width: 120, height: 120, borderRadius: 12, marginBottom: 10 },
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
  buttonRow: { marginVertical: 40 },
  btnPrimary: { backgroundColor: '#519377', padding: 16, borderRadius: 12 },
  btnSuccess: { backgroundColor: '#519377', padding: 16, borderRadius: 12 },
  btnTextWhite: { textAlign: 'center', fontWeight: '600', color: '#FFF', fontSize: 16 },
});