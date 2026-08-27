// SocietyInfoScreen.js

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocietyAdmin, updateSocietyAdmin } from '../../app/features/societySlice';
import { showMessage } from '../../app/features/messageSlice';




const CustomInput = ({
    value,
    onChangeText,
    placeholder,
    multiline = false,
    editable = true,
    style,
    ...otherProps
}) => {
    return (
        <View style={styles.containerText}>
            <TextInput
                style={[styles.input, multiline && styles.multiline, style]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#999"
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                editable={editable}
                {...otherProps}
            />
        </View>
    );
};

const SocietyInfoScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const { societyData, loading, updateLoading } = useSelector(
        (state) => state.society
    );
    console.log(societyData, 'spccdlhbv')

    const [societyName, setSocietyName] = useState('');
    const [blockSector, setBlockSector] = useState('');
    const [address, setAddress] = useState('');
    const [gstNumber, setGstNumber] = useState('');


    useEffect(() => {
        dispatch(fetchSocietyAdmin({ page: 1, limit: 10 }));
    }, [dispatch]);

    useEffect(() => {
        if (societyData && Array.isArray(societyData) && societyData.length > 0) {
            const society = societyData[0];
            setSocietyName(society.societyName || '');
            setBlockSector(society.block || society.blockSector || '');
            setAddress(society.address || '');
            setGstNumber(society.gstNumber || '');
        }
    }, [societyData]);


    const handleUpdate = async () => {

        try {
            if (!societyName.trim()) {
                dispatch(
                    showMessage({
                        type: 'error',
                        text: 'Society name is required',
                    })
                );
                return;
            }

            if (!blockSector.trim()) {
                dispatch(
                    showMessage({
                        type: 'error',
                        text: 'Block/Sector is required',
                    })
                );
                return;
            }

            const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

            if (!gstNumber.trim()) {
                dispatch(showMessage({ type: 'error', text: 'GST number is required' }));
                return;
            } else if (!gstRegex.test(gstNumber.trim().toUpperCase())) {
                dispatch(showMessage({ type: 'error', text: 'Invalid GST number format.' }));
                return;
            }

            if (!address.trim()) {
                dispatch(
                    showMessage({
                        type: 'error',
                        text: 'Address is required',
                    })
                );
                return;
            }

            const societyId = societyData[0]?._id;
            console.log("Society ID :",societyId);
            if (!societyId) {
                dispatch(
                    showMessage({
                        type: 'error',
                        text: 'Society ID not found',
                    })
                );
                return;
            }

            const payload = {
                societyName: societyName.trim(),
                block: blockSector.trim(),
                address: address.trim(),
                gstNumber: gstNumber.trim(),
                isActive: true
            };

            console.log(societyId, payload, 'payload+++++')
            const response = await dispatch(updateSocietyAdmin({ id: societyId, payload })).unwrap();

            dispatch(
                showMessage({
                    type: 'success',
                    text: response?.message || 'Society information updated successfully',
                })
            );
            setTimeout(() => {
                navigation.goBack();
            }, 1000);

        } catch (error) {
            dispatch(
                showMessage({
                    type: 'error',
                    text: error?.message || 'Failed to update society information',
                })
            );
        }
    };

    // if (loading) {
    //     return (
    //         <SafeAreaView style={styles.container}>
    //             <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    //             <View style={styles.loadingContainer}>
    //                 <ActivityIndicator size="large" color="#519377" />
    //             </View>
    //         </SafeAreaView>
    //     );
    // }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#519377" />

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
            {loading ?
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#519377" />
                </View>
                : <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Society Name</Text>
                        <CustomInput
                            value={societyName}
                            onChangeText={setSocietyName}
                            placeholder="Enter society name"
                            editable={!updateLoading}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Block / Sector</Text>
                        <CustomInput
                            value={blockSector}
                            onChangeText={setBlockSector}
                            placeholder="Enter block/sector"
                            editable={!updateLoading}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address</Text>
                        <CustomInput
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Enter address"
                            multiline
                            editable={!updateLoading}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>GST/Registration Number</Text>
                        <CustomInput
                            value={gstNumber}
                            onChangeText={setGstNumber}
                            placeholder="Enter GST/Registration number"
                            editable={!updateLoading}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.updateButton,
                                updateLoading && styles.updateButtonDisabled,
                            ]}
                            onPress={handleUpdate}
                            activeOpacity={0.8}
                            disabled={updateLoading}
                        >
                            {updateLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.updateButtonText}>Update</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>}
        </SafeAreaView>
    );
};

export default SocietyInfoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: moderateScale(16),
        fontSize: moderateScale(16),
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(12),
        backgroundColor: '#F9FAFB',

    },
    backButton: {
        marginTop: 2,
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
    buttonContainer: {
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(20),
        backgroundColor: '#F9FAFB',

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
    updateButtonDisabled: {
        backgroundColor: '#A5C9B8',
    },
    updateButtonText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#fff',
    },
    containerText: {
        backgroundColor: '#F5F5F5',
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    input: {
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(12),
        fontSize: moderateScale(15),
        color: '#000',
    },
    multiline: {
        minHeight: moderateScale(100),
        textAlignVertical: 'top',
    },
});