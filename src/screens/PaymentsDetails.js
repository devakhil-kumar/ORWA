import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ScrollView,
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const PaymentDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { payment } = route.params;
    console.log(payment, 'payment++++++')
    const { loading, success, error } = useSelector((state) => state.paymentApprove);
    const [verifyingStatus, setVerifyingStatus] = useState(null);



    const formatForAPI = (date) => {
        if (!date) return null;
        return date.toISOString().split('T')[0];
    };

    const handleVerify = async (status) => {
        setVerifyingStatus(status);

        if (status === 'verified' && (!fromDate || !toDate)) {
            Alert.alert("Validation Error", "Please select From and To dates before approving.");
            setVerifyingStatus(null);
            return;
        }

        const result = await dispatch(verifyPaymentThunk({
            paymentId: payment._id,
            paidFrom: formatForAPI(fromDate),
            paidTo: formatForAPI(toDate),
            status,
        }));

        console.log(result.payload, 'result');

        if (verifyPaymentThunk.fulfilled.match(result)) {
            dispatch(showMessage({
                type: 'success',
                text: result.payload.message || 'Payment Approved!',
            }));
            navigation.goBack();
        } else {
            dispatch(showMessage({
                type: 'error',
                text: result.payload?.message || 'Action failed!',
            }));
        }

        setVerifyingStatus(null);
        dispatch(resetVerifyState());
    };

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

    useEffect(() => {
        if (payment.paidFrom) setFromDate(new Date(payment.paidFrom));
        if (payment.paidTo) setToDate(new Date(payment.paidTo));
    }, [payment]);


    const formatDate = (date) => {
        if (!date) return 'Select Date';
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleFromDateChange = (event, selectedDate) => {
        setShowFromPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFromDate(selectedDate);
            if (toDate && selectedDate > toDate) {
                setToDate(null);
            }
        }
    };

    const handleToDateChange = (event, selectedDate) => {
        setShowToPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setToDate(selectedDate);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="#519377" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Details</Text>
                <View style={styles.placeholder} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 16 }}>

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
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: "flex-start", }}>
                            <View style={styles.cardInfo}>
                                <Text style={styles.residentName}>{payment.residentialName}</Text>
                                <Text style={styles.residentAddress}>{payment.residentialAddress}</Text>
                            </View>
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 15,
                                    paddingHorizontal: 12,
                                    paddingVertical: 4
                                }}
                            >
                                <Text style={styles.monthText}>
                                    {new Date(payment.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Image
                    source={{ uri: payment.paymentScreenshot }}
                    style={styles.paymentImage}
                    resizeMode="contain"
                />
                {/* Date Pickers */}
                <View style={styles.dateRow}>
                    {/* From Date */}
                    <View style={styles.dateGroup}>
                        <Text style={styles.dateLabel}>From</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowFromPicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={16} color="#519377" />
                            <Text style={[styles.dateText, !fromDate && styles.datePlaceholder]}>
                                {formatDate(fromDate)}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.dateDivider} />

                    {/* To Date */}
                    <View style={styles.dateGroup}>
                        <Text style={styles.dateLabel}>To</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowToPicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={16} color="#519377" />
                            <Text style={[styles.dateText, !toDate && styles.datePlaceholder]}>
                                {formatDate(toDate)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* From Date Picker */}
                {showFromPicker && (
                    <DateTimePicker
                        value={fromDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleFromDateChange}
                        maximumDate={toDate || undefined}
                    />
                )}

                {/* To Date Picker */}
                {showToPicker && (
                    <DateTimePicker
                        value={toDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleToDateChange}
                        minimumDate={fromDate || undefined}
                    />
                )}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => handleVerify('verified')}
                        disabled={verifyingStatus !== null}
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
            </ScrollView>
        </SafeAreaView>
    );
};

export default PaymentDetails;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
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
    monthText: { fontSize: moderateScale(12), color: '#4B5563', fontWeight: '500' },
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
    // Date Picker Styles
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: moderateScale(20),
        backgroundColor: '#fff',
        borderRadius: moderateScale(16),
        padding: moderateScale(14),
        elevation: 2,
    },
    dateGroup: {
        flex: 1,
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: moderateScale(12),
        color: '#9CA3AF',
        fontWeight: '500',
        marginBottom: 6,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
    },
    dateText: {
        fontSize: moderateScale(13),
        color: '#111827',
        fontWeight: '500',
    },
    datePlaceholder: {
        color: '#9CA3AF',
    },
    dateDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 10,
    },
});