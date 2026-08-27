import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPaymentHistory,
  resetPaymentHistoryState,
} from '../app/features/paymentHistorySlice';
import { useNavigation } from '@react-navigation/native';

const PAGE_LIMIT = 20;

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const SectionItem = ({ item }) => {
  const navigation = useNavigation();

  const handleNavigation = () => {
    navigation.navigate('UserHistoryPaymentsDetails', item);
  };

  const fromDate = formatDate(item?.paidFrom);
  const toDate = formatDate(item?.paidTo);

  const name =
    item?.residentialId?.name || item?.residentialName || 'Resident';
  const address =
    item?.residentialId?.address || item?.residentialAddress || '';
  const photo =
    item?.residentialId?.applicantPhoto || item?.residentialPhoto || null;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={handleNavigation}
    >
      <View style={styles.cardLeft}>
        {photo ? (
          <View style={styles.avatar}>
            <Image source={{ uri: photo }} style={styles.avatarImage} />
          </View>
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={30} color="#519377" />
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.residentName}>{name}</Text>
          {!!address && (
            <Text style={styles.residentAddress}>{address}</Text>
          )}
          {(fromDate || toDate) && (
            <Text style={styles.paymentPeriod}>
              {fromDate}
              {fromDate && toDate ? ' - ' : ''}
              {toDate}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.receiptIconContainer}>
        {item?.paymentScreenshot ? (
          <Image
            source={{ uri: item.paymentScreenshot }}
            style={styles.receiptIcon}
            resizeMode="contain"
            onError={(e) =>
              console.log('Image error:', e.nativeEvent.error)
            }
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const PaymentHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const onEndReachedCalledDuringMomentum = useRef(true);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    data = [],
    loading,
    error,
    page = 1,
    totalPages = 1,
  } = useSelector((state) => state.paymentHistory);

  // Initial load – page 1 only
  useEffect(() => {
    dispatch(resetPaymentHistoryState());
    dispatch(fetchPaymentHistory({ page: 1, limit: PAGE_LIMIT }));
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (onEndReachedCalledDuringMomentum.current) return;
    if (loading || isFetchingMore) return;
    if (!totalPages || page >= totalPages) return;

    onEndReachedCalledDuringMomentum.current = true;
    setIsFetchingMore(true);

    dispatch(fetchPaymentHistory({ page: page + 1, limit: PAGE_LIMIT })).finally(
      () => setIsFetchingMore(false)
    );
  }, [dispatch, loading, isFetchingMore, page, totalPages]);

  const filteredData = data.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.status?.toLowerCase() === selectedFilter;
  });

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'verified', label: 'Paid' },
    { key: 'rejected', label: 'Failed' },
  ];

  const handleGoback = () => navigation.goBack();

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#519377" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoback}>
          <Ionicons name="chevron-back" size={28} color="#519377" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Payment History</Text>
        <View style={{ width: 28 }} />
      </View>

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
                style={[
                  styles.filterText,
                  selectedFilter === filter.key && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </Text>
              {filter.key !== 'all' && (
                <Text
                  style={[
                    styles.countText,
                    selectedFilter === filter.key && styles.activeCountText,
                  ]}
                >
                  (
                  {
                    data.filter(
                      (i) => i.status?.toLowerCase() === filter.key
                    ).length
                  }
                  )
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {loading && data.length === 0 ? (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#519377" />
          </View>
        ) : error ? (
          <Text style={styles.emptyText}>
            {typeof error === 'string' ? error : error?.message || 'Error'}
          </Text>
        ) : filteredData.length === 0 ? (
          <Text style={styles.emptyText}>No payments found</Text>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <SectionItem item={item} />}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            ListFooterComponent={renderFooter}
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
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: moderateScale(20),
    color: '#111827',
    fontWeight: '700',
  },
  loaderOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footerLoader: {
    paddingVertical: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
  paymentPeriod: {
    fontSize: moderateScale(13),
    color: '#519377',
    fontWeight: '500',
    marginTop: moderateScale(4),
  },
});