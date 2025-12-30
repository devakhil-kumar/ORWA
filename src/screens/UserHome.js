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
import imagePath from '../contests/imagePath';

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
                <Text style={styles.avatarText}>S</Text>
              </View>}
            <View>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Residence Card */}
        <View style={styles.residenceCard}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.residenceLabel}>Residence</Text>
              <Text style={styles.flatNumber}>Flat No {user?.flatNumber}</Text>
              {/* <Text style={styles.societyName}>Society Name</Text> */}
            </View>
            <TouchableOpacity style={styles.qrButton}>
              <Image source={imagePath.building} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Announcements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Announcements</Text>
            <TouchableOpacity onPress={handelAnnoucment}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.announcementCard}>
            <View style={styles.announcementIcon}>
              <Icon name="bullhorn" size={45} color="#FF6B35" />
            </View>
            <View style={styles.announcementContent}>
              <View style={styles.announcementHeader}>
                <Text style={styles.announcementTitle}>Annual Maintenance</Text>
                <Text style={styles.announcementDate}>Today</Text>
              </View>
              <Text style={styles.announcementText}>
                Scheduled elevator maintenance will occur on Tuesday from 10 A...
              </Text>
            </View>
          </View>
        </View>

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

            <TouchableOpacity style={styles.actionButton} onPress={handleGohistory}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#F3E5F5' }]}>
                <MaterialIcons name="update" size={40} color="#9C27B0" />
              </View>
              <Text style={styles.actionText}>History</Text>
              <Text style={styles.actionSubText}>View Past Bills</Text>
            </TouchableOpacity>

            {/* Row 2 */}
            {/* <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <FontAwesome name="users" size={30} color="#4CAF50" />
              </View>
              <Text style={styles.actionText}>Membership</Text>
              <Text style={styles.actionSubText}>Family & pets</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.actionButton} onPress={handleContactUs}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#FFEBEE' }]}>
                <MaterialIcons name="headset-mic" size={35} color="#F44336" />
              </View>
              <Text style={styles.actionText}>Help Desk</Text>
              <Text style={styles.actionSubText}>Raise Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5F5F5',
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
    color: '#999',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
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
    fontSize: 14,
    color: '#fff',
  },
  flatNumber: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
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
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 12,
    color: '#F0B90B',
    fontWeight: '600'
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
    width: 50,
    height: 50,
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
    fontWeight: '600',
    color: '#000000',
  },
  announcementDate: {
    fontSize: 10,
    color: '#999',
  },
  announcementText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    fontWeight: '500'
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
    fontWeight: '600',
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