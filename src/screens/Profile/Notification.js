import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Platform, Alert, Linking, Image, Dimensions } from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import Ionicons from "@react-native-vector-icons/ionicons";
import { moderateScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import imagePath from "../../contests/imagePath";
import { fetchAdminNotifications } from "../../app/features/adminNotificationSlice";
import { useDispatch, useSelector } from "react-redux";
const { width, height } = Dimensions.get('window');


const announcements = [
    {
        id: '1',
        title: 'Annual Maintenance',
        description: 'Scheduled elevator maintenance',
        date: 'Today',
    },
    {
        id: '2',
        title: 'New Screenshot Uploaded',
        description: 'Scheduled elevator maintenance',
        date: 'Today',
    },
    {
        id: '3',
        title: 'New Resident Added',
        description: 'Scheduled elevator maintenance',
        date: 'Today',
    },
    {
        id: '4',
        title: 'Annual Maintenance',
        description: 'Scheduled elevator maintenance',
        date: 'Today',
    },
    {
        id: '5',
        title: 'New Screenshot Uploaded',
        description: 'Scheduled elevator maintenance',
        date: 'Today',
    },
    {
        id: '6',
        title: 'New Resident Added',
        description: 'Scheduled elevator maintenance',
        date: 'Today',
    },
    {
        id: '7',
        title: 'Annual Maintenance',
        description: 'Scheduled elevator maintenance',
        date: 'Today',
    },
    {
        id: '8',
        title: 'New Screenshot Uploaded',
        description: 'Scheduled elevator maintenance',
        date: 'Today',
    },
    {
        id: '9',
        title: 'New Resident Added',
        description: 'Scheduled elevator maintenance',
        date: 'Today',
    },
];

const Notification = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const onHandleProfile = () => {
        navigation.navigate('Profile')
    }

    const onHandleCreate = () => {
        navigation.navigate('AddMember')
    }

    useEffect(() => {
        dispatch(fetchAdminNotifications({ page: 1, limit: 20 }));
    }, [dispatch])

    const { notifications, loading } = useSelector((state) => state.adminNotification)
    console.log(notifications, loading, 'loading++++++++++=+')

    const formatNotificationDate = (dateString) => {
        const notificationDate = new Date(dateString);
        const today = new Date();
        
        // Reset time to compare only dates
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
            // Return date in format: day/month (e.g., "22/12")
            const day = notificationDate.getDate();
            const month = notificationDate.getMonth() + 1; // Months are 0-indexed
            return `${day}/${month}`;
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View key={item.id} style={style.card}>
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
                            data={notifications}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
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
    topButtonsRow: { flexDirection: "row", marginTop: 15, alignItems: 'center', alignSelf: 'center', width: '100%', justifyContent: 'space-between' },
    filterBtn: { flexDirection: 'row', padding: 4 },
    filterText: { fontSize: moderateScale(14), marginLeft: 8 },
    exportBtn: { flexDirection: 'row', padding: 7, borderWidth: 1, borderRadius: 8, borderColor: 'gray', marginLeft: 10 },
    exportText: { fontSize: moderateScale(14), marginLeft: 8 },
    addUserBtn: { flexDirection: 'row', backgroundColor: '#519377', borderRadius: 8, alignItems: "center", padding: 12, marginLeft: 8 },
    addUserText: { fontSize: moderateScale(14), marginLeft: 8, lineHeight: moderateScale(15), color: '#fff' },
    listWrapper: { marginTop: 20, marginBottom: 10 * 3.8 },
    listContent: { paddingBottom: 10 },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    container: {
        flex: 1,
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
        marginLeft: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
    },
    welcomeText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right'
    },
    userName: {
        fontSize: moderateScale(20),
        fontWeight: '600',
        color: '#000000',
        marginTop: 2,
    },
    heading: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginVertical: 20,
        color: '#111827',
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        marginRight: 12,
    },

    textContainer: {
        flex: 1,
    },

    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
    },

    address: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },

    rightContainer: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },

    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    date: {
        fontSize: 12,
        color: '#2E7D32',
        marginTop: 12,
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
        elevation:6
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
