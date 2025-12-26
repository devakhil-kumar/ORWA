import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResidentialPaymentsThunk } from '../app/features/residentialPaymentsSlice';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PaymentHistoryScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isRejected, setIsRejected] = useState(false);
    const { data, loading, error } = useSelector((state) => state.residentialpayment);
    const route = useRoute();

    useFocusEffect(
        useCallback(() => {
          setIsRejected(route.params?.rejected === true);
        }, [route.params?.rejected])
      );

    const filteredData = isRejected
        ? data?.filter(item => item?.status === 'rejected')
        : data;


    useFocusEffect(
        useCallback(() => {
            dispatch(fetchResidentialPaymentsThunk('all'));
        }, [dispatch])
    );


    const getStatusColor = (status) => {
        switch (status) {
            case 'verified':
                return '#4CAF50';
            case 'rejected':
                return '#F44336';
            case 'pending':
                return '#FF9800';
            default:
                return '#757575';
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'verified':
                return '#E8F5E9';
            case 'rejected':
                return '#FFEBEE';
            case 'pending':
                return '#FFF3E0';
            default:
                return '#F5F5F5';
        }
    };

    const renderPaymentCard = (item) => {
        console.log(item?.residentialPhoto, 'item')

        const handleNavigation = () => {
            navigation.navigate('PaymentDetails', { payment: item })
        }

        return (
            <TouchableOpacity key={item._id} style={styles.paymentCard} onPress={handleNavigation}>
                <View style={styles.cardContent}>
                    <Image
                        source={{ uri: item?.residentialPhoto }}
                        style={styles.avatar}
                    />
                    <View style={styles.infoContainer}>
                        <Text style={styles.nameText}>{item?.residentialName}</Text>
                        <Text style={styles.addressText}>{item?.residentialAddress}</Text>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusBgColor(item.status) },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    { color: getStatusColor(item.status) },
                                ]}
                            >
                                {item.status.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity>
                    <Image
                        source={{ uri: item?.paymentScreenshot }}
                        style={styles.paymentScreenshot}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', "0"]}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={28} color="#519377" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Payment History</Text>
                        <View style={{ width: 50 }} />
                    </View>
                </View>

                {/* Content */}
                {/* <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#9E9E9E" />
                        </View>
                    ) : error ? (
                        <View style={styles.centerContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : data && data.length > 0 ? (
                        <>
                            <Text style={styles.sectionTitle}>Today</Text>
                            {data.slice(0).map(renderPaymentCard)}

                            <Text style={styles.sectionTitle}>Last Month</Text>
                            {data.slice(0).map(renderPaymentCard)}
                        </>
                    ) : (
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>No payments found</Text>
                        </View>
                    )}
                </ScrollView> */}
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator
                                size="large"
                                color="#9E9E9E"
                            />
                        </View>
                    ) : error ? (
                        <View style={styles.centerContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : filteredData && filteredData.length > 0 ? (
                        <>
                            {!isRejected && (
                                <Text style={styles.sectionTitle}>Today</Text>
                            )}

                            {(isRejected
                                ? filteredData
                                : filteredData.slice(0, 3)
                            ).map(renderPaymentCard)}

                            {!isRejected && filteredData.length > 3 && (
                                <>
                                    <Text style={styles.sectionTitle}>
                                        Last Month
                                    </Text>
                                    {filteredData
                                        .slice(3)
                                        .map(renderPaymentCard)}
                                </>
                            )}
                        </>
                    ) : (
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>
                                {isRejected
                                    ? 'No rejected payments found'
                                    : 'No payments found'}
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
        justifyContent: 'space-between'
    },
    backButton: {
        fontSize: 24,
        marginRight: 16,
        color: '#000000',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    monthFilters: {
        flexDirection: 'row',
        gap: 12,
    },
    monthButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    monthButtonActive: {
        backgroundColor: '#9E9E9E',
        borderWidth: 0,
    },
    monthText: {
        fontSize: 14,
        color: '#757575',
        fontWeight: '400',
    },
    monthTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingBottom: 20,
        paddingHorizontal: 16
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 16,
    },
    paymentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E0E0E0',
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 6,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    paymentScreenshot: {
        width: 60,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
    },
    emptyText: {
        fontSize: 16,
        color: '#757575',
    },
});

export default PaymentHistoryScreen;