import React, { useCallback, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    TextInput,
    Image,
    ActivityIndicator,
    Alert,
    Platform, // ✅ added
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import Feather from '@react-native-vector-icons/feather';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPaymentThunk, editPaymentThunk } from '../app/features/paymentUploadSlice';
import { showMessage } from '../app/features/messageSlice';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchAdminResidentials } from "../app/features/getResidentails";

const { width } = Dimensions.get('window');

const pickAndCrop = async (setter) => {
    try {
        const image = await ImageCropPicker.openPicker({
            mediaType: 'photo',
            cropping: false,
            compressImageQuality: 0.8,
            includeBase64: false,
        });

        setter({
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

const UploadBox = ({ title, file, onPress, hint }) => (
    <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
        {file ? (
            <Image source={{ uri: file.uri }} style={styles.uploadedImage} resizeMode="cover" />
        ) : (
            <>
                <Ionicons name='cloud-upload-outline' size={40} color={'#666'} />
                <Text style={styles.hint}>{hint || title}</Text>
                <Text style={styles.uploadText}>JPG, PNG or PDF (Max 5MB)</Text>
            </>
        )}
        {file && <Text style={styles.fileName}>{file.name || 'payment_screenshot'}</Text>}
    </TouchableOpacity>
);

const CustomInput = ({ placeholder, type, style, isEditable = true }) => {
    const [text, setText] = useState('');

    return (
        <View style={[styles.textInputContainer, style]}>
            {type === 'person' && (
                <Ionicons name="person" size={28} color="#9CA3AF" />
            )}
            {type === 'email' && (
                <MaterialDesignIcons name="gmail" size={28} color="#9CA3AF" />
            )}
            {type === 'payment' && (
                <MaterialDesignIcons name="currency-rupee" size={28} color="#9CA3AF" />
            )}
            <TextInput
                editable={isEditable}
                value={text}
                onChangeText={setText}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                style={styles.textInput}
            />
            {type === 'email' && (
                <Ionicons name="lock-closed" size={28} color="#9CA3AF" />
            )}
            {type === 'person' && (
                <Ionicons name="lock-closed" size={28} color="#9CA3AF" />
            )}
        </View>
    );
};

const SubmitPayment = ({ route }) => {
    const [idProof, setIdProof] = useState(null);
    const { loading } = useSelector((state) => state.payment);
    const { user } = useSelector((state) => state.profile);
    const { isAdmin = false, isEdit = false, payment = {} } = route?.params ?? {};
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [description, setDescription] = useState('');
    const { residentials: userList = [], loading: loadingUsers } = useSelector((state) => state.residential);
    const [existingScreenshot, setExistingScreenshot] = useState(null);

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

    const checkIsEdit = (freshUserList = []) => {
        if (!isEdit || !payment) return;

        const matchedUser = freshUserList.find((u) => u._id === payment?.residentialId);
        setSelectedUser(matchedUser ?? null);

        if (!matchedUser && isAdmin) {
            console.warn('Residential user not found for payment, going back.');
            navigation.goBack();
            return;
        }

        setFromDate(payment?.paidFrom ? new Date(payment.paidFrom) : null);
        setToDate(payment?.paidTo ? new Date(payment.paidTo) : null);
        setDescription(payment?.remarks || '');

        if (payment?.paymentScreenshot) {
            const url = payment.paymentScreenshot;
            const name = url.split('/').pop() || 'payment_screenshot'; // ✅ fallback name
            setExistingScreenshot({ uri: url, name });
        }

        setIdProof(null);
        console.log("Payment screenshot:", payment?.paymentScreenshot);
    };

    useFocusEffect(
        useCallback(() => {
            if (isAdmin) {
                dispatch(fetchAdminResidentials())
                    .unwrap()
                    .then((result) => {
                        // ✅ Pass fresh resolved list directly — avoids stale Redux closure
                        const freshList = result?.data ?? result ?? [];
                        if (isEdit) checkIsEdit(freshList);
                    })
                    .catch((err) => console.log('API error:', err));
            } else if (isEdit) {
                // ✅ Non-admin edit: populate fields without needing user list
                checkIsEdit([]);
            }
        }, [dispatch, isAdmin, isEdit]) // ✅ isEdit added to deps
    );

    const handleSubmit = async () => {
        if (isAdmin && !selectedUser?._id) {
            Alert.alert('Error', 'Please Select a resident.');
            return;
        }
        if (!idProof) {
            Alert.alert('Error', 'Please upload payment proof.');
            return;
        }
        if (!fromDate) {
            Alert.alert('Error', 'Please select a from date.');
            return;
        }
        if (!toDate) {
            Alert.alert('Error', 'Please select a to date.');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description.');
            return;
        }

        const fromData = new FormData();
        if (isAdmin && selectedUser?._id != null) fromData.append('residentialId', selectedUser._id);
        if (idProof) fromData.append('paymentScreenshot', idProof);
        if (fromDate) fromData.append('paidFrom', fromDate.toISOString());
        if (toDate) fromData.append('paidTo', toDate.toISOString());
        if (description.trim()) fromData.append('remarks', description.trim());

        try {
            const response = await dispatch(uploadPaymentThunk({ userData: fromData, isAdmin }));
            console.log("Response : ", response);

            if (response.meta.requestStatus === 'fulfilled') {
                dispatch(showMessage({
                    type: 'success',
                    text: response?.payload?.message || 'Payment uploaded successfully. Pending verification.',
                }));
                setFromDate(null);
                setToDate(null);
                setDescription('');
                setIdProof(null);
                navigation.goBack();
            } else {
                dispatch(showMessage({
                    type: 'error',
                    text: response?.payload?.message || 'Error while submitting payment.',
                }));
            }
        } catch (error) {
            dispatch(showMessage({
                type: 'error',
                text: error?.message || 'Error while submitting payment.',
            }));
        }
    };

    const handleEditSubmit = async () => {
        if (isAdmin && !selectedUser?._id) {
            Alert.alert('Error', 'Please Select a resident.');
            return;
        }
        if (!existingScreenshot && !idProof) {
            Alert.alert('Error', 'Please upload payment proof.');
            return;
        }
        if (!fromDate) {
            Alert.alert('Error', 'Please select a from date.');
            return;
        }
        if (!toDate) {
            Alert.alert('Error', 'Please select a to date.');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description.');
            return;
        }

        console.log('payment._id:', payment?._id);

        // ✅ Local RN image picker files use file:// not http://
        const isLocalFile = (file) => file?.uri?.startsWith('file://');

        // ✅ New pick always takes priority; only re-upload existing if it's a local file
        const fileToUpload = idProof
            ? idProof
            : (existingScreenshot && isLocalFile(existingScreenshot) ? existingScreenshot : null);

        const fromData = new FormData();
        if (isAdmin && selectedUser?._id != null) fromData.append('residentialId', selectedUser._id);
        if (fileToUpload) {
            console.log("Screenshot : ", fileToUpload);
            fromData.append('paymentScreenshot', fileToUpload);
        }
        if (fromDate) fromData.append('paidFrom', fromDate.toISOString());
        if (toDate) fromData.append('paidTo', toDate.toISOString());
        if (description.trim()) fromData.append('remarks', description.trim());

        try {
            const response = await dispatch(
                editPaymentThunk({ paymentData: fromData, paymentId: payment?._id })
            ).unwrap();

            console.log("Print edit response :", response);
            dispatch(showMessage({ type: 'success', text: response?.message || 'Edited!' }));
            setDescription('');
            setIdProof(null);
            navigation.popTo('PaymentHistory');

        } catch (error) {
            dispatch(showMessage({
                type: 'error',
                text: error?.message || 'Edit failed. Please Try Again.'
            }));
        }
    };

    const handleCancel = () => {
        setIdProof(null);
        navigation.goBack();
    };

    if (loading) {
        return (
            <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color="#519377" />
            </View>
        );
    }

    const handleHistory = () => {
        navigation.navigate('UserHistoryPayments');
    };

    const handlegoBack = () => {
        navigation.goBack();
    };

    const formatDate = (date) => {
        if (!date) return 'Select Date';
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return 'Select Date';
        return d.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleFromDateChange = (event, selectedDate) => {
        setShowFromPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFromDate(selectedDate);
            if (toDate && selectedDate > toDate) {
                setToDate(null);
            }
        }
    };

    const handleToDateChange = (event, selectedDate) => {
        setShowToPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setToDate(selectedDate);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handlegoBack}>
                    <Ionicons name="chevron-back" size={28} color="#519377" />
                </TouchableOpacity>
                <Text style={styles.headerText}>{isEdit ? "Edit Payment" : "Submit Payment"}</Text>
                {isAdmin ? (
                    <View style={{ width: 27 }} />
                ) : (
                    <TouchableOpacity onPress={handleHistory}>
                        <FontAwesome name="history" size={27} color='#519377' />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, backgroundColor: '#F9FAFB80', padding: 16 }}
            >
                {isAdmin ? (
                    <View style={styles.profileCard}>
                        <Text style={[styles.label, { color: 'black', marginBottom: moderateScale(8) }]}>
                            Select User
                        </Text>
                        <TouchableOpacity
                            style={styles.dropdownTrigger}
                            onPress={() => setDropdownOpen(!dropdownOpen)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.dropdownTriggerText}>
                                {selectedUser ? selectedUser.name : 'Select a user...'}
                            </Text>
                            <Ionicons
                                name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="#519377"
                            />
                        </TouchableOpacity>

                        {dropdownOpen && (
                            <View style={styles.dropdownList}>
                                <ScrollView
                                    nestedScrollEnabled
                                    style={{ maxHeight: moderateScale(200) }}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {userList.map((u) => (
                                        <TouchableOpacity
                                            key={u._id}
                                            style={[
                                                styles.dropdownItem,
                                                selectedUser?._id === u._id && styles.dropdownItemActive,
                                            ]}
                                            onPress={() => {
                                                setSelectedUser(u);
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            <View style={styles.dropdownAvatar}>
                                                <Ionicons name="person" size={20} color="#000" />
                                            </View>
                                            <View>
                                                <Text style={styles.dropdownItemText}>{u.name}</Text>
                                                <Text style={styles.dropdownItemSub}>Flat No. : {u.flatNumber}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {selectedUser && (
                            <>
                                <Text style={[styles.label, { color: 'black', marginTop: moderateScale(16) }]}>
                                    Name
                                </Text>
                                <CustomInput
                                    placeholder={selectedUser?.name}
                                    type={'person'}
                                    style={{ marginTop: moderateScale(6) }}
                                    isEditable={false}
                                />
                                <Text style={[styles.label, { color: 'black', marginTop: moderateScale(16) }]}>
                                    Email
                                </Text>
                                <CustomInput
                                    isEditable={false}
                                    placeholder={selectedUser?.email}
                                    type={'email'}
                                    style={{ marginTop: moderateScale(6) }}
                                />
                                <Text style={[styles.label, { color: 'black', marginTop: moderateScale(16) }]}>
                                    Description
                                </Text>
                                <TextInput
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Add a note or description..."
                                    placeholderTextColor="#9CA3AF"
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    style={styles.descriptionInput}
                                />
                            </>
                        )}
                    </View>
                ) : (
                    <View style={styles.profileCard}>
                        <View style={styles.nameRow}>
                            <View style={styles.iconCircle}>
                                {user?.profileImage ? (
                                    <Image source={{ uri: user.profileImage }} style={styles.avatar} />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <Ionicons name="person" size={30} color="#000" />
                                    </View>
                                )}
                            </View>
                            <View style={{ marginStart: moderateScale(16) }}>
                                <Text style={styles.mediumText}>{user?.name}</Text>
                                <Text style={styles.label}>{user?.flatNumber}</Text>
                            </View>
                        </View>
                        <Text style={[styles.label, { color: 'black', marginTop: moderateScale(16) }]}>
                            Name
                        </Text>
                        <CustomInput
                            placeholder={user?.name}
                            type={'person'}
                            style={{ marginTop: moderateScale(6) }}
                            isEditable={false}
                        />
                        <Text style={[styles.label, { color: 'black', marginTop: moderateScale(16) }]}>
                            Email
                        </Text>
                        <CustomInput
                            isEditable={false}
                            placeholder={user?.email}
                            type={'email'}
                            style={{ marginTop: moderateScale(6) }}
                        />
                        <Text style={[styles.label, { color: 'black', marginTop: moderateScale(16) }]}>
                            Description
                        </Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Add a note or description..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            style={styles.descriptionInput}
                        />
                    </View>
                )}

                {/* Date Pickers */}
                <View style={styles.dateRow}>
                    <View style={styles.dateGroup}>
                        <Text style={styles.dateLabel}>From</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowFromPicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={16} color="#519377" />
                            <Text style={[styles.dateText, !fromDate && styles.datePlaceholder]}>
                                {formatDate(fromDate)}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dateDivider} />

                    <View style={styles.dateGroup}>
                        <Text style={styles.dateLabel}>To</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowToPicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={16} color="#519377" />
                            <Text style={[styles.dateText, !toDate && styles.datePlaceholder]}>
                                {formatDate(toDate)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {showFromPicker && (
                    <DateTimePicker
                        value={fromDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleFromDateChange}
                        maximumDate={toDate || undefined}
                        themeVariant="light"
                    />
                )}

                {showToPicker && (
                    <DateTimePicker
                        value={toDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleToDateChange}
                        minimumDate={fromDate || undefined}
                        themeVariant="light"
                    />
                )}

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: moderateScale(24) }}>
                    <Text style={[styles.mediumText, { fontSize: moderateScale(16) }]}>
                        Payment Proof
                    </Text>
                    <Text style={[styles.mediumText, { marginStart: moderateScale(4), color: '#787878', fontSize: moderateScale(14) }]}>
                        (Screenshot or Receipt)
                    </Text>
                </View>

                <UploadBox
                    title="Tap to upload screenshot"
                    file={idProof ?? existingScreenshot}
                    onPress={() => pickAndCrop(setIdProof)}
                />

                <TouchableOpacity
                    style={[styles.buttonStyle, { marginTop: moderateScale(24) }]}
                    onPress={isEdit ? handleEditSubmit : handleSubmit}
                >
                    <Text style={[styles.mediumText, { color: 'white' }]}>
                        {isEdit ? "Edit Payment" : "Submit Payment"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buttonStyle, { backgroundColor: '#D9D9D9', marginTop: moderateScale(16), marginBottom: moderateScale(32) }]}
                    onPress={handleCancel}
                >
                    <Text style={[styles.mediumText, { color: 'black' }]}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SubmitPayment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingBottom: 40
    },
    descriptionInput: {
        marginTop: moderateScale(6),
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(10),
        fontSize: moderateScale(15),
        color: '#374151',
        minHeight: moderateScale(100),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(10),
        paddingBottom: moderateScale(15),
        justifyContent: 'space-between'
    },
    headerText: {
        fontSize: moderateScale(20),
        color: '#111827',
        marginStart: moderateScale(16),
        fontWeight: '700',
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(24),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    iconCircle: {
        width: 45,
        height: 45,
        borderRadius: 100,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediumText: {
        fontSize: moderateScale(18),
        color: '#000',
        fontWeight: '600',
    },
    label: {
        fontSize: moderateScale(12),
        color: '#787878',
        fontWeight: '600',
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    dropdownBox: {
        height: 50,
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        backgroundColor: '#fff',
        paddingHorizontal: moderateScale(16),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 2,
    },
    selectedText: {
        fontSize: moderateScale(16),
        fontWeight: '500',
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalBox: {
        backgroundColor: '#fff',
        marginHorizontal: moderateScale(30),
        borderRadius: moderateScale(10),
        paddingVertical: moderateScale(10),
        maxHeight: 250,
    },
    item: {
        padding: moderateScale(16),
        borderBottomWidth: 0.3,
        borderColor: '#ccc',
    },
    itemText: {
        fontSize: moderateScale(16),
        fontWeight: '500',
        color: '#000',
    },
    uploadContainer: {
        borderWidth: moderateScale(2),
        borderColor: '#D3D3D3',
        borderStyle: 'dashed',
        borderRadius: moderateScale(12),
        paddingVertical: moderateScale(35),
        paddingHorizontal: moderateScale(20),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        marginVertical: moderateScale(10),
    },
    uploadTitle: {
        fontSize: moderateScale(16),
        fontWeight: '500',
        color: '#000',
    },
    uploadSubtitle: {
        fontSize: moderateScale(12),
        fontWeight: '500',
        color: '#838383',
    },
    buttonStyle: {
        backgroundColor: '#519377',
        width: '95%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: moderateScale(12),
        borderRadius: 20,
    },
    textInputContainer: {
        height: 50,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(12),
    },
    textInput: {
        flex: 1,
        fontSize: moderateScale(16),
        color: '#374151',
        marginLeft: 8
    },
    uploadBox: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        marginTop: 12
    },
    uploadedImage: {
        width: '100%',
        minHeight: 300,
        height: undefined,
        aspectRatio: 9 / 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    hint: { fontSize: 14, color: '#000', marginTop: 10, fontWeight: '500' },
    uploadText: { fontSize: 12, color: '#838383', fontWeight: '500' },
    fileName: { fontSize: 12, color: '#666', marginTop: 6 },
    loaderOverlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: moderateScale(20),
        backgroundColor: '#fff',
        borderRadius: moderateScale(16),
        padding: moderateScale(14),
        elevation: 2,
    },
    dateGroup: {
        flex: 1,
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: moderateScale(12),
        color: '#9CA3AF',
        fontWeight: '500',
        marginBottom: 6,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
    },
    dateText: {
        fontSize: moderateScale(13),
        color: '#111827',
        fontWeight: '500',
    },
    datePlaceholder: {
        color: '#9CA3AF',
    },
    dateDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 10,
    },
    dropdownTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(12),
        backgroundColor: '#f9f9f9',
    },
    dropdownTriggerText: {
        fontSize: 14,
        color: '#333',
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginTop: moderateScale(4),
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(10),
        gap: moderateScale(10),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemActive: {
        backgroundColor: '#e8f5f0',
    },
    dropdownAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    dropdownItemText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    dropdownItemSub: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 100,
    },
    avatarPlaceholder: {
        width: 45,
        height: 45,
        borderRadius: 100,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
    },
});