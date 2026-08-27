import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Platform, Alert, Linking, Image, Modal, ScrollView, Dimensions, TextInput } from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import Ionicons from "@react-native-vector-icons/ionicons";
import { moderateScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminResidentials, terminateMember } from "../../app/features/getResidentails";
import { showMessage } from "../../app/features/messageSlice";
import RNFS from "react-native-fs";
import Share from "react-native-share";

const { width } = Dimensions.get('window');

const ResidentsList = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { residentials, loading } = useSelector((state) => state.residential);
    const activeResidents = residentials?.filter(
        resident => resident.isActive === true
    ) || [];

    const [searchQuery, setSearchQuery] = useState('');

    const filteredResidents = activeResidents.filter(resident => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            resident.name?.toLowerCase().includes(query) ||
            resident.address?.toLowerCase().includes(query)
        );
    });

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchAdminResidentials());
        }, [dispatch])
    );

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={{ marginTop: 50, alignItems: 'center' }}>
                <Text style={{ color: '#999', fontSize: 16 }}>
                    {searchQuery ? 'No matching residents found' : 'No Residents yet'}
                </Text>
            </View>
        );
    };

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleEditMember = (member) => {
        navigation.navigate('AddMember', {
            isEdit: true,
            member: member,
        });
    };

    const handleDeleteMember = (item) => {
        setSelectedItem(item);
        setDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalVisible(false);
        setSelectedItem(null);
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;
        try {
            const result = await dispatch(terminateMember(selectedItem._id)).unwrap();
            dispatch(fetchAdminResidentials());
            closeDeleteModal();
            dispatch(
                showMessage({
                    type: 'success',
                    text: result?.message || 'Member terminated successfully!',
                })
            );
        } catch (error) {
            console.log('Delete error:', error);
            dispatch(
                showMessage({
                    type: 'error',
                    text: error?.message || 'Failed to terminate member.',
                })
            );
        }
    };

    const handleOnItemTap = (id) => {
        navigation.navigate('PaymentHistory', { userId: id });
    };

    const [selectedList, setSelectedList] = useState([]);

    const renderItem = ({ item }) => {
        const isItemSelected = selectedList.includes(item._id);

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleOnItemTap(item._id)}
            >
                <View style={[styles.card, isItemSelected && styles.selectedCard]}>
                    {/* Selection Area (Avatar) */}
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedList(prev =>
                                prev.includes(item._id)
                                    ? prev.filter(id => id !== item._id)
                                    : [...prev, item._id]
                            );
                        }}
                        style={styles.avatarContainer}
                    >
                        {/* {item.profileImage ? (
                            <Image
                                source={{ uri: item.profileImage }}
                                style={styles.avatar}
                            />
                        ) : ( */}
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={30} color="#519377" />
                        </View>
                        {/* )} */}
                    </TouchableOpacity>

                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.address}>
                            {item.address || "Address not declared"}
                        </Text>
                    </View>

                    <View style={styles.rightContainer}>
                        <View style={styles.iconRow}>
                            <TouchableOpacity onPress={() => handleEditMember(item)}>
                                <Feather name="edit" size={18} color="#519377" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDeleteMember(item)}
                                style={{ marginLeft: 14 }}
                            >
                                <MaterialIcons
                                    name="delete"
                                    size={20}
                                    color="#D32F2F"
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.date}>
                            {new Date(item.createdAt)
                                .toLocaleDateString("en-GB")
                                .replaceAll("/", "-")}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const handleSelectAll = () => {
        if (selectedList.length === filteredResidents.length) {
            setSelectedList([]); // unselect all
        } else {
            setSelectedList(filteredResidents.map(item => item._id)); // select all visible
        }
    };

    const handleExport = async () => {
        try {
            const selectedItems = activeResidents.filter(item =>
                selectedList.includes(item._id)
            );
            if (selectedItems.length === 0) return;

            // Better CSV escaping
            const keys = Object.keys(selectedItems[0]);
            const escapeCsv = (value) => {
                if (value === null || value === undefined) return '""';
                const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
                return `"${str.replace(/"/g, '""')}"`;
            };

            const header = keys.map(k => `"${k}"`).join(',') + '\n';
            const rows = selectedItems
                .map(item => keys.map(key => escapeCsv(item[key])).join(','))
                .join('\n');

            const csvData = header + rows;
            const fileName = `residents_export_${Date.now()}.csv`;

            const path = `${RNFS.CachesDirectoryPath}/${fileName}`;
            await RNFS.writeFile(path, csvData, 'utf8');

            const base64 = await RNFS.readFile(path, 'base64');

            await Share.open({
                title: 'Export Residents',
                url: `data:text/csv;base64,${base64}`,
                type: 'text/csv',
                filename: fileName,               
                failOnCancel: false,
                useInternalStorage: true,          
            });

            // Optional: clean up the temp file
            await RNFS.unlink(path).catch(() => { });

        } catch (error) {
            console.log('CSV Export Error:', error);
            dispatch(showMessage({ type: 'error', text: 'Failed to export CSV' }));
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.main}>
                <View style={styles.innerContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            {selectedList.length === 0 ? (
                                <Ionicons name="chevron-back" size={28} color="#519377" />
                            ) : (
                                <TouchableOpacity
                                    style={{ flexDirection: "row", alignItems: "center" }}
                                    onPress={handleSelectAll}
                                >
                                    <Ionicons
                                        name={
                                            selectedList.length === filteredResidents.length
                                                ? "checkbox"
                                                : "checkbox-outline"
                                        }
                                        size={24}
                                        color="#519377"
                                    />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>List of Members</Text>

                        {selectedList.length > 0 && (
                            <TouchableOpacity onPress={handleExport}>
                                <Ionicons name="share-outline" size={28} color="#519377" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by name or address..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#9CA3AF"
                            clearButtonMode="while-editing"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                                <Feather name="x" size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* List */}
                    {loading ? (
                        <View style={styles.loaderOverlay}>
                            <ActivityIndicator size="large" color="#519377" />
                        </View>
                    ) : (
                        <View style={styles.listWrapper}>
                            <FlatList
                                data={filteredResidents}
                                keyExtractor={(item, index) =>
                                    item?._id ? item._id.toString() : index.toString()
                                }
                                renderItem={renderItem}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 80 }}
                                ListEmptyComponent={renderEmpty}
                            />
                        </View>
                    )}
                </View>
            </View>

            {/* Delete Confirmation Modal */}
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

                        <Text style={styles.deleteTitle}>Terminate Member?</Text>
                        <Text style={styles.deleteMessage}>
                            Are you sure you want to terminate this member? This action cannot be undone.
                        </Text>

                        <View style={styles.deleteButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.deleteModalButton, styles.cancelButton]}
                                onPress={closeDeleteModal}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.deleteModalButton, styles.confirmDeleteButton]}
                                onPress={confirmDelete}
                            >
                                <Text style={styles.confirmDeleteButtonText}>Yes, Terminate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default ResidentsList;

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: '#F9FAFB' },
    innerContainer: { flex: 1, padding: 16 },
    container: { flex: 1, backgroundColor: '#F9FAFB' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: '600',
        color: '#000',
        flex: 1,
        textAlign: 'center',
    },

    // Search Styles
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        height: 48,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: moderateScale(15),
        color: '#1F2937',
    },
    clearButton: {
        padding: 4,
    },

    listWrapper: { flex: 1 },

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

    selectedCard: {
        backgroundColor: '#DCFCE7',
        borderColor: '#519377',
        borderWidth: 1.5,
    },

    avatarContainer: {
        marginRight: 12,
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },

    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E0F2F1',
        justifyContent: 'center',
        alignItems: 'center',
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
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
        color: '#519377',
        marginTop: 8,
    },

    loaderOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Delete Modal
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
    confirmDeleteButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});