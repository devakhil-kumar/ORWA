// SocietyHeadScreen.js

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    Dimensions,
    Platform,
    ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import imagePath from '../../contests/imagePath';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../app/features/authSlice';
const { width, height } = Dimensions.get('window');

const SocietyHeadScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const { admin, adminLoading } = useSelector((state) => state.profile);

    const generalMenuItems = [
        {
            id: 1,
            icon: 'information-circle-outline',
            title: 'Society Info',
            onPress: () => navigation.navigate('SocietyInfoScreen'),
        },
        // {
        //     id: 2,
        //     icon: 'settings-outline',
        //     title: 'Settings',
        //     onPress: () => navigation.navigate('AppSettings'),
        // },
        {
            id: 3,
            icon: 'notifications-outline',
            title: 'Notification',
            onPress: () => navigation.navigate('Notification'),
        },
        {
            id: 4,
            icon: 'lock-closed-outline',
            title: 'Members',
            onPress: () => navigation.navigate('ResdentsList'),
        },
        {
            id: 5,
            icon: 'person-outline',
            title: 'Termination Requests',
            onPress: () => navigation.navigate('TerminationRequest'),
        },
        {
            id: 6,
            icon: 'log-out-outline',
            title: 'Logout',
            onPress: () => {
                dispatch(logout())
            },
        },
    ];

    const helpMenuItems = [
        {
            id: 6,
            icon: 'person-outline',
            title: 'Contact Us',
            onPress: () => navigation.navigate('ContactUs'),
        },
    ];

    const renderMenuItem = (item) => (
        <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
        >
            <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={24} color="#333" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['0', '0']} >
            <StatusBar barStyle="light-content" backgroundColor="#519377" />
            <ImageBackground source={imagePath.profileBackground} style={styles.header}>
                <Text style={styles.headerTitle}>Society Head</Text>
            </ImageBackground>
            <View style={styles.profileCard}>
                <View style={styles.profileContent}>
                    {admin?.profileImage ? (
                        <Image
                            source={{ uri: admin?.profileImage }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={40} color="#519377" />
                        </View>
                    )}
                    <View style={styles.profileInfo}>
                        <Text style={styles.adminName}>{admin.name}</Text>
                        <Text style={styles.adminEmail}>{admin.email}</Text>
                        <Text style={styles.adminPhone}>{admin.phone}</Text>
                    </View>
                    {/* <TouchableOpacity style={styles.editIconButton}>
                        <Ionicons name="create-outline" size={24} color="#333" />
                    </TouchableOpacity> */}
                </View>
            </View>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>
                    <View style={styles.menuContainer}>
                        {generalMenuItems.map(item => renderMenuItem(item))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Help</Text>
                    <View style={styles.menuContainer}>
                        {helpMenuItems.map(item => renderMenuItem(item))}
                    </View>
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default SocietyHeadScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
         backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#115543',
        paddingHorizontal: moderateScale(20),
        height: height / 6,
        position: 'relative',
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: moderateScale(28),
        fontWeight: '700',
        color: '#fff',
    },
    scrollView: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? 75 : 60
    },
    profileCard: {
      justifyContent:'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: moderateScale(16),
        height: height / 8,
        borderRadius: moderateScale(16),
        padding: moderateScale(18),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        position: 'absolute',
        top: 100,
        bottom: 0,
        right: 0,
        left: 0,
    },
    profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(35),
        backgroundColor: '#FFD54F',
    },
    avatarPlaceholder: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(35),
        backgroundColor: '#FFD54F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
        marginLeft: moderateScale(10),
    },
    adminName: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        color: '#333',
        marginBottom: moderateScale(4),
    },
    adminEmail: {
        fontSize: moderateScale(13),
        color: '#666',
        marginBottom: moderateScale(2),
    },
    adminPhone: {
        fontSize: moderateScale(13),
        color: '#666',
    },
    editIconButton: {
        padding: moderateScale(8),
    },
    section: {
        marginTop: moderateScale(24),
        paddingHorizontal: moderateScale(16),
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        color: '#333',
        marginLeft: moderateScale(4),
    },
    menuContainer: {
        borderRadius: moderateScale(12),
        overflow: 'hidden',
        paddingHorizontal: 8,
        paddingVertical: 6
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: moderateScale(5),
        paddingHorizontal: moderateScale(16),
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 10,
        elevation: 2
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: moderateScale(40),
        height: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: moderateScale(16),
        color: '#333',
        marginLeft: moderateScale(12),
        fontWeight: '500',
    },
    bottomSpacer: {
        height: moderateScale(30),
    },
});