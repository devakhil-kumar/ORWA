import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import Ionicons from '@react-native-vector-icons/ionicons';
import imagePath from '../contests/imagePath';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/features/authSlice';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';

const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
        <Icon name={icon} size={22} color="#585858" />
        <View style={styles.infoTextWrap}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    </View>
);

const UserProfile = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const dummyData = {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "+91 9876543210",
        flatNo: "A-101",
        aadhar: "1234-5678-9012",
        profileImage: imagePath.dammyImage,
    };

    const { user, loading } = useSelector((state) => state.profile);


    const userData = {
        name: user?.name || dummyData.name,
        email: user?.email || dummyData.email,
        phone: user?.phone || dummyData.phone,
        flatNo: user?.address || dummyData.flatNo,
        // aadhar: user?.aadhar || dummyData.aadhar,
        profileImage: user?.profileImage || dummyData.profileImage,
    };

    const handleLogout = () => {
        dispatch(logout())
    }

    const handlegoBack = () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', '0']}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handlegoBack}>
                        <Ionicons name="chevron-back" size={28} color="#519377" />
                    </TouchableOpacity>
                    {/* <TouchableOpacity >
                        <MaterialIcons name="share" size={22} color="#000" />
                    </TouchableOpacity> */}
                </View>
                <View style={styles.profileWrapper}>
                    <Image
                        source={userData.profileImage}
                        style={styles.profileImage}
                    />
                </View>

                <View style={styles.nameRow}>
                    <Text style={styles.nameText}>{userData.name}</Text>
                    {/* <TouchableOpacity style={styles.editIcon}>
                        <Icon name="pencil" size={16} color="#fff" />
                    </TouchableOpacity> */}
                </View>
                <View style={{ marginTop: 30 }}>
                    <InfoRow icon="email-outline" label="Email" value={userData.email} />
                    <InfoRow icon="phone-outline" label="Phone Number" value={userData.phone} />
                    <InfoRow icon="home-outline" label="Flat NO" value={userData.flatNo} />
                    {/* <InfoRow icon="card-account-details-outline" label="Aadhar Card no" value={userData.aadhar} /> */}
                </View>
                <TouchableOpacity style={styles.infoRow} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={23} color="#585858" />
                    <Text style={{ marginLeft: 16, color: "#333", fontWeight: '500', fontSize: 16 }}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};



export default UserProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    profileWrapper: {
        alignItems: 'center',
        marginTop: 10,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#C8E6C9',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    nameText: {
        fontSize: 20,
        fontWeight: '400',
        marginRight: 8,
    },
    editIcon: {
        backgroundColor: '#2E7D32',
        padding: 6,
        borderRadius: 6,
    },
    infoRow: {
        flexDirection: 'row',
        // alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        // marginTop:20
    },
    infoTextWrap: {
        marginLeft: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 500,
        color: '#333',
    },
    value: {
        fontSize: 14,
        fontWeight: 500,
        color: '#333',
        marginTop: 2,
    },
});
