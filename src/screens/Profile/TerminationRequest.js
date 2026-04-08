import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Platform, Alert, Linking, Image, Modal, ScrollView, Dimensions, } from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import Ionicons from "@react-native-vector-icons/ionicons";
import { moderateScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useDispatch, useSelector, } from "react-redux";
import { fetchTerminationRequests, deleteMember } from "../../app/features/getResidentails";
import { showMessage } from "../../app/features/messageSlice";
import { processInset } from "react-native-reanimated/lib/typescript/common";
import RNFS from "react-native-fs";
import Share from "react-native-share";
const { width, height } = Dimensions.get('window');

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

const TerminationRequest = () => {
    const navigation = useNavigation();

    const dispatch = useDispatch();

    const { residentials, loading } = useSelector((state) => state.residential)
    console.log(residentials, loading, 'loading, resdi+++++++++++')

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchTerminationRequests());
        }, [dispatch])
    );

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={{ marginTop: 50, alignItems: 'center' }}>
                <Text style={{ color: '#999', fontSize: 16 }}>No Termination Request yet</Text>
            </View>
        );
    };

    // modal 

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleDeleteMember = (item) => {
        setSelectedItem(item);
        setDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalVisible(false);
    };

   const confirmDelete = async () => {
    try {
        console.log("Selected item id:", selectedItem); 
        const result = await dispatch(
            deleteMember(selectedItem)
        ).unwrap();

        dispatch(fetchTerminationRequests());
        closeDeleteModal();
        dispatch(showMessage({
            type: 'success',
            text: result?.message || 'Member deleted successfully!',
        }));
    } catch (error) {
        dispatch(showMessage({
            type: 'error',
            text: error?.message || 'Failed to delete member.',
        }));
    }
};

    const handleOnItemTap = (id) => {
        console.log("id from fun:", id);
        navigation.navigate('PaymentHistory', {
            userId: id
        });
    };

    const [selectedList, setSelectedList] = useState([]);
    const renderItem = ({ item }) => {
        const isItemSelected = selectedList.includes(item._id);
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleDeleteMember(item._id)}
            >

                <View style={[style.card, isItemSelected && style.selectedCard]}>
                    <TouchableOpacity onPress={() => {
                        setSelectedList(prev =>
                            prev.includes(item._id)
                                ? prev.filter(id => id !== item._id)
                                : [...prev, item._id]
                        );
                    }}>
                        {residentials.profileImage ? (
                            <Image
                                source={{ uri: residentials.profileImage }}
                                style={style.avatar}
                            />
                        ) : (
                            <View style={style.avatarPlaceholder}>
                                <Ionicons name="person" size={30} color="#519377" />
                            </View>
                        )}
                    </TouchableOpacity>
                    <View style={style.textContainer}>
                        <Text style={style.name}>{item.name}</Text>

                        <Text style={style.address}>{item.email || "not declare"}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    const handleSelectAll = (items) => {
        if (selectedList.length === items.length) {
            setSelectedList([]); // unselect all
        } else {
            setSelectedList(items.map(item => item._id)); // select all
        }
    };


    const handleExport = async () => {
        try {
            const selectedItems = residentials.filter(item =>
                selectedList.includes(item._id)
            );
            if (selectedItems.length === 0) return;

            const header = Object.keys(selectedItems[0]).join(",") + "\n";
            const rows = selectedItems
                .map(item =>
                    Object.values(item)
                        .map(v => `"${String(v).replace(/"/g, '""')}"`)
                        .join(",")
                )
                .join("\n");

            const csvData = header + rows;

            // ANDROID SAFE PATH → Downloads folder
            const path =
                Platform.OS === "android"
                    ? `${RNFS.DownloadDirectoryPath}/export.csv`
                    : `${RNFS.DocumentDirectoryPath}/export.csv`;

            await RNFS.writeFile(path, csvData, "utf8");

            console.log("CSV saved at:", path);

            const fileUrl =
                Platform.OS === "android" ? `file://${path}` : path;

            console.log("Sharing URL:", fileUrl);

            await Share.open({
                title: "Export CSV",
                url: fileUrl,
                type: "text/csv",
                failOnCancel: false,
            });
        } catch (error) {
            console.log("CSV Export Error:", error);
        }
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
                            {selectedList.length === 0 && <Ionicons name="chevron-back" size={28} color="#519377" />}
                            {selectedList.length > 0 && (
                                <TouchableOpacity
                                    style={{ flexDirection: "row", alignItems: "center", marginLeft: 12 }}
                                    onPress={() => handleSelectAll(residentials)}
                                >
                                    <Ionicons
                                        name={
                                            selectedList.length === residentials.length
                                                ? "checkbox"
                                                : "checkbox-outline"
                                        }
                                        size={24}
                                        color="#519377"
                                    />

                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                        <Text style={style.headerTitle}>Termination Requests</Text>
                        {selectedList.length > 0 && (
                            <TouchableOpacity
                                style={{ marginLeft: 12 }}
                                onPress={handleExport}
                            >
                                <Ionicons name="share-outline" size={28} color="#519377" />
                            </TouchableOpacity>
                        )}
                    </View>
                    {loading ?
                        <View style={style.loaderOverlay}>
                            <ActivityIndicator size="large" color="#519377" />
                        </View>
                        : <View style={style.listWrapper}>
                            <FlatList
                                data={residentials}
                                // keyExtractor={(item) => item.id}
                                keyExtractor={(item, index) =>
                                    item?.id ? item.id.toString() : index.toString()
                                }
                                renderItem={renderItem}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                ListEmptyComponent={renderEmpty}
                            />
                        </View>}
                </View>
            </View>

            {/* resident delete modal */}
            <Modal
                visible={deleteModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={closeDeleteModal}
            >
                <View style={style.deleteModalOverlay}>
                    <View style={style.deleteModalContent}>
                        <View style={style.deleteIconWrapper}>
                            <MaterialIcons name="delete-outline" size={50} color="#D32F2F" />
                        </View>

                        <Text style={style.deleteTitle}>Delete Member?</Text>
                        <Text style={style.deleteMessage}>
                            Are you sure you want to delete this Member? This action cannot be undone.
                        </Text>

                        <View style={style.deleteButtonsContainer}>
                            <TouchableOpacity
                                style={[style.deleteModalButton, style.cancelButton]}
                                onPress={closeDeleteModal}

                            >
                                <Text style={style.cancelButtonText}>No, Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[style.deleteModalButton, style.confirmDeleteButton]}
                                onPress={confirmDelete}

                            >
                                <Text style={style.confirmDeleteButtonText}>Yes, Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default TerminationRequest;

const style = StyleSheet.create({
    main: { flex: 1, backgroundColor: '#F9FAFB', },
    innerCantainer: { flex: 1, padding: 16 },
    topButtonsRow: { flexDirection: "row", marginTop: 15, alignItems: 'center', alignSelf: 'center', width: '100%', justifyContent: 'space-between' },
    filterBtn: { flexDirection: 'row', padding: 4 },
    filterText: { fontSize: moderateScale(14), marginLeft: 8 },
    exportBtn: { flexDirection: 'row', padding: 7, borderWidth: 1, borderRadius: 8, borderColor: 'gray', marginLeft: 10 },
    exportText: { fontSize: moderateScale(14), marginLeft: 8 },
    addUserBtn: { flexDirection: 'row', backgroundColor: '#519377', borderRadius: 8, alignItems: "center", padding: 12, marginLeft: 8 },
    addUserText: { fontSize: moderateScale(14), marginLeft: 8, lineHeight: moderateScale(15), color: '#fff' },
    listWrapper: { marginTop: 20, marginBottom: 40 },
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
        backgroundColor: '#F9FAFB',
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

    selectedCard: {
        flexDirection: 'row',
        backgroundColor: '#85caeaff',
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
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
        justifyContent: 'center'
    },

    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    date: {
        fontSize: 12,
        color: '#2E7D32',
        marginTop: 8
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
    avatarPlaceholder: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: moderateScale(35),
        backgroundColor: '#FFD54F',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    loaderOverlay: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    //delete modal style 
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
