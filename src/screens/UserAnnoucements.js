import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ScrollView,
    FlatList,
    Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import CustomInput from '../components/CustomInput';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnnouncements } from '../app/features/announcementSliceUser';
import { stat } from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const announcementFilterType = ['All', 'System', 'Announcements'];
const announcementListData = [
    {
        id: '1',
        category: {
            label: 'Pinned',
            color: '#34D399',
        },
        time: '2 hrs ago',
        title: 'System Maintenance Scheduled',
        subtitle:
            'We will be performing scheduled maintenance on our servers this coming...',
        author: {
            name: 'Admin Team',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        type: 'PINNED',
    },

    {
        id: '2',
        category: {
            label: 'New Feature',
            color: '#10B981',
        },
        time: 'Yesterday',
        title: 'Dark Mode is Here! 🌙',
        subtitle:
            'You asked, we listened. Experience the app in a whole new look...',
        icon: 'moon',
        type: 'FEATURE',
    },

    {
        id: '3',
        category: {
            label: 'Event',
            color: '#F59E0B',
        },
        time: 'Oct 24, 2023',
        title: 'Annual Community Meetup',
        subtitle:
            'Join us for a virtual gathering of minds! We have exciting speakers lined up...',
        button: {
            text: 'RSVP Now',
        },
        type: 'EVENT',
    },

    {
        id: '4',
        category: {
            label: 'Policy',
            color: '#9CA3AF',
        },
        time: 'Oct 20, 2023',
        title: 'Updated Privacy Policy',
        subtitle:
            "We've updated our privacy policy to be more transparent about how we handle your data...",
        footerLink: {
            text: 'Read Policy →',
        },
        type: 'POLICY',
    },
];

const AnnouncementListItem = ({ item }) => {
    return (
        <View
            style={[
                {
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginHorizontal: moderateScale(16),
                    marginTop: moderateScale(16),
                    padding: moderateScale(16),
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 5,
                    marginBottom: 10
                    // paddingBottom:10
                },
                item.type === 'PINNED' && {
                    borderLeftWidth: 5,
                    borderColor: '#519377',
                },
            ]}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                {/* Top row */}
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#EEFFF3',
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: 6,
                        },
                        item.type === 'System' && { backgroundColor: '#F0FDF4' },
                        item.type === 'event' && { backgroundColor: '#FFF7ED' },
                    ]}
                >
                    <Text
                        style={[
                            {
                                fontWeight: '700',
                                fontSize: moderateScale(12),
                                color: '#519377',
                            },
                            item.type === 'System' && { color: '#16A34A' },
                            item.type === 'event' && { color: '#EA580C' },
                        ]}
                    >
                        {item.type}
                    </Text>
                </View>
                <Text
                    style={{
                        fontWeight: '700',
                        fontSize: moderateScale(12),
                        color: '#9CA3AF',
                    }}
                >
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: moderateScale(8),
                }}
            >
                <View style={item.type === 'FEATURE' && { width: width * 0.6 }}>
                    <Text
                        style={{
                            fontWeight: '700',
                            fontSize: moderateScale(18),
                            color: '#000',
                        }}
                    >
                        {item.title}
                    </Text>
                    <Text
                        style={{
                            fontWeight: '400',
                            fontSize: moderateScale(14),
                            color: '#4B5563',
                            marginTop: moderateScale(8),
                        }}
                    >
                        {item.message}
                    </Text>
                </View>
            </View>
            <View style={{ marginTop: 15 }}>
                <Image source={{ uri: item.image }} style={{ width: width / 1.2, height: height / 3.5 }} />
            </View>
            {/* {item.type === 'EVENT' && (
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#F9FAFB',
                        marginTop: moderateScale(8),
                        borderRadius: 8,
                    }}
                >
                    <Text
                        style={{
                            fontWeight: '600',
                            fontSize: moderateScale(12),
                            color: '#374151',
                            marginVertical: moderateScale(8),
                        }}
                    >
                        RSVP Now
                    </Text>
                </View>
            )} */}
            {/* {item.type === 'POLICY' && (
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: moderateScale(8),
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Text
                        style={{
                            fontWeight: '600',
                            fontSize: moderateScale(12),
                            color: '#519377',
                            marginVertical: moderateScale(8),
                        }}
                    >
                        Read Policy
                    </Text>
                    <MaterialIcons
                        name="arrow-forward"
                        size={12}
                        color="#519377"
                        style={{ marginLeft: 4 }}
                    />
                </View>
            )} */}
        </View>
    );
};

const Announcement = () => {
    const [selectedAnnouncementFilter, setSelectedAnnouncementFilter] = useState('All');
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const navigation = useNavigation();
    const searchInputRef = useRef(null);


    useEffect(() => {
        console.log('print')
        dispatch(fetchAnnouncements())
    }, [dispatch])

    const { list, loading, page } = useSelector((state) => state.userAnnouncement);
    console.log(list, loading, page, 'data+++++++++++')

    const filteredAnnouncements = list.filter((item) => {
        if (selectedAnnouncementFilter === 'System') {
            return item.type === 'system';
        }

        if (selectedAnnouncementFilter === 'Announcements') {
            return item.type === 'event';
        }

        if (searchText.trim().length > 0) {
            const search = searchText.toLowerCase();
            const titleMatch = item?.title?.toLowerCase().includes(search);
            const messageMatch = item?.message?.toLowerCase().includes(search);
            const typeMatch = item?.type?.toLowerCase().includes(search);
            return titleMatch || messageMatch || typeMatch;
        }

        return true;
    });

    const EmptyState = ({ message }) => {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyText}>{message}</Text>
            </View>
        );
    };


    return (
        <SafeAreaView style={styles.container} edges={['top', '0']}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <Ionicons name="chevron-back" size={28} color="#519377" />
                    </TouchableOpacity>
                    {/* <Text style={styles.headerText}>Announcements</Text> */}
                </View>
                <Text style={styles.headerText}>Notifications</Text>
                <View style={{ width: '10%' }} />
            </View>
            {/* <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, backgroundColor: '#F9FAFB80' }}
            > */}

            <TouchableOpacity
                style={styles.searchContainer}
                onPress={() => searchInputRef.current?.focus()}  // ← tap anywhere to focus
                activeOpacity={1}
            >
                <Ionicons
                    name="search"
                    size={18}
                    color="#9CA3AF"
                    style={{ marginRight: 8 }}
                />
                <TextInput
                    ref={searchInputRef}  // ← add ref
                    style={styles.searchText}
                    placeholder="Search updates..."
                    placeholderTextColor="#9CA3AF"
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </TouchableOpacity>
            <View style={styles.announcementFilterCategoryContainer}>
                <FlatList
                    data={announcementFilterType}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.announcementFilterCategoryList}
                    renderItem={({ item }) => {
                        const isSelected = item === selectedAnnouncementFilter;
                        return (
                            <TouchableOpacity
                                onPress={() => setSelectedAnnouncementFilter(item)}
                                style={[
                                    styles.announcementFilterItem,
                                    isSelected
                                        ? styles.activeAnnouncementFilter
                                        : styles.inactiveAnnouncementFilter,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.announcementFilterText,
                                        isSelected
                                            ? styles.announcementFilterActiveText
                                            : styles.announcementFilterInactiveText,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* Announcement List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, backgroundColor: '#F9FAFB80' }}
            >
                {filteredAnnouncements.length === 0 ?
                    <EmptyState
                        message={
                            selectedAnnouncementFilter === 'System'
                                ? 'No system notifications available'
                                : selectedAnnouncementFilter === 'Event'
                                    ? 'No events available'
                                    : 'No announcements available'
                        }
                    />
                    : <FlatList
                        data={filteredAnnouncements}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                        renderItem={({ item }) => {
                            return <AnnouncementListItem item={item} />;
                        }}
                    />
                }
                {/* OFFER container */}

            </ScrollView>
        </SafeAreaView>
    );
};

export default Announcement;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        // backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(10),
        paddingBottom: moderateScale(15),
    },
    headerText: {
        fontSize: moderateScale(20),
        color: '#111827',
        marginStart: moderateScale(16),
        fontWeight: '700',
    },
    //search text
    searchText: {
        fontSize: moderateScale(14),
        color: '#9CA3AF',
        fontWeight: '400',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: moderateScale(12),
        paddingHorizontal: moderateScale(16),
        height: 40,
        marginHorizontal: moderateScale(16),
        marginTop: moderateScale(16),
    },

    // payment status category
    announcementFilterCategoryContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    announcementFilterCategoryList: {
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(8),
    },

    announcementFilterItem: {
        paddingVertical: moderateScale(8),
        paddingHorizontal: moderateScale(24),
        borderRadius: 30,
        marginRight: moderateScale(12),
    },

    activeAnnouncementFilter: {
        backgroundColor: '#519377',
        shadowColor: '#519377',
        shadowOpacity: 0.4,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },

    inactiveAnnouncementFilter: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E4E6EB',
    },

    announcementFilterText: {
        fontSize: moderateScale(12),
        fontWeight: '500',
    },

    announcementFilterActiveText: {
        color: '#FFF',
    },

    announcementFilterInactiveText: {
        color: '#3A3A3A',
    },

    iconCircle: {
        width: 24,
        height: 24,
        borderRadius: 100,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },

    //OFFER container
    offerContainer: {
        borderRadius: 16,
        marginHorizontal: moderateScale(16),
        marginTop: moderateScale(16),
        padding: moderateScale(16),
        marginBottom: moderateScale(24),
    },
    offerContainerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    promoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF33',
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(4),
        borderRadius: 6,
    },
    promoText: {
        fontWeight: '700',
        fontSize: moderateScale(12),
        color: '#FFFFFF',
    },
    dateText: {
        fontWeight: '700',
        fontSize: moderateScale(12),
        color: '#FFFFFF',
    },
    titleText: {
        fontWeight: '700',
        fontSize: moderateScale(18),
        color: '#fff',
        marginTop: moderateScale(8),
    },
    descriptionText: {
        fontWeight: '400',
        fontSize: moderateScale(14),
        color: '#fff',
        marginTop: moderateScale(8),
    },

    codeContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#F9FAFB',
        marginTop: moderateScale(8),
        borderRadius: 4,
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(4),
    },
    codeText: {
        fontWeight: '600',
        fontSize: moderateScale(12),
        color: '#519377',
    },
    emptyContainer: {
        marginTop: height * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },

    emptyText: {
        marginTop: 12,
        fontSize: moderateScale(16),
        color: '#9CA3AF',
        textAlign: 'center',
        fontWeight: '500',
    },

});
