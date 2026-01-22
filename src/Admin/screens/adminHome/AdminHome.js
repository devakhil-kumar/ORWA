import React, { useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
    ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import imagePath from '../../../contests/imagePath';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProfile } from '../../../app/features/getprofileSlice';
import { fetchEventsAdmin } from '../../../app/features/eventAdminSlice';
const { width, height } = Dimensions.get('window');
import { formatNotificationDate } from '../../../screens/Profile/Notification';

const AdminHome = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const onHandleProfile = () => {
        navigation.navigate('Profile')
    }

    const handleViewAll = () => {
        navigation.navigate('Announcements', {
            events: events,
        });
    };

    const hnadleAddResidents = () => {
        navigation.navigate('AddMember')
    }

    const handlePostUpdate = () => {
        navigation.navigate('AddUpdates')
    }

    const handleUserList = () => {
        navigation.navigate('ResidentsList')
    }

    const handleRejectedList = () => {
        navigation.navigate('Payments', {
            screen: 'PaymentHistory',
            params: { rejected: true }
        });
    };

    const { admin, adminLoading } = useSelector((state) => state.profile);
    const { events, loading } = useSelector((state) => state.eventAdmin);

    useEffect(() => {
        dispatch((fetchAdminProfile()))
    }, [dispatch])

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchEventsAdmin({ isActive: true, page: 1, limit: 20 }))
        }, [dispatch])
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', }} edges={['top', '0']}>
            <StatusBar barStyle="dark-content" backgroundColor="#519377" />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.profileSection} onPress={onHandleProfile}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{admin?.name?.charAt(0)?.toUpperCase()}</Text>
                        </View>
                        <View>
                            <Text style={styles.welcomeText}>Welcome Back</Text>
                            <Text style={styles.userName}>{admin?.name}</Text>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.DateText}>
                            {new Date().toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </Text>
                        <Text style={styles.DateText}>
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                            })}
                        </Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 }}>
                        <TouchableOpacity style={styles.topButns} onPress={hnadleAddResidents} >
                            <Feather name='plus' color={'#519377'} size={20} />
                            <Text style={styles.topButnsText}>Add Member</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topButns} onPress={handlePostUpdate}>
                            <MaterialIcons name='update' color={'#519377'} size={20} />
                            <Text style={styles.topButnsText}>Post Notice</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActionsGrid} >
                        <TouchableOpacity style={styles.actionButton} onPress={handleUserList}>
                            <View style={[styles.actionIconContainer, { backgroundColor: '#F0FDF4' }]}>
                                <Image source={imagePath.usersImage} style={{ width: width / 12, height: height / 30 }} />
                            </View>
                            <Text style={styles.actionText}>Members</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={handleRejectedList}>
                            <View style={[styles.actionIconContainer, { backgroundColor: '#FFF1F2' }]}>
                                <MaterialIcons name="highlight-off" size={24} color="red" />
                            </View>
                            <Text style={styles.actionText}>Rejected Pyaments</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Announcements</Text>
                        {events?.length > 0 && (
                            <TouchableOpacity onPress={handleViewAll}>
                                <Text style={styles.viewAllText}>View all</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {loading ? (
                        <View style={{ height: 100, justifyContent: 'center' }}>
                            <ActivityIndicator size="small" color="#519377" style={{ marginTop: 0 }} />
                        </View>
                    ) : events?.length === 0 ? (
                        <View style={{ height: 100, justifyContent: 'center' }}>
                            <Text style={styles.noDataText}>No events available</Text>
                        </View>
                    ) : (
                        events.slice(0, 8).map((item, index) => (
                            <View
                                key={`${item?._id ?? 'event'}-${index}`}
                                style={styles.card}
                            >
                                <View style={styles.iconWrapper}>
                                    <Image
                                        source={imagePath.speakerImage}
                                        style={{ width: width * 0.1 / 2.2, height: height * 0.1 / 5 }}
                                    />
                                </View>

                                <View style={styles.textContainer}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.subtitle}>{item.description}</Text>
                                </View>

                                <View style={styles.dateWrapper}>
                                    <Text style={styles.dateText}>
                                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, paddingHorizontal: 16
    },
    header: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'

    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    menuButton: {
        // marginRight: 15,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
    },
    welcomeText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'left'
    },
    DateText: {
        fontSize: 14,
        color: '#000',
        textAlign: 'right'
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginTop: 2,
    },
    residenceCard: {
        backgroundColor: '#F4C430',
        marginTop: 15,
        borderRadius: 20,
        paddingVertical: 25,
        paddingHorizontal: 15,
        elevation: 5
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    residenceLabel: {
        fontSize: 14,
        color: '#fff',
    },
    flatNumber: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    societyName: {
        fontSize: 14,
        color: '#fff',
    },
    qrButton: {
        backgroundColor: '#fff',
        width: 48,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginTop: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginTop: 10
    },
    viewAllText: {
        fontSize: 14,
        color: '#519377',
        fontWeight: '600'
    },
    announcementCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 25,
        paddingHorizontal: 15,
        flexDirection: 'row',
        elevation: 7,
        alignItems: 'center'
    },
    announcementIcon: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#FFE8E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        alignSelf: 'center'
    },
    announcementContent: {
        flex: 1,
    },
    announcementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    announcementTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    announcementDate: {
        fontSize: 10,
        color: '#999',
    },
    announcementText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
        fontWeight: '500'
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    actionButton: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 14,
        alignItems: 'center',
        marginBottom: 12,
        elevation: 5
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 2,
        textAlign: 'center'
    },
    actionSubText: {
        fontSize: 14,
        color: '#0000',
        fontWeight: '700'
    },
    billCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        elevation: 5
    },
    billLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    billIconContainer: {
        width: 30,
        height: 30,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    billTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 2,
    },
    billDate: {
        fontSize: 12,
        color: '#999',
    },
    billAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    topButns: {
        borderWidth: 1,
        paddingVertical: 13,
        width: width / 2.5,
        borderRadius: 15,
        borderColor: "#519377",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    topButnsText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#519377',
        fontWeight: '600'
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 6,
        marginTop: 8,
        marginBottom: 8,
        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.20,
        shadowRadius: 6,

        // Android Shadow
        elevation: 5,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 15,
        backgroundColor: '#FCE8DC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
    },
    subtitle: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 2,
    },
    dateWrapper: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },

    dateText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#6B7280',
        fontSize: 14,
    },
});

export default AdminHome;