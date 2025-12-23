import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import Ionicons from "@react-native-vector-icons/ionicons";
import { moderateScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { fetchAdminNotifications } from "../../app/features/adminNotificationSlice";
import { useDispatch, useSelector } from "react-redux";
import imagePath from "../contests/imagePath";
const { width, height } = Dimensions.get('window');

const Notification = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [allNotifications, setAllNotifications] = useState([]);

    const { notifications, loading, totalPages, page } = useSelector((state) => state.adminNotification);

    // Load initial data
    useEffect(() => {
        dispatch(fetchAdminNotifications({ page: 1, limit: 20 }));
    }, [dispatch]);

    // Update all notifications when new data arrives
    useEffect(() => {
        if (notifications && notifications.length > 0) {
            if (page === 1) {
                // First page - replace all data
                setAllNotifications(notifications);
            } else {
                // Subsequent pages - append data
                setAllNotifications(prev => [...prev, ...notifications]);
            }
        }
    }, [notifications, page]);

    const formatNotificationDate = (dateString) => {
        const notificationDate = new Date(dateString);
        const today = new Date();
        
        today.setHours(0, 0, 0, 0);
        const notifDate = new Date(notificationDate);
        notifDate.setHours(0, 0, 0, 0);
        
        const diffTime = today - notifDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else {
            const day = notificationDate.getDate();
            const month = notificationDate.getMonth() + 1;
            return `${day}/${month}`;
        }
    };

    // Load more data when reaching end of list
    const handleLoadMore = () => {
        if (!loading && currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            dispatch(fetchAdminNotifications({ page: nextPage, limit: 20 }));
        }
    };

    // Refresh data (pull to refresh)
    const handleRefresh = () => {
        setCurrentPage(1);
        setAllNotifications([]);
        dispatch(fetchAdminNotifications({ page: 1, limit: 20 }));
    };

    const renderItem = ({ item }) => {
        return (
            <View style={style.card}>
                <View style={style.iconWrapper}>
                    <Image source={imagePath.speakerImage} style={{ width: width * 0.1 / 2, height: height * 0.1 / 5 }} />
                </View>

                <View style={style.textContainer}>
                    <Text style={style.title}>{item?.title}</Text>
                    <Text style={style.subtitle}>{item?.message}</Text>
                </View>

                <View style={style.dateWrapper}>
                    <Text style={style.dateText}>{formatNotificationDate(item.createdAt)}</Text>
                </View>
            </View>
        );
    };

    // Footer component showing loading indicator
    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color="#519377" />
            </View>
        );
    };

    // Empty component
    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={{ marginTop: 50, alignItems: 'center' }}>
                <Text style={{ color: '#999', fontSize: 16 }}>No notifications yet</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={style.container} edges={['top']}>
            <View style={style.main}>
                <View style={style.innerCantainer}>
                    <View style={style.header}>
                        <TouchableOpacity
                            style={style.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="chevron-back" size={28} color="#519377" />
                        </TouchableOpacity>
                        <Text style={style.headerTitle}>Notifications</Text>
                        <View style={style.placeholder} />
                    </View>
                    <View style={style.listWrapper}>
                        <FlatList
                            data={allNotifications}
                            keyExtractor={(item, index) => item._id || index.toString()}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                            ListEmptyComponent={renderEmpty}
                            refreshing={loading && currentPage === 1}
                            onRefresh={handleRefresh}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Notification;

const style = StyleSheet.create({
    main: { flex: 1 },
    innerCantainer: { flex: 1, padding: 16 },
    listWrapper: { marginTop: 20, marginBottom: 10 * 3.8 },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(0),
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
        width: 28,
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000000',
    },
    subtitle: {
        fontSize: 10,
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
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor:'#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        borderRadius:10,
        paddingHorizontal:8,
        elevation:6,
        marginBottom: 10,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 15,
        backgroundColor: '#FCE8DC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
});