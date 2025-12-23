import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';

const MemberDetailScreen = () => {

  const navigation = useNavigation();


  return (
    <SafeAreaView style={styles.container} edges={['top','bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value="Aarav"
            editable={false}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Father/Husband/Mother/Wife's Name</Text>
          <TextInput
            style={styles.input}
            value="Jagjeet Singh"
            editable={false}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Are you living here?</Text>
          <View style={styles.radioContainer}>
            <View style={styles.radioOption}>
              <View style={styles.radioOuter}>
                <View style={styles.radioInner} />
              </View>
              <Text style={styles.radioText}>Yes</Text>
            </View>
          </View>
        </View>

        {/* Date of Birth */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            value="12-09-1998"
            editable={false}
          />
        </View>

        {/* Occupation */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Occupation</Text>
          <TextInput
            style={styles.input}
            value="Veteran Doctor"
            editable={false}
          />
        </View>

        {/* Email */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value="Sunitawillaims@gmail.com"
            editable={false}
            keyboardType="email-address"
          />
        </View>

        {/* Phone Number */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value="0000000000"
            editable={false}
            keyboardType="phone-pad"
          />
        </View>

        {/* Flat/Villa/Plot Number */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Flat/Villa/Plot Number</Text>
          <TextInput
            style={styles.input}
            value="1264"
            editable={false}
          />
        </View>

        {/* Floor (if applicable) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Floor (if applicable)</Text>
          <TextInput
            style={styles.input}
            value="2nd Floor"
            editable={false}
          />
        </View>

        {/* Scheme (if applicable) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Scheme (if applicable)</Text>
          <TextInput
            style={styles.input}
            value="Scheme no.5"
            editable={false}
          />
        </View>

        {/* Correspondence Address */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Correspondence Address</Text>
          <TextInput
            style={styles.input}
            value="Random address"
            editable={false}
          />
          <TextInput
            style={[styles.input, styles.inputSpacing]}
            value="Random address in line"
            editable={false}
          />
        </View>

        {/* City and State */}
        <View style={styles.rowContainer}>
          <View style={styles.halfField}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value="Mohali"
              editable={false}
            />
          </View>
          <View style={[styles.halfField, styles.halfFieldRight]}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value="Punjab"
              editable={false}
            />
          </View>
        </View>

        {/* Country and Postal Code */}
        <View style={styles.rowContainer}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value="India"
              editable={false}
            />
          </View>
          <View style={[styles.halfField, styles.halfFieldRight]}>
            <Text style={styles.label}>Postal Code</Text>
            <TextInput
              style={styles.input}
              value="160035"
              editable={false}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* No. of family members including children */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>No. of family members including children</Text>
          <TextInput
            style={styles.input}
            value="6"
            editable={false}
            keyboardType="number-pad"
          />
        </View>

        {/* Hobbies & Skills */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Hobbies & Skills</Text>
          <TextInput
            style={styles.input}
            value="Playing Cricket, Reading Books"
            editable={false}
          />
        </View>

        {/* Identity Proof */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Identity Proof</Text>
          <TextInput
            style={styles.input}
            value="Aadhar Card"
            editable={false}
          />
        </View>

        {/* Address Proof */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Address Proof</Text>
          <TextInput
            style={styles.input}
            value="Voter ID"
            editable={false}
          />
        </View>

        {/* Ownership Proof */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Ownership Proof</Text>
          <TextInput
            style={styles.input}
            value="Possession Letter"
            editable={false}
          />
        </View>

        {/* Signature */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Signature</Text>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>Aarav Singh</Text>
          </View>
        </View>

        {/* Bottom spacing for buttons */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => console.log('Approved')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.denyButton}
          onPress={() => console.log('Denied')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Deny</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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

});

export default MemberDetailScreen;