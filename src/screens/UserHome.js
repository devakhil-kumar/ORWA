import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { fetchProfile } from '../app/features/getprofileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnnouncements } from '../app/features/announcementSliceUser';
import imagePath from '../contests/imagePath';
import LinearGradient from 'react-native-linear-gradient';

const UserHome = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onHandleProfile = () => {
    navigation.navigate('Profile')
  }

  const { user, loading } = useSelector((state) => state.profile);
  console.log(user, loading, 'loading++++++++++++++++++++++')

  useEffect(() => {
    dispatch(fetchProfile())
    dispatch(fetchAnnouncements())
    console.log("Date: ", list[0]?.createdAt);
  }, [dispatch])

  const handleGohistory = () => {
    navigation.navigate('UserHistoryPayments')
  }

  const handleContactUs = () => {
    navigation.navigate('ContactUs')
  }

  const handelAnnoucment = () => {
    navigation.navigate('UserAnnouncements')
  }

  const { list, listLoading, page } = useSelector((state) => state.userAnnouncement);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#519377" />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#F9FAFB80', padding: 16 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.profileSection} onPress={onHandleProfile}>
            {user?.profileImage ?
              <View style={styles.avatar}>
                <Image
                  source={user?.residentialId?.applicantPhoto}
                  style={styles.avatarImage}
                />
              </View> : <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()}</Text>
              </View>}
            <View>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Residence Card */}
        <LinearGradient
          colors={['#519377', '#AAE5CC']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.residenceCard}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.residenceLabel}>Member</Text>
              <Text style={styles.flatNumber}>Flat No {user?.flatNumber}</Text>
              <Text style={styles.societyName}>{user?.societyId?.societyName}</Text>
            </View>
            <View style={styles.qrButton}>
              <Image source={imagePath.building} style={{ width: 30, height: 30 }} />
            </View>
          </View>
        </LinearGradient>

        {/* Announcements Section */}
        {list.find(item => item.type === 'event') && (
          (() => {
            const eventItem = list.find(item => item.type === 'event');
            return (
              <View style={[styles.section,]}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Announcements</Text>
                  <TouchableOpacity onPress={handelAnnoucment}>
                    <Text style={styles.viewAllText}>View all</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.announcementCard}>
                  <View style={styles.announcementIcon}>
                    <Icon name="bullhorn" size={48} color="#FF6B35" />
                  </View>
                  <View style={styles.announcementContent}>
                    <View style={styles.announcementHeader}>
                      <Text style={styles.announcementTitle}>{eventItem?.title}</Text>

                      <View style={styles.announcementDateCard}>
                        <Text style={styles.announcementDate}>
                          {new Date(eventItem?.createdAt).toLocaleDateString("en-GB")}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.announcementText}>
                      {eventItem?.message}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })()
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.quickActionsGrid}>
            {/* Row 1 */}
            {/* <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <MaterialIcons name="payment" size={35} color="#2196F3" />
              </View>
              <Text style={styles.actionText}>Pay Dues</Text>
              <Text style={styles.actionSubText}>Pending:₹0</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.actionButton} onPress={handleContactUs}>
              <View style={[styles.actionIconContainer, { borderRadius: 100, backgroundColor: '#FFF1F2' }]}>
                <MaterialIcons name="headset-mic" size={35} color="#F44336" />
              </View>
              <Text style={styles.actionText}>Help Desk</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleGohistory}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#F3E5F5' }]}>
                <MaterialIcons name="update" size={40} color="#9C27B0" />
              </View>
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>

            {/* Row 2 */}
            {/* <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <FontAwesome name="users" size={30} color="#4CAF50" />
              </View>
              <Text style={styles.actionText}>Membership</Text>
              <Text style={styles.actionSubText}>Family & pets</Text>
            </TouchableOpacity> */}


          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  welcomeText: {
    fontSize: 12,
    fontWeight:600,
    color: '#787878',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1C',
    marginTop: 2,
  },
  residenceCard: {
    backgroundColor: '#519377',
    marginTop: 15,
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 15,
    elevation: 5
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  residenceLabel: {
    fontSize: 16,
    fontWeight:600,
    color: '#FBFBFB',
  },
  flatNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FBFBFB',
    marginBottom: 2,
  },
  societyName: {
    fontSize: 14,
    color: '#fff',
  },
  qrButton: {
    backgroundColor: '#84AA9A',
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  viewAllText: {
    fontSize: 14,
    color: '#72B196',
    fontWeight: '700'
  },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    elevation: 7
  },
  announcementIcon: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#FFE8E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    alignSelf: 'center'
  },
  announcementContent: {
    flex: 1,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  announcementDateCard: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#F3F4F6', borderRadius: 15 },
  announcementDate: {
    fontSize: 10,
    color: '#000',
  },
  announcementText: {
    fontSize: 14,
    color: '#565656',
    lineHeight: 18,
    fontWeight: '400'
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 5
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  actionSubText: {
    fontSize: 14,
    color: '#0000',
  },
  billCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    elevation: 5
  },
  billLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  billDate: {
    fontSize: 12,
    color: '#999',
  },
  billAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});

export default UserHome;