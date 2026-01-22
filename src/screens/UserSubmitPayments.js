import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import Feather from '@react-native-vector-icons/feather';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { State } from 'react-native-gesture-handler';
import { uploadPaymentThunk } from '../app/features/paymentUploadSlice';
import { showMessage } from '../app/features/messageSlice';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation } from '@react-navigation/native';
import imagePath from '../contests/imagePath';

const { width } = Dimensions.get('window');


const pickAndCrop = async (setter, options = {}) => {
    try {
        const image = await ImageCropPicker.openPicker({
            width: options.width || 800,
            height: options.height || 800,
            cropping: true,
            cropperCircleOverlay: options.circle || false,
            freeStyleCropEnabled: true,
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
                <Text style={styles.uploadText}>JPG,PNG or PDF (Max 5MB)</Text>
            </>
        )}
        {file && <Text style={styles.fileName}>{file.name}</Text>}
    </TouchableOpacity>
);

const CustomInput = ({ placeholder, type, style, isEditable = true }) => {
    const [text, setText] = useState('');

    return (
        <View style={[styles.textInputContainer, style]}>
            {/* Left Icon */}

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

const SubmitPayment = () => {
    const [idProof, setIdProof] = useState(null);
    const { loading } = useSelector((state) => state.payment);
    const { user } = useSelector((state) => state.profile);

    const dispatch = useDispatch();
    const navigation = useNavigation();


    const handleSubmit = async () => {
        if (!idProof) {
            Alert.alert('Error', 'Please upload payment proof');
            return;
        }
        const fromData = new FormData();
        if (idProof) fromData.append('paymentScreenshot', idProof);
        console.log(fromData, 'formadata=====')
        try {
            const response = await dispatch(uploadPaymentThunk(fromData)).unwrap();
            dispatch(
                showMessage({
                    type: 'success',
                    text: response?.message || 'Payment uploaded successfully. Pending verification.',
                })
            );
            setIdProof(null);
        } catch (error) {
            dispatch(
                showMessage({
                    type: 'error',
                    text: error || 'Payment uploaded successfully. Pending verification.',
                })
            );
        }
    };

    const handleCancel = () => {
        setIdProof(null);
    };

    if (loading) {
        return <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#519377" />
        </View>
    }

    const handleHistory = () => {
        navigation.navigate('UserHistoryPayments')
    }

    const handlegoBack = () => {
        navigation.goBack();
    }


    return (
        <SafeAreaView style={styles.container} edges={['top', '0']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handlegoBack}>
                    <Ionicons name="chevron-back" size={28} color="#519377" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Submit Payment</Text>
                {/* <View style={{ width: '10%' }} /> */}
                <TouchableOpacity onPress={handleHistory}>
                    <FontAwesome name="history" size={27} color='#519377' />
                </TouchableOpacity>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, backgroundColor: '#F9FAFB80', padding: 16 }}
            >
                <View style={styles.profileCard}>
                    <View style={styles.nameRow}>
                        <View style={styles.iconCircle}>
                            {user?.profileImage ? (
                                <Image
                                    source={{ uri: user.profileImage }}
                                    style={styles.avatar}
                                />
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
                    <Text
                        style={[
                            styles.label,
                            { color: 'black', marginTop: moderateScale(16) },
                        ]}
                    >
                        Name
                    </Text>
                    <CustomInput
                        placeholder={user?.name}
                        type={'person'}
                        style={{ marginTop: moderateScale(6) }}
                        value={user?.name}
                        isEditable={false}
                        pointerEvents="none"

                    />
                    <Text
                        style={[
                            styles.label,
                            { color: 'black', marginTop: moderateScale(16) },
                        ]}
                    >
                        Email
                    </Text>
                    <CustomInput
                        isEditable={false}
                        placeholder={user?.email}
                        type={'email'}
                        style={{ marginTop: moderateScale(6) }}

                        pointerEvents="none"
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: moderateScale(24),
                    }}
                >
                    <Text style={[styles.mediumText, { fontSize: moderateScale(16) }]}>
                        Payment Proof
                    </Text>
                    <Text
                        style={[
                            styles.mediumText,
                            {
                                marginStart: moderateScale(4),
                                color: '#787878',
                                fontSize: moderateScale(14),
                            },
                        ]}
                    >
                        (Screenshot or Receipt)
                    </Text>
                </View>
                <UploadBox title="Tap to upload screenshot" file={idProof} onPress={() => pickAndCrop(setIdProof)} />
                <TouchableOpacity
                    style={[styles.buttonStyle, { marginTop: moderateScale(24) }]}
                    onPress={handleSubmit}
                >
                    <Text style={[styles.mediumText, { color: 'white' }]}>
                        Submit Payment
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.buttonStyle,
                        {
                            backgroundColor: '#D9D9D9',
                            marginTop: moderateScale(16),
                            marginBottom: moderateScale(32),
                        },
                    ]}
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

    // Profile card
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

    //drop down style
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

    // uploadBox
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
    //buttons
    buttonStyle: {
        backgroundColor: '#519377',
        width: '95%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: moderateScale(12),
        borderRadius: 20,
    },
    //  textinput style
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
    textInputLeftIcon: {
        width: 12,
        height: 12,
        tintColor: '#D1D5DB',
        marginRight: moderateScale(8),
    },
    textInputRightIcon: {
        width: 12,
        height: 12,
        tintColor: '#D1D5DB',
        marginLeft: moderateScale(8),
    },
    textInput: {
        flex: 1,
        fontSize: moderateScale(16),
        color: '#374151',
        marginLeft: 8
    },
    uploadBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 30, alignItems: 'center', borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed', marginTop: 12 },
    uploadedImage: { width: 120, height: 120, borderRadius: 12, marginBottom: 10 },
    hint: { fontSize: 14, color: '#000', marginTop: 10, fontWeight: 500 },
    uploadText: { fontSize: 12, color: '#838383', fontWeight: 500 },
    loaderOverlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
});
