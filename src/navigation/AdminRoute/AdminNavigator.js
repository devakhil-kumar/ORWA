import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import AdminBottomTabs from './BottomBar';
import { useNavigation } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import AddMemeber from '../../Admin/components/AddMember';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


const CustomDrawerContent = (props) => {
  //   const dispatch = useDispatch();
  //   const [user, setUser] = useState(null);

  //   useEffect(() => {
  //     const loadUser = async () => {
  //       const stored = await getUserData('user');
  //       console.log(stored, 'stroed++++++++++++')
  //       if (stored?.user) {
  //         setUser(stored?.user);
  //       }
  //     };
  //     loadUser();
  //   }, []);

  //   const handleLogout = async () => {
  //     dispatch(logout());
  //   };

  return (
    <SafeAreaView style={styles.drawerWrapper} edges={['top']} >
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
        <View style={styles.menuSection}>
          {props.state.routes
            .filter(route => route.name !== 'AddMemeber')
            .map((route, index) => {
              const { drawerIcon, drawerLabel } =
                props.descriptors[route.key].options;
              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={() => props.navigation.navigate(route.name)}
                  style={styles.menuItem}
                >
                  <View style={styles.iconLeft}>
                    {drawerIcon && drawerIcon({ focused: false })}
                  </View>
                  <Text style={styles.menuLabel}>
                    {drawerLabel || route.name}
                  </Text>
                  <Feather name={'chevron-right'} size={20} color='#0000' />
                </TouchableOpacity>
              );
            })}
        </View>
      </DrawerContentScrollView>

      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          //   onPress={handleLogout}
          activeOpacity={0.7}
        >
          {/* <Image
            source={ImagePath.logout}
            style={styles.logoutIcon}
          /> */}
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const AdminDrawer = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 10;
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        // header: ({ navigation }) => <CustomHeader navigation={navigation} />,
        drawerActiveTintColor: '#FAB713',
        drawerInactiveTintColor: '#ccc',
        drawerLabelStyle: { fontSize: 15 },
        drawerStyle: {

          paddingBottom: bottomInset,
          paddingTop: 20,
        }
      }}
    >
      <Drawer.Screen
        name="DashBorad"
        component={AdminBottomTabs}
        options={{
          drawerIcon: ({ focused }) => (
            <Feather name='home' color={focused ? '#519377' : '#9CA3AF'} size={28} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="AddMemeber"
        component={AddMemeber}
        options={{
          drawerIcon: ({ focused }) => (
            <MaterialDesignIcons name='home' color={focused ? '#9CA3AF' : '#F0B90B'} size={28}/>
          ),
        }}
      /> */}

      {/* <Drawer.Screen
        name="Profile Settings"
        component={ProfileNavigator}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.profileActive : ImagePath.profileInActive}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      /> */}
      {/* <Drawer.Screen
        name="Event"
        component={Event}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Delete"
        component={Delete}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="notification"
        component={Notification}
        options={{
          headerShown: true,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Activities"
        component={Activities}
        options={{
          headerShown: true,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Contact Us"
        component={ContactUs}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Privacy Policy"
        component={PrivacyPolicy}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Terms & Conditions"
        component={TermsConditions}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};

const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerWrapper: {
    flex: 1,
  },
  drawerContainer: {
    flexGrow: 1,
    paddingTop: 0,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: '#6B7280',
  },
  menuSection: {
    flex: 1,
    paddingTop: 8,
  },
  logoutSection: {
    // borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 40
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 12,
    // tintColor: '#EF4444',
  },
  logoutText: {
    fontSize: 15,
    // color: '#EF4444',
    fontWeight: '500',
  },
  menuWrapper: {
    paddingTop: 10,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  iconLeft: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  menuLabel: {
    fontSize: 15,
    color: "#111",
    flex: 1,
  },
});

export default AdminNavigator;