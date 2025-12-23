// SocietyInfoScreen.js

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import CustomInput from '../../components/CustomInput';

const SocietyInfoScreen = ({ navigation }) => {
    const [societyName, setSocietyName] = useState('Silver Birch');
    const [blockSector, setBlockSector] = useState('Silver Birch, Omaxe Township, 140901');
    const [address, setAddress] = useState('Silver Birch, Omaxe Township, 140901');
    const [gstNumber, setGstNumber] = useState('562ADD5155DFVDVD');

    const handleUpdate = () => {
        console.log('Update pressed');
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
                <Text style={styles.headerTitle}>Society Info</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Society Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Society Name</Text>
                    <CustomInput
                        value={societyName}
                        onChangeText={setSocietyName}
                        keyboardType="email-address"
                    />
                </View>

                {/* Block / Sector */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Block / Sector</Text>
                    <CustomInput
                        value={blockSector}
                        onChangeText={setBlockSector}
                        keyboardType="email-address"
                    />
                </View>

                {/* Address */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Address</Text>
                     <CustomInput
                        value={address}
                        onChangeText={setAddress}
                        keyboardType="email-address"
                    />
                </View>

                {/* GST/Registration Number */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>GST/Registration Number</Text>
                     <CustomInput
                        value={gstNumber}
                        onChangeText={setGstNumber}
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.updateButton}
                    onPress={handleUpdate}
                    activeOpacity={0.8}
                >
                    <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>

           
        </SafeAreaView>
    );
};

export default SocietyInfoScreen;

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
        marginTop:2
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
    inputGroup: {
        marginBottom: moderateScale(15),
    },
    label: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#000',
        marginBottom: moderateScale(5),
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: moderateScale(12),
        backgroundColor: '#fff',
    },
    input: {
        fontSize: moderateScale(16),
        color: '#333',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(16),
        fontWeight: '400',
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
    updateButtonText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#fff',
    },
});