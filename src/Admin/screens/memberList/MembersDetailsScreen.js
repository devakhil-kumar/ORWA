import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { verifyMemberPayment } from '../../../app/features/adminMemberRequestsSlice';
import { showMessage } from '../../../app/features/messageSlice';

const MemberDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { member } = route.params;
  const [processing, setProcessing] = useState(null);
  const dispatch = useDispatch();

  const { verifyLoading, verifyError, verifySuccess } = useSelector(
    (state) => state.memberList
  );

  const fullName = `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim();
  const relationFullName = `${member.relationName || ''} ${member.relationMiddleName || ''} ${member.relationLastName || ''}`.trim();

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB');
  };

  const handleVerify = async (status) => {
    const action = status ? 'approve' : 'deny';
    if (processing) return;
    setProcessing(action);
    console.log(status, 'status')
    try {
      const resultAction = await dispatch(
        verifyMemberPayment({ id: member?._id, status })
      ).unwrap();
      const responseMessage =
        resultAction?.message ||
        `Membership request has been ${status ? 'approved' : 'denied'} successfully!`;

      dispatch(
        showMessage({
          type: 'success',
          text: responseMessage || 'Approve successful!',
        })
      );
      setTimeout(() => {
        navigation.goBack();
      }, 800);

    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.error ||
        'Failed to process request. Please try again.';
      dispatch(
        showMessage({
          type: 'error',
          text: String(errorMessage),
        })
      );
    } finally {
      setProcessing(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#519377" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Membership Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Full Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={fullName} editable={false} />
        </View>

        {/* Relation Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Father / Husband / Mother / Wife's Name</Text>
          <TextInput style={styles.input} value={relationFullName} editable={false} />
        </View>

        {/* Living Here */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Are you living here?</Text>
          <View style={styles.radioContainer}>
            <View style={styles.radioOption}>
              <View style={styles.radioOuter}>
                {member?.livingHere && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioText}>{member?.livingHere ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        </View>

        {/* Date of Birth */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput style={styles.input} value={formatDate(member?.dateOfBirth)} editable={false} />
        </View>

        {/* Occupation */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Occupation</Text>
          <TextInput style={styles.input} value={member?.occupation || ''} editable={false} />
        </View>

        {/* Email */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={member?.email || ''} editable={false} />
        </View>

        {/* Phone */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={member?.phone || ''} editable={false} />
        </View>

        {/* Flat Number */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Flat / Villa / Plot Number</Text>
          <TextInput
            style={styles.input}
            value={member.flatNumber || member?.chosenFlatVilla || ''}
            editable={false}
          />
        </View>

        {/* Floor */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Floor (if applicable)</Text>
          <TextInput style={styles.input} value={member?.floor || ''} editable={false} />
        </View>

        {/* Scheme */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Scheme (if applicable)</Text>
          <TextInput style={styles.input} value={member?.scheme || ''} editable={false} />
        </View>

        {/* Address */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Correspondence Address</Text>
          <TextInput style={styles.input} value={member?.correspondenceAddress || ''} editable={false} />
          <TextInput
            style={[styles.input, styles.inputSpacing]}
            value={member?.address || ''}
            editable={false}
          />
        </View>

        {/* City & State */}
        <View style={styles.rowContainer}>
          <View style={styles.halfField}>
            <Text style={styles.label}>City</Text>
            <TextInput style={styles.input} value={member?.city || ''} editable={false} />
          </View>
          <View style={[styles.halfField, styles.halfFieldRight]}>
            <Text style={styles.label}>State</Text>
            <TextInput style={styles.input} value={member?.state || ''} editable={false} />
          </View>
        </View>

        {/* Country & Postal Code */}
        <View style={styles.rowContainer}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Country</Text>
            <TextInput style={styles.input} value={member?.country || ''} editable={false} />
          </View>
          <View style={[styles.halfField, styles.halfFieldRight]}>
            <Text style={styles.label}>Postal Code</Text>
            <TextInput style={styles.input} value={member?.postalCode || ''} editable={false} />
          </View>
        </View>

        {/* Family Members */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>No. of family members including children</Text>
          <TextInput
            style={styles.input}
            value={String(member?.familyMembersCount || '')}
            editable={false}
          />
        </View>

        {/* Hobbies */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Hobbies & Skills</Text>
          <TextInput style={styles.input} value={member?.hobbiesAndSkills || ''} editable={false} />
        </View>

        {/* Proofs */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Identity Proof</Text>
          <TextInput style={styles.input} value={member?.identityProofType || ''} editable={false} />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Address Proof</Text>
          <TextInput style={styles.input} value={member?.addressProofType || ''} editable={false} />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Ownership Proof</Text>
          <TextInput style={styles.input} value={member?.ownershipProofType || ''} editable={false} />
        </View>

        {/* Signature */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Signature</Text>
          <View style={styles.signatureBox}>
            {member?.signature ? (
              <Image
                source={{ uri: member.signature }}
                style={styles.signatureImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.signatureText}>{fullName}</Text>
            )}
          </View>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[
          styles.approveButton,
          processing === 'approve' && styles.disabledButton,
        ]} onPress={() => handleVerify(true)} disabled={!!processing} >

          <Text style={styles.buttonText}>{processing === 'approve' ? 'Processing...' : 'Approve'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[
          styles.denyButton,
          processing === 'deny' && styles.disabledButton, ,
        ]} onPress={() => handleVerify(false)} disabled={!!processing}>

          <Text style={styles.buttonText}>{processing === 'deny' ? 'Processing...' : 'Deny'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// export default MemberDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  inputSpacing: {
    marginTop: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  radioText: {
    fontSize: 14,
    color: '#333333',
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  halfField: {
    flex: 1,
  },
  halfFieldRight: {
    marginLeft: 12,
  },
  signatureBox: {
    borderWidth: 2,
    borderColor: '#DADADA',
    borderRadius: 12,
    borderStyle: 'dashed',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  signatureText: {
    fontSize: 24,
    fontStyle: 'italic',
    color: '#666666',
    fontWeight: '300',
  },
  bottomSpacer: {
    height: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#519377',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  denyButton: {
    flex: 1,
    backgroundColor: '#DC3545',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(0),
  },
  backButton: {
    marginTop: 2
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
  signatureImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default MemberDetailScreen;