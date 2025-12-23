import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Platform, Alert, Linking, Image } from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import Ionicons from "@react-native-vector-icons/ionicons";
import { moderateScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@react-native-vector-icons/material-icons";


const residents = [
    {
        id: '1',
        name: 'Resident Name',
        address: 'Address goes here',
        date: '29-09-2024',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
        id: '2',
        name: 'Resident Name',
        address: 'Address goes here',
        date: '29-09-2024',
        image: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
    {
        id: '3',
        name: 'Resident Name',
        address: 'Address goes here',
        date: '29-09-2024',
        image: 'https://randomuser.me/api/portraits/women/46.jpg',
    },
    {
        id: '4',
        name: 'Resident Name',
        address: 'Address goes here',
        date: '29-09-2024',
        image: 'https://randomuser.me/api/portraits/women/47.jpg',
    },
];

const UserList = () => {
    const navigation = useNavigation();

    const onHandleProfile = () => {
        navigation.navigate('Profile')
    }

    const onHandleCreate = () => {
        navigation.navigate('AddMember')
    }

    const renderItem = ({ item }) => {

        const handleMember = () => {
           navigation.navigate('MembersDetailsScreens')
        }

        return (
            <View style={style.card}>
                <Image source={{ uri: item.image }} style={style.avatar} />
                <View style={style.textContainer}>
                    <Text style={style.name}>{item.name}</Text>
                    <Text style={style.address}>{item.address}</Text>
                </View>

                <View style={style.rightContainer}>
                    <View style={style.iconRow}>
                        <TouchableOpacity onPress={handleMember}>
                        <Feather name="eye" size={15} color="#000" />
                        </TouchableOpacity>
                        <MaterialIcons
                            name="delete"
                            size={18}
                            color="#D32F2F"
                            style={{ marginLeft: 14 }}
                        />
                    </View>

                    <Text style={style.date}>{item.date}</Text>
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
                            <Ionicons name="arrow-back" size={28} color="#519377" />
                        </TouchableOpacity>
                        <Text style={style.headerTitle}>Membership Requests</Text>
                        <View style={style.placeholder} />
                    </View>
                    <View style={style.listWrapper}>
                        <FlatList
                            data={residents}
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

export default UserList;

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
    listWrapper: { marginTop: 30, marginBottom: 10 * 3.8 },
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

    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
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
    placeholder: {
        width: moderateScale(34),
    },
});
