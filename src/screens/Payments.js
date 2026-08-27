import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchResidentialPaymentsThunk,
  fetchResidentialPaymentsFromIdThunk,
  resetPaymentsState,
} from '../app/features/residentialPaymentsSlice';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

const PAGE_LIMIT = 10;

const PaymentHistoryScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const [isRejected, setIsRejected] = useState(false);
  const onEndReachedCalledDuringMomentum = useRef(true);

  const {
    data = [],
    loading,
    loadingMore,
    error,
    page = 1,
    totalPages = 1,
    hasMore = true,
  } = useSelector((state) => state.residentialpayment);

  const userId = route?.params?.userId;

  useFocusEffect(
    useCallback(() => {
      setIsRejected(route.params?.rejected === true);
    }, [route.params?.rejected])
  );

  // Initial load (page 1)
  useFocusEffect(
    useCallback(() => {
      dispatch(resetPaymentsState());

      if (userId) {
        dispatch(
          fetchResidentialPaymentsFromIdThunk({
            id: userId,
            userId,
            page: 1,
            limit: PAGE_LIMIT,
          })
        );
      } else {
        dispatch(
          fetchResidentialPaymentsThunk({
            type: 'all',
            page: 1,
            limit: PAGE_LIMIT,
          })
        );
      }
    }, [dispatch, userId])
  );

  const handleLoadMore = useCallback(() => {
    if (onEndReachedCalledDuringMomentum.current) return;
    if (loading || loadingMore) return;
    if (!hasMore) {
      console.log('No more data', { page, totalPages, hasMore });
      return;
    }

    onEndReachedCalledDuringMomentum.current = true;
    const nextPage = page + 1;
    console.log('➡️ Loading page', nextPage);

    if (userId) {
      dispatch(
        fetchResidentialPaymentsFromIdThunk({
          id: userId,
          userId,
          page: nextPage,
          limit: PAGE_LIMIT,
        })
      );
    } else {
      dispatch(
        fetchResidentialPaymentsThunk({
          type: 'all',
          page: nextPage,
          limit: PAGE_LIMIT,
        })
      );
    }
  }, [dispatch, loading, loadingMore, hasMore, page, totalPages, userId]);

  const filteredData = userId
    ? isRejected
      ? data.filter(
        (item) =>
          String(item?.residentialId) === String(userId) &&
          item?.status === 'rejected'
      )
      : data.filter((item) => String(item?.residentialId) === String(userId))
    : isRejected
      ? data.filter((item) => item?.status === 'rejected')
      : data;

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      case 'pending':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'verified':
        return '#E8F5E9';
      case 'rejected':
        return '#FFEBEE';
      case 'pending':
        return '#FFF3E0';
      default:
        return '#F5F5F5';
    }
  };

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

  const renderPaymentCard = ({ item }) => {
    const fromDate = formatDate(item?.paidFrom);
    const toDate = formatDate(item?.paidTo);
    return (
      <TouchableOpacity
        style={styles.paymentCard}
        onPress={() => navigation.navigate('PaymentDetails', { payment: item })}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          {item?.residentialPhoto == null ? (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={30} color="#519377" />
            </View>
          ) : (
            <Image
              source={{ uri: item.residentialPhoto }}
              style={styles.avatar}
              onError={(e) => console.log('Image error:', e.nativeEvent.error)}
            />
          )}

          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>{item?.residentialName}</Text>
            <Text style={styles.addressText}>{item?.residentialAddress}</Text>
            {(fromDate || toDate) && (
              <Text style={styles.paymentPeriod}>
                {fromDate}
                {fromDate && toDate ? ' - ' : ''}
                {toDate}
              </Text>
            )}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusBgColor(item.status) },
              ]}
            >
              <Text
                style={[styles.statusText, { color: getStatusColor(item.status) }]}
              >
                {item.status?.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {item?.paymentScreenshot ? (
          <Image
            source={{ uri: item.paymentScreenshot }}
            style={styles.paymentScreenshot}
            onError={(e) => console.log('Image error:', e.nativeEvent.error)}
          />
        ) : null}
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#519377" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>
          {isRejected ? 'No rejected payments found' : 'No payments found'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={28} color="#519377" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isRejected ? 'Rejected payments' : 'Payment History'}
            </Text>
            <View style={{ width: 50 }} />
          </View>
        </View>

        {/* List */}
        {loading && data.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item._id}
            renderItem={renderPaymentCard}
            contentContainerStyle={styles.listContent}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            navigation.navigate('UserSubmitPayment', { isAdmin: true })
          }
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  paymentPeriod: {
    fontSize: 12,
    color: '#519377',
    fontWeight: '500'
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#519377',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 6,
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentScreenshot: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
});

export default PaymentHistoryScreen;