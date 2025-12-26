import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import imagePath from '../contests/imagePath';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPaymentThunk, resetVerifyState } from '../app/features/paymentVerifySlice';
import { showMessage } from '../app/features/messageSlice';

const PaymentDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { payment } = route.params;
    console.log(payment, 'payment++++++')
    const { loading, success, error } = useSelector((state) => state.paymentApprove);
    const [verifyingStatus, setVerifyingStatus] = useState(null);

    const handleVerify = async (status) => {
        setVerifyingStatus(status); // Show loading only on this button

        const result = await dispatch(verifyPaymentThunk({
            paymentId: payment._id,
            status
        }));

        console.log(result.payload.message, 'resulev hlfdvbldfh')

        if (verifyPaymentThunk.fulfilled.match(result)) {
            dispatch(
                showMessage({
                    type: 'success',
                    text:result.payload.message || 'Payment Approved!',
                })
            );
            navigation.goBack();
            // Alert.alert('Success', `Payment ${status === 'verified' ? 'Approved' : 'Rejected'}!`, [
            //     { text: 'OK', onPress: () => navigation.goBack() }
            // ]);
        } else {
            dispatch(
                showMessage({
                    type: 'error',
                    text:'Payment Deny!',
                })
            );
        }

        setVerifyingStatus(null); // Hide loading
        dispatch(resetVerifyState());
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#519377" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Details</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Resident Card */}
            <View style={styles.card}>
                <View style={styles.cardLeft}>
                    {payment.residentialPhoto ? (
                        <Image
                            source={{ uri: payment.residentialPhoto }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Ionicons name="person" size={30} color="#519377" />
                        </View>
                    )}
                    <View style={styles.cardInfo}>
                        <Text style={styles.residentName}>{payment.residentialName}</Text>
                        <Text style={styles.residentAddress}>{payment.residentialAddress}</Text>
                        {/* <Text style={styles.monthText}>
                            {payment.month} {payment.year}
                        </Text> */}
                    </View>
                </View>
            </View>
            <Image
                source={{ uri: payment.paymentScreenshot }}
                style={styles.paymentImage}
                resizeMode="contain"
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleVerify('verified')}
                    disabled={verifyingStatus !== null} // Disable both while loading
                >
                    {verifyingStatus === 'verified' ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Approve</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.denyButton}
                    onPress={() => handleVerify('rejected')}
                    disabled={verifyingStatus !== null}
                >
                    {verifyingStatus === 'rejected' ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Deny</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default PaymentDetails;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 16 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: moderateScale(12),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: '600',
        color: '#000',
        flex: 1,
        textAlign: 'center',
        marginRight: moderateScale(34),
    },
    placeholder: { width: moderateScale(34) },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        marginVertical: moderateScale(20),
        elevation: 4,
    },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    avatar: {
        width: moderateScale(70),
        height: moderateScale(70),
        borderRadius: moderateScale(35),
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: { width: moderateScale(70), height: moderateScale(70), borderRadius: moderateScale(35) },
    avatarPlaceholder: { backgroundColor: '#e0e0e0' },
    cardInfo: { marginLeft: moderateScale(16) },
    residentName: { fontSize: moderateScale(18), fontWeight: 'bold', color: '#000' },
    residentAddress: { fontSize: moderateScale(15), color: '#666', marginTop: 4 },
    monthText: { fontSize: moderateScale(14), color: '#519377', marginTop: 8, fontWeight: '600' },
    paymentImage: {
        width: '100%',
        height: moderateScale(330),
        borderRadius: moderateScale(16),
        backgroundColor: '#f0f0f0',
        marginVertical: moderateScale(20),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(20),
        marginTop: 'auto',
        paddingBottom: moderateScale(30),
    },
    approveButton: {
        backgroundColor: '#519377',
        width: '45%',
        paddingVertical: moderateScale(16),
        borderRadius: moderateScale(30),
        alignItems: 'center',
    },
    denyButton: {
        backgroundColor: '#D32F2F',
        width: '45%',
        paddingVertical: moderateScale(16),
        borderRadius: moderateScale(30),
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
});