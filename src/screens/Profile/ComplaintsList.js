import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { usersContactUsList } from '../../app/features/userContactSlice';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const ComplaintsList = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [refreshing, setRefreshing] = useState(false);

    const { usersComplaints, loading } = useSelector(
        (state) => state.contactUser
    );

    const fetchComplaints = useCallback(async () => {
        try {
            await dispatch(
                usersContactUsList({
                    status: '',
                    page: 1,
                    limit: 50,
                })
            ).unwrap();
        } catch (error) {
            console.log('Complaint Fetch Error =>', error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchComplaints();
        setRefreshing(false);
    };

    const renderComplaintItem = ({ item }) => {
        const hasImage = item?.complaintFile && item?.complaintFile !== 'null';

        return (
            <TouchableOpacity
                style={styles.complaintCard}
                onPress={() =>
                    navigation.navigate('ComplaintDetail', {
                        complaint: item,
                    })
                }
            >
                <View style={styles.cardHeader}>
                    {/* Complainant Info */}
                    <View style={styles.complainantInfo}>
                        <Text style={styles.complainantName}>{item.name}</Text>
                        <Text style={styles.messageText}>{item.email}</Text>
                        <Text style={styles.complaintType}>
                            {item?.complaintType || 'General Complaint'}
                        </Text>
                    </View>

                    {hasImage && (
                        <Image
                            source={{ uri: item.complaintFile }}
                            style={styles.screenshotPreview}
                            resizeMode="cover"
                        />
                    )}
                </View>

                <Text
                    style={styles.messageText}
                    numberOfLines={3}
                >
                    {item?.message}
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.dateText}>
                        {moment(item?.createdAt).format('DD MMM YYYY, hh:mm A')}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={28} color="#519377" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Complaints</Text>

                <TouchableOpacity onPress={fetchComplaints} style={styles.refreshButton}>
                    <Ionicons name="refresh" size={24} color="#519377" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {loading && !refreshing ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#519377" />
                    </View>
                ) : (
                    <FlatList
                        data={Array.isArray(usersComplaints) ? usersComplaints : []}
                        renderItem={renderComplaintItem}
                        keyExtractor={(item, index) =>
                            item?._id?.toString() || index.toString()
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#519377']}
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="document-text-outline" size={60} color="#CFCFCF" />
                                <Text style={styles.emptyText}>No complaints found</Text>
                                <Text style={styles.emptySubText}>
                                    Your submitted complaints will appear here
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default ComplaintsList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(12),
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: { marginTop: 2 },
    refreshButton: { padding: moderateScale(4) },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: '600',
        color: '#000',
        flex: 1,
        textAlign: 'center',
    },
    content: { flex: 1 },
    listContainer: {
        paddingHorizontal: moderateScale(14),
        paddingTop: moderateScale(10),
        paddingBottom: moderateScale(80),
    },
    complaintCard: {
        backgroundColor: '#fff',
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        marginBottom: moderateScale(12),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: moderateScale(12),
    },
    complainantInfo: {
        flex: 1,
        paddingRight: moderateScale(12),
    },
    complainantName: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: moderateScale(2),
    },
    complaintType: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: '#519377',
    },
    screenshotPreview: {
        width: moderateScale(70),
        height: moderateScale(70),
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    messageText: {
        fontSize: moderateScale(15),
        color: '#333',
        lineHeight: moderateScale(22),
        marginBottom: moderateScale(12),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: moderateScale(13),
        color: '#666',
    },
    idText: {
        fontSize: moderateScale(12),
        color: '#999',
        fontFamily: 'monospace',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: moderateScale(100),
    },
    emptyText: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        color: '#666',
        marginTop: moderateScale(16),
    },
    emptySubText: {
        fontSize: moderateScale(14),
        color: '#999',
        textAlign: 'center',
        marginTop: moderateScale(8),
    },
});