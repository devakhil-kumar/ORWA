import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import Ionicons from '@react-native-vector-icons/ionicons';
import imagePath from '../contests/imagePath';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/features/authSlice';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import { deleteResidentialThunk } from '../app/features/deleteAcountSlice';
import { showMessage } from '../app/features/messageSlice';

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
    const [deleteLoading, setDeleteLoading] = useState(false);

    const dummyData = {
        membershipType: "co-owner",
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "+91 9876543210",
        flatNo: "A-101",
        aadhar: "1234-5678-9012",
        profileImage: imagePath.dammyImage,
    };

    const { user, loading } = useSelector((state) => state.profile);
    const userData = {
        membershipType: user?.membershipType || dummyData.membershipType,
        name: user?.name || dummyData.name,
        email: user?.email || dummyData.email,
        phone: user?.phone || dummyData.phone,
        flatNo: user?.address || dummyData.flatNo,
        profileImage: user?.profileImage || dummyData.profileImage,
    };

    const handleLogout = () => {
        dispatch(logout())
    }

    const handleChangePassword = () => {
        navigation.navigate('ChangePassword');
    }

    const handlegoBack = () => {
        navigation.goBack();
    }

    const handleNavigateToEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    // Open delete modal
    const openDeleteModal = () => {
        setDeleteModalVisible(true);
    }

    // Close delete modal
    const closeDeleteModal = () => {
        setDeleteModalVisible(false);
    }

    // Confirm delete account
    const confirmDelete = async () => {
        try {
            setDeleteLoading(true);
            const userId = user?._id || user?.id;

            const result = await dispatch(deleteResidentialThunk(
                userId,
            )).unwrap();

            setDeleteLoading(false);
            setDeleteModalVisible(false);

            dispatch(
                showMessage({
                    type: 'success',
                    text: 'Your account has been Terminated successfully.',
                })
            );

            setTimeout(() => {
                dispatch(logout());
            }, 1000);

        } catch (error) {
            setDeleteLoading(false);
            setDeleteModalVisible(false);
            dispatch(
                showMessage({
                    type: 'error',
                    text: error?.message || 'Failed to terminate account',
                })
            );
        }
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
                    <TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: 10, }} onPress={handleNavigateToEditProfile}>
                        <MaterialIcons name="edit" size={23} color="#333" />
                        <Text style={{ marginLeft: 16, color: "#333", fontWeight: '500', fontSize: 16 }}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.profileWrapper}>
                    {user?.profileImage ? <Image
                        source={{ uri: getUri(userData.profileImage) }}
                        style={styles.profileImage}
                    /> : <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()}</Text>
                    </View>}
                </View>

                <View style={styles.nameRow}>
                    <Text style={styles.nameText}>{userData.name}</Text>
                </View>
                <View style={{ marginTop: 30 }}>
                    <InfoRow icon="account-outline" label="Membership Type" value={userData.membershipType} />
                    <InfoRow icon="email-outline" label="Email" value={userData.email} />
                    <InfoRow icon="phone-outline" label="Phone Number" value={userData.phone} />
                    <InfoRow icon="home-outline" label="Flat No" value={userData.flatNo} />
                    {/* <InfoRow icon="card-account-details-outline" label="Aadhar Card no" value={userData.aadhar} /> */}
                </View>
                {/* <TouchableOpacity style={styles.infoRow} onPress={openDeleteModal}>
                    <MaterialIcons name="delete-outline" size={23} color="#333" />
                    <Text style={{ marginLeft: 16, color: "#333", fontWeight: '500', fontSize: 16 }}>Terminate Account</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.infoRow} onPress={handleChangePassword}>
                    <MaterialIcons name="password" size={23} color="#585858" />
                    <Text style={{ marginLeft: 16, color: "#333", fontWeight: '500', fontSize: 16 }}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.infoRow} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={23} color="#585858" />
                    <Text style={{ marginLeft: 16, color: "#333", fontWeight: '500', fontSize: 16 }}>Logout</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Delete Account Modal */}
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

                        <Text style={styles.deleteTitle}>Terminate Account?</Text>
                        <Text style={styles.deleteMessage}>
                            Are you sure you want to terminate your account?
                        </Text>

                        <View style={styles.deleteButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.deleteModalButton, styles.cancelButton]}
                                onPress={closeDeleteModal}
                                disabled={deleteLoading}
                            >
                                <Text style={styles.cancelButtonText}>No, Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.deleteModalButton, styles.confirmDeleteButton, deleteLoading && styles.deleteButtonDisabled]}
                                onPress={confirmDelete}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.confirmDeleteButtonText}>Yes, Terminate</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        backgroundColor: '#F9FAFB',
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
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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
    // Modal Styles
    deleteModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteModalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    deleteIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    deleteTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    deleteMessage: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    deleteButtonsContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    deleteModalButton: {
        flex: 1,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    confirmDeleteButton: {
        backgroundColor: '#D32F2F',
    },
    deleteButtonDisabled: {
        opacity: 0.6,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    confirmDeleteButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 100,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 80,
        fontWeight: '600',
        color: '#000',
    },
});
