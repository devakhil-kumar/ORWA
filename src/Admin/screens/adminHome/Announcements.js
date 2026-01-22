import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Platform, Alert, Linking, Image, Dimensions, Modal, ScrollView } from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import Ionicons from "@react-native-vector-icons/ionicons";
import { moderateScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import imagePath from "../../../contests/imagePath";
const { width, height } = Dimensions.get('window');
import { formatNotificationDate } from '../../../screens/Profile/Notification';
import ImageCropPicker from "react-native-image-crop-picker";
import CustomInput from '../../../components/CustomInput';
import { deleteEvent, fetchEventsAdmin, updateEvent } from "../../../app/features/eventAdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "../../../app/features/messageSlice";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


const Announcements = () => {
    const navigation = useNavigation();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editImage, setEditImage] = useState(null);
    console.log(editImage, 'eeditimage++++')
    const dispatch = useDispatch();
    const route = useRoute();
    const { events, loading, updateLoading, deleteLoading } = useSelector((state) => state.eventAdmin);

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchEventsAdmin({ isActive: true, page: 1, limit: 10 }));
        }, [dispatch])
    );


    const handleEditEvent = (event) => {
        console.log(event, 'event+++++++')
        setSelectedEvent(event);
        setEditTitle(event.title || '');
        setEditDescription(event.description || '');
        setEditImage(event?.image); // Reset image
        setEditModalVisible(true);
    };

    const closeEditModal = () => {
        setEditModalVisible(false);
        setSelectedEvent(null);
        setEditTitle('');
        setEditDescription('');
        setEditImage(null);
    };

    const handleDeleteEvent = (event) => {
        setSelectedEvent(event);
        setDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalVisible(false);
        setSelectedEvent(null);
    };

    const confirmDelete = async () => {
        try {
            const result = await dispatch(
                deleteEvent(selectedEvent._id || selectedEvent.id)
            ).unwrap();

            closeDeleteModal();
            dispatch(
                showMessage({
                    type: 'success',
                    text: result?.message || 'Event deleted successfully!',
                })
            );
        } catch (error) {
            console.log('Delete error:', error);
            dispatch(
                showMessage({
                    type: 'error',
                    text: error?.message || 'Failed to delete event',
                })
            );
        }
    };

    // Pick Image
    const pickAndCropImage = async () => {
        try {
            const image = await ImageCropPicker.openPicker({
                width: 1000,
                height: 800,
                cropping: true,
                freeStyleCropEnabled: true,
                compressImageQuality: 0.8,
                includeBase64: false,
            });
            setEditImage({
                uri: image.path,
                type: image.mime,
                name: image.path.split('/').pop(),
            });
        } catch (err) {
            if (err.code !== 'E_PICKER_CANCELLED') {
                Alert.alert('Error', 'Could not select image');
            }
        }
    };


    const handleUpdate = async () => {
        if (!editTitle.trim()) {
            Alert.alert('Validation Error', 'Please enter a title');
            return;
        }
        if (!editDescription.trim()) {
            Alert.alert('Validation Error', 'Please enter a description');
            return;
        }
        const formData = new FormData();
        formData.append('title', editTitle.trim());
        formData.append('description', editDescription.trim());
        if (editImage && typeof editImage !== 'string') {
            formData.append('image', {
                uri: editImage.uri,
                type: editImage.type,
                name: editImage.name,
            });
        }
        console.log(formData, 'fromdata++++++')
        console.log(selectedEvent._id, 'cbslcbsfj')
        try {
            const result = await dispatch(updateEvent({ id: selectedEvent._id, payload: formData })).unwrap();
            console.log(result, 'result+++++++++++++++')
            closeEditModal();
            dispatch(
                showMessage({
                    type: 'success',
                    text: result?.message || 'Announcements Update successful!',
                })
            );
            navigation.goBack();
            // dispatch(fetchEventsAdmin({ isActive: true, page: 1, limit: 10 }));
        } catch (error) {
            closeEditModal();
            console.log('Update error:', error);
            dispatch(
                showMessage({
                    type: 'error',
                    text: error?.message || 'Announcements Failed!',
                })
            );
        }
    };

    const handlePostUpdate = () => {
        navigation.navigate('AddUpdates');
    }

    const renderItem = ({ item }) => {
        return (
            <View style={style.card}>
                <View style={style.iconWrapper}>
                    <Image source={imagePath.speakerImage} style={{ width: width * 0.1 / 2, height: height * 0.1 / 5 }} />
                </View>
                <View style={style.textContainer}>
                    <Text style={style.name}>{item.title}</Text>
                    <Text style={style.address}>{item.description}</Text>
                </View>

                <View style={style.rightContainer}>
                    <Text style={style.dateText}> {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    })}</Text>
                    <View style={style.iconRow}>
                        <TouchableOpacity onPress={() => handleEditEvent(item)}>
                            <Feather name="edit" size={15} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteEvent(item)} >
                            <MaterialIcons
                                name="delete"
                                size={18}
                                color="#D32F2F"
                                style={{ marginLeft: 14 }}
                            />
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={style.container} edges={['top', 'bottom']}>
            <View style={style.main}>
                <View style={style.innerCantainer}>
                    <View style={style.header}>
                        <TouchableOpacity
                            style={style.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="chevron-back" size={28} color="#519377" />
                        </TouchableOpacity>
                        <Text style={style.headerTitle}>Announcements</Text>
                        <TouchableOpacity style={style.topButns} onPress={handlePostUpdate}>
                            <MaterialIcons name='add' color={'#519377'} size={20} />
                        </TouchableOpacity>
                        <View style={style.placeholder} />
                    </View>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom:15 }}> */}
                    {/* <TouchableOpacity style={[style.topButns, { width: width / 2.9, backgroundColor: "#519377" }]}>
                            <Ionicons name='filter' color={'#fff'} size={20} />
                            <Text style={[style.topButnsText, { fontSize: 16, marginLeft: 8, color: '#fff' }]}>Filter</Text>
                        </TouchableOpacity> */}
                    {/* <TouchableOpacity style={style.topButns} onPress={handlePostUpdate}>
                            <MaterialIcons name='update' color={'#519377'} size={20} />
                            <Text style={style.topButnsText}>Post Update</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={style.listWrapper}>
                        <FlatList
                            data={events}
                            keyExtractor={(item, index) =>
                                item?.id ? item.id.toString() : index.toString()
                            }
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            ListEmptyComponent={
                                <Text style={style.noDataText}>
                                    No events available
                                </Text>
                            }
                        />
                    </View>
                </View>
            </View>
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeEditModal}
            >
                <View style={style.modalOverlay}>
                    <View style={style.modalContent}>
                        {/* Modal Header */}
                        <View style={style.modalHeader}>
                            <Text style={style.modalTitle}>Edit Event</Text>
                            <TouchableOpacity onPress={closeEditModal} disabled={updateLoading}>
                                <Ionicons name="close" size={28} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Title Input */}
                            <View style={style.inputGroup}>
                                <Text style={style.label}>Title *</Text>
                                <CustomInput
                                    value={editTitle}
                                    onChangeText={setEditTitle}
                                    style={style.normalInput}
                                    placeholder="Title Goes here"
                                    editable={!updateLoading}
                                />
                            </View>

                            {/* Description Input */}
                            <View style={style.inputGroup}>
                                <Text style={style.label}>Description *</Text>
                                <CustomInput
                                    value={editDescription}
                                    onChangeText={setEditDescription}
                                    style={style.input}
                                    placeholder="Write here"
                                    textAlignVertical="top"
                                    multiline
                                    editable={!updateLoading}
                                />
                            </View>
                            <View style={style.inputGroup}>
                                <Text style={style.label}>Update Image (Optional)</Text>
                                <TouchableOpacity
                                    style={style.uploadBox}
                                    onPress={pickAndCropImage}
                                    disabled={updateLoading}
                                >
                                    {editImage ? (
                                        <>
                                            <Image source={{
                                                uri: typeof editImage === 'string'
                                                    ? editImage
                                                    : editImage?.uri
                                            }} style={style.uploadedImage} resizeMode="cover" />
                                            <Text style={style.fileName}>{editImage.name}</Text>
                                        </>
                                    ) : (
                                        <>
                                            <Ionicons name="cloud-upload-outline" size={40} color={'#666'} />
                                            <Text style={style.uploadText}>Choose New Image</Text>
                                            <Text style={style.hint}>Leave empty to keep current image</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Update Button */}
                            <TouchableOpacity
                                style={[style.updateButton, updateLoading && style.updateButtonDisabled]}
                                onPress={handleUpdate}
                                disabled={updateLoading}
                            >
                                {updateLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={style.updateButtonText}>Update Event</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

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

                        <Text style={style.deleteTitle}>Delete Event?</Text>
                        <Text style={style.deleteMessage}>
                            Are you sure you want to delete this event? This action cannot be undone.
                        </Text>

                        <View style={style.deleteButtonsContainer}>
                            <TouchableOpacity
                                style={[style.deleteModalButton, style.cancelButton]}
                                onPress={closeDeleteModal}
                                disabled={deleteLoading}
                            >
                                <Text style={style.cancelButtonText}>No, Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[style.deleteModalButton, style.confirmDeleteButton, deleteLoading && style.deleteButtonDisabled]}
                                onPress={confirmDelete}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={style.confirmDeleteButtonText}>Yes, Delete</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Announcements;

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
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
    },

    address: {
        fontSize: 11,
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
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 15,
        backgroundColor: '#FCE8DC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    // topButns: {
    //     borderWidth: 1,
    //     paddingVertical: 8,
    //     width: width / 2.5,
    //     borderRadius: 15,
    //     borderColor: "#519377",
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // },
    topButns: {
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
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
    dateText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
        maxHeight: height * 0.85,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    input: {
        height: 150,
        borderWidth: 1,
        borderColor: '#CFCFCF',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
    },
    normalInput: {
        height: 50,
        borderWidth: 1,
        borderColor: '#CFCFCF',
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
    },
    uploadBox: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        minHeight: 150,
        justifyContent: 'center',
    },
    uploadedImage: {
        width: 200,
        height: 120,
        borderRadius: 12,
        marginBottom: 10,
    },
    uploadText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    fileName: {
        color: '#0066CC',
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    hint: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
        textAlign: 'center',
    },
    updateButton: {
        backgroundColor: '#519377',
        paddingVertical: 14,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        minHeight: 50,
    },
    updateButtonDisabled: {
        backgroundColor: '#9E9E9E',
        opacity: 0.7,
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#6B7280',
        fontSize: 14,
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