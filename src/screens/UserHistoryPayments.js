import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
  SectionList,
  ActivityIndicator,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import Feather from '@react-native-vector-icons/feather';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentHistory } from '../app/features/paymentHistorySlice';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

const months = ['Oct 2025', 'Nov 2025', 'Dec 2025'];
const paymentStatus = ['All', 'Paid', 'Pending', 'Failed'];
const DATA = [
  {
    title: 'Today',
    data: [
      {
        name: 'Maintenance Bill',
        month: 'Oct 2025',
        amount: '₹1150.00',
        status: 'Pending',
        statusColor: '#FF9900',
      },
      {
        name: 'Bill',
        month: 'Oct 2025',
        amount: '₹1150.00',
        status: 'Failed',
        statusColor: '#FF3B30',
      },
    ],
  },
];

const SectionItem = (item) => {
  const navigation = useNavigation();
  const handleNavigation = () => {
    console.log(item, 'item from user payment history page')
    navigation.navigate('UserHistoryPaymentsDetails', item.item)
  }
  return (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      activeOpacity={0.7}
      onPress={handleNavigation}
    >
      <View style={styles.cardLeft}>
        {item?.residentialId?.applicantPhoto ? (
          <View style={styles.avatar}>
            <Image
              source={item?.residentialId?.applicantPhoto}
              style={styles.avatarImage}
            />
          </View>
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={30} color="#519377" />
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.residentName}>{item?.item?.residentialId.name}</Text>
          <Text style={styles.residentAddress}>{item?.item?.residentialId.address}</Text>
        </View>
      </View>
      <View style={styles.receiptIconContainer}>
        <Image
          source={{ uri:item?.item?.paymentScreenshot }}
          onError={(e) => console.log('Image error:', e.nativeEvent.error)}  // ✅ debug
          onLoad={() => console.log('Image loaded!')}
          style={styles.receiptIcon}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
};


const PaymentHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState('Oct 2025');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigation = useNavigation();


  const dispatch = useDispatch();
  const {
    data,
    loading,
    error,
    page,
    totalPages,
    total,
  } = useSelector((state) => state.paymentHistory);

  useEffect(() => {
    dispatch(fetchPaymentHistory({ year: new Date().getFullYear() , page: 1, limit: 50 }));
  }, [dispatch]);

  const filteredData = data.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.status.toLowerCase() === selectedFilter;
  });

  console.log(filteredData, 'cilbfdsvf')

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'verified', label: 'paid' },
    { key: 'rejected', label: 'failed' },
  ];

  if (loading) {
    return <View style={styles.loaderOverlay}>
      <ActivityIndicator size="large" color="#519377" />
    </View>
  }

  const handleGoback = () => {
    navigation.goBack();
  }

  console.log(data, 'data')


  return (
    <SafeAreaView style={styles.container} edges={['top', '0']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoback}>
          <Ionicons name="chevron-back" size={28} color="#519377" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Payment History</Text>
        <View style={{ width: '20%' }} />
      </View>
      {/* </ScrollView> */}
      <View style={styles.container}>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                selectedFilter === filter.key && styles.activeFilterTab,
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text
                style=
                {[styles.filterText,
                selectedFilter === filter.key && styles.activeFilterText,]}

              >
                {filter.label}
              </Text>
              {filter.key !== 'all' && (
                <Text style={[styles.countText,
                selectedFilter === filter.key && styles.activeCountText,]}>
                  ({data.filter((i) => i.status.toLowerCase() === filter.key).length})
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : filteredData.length === 0 ? (
          <Text style={styles.emptyText}>No payments found</Text>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <SectionItem item={item} />}
            contentContainerStyle={{ padding: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#F9FAFB',

    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(15),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(15),
    justifyContent: "space-between"
  },
  headerText: {
    fontSize: moderateScale(20),
    color: '#111827',
    marginStart: moderateScale(16),
    fontWeight: '700',
  },
  // month List category
  monthCategoryContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  monthCategoryList: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
  },

  monthItem: {
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    borderRadius: 30,
    marginRight: moderateScale(12),
  },

  activeMonth: {
    backgroundColor: '#A9A9A9',
    shadowColor: '#7C8CF3',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  inactiveMonth: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E4E6EB',
  },

  monthText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },

  activeText: {
    color: '#FFF',
  },

  inactiveText: {
    color: '#3A3A3A',
  },
  totalSpentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
  },
  totalSpentText: {
    fontSize: moderateScale(16),
    color: '#000000',
    fontWeight: '500',
  },
  totalSpentRupeeText: {
    fontSize: moderateScale(36),
    color: '#000000',
    fontWeight: '500',
  },
  label: {
    fontSize: moderateScale(16),
    color: '#fff',
    marginStart: moderateScale(8),
    fontWeight: '500',
  },
  exportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#519377',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
  },

  // payment status category
  paymentStatusCategoryContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  paymentStatusCategoryList: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
  },

  paymentStatusItem: {
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(24),
    borderRadius: 30,
    marginRight: moderateScale(12),
  },

  activePaymentStatus: {
    backgroundColor: '#519377',
    shadowColor: '#519377',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  inactivePaymentStatus: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E4E6EB',
  },

  paymentStatusText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },

  paymentStatusActiveText: {
    color: '#FFF',
  },

  paymentStatusInactiveText: {
    color: '#3A3A3A',
  },
  sectionHeader: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    marginTop: moderateScale(16),
    marginBottom: moderateScale(8),
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
  },

  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 100,
    backgroundColor: '#E8F9EE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#000',
  },

  month: {
    fontSize: moderateScale(14),
    color: '#666',
    marginTop: moderateScale(4),
  },

  amount: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#000',
  },
  loaderOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  residentName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#000',
    marginBottom: moderateScale(4),
  },
  residentAddress: {
    fontSize: moderateScale(14),
    color: '#666',
    fontWeight: '400',
  },
  receiptIconContainer: {
    marginLeft: moderateScale(10),
  },
  receiptIcon: {
    width: moderateScale(40),
    height: moderateScale(50),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {

    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    marginLeft: moderateScale(14),
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: moderateScale(35),
    height: moderateScale(35),
    borderRadius: moderateScale(45),
    backgroundColor: '#FFD54F',
    overflow: 'hidden',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',

    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterTab: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#519377',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterText: {
    color: '#FFF',
  },
  countText: {
    color: '#000',
    marginLeft: 6,
    fontSize: 12,
  },
  activeCountText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 12,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});
