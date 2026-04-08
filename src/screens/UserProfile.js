import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import Ionicons from '@react-native-vector-icons/ionicons';
import imagePath from '../contests/imagePath';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/features/authSlice';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import { terminationRequest } from "../app/features/getprofileSlice";
import { showMessage } from "../app/features/messageSlice";

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
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
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


    const handleDeleteMember = () => {
        setDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalVisible(false);
    };

    const confirmDelete = async () => {
        try {

            const result = await dispatch(
                terminationRequest()
            ).unwrap();

            closeDeleteModal();
            dispatch(
                showMessage({
                    type: 'success',
                    text: result?.message || 'Termination Request send successfully!',
                })
            );
        } catch (error) {
            console.log('Delete error:', error);
            dispatch(
                showMessage({
                    type: 'error',
                    text: error?.message || 'Failed to send Termination Request.',
                })
            );
        }
    };

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

    const getUri = (value) => {
        if (!value) return null;
        if (typeof value === 'string') return value;
        return value?.uri || null;
    };


    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', '0']}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handlegoBack}>
                        <Ionicons name="chevron-back" size={28} color="#519377" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                        <MaterialIcons name="edit" size={22} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.profileWrapper}>
                    <Image
                        source={{ uri: getUri(userData.profileImage) }}
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
                    <InfoRow icon="home-outline" label="Flat No" value={userData.flatNo} />
                    {/* <InfoRow icon="card-account-details-outline" label="Aadhar Card no" value={userData.aadhar} /> */}
                </View>
                <TouchableOpacity style={styles.infoRow} onPress={handleDeleteMember}>
                    <MaterialIcons name="delete" size={23} color="red" />
                    <Text style={{ marginLeft: 16, color: "red", fontWeight: '500', fontSize: 16 }}>Delete Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.infoRow} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={23} color="#585858" />
                    <Text style={{ marginLeft: 16, color: "#333", fontWeight: '500', fontSize: 16 }}>Logout</Text>
                </TouchableOpacity>

                {/* resident delete modal */}
                <Modal
                    visible={deleteModalVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={closeDeleteModal}
                >
                    <View style={styles.deleteModalOverlay}>
                        <View style={styles.deleteModalContent}>
                            <View style={styles.deleteIconWrapper}>
                                <MaterialIcons name="delete-outline" size={50} color="#D32F2F" />
                            </View>

                            <Text style={styles.deleteTitle}>Delete Account?</Text>
                            <Text style={styles.deleteMessage}>
                                Are you sure you want to delete your account? This action cannot be undone.
                            </Text>

                            <View style={styles.deleteButtonsContainer}>
                                <TouchableOpacity
                                    style={[styles.deleteModalButton, styles.cancelButton]}
                                    onPress={closeDeleteModal}

                                >
                                    <Text style={styles.cancelButtonText}>No, Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.deleteModalButton, styles.confirmDeleteButton]}
                                    onPress={confirmDelete}

                                >
                                    <Text style={styles.confirmDeleteButtonText}>Yes, Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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


    deleteModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    deleteModalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    deleteIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    deleteTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
        textAlign: 'center',
    },
    deleteMessage: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    deleteButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    deleteModalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    confirmDeleteButton: {
        backgroundColor: '#D32F2F',
    },
    deleteButtonDisabled: {
        backgroundColor: '#FFCDD2',
        opacity: 0.7,
    },
    confirmDeleteButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
