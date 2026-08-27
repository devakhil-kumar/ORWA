import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

const ComplaintDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const complaint = route?.params?.complaint || {};

    const hasImage =
        complaint?.complaintFile && complaint?.complaintFile !== 'null';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={28} color="#519377" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Complaint Details</Text>

                {/* Spacer to balance the back button so title stays centered */}
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.typeContainer}>
                        <Text style={[styles.complaintType, , { color: '#519377' }]}>
                           Name : {complaint?.name}
                        </Text>
                        <Text style={styles.dateText}>
                           Email : {complaint?.email}
                        </Text>
                        <Text style={[styles.complaintType,{marginTop:20}]}>
                            {complaint?.complaintType || 'General Complaint'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.dateText}>
                    {moment(complaint?.createdAt).format(
                        'DD MMM YYYY, hh:mm A'
                    )}
                </Text>

                <View style={styles.sectionDivider} />

                <Text style={styles.sectionLabel}>Description</Text>
                <Text style={styles.descriptionText}>
                    {complaint?.message || 'No description provided.'}
                </Text>

                {hasImage && (
                    <>
                        <View style={styles.sectionDivider} />
                        <Text style={styles.sectionLabel}>Screenshot</Text>
                        <Image
                            source={{ uri: complaint.complaintFile }}
                            style={styles.screenshot}
                            resizeMode="contain"
                        />
                    </>
                )}

                {complaint?.response && (
                    <>
                        <View style={styles.sectionDivider} />
                        <Text style={styles.sectionLabel}>Admin Response</Text>
                        <View style={styles.responseBox}>
                            <Text style={styles.responseText}>
                                {complaint.response}
                            </Text>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ComplaintDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(12),
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        marginTop: 2,
        width: moderateScale(28),
    },
    headerSpacer: {
        width: moderateScale(28),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: '600',
        color: '#000',
        flex: 1,
        textAlign: 'center',
    },
    content: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(16),
        paddingBottom: moderateScale(40),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(8),
    },
    typeContainer: {
        flex: 1,
        marginRight: moderateScale(8),
    },
    complaintType: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        color: '#000',
    },
    statusBadge: {
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(20),
    },
    statusText: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: '#fff',
    },
    dateText: {
        fontSize: moderateScale(13),
        color: '#666',
        marginBottom: moderateScale(8),
    },
    sectionDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: moderateScale(16),
    },
    sectionLabel: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: '#519377',
        marginBottom: moderateScale(8),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    descriptionText: {
        fontSize: moderateScale(15),
        color: '#333',
        lineHeight: moderateScale(22),
    },
    screenshot: {
        width: '100%',
        height: moderateScale(280),
        borderRadius: moderateScale(12),
        backgroundColor: '#F0F0F0',
    },
    responseBox: {
        backgroundColor: '#F0F9F4',
        borderRadius: moderateScale(12),
        padding: moderateScale(14),
    },
    responseText: {
        fontSize: moderateScale(15),
        color: '#333',
        lineHeight: moderateScale(22),
    },
});