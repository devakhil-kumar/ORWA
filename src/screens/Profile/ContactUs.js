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

const ContactUs = ({ navigation }) => {
    const [societyName, setSocietyName] = useState('');
    const [blockSector, setBlockSector] = useState('Silver Birch, Omaxe Township, 140901');
    const [address, setAddress] = useState('Silver Birch, Omaxe Township, 140901');
    const [gstNumber, setGstNumber] = useState('562ADD5155DFVDVD');

    const handleUpdate = () => {
        console.log('Update pressed');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={28} color="#519377" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contact Us</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View>
                    <Text >
                        Contact us at:
                    </Text>
                    <Text style={{ marginTop: 20 }}>
                        Call: +91 0987654321
                    </Text>
                    <Text>
                        Email: orwasupport@gmail.com
                    </Text>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Write to us</Text>
                    <CustomInput
                        value={societyName}
                        onChangeText={setSocietyName}
                        keyboardType="email-address"
                        style={styles.input}
                        placeholder="Write here"
                        textAlignVertical={"top"}
                        multiline
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleUpdate}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.updateButtonText}>Submit</Text>
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
        marginTop: moderateScale(20)
    },
    label: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#000',
        marginBottom: moderateScale(0),
    },
    // input: {
    //     fontSize: moderateScale(16),
    //     color: '#333',
    //     paddingHorizontal: moderateScale(16),
    //     paddingVertical: moderateScale(16),
    //     fontWeight: '400',
    // },
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
    input: {
        height: 180,
        borderWidth: 1,
        borderColor: '#CFCFCF',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
    },
});