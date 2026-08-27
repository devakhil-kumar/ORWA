import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AdminHome from '../../Admin/screens/adminHome/AdminHome.js';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import ProfileScreen from '../../screens/Profile/ProfileScreen.js';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import UserList from '../../Admin/screens/memberList/UserList.js'
import Payments from '../../screens/Payments.js';
import Ionicons from '@react-native-vector-icons/ionicons';
import AddMemeber from '../../Admin/components/AddMember.js';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import Lucide from '@react-native-vector-icons/lucide'
import SocietyInfoScreen from '../../screens/Profile/SocietyInfoScreen.js';
import ResdentsList from '../../screens/Profile/ResidentsList.js';
import ContactUs from '../../screens/Profile/ContactUs.js';
import Notification from '../../screens/Profile/Notification.js';
import Announcements from '../../Admin/screens/adminHome/Announcements.js'
import MembersDetailsScreens from '../../Admin/screens/memberList/MembersDetailsScreen.js'
import PaymentHistoryScreen from '../../screens/Payments.js';
import PaymentDetails from '../../screens/PaymentsDetails.js';
import AddUpdates from '../../Admin/screens/adminHome/AddUpdates.js';
import ResidentsList from '../../screens/Profile/ResidentsList.js';
import TerminationRequest from '../../screens/Profile/TerminationRequest.js'
import imagePath from '../../contests/imagePath.jsx';
import UserSubmitPayment from '../../screens/UserSubmitPayments.js';
import ComplaintsList from '../../screens/Profile/ComplaintsList.js';
import ComplaintDetail from '../../screens/Profile/ComplaintDetail.js';
import ChangePassword from '../../screens/Profile/ChangePassword.js';

const { width, height } = Dimensions.get('window');

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const Users = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="UserList">
            <Stack.Screen name="UserList" component={UserList} />
            <Stack.Screen name="MembersDetailsScreens" component={MembersDetailsScreens} />
        </Stack.Navigator>
    );
};

export const AdminNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='AdminHome'>
            <Stack.Screen name='AdminHome' component={AdminHome} />
            <Stack.Screen name='Announcements' component={Announcements} />
            <Stack.Screen name='AddMember' component={AddMemeber} />
            <Stack.Screen name='AddUpdates' component={AddUpdates} />
            <Stack.Screen name="ResidentsList" component={ResidentsList} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
            <Stack.Screen name="PaymentDetails" component={PaymentDetails} />
            <Stack.Screen name="UserSubmitPayment" component={UserSubmitPayment} />

        </Stack.Navigator>
    )
}

export const ProfileNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Profile'>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="SocietyInfoScreen" component={SocietyInfoScreen} />
            <Stack.Screen name='AddMember' component={AddMemeber} />
            <Stack.Screen name='ResdentsList' component={ResdentsList} />
            <Stack.Screen name='ContactUs' component={ContactUs} />
            <Stack.Screen name='Notification' component={Notification} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
            <Stack.Screen name="PaymentDetails" component={PaymentDetails} />
            <Stack.Screen name='TerminationRequest' component={TerminationRequest} />
            <Stack.Screen name='ComplaintsList' component={ComplaintsList} />
            <Stack.Screen name='ComplaintDetail' component={ComplaintDetail} />
            <Stack.Screen name='ChangePassword' component={ChangePassword} />
            <Stack.Screen name="UserSubmitPayment" component={UserSubmitPayment} />

        </Stack.Navigator>
    )
}

export const PaymentNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='PaymentHistory'>
            <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
            <Stack.Screen name="PaymentDetails" component={PaymentDetails} />
            <Stack.Screen name="UserSubmitPayment" component={UserSubmitPayment} />
        </Stack.Navigator>
    )
}

export const AnnouncementNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Announcements'>
            <Stack.Screen name='Announcements' component={Announcements} />
            <Stack.Screen name='AddUpdates' component={AddUpdates} />
        </Stack.Navigator>
    )
}

const AdminBottomTabs = () => {
    const insets = useSafeAreaInsets();
    const bottomInset = Platform.OS === 'android' ? insets.bottom : 10;
    const defaultTabBarStyle = {

        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 3,
        elevation: 10,
        backgroundColor: '#fff',
        borderTopWidth: 0,
        height: 70 + bottomInset,
        paddingBottom: bottomInset,
        paddingTop: 8,
        overflow: "hidden",
    };

    return (
        <Tab.Navigator
            initialRouteName="AdminHome"
            screenOptions={{
                headerShown: false,
                tabBarStyle: defaultTabBarStyle,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    color: '#fff',
                },
            }}
        >
            <Tab.Screen
                name="AdminHome"
                component={AdminNavigator}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <Feather name='home' color={focused ? '#519377' : '#000'} size={28} />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{ color: focused ? '#519377' : '#000', fontSize: 12 }}>Home</Text>
                    ),
                    tabBarStyle: (() => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profile';
                        if (routeName === 'Announcements' || routeName === 'AddMember' || routeName === 'AddUpdates' || routeName === 'ResidentsList' || routeName === 'PaymentHistory' || routeName === 'PaymentDetails' || routeName === 'UserSubmitPayment') {
                            return { display: 'none' };
                        }
                        return defaultTabBarStyle;
                    })(),
                })}
            />
            <Tab.Screen
                name="Users"
                component={Users}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name='person-outline' size={28} color={focused ? '#519377' : '#000'} />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{ color: focused ? '#519377' : '#000', fontSize: 12 }}>Requests</Text>
                    ),
                    tabBarStyle: (() => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'User';
                        if (routeName === 'MembersDetailsScreens') {
                            return { display: 'none' };
                        }
                        return defaultTabBarStyle;
                    })(),
                })}
            />
            <Tab.Screen
                name="Payments"
                component={PaymentNavigator}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Payments', {
                            screen: 'PaymentHistory',
                            params: { rejected: false }
                        });
                    },
                })}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name='wallet-outline' size={28} color={focused ? '#519377' : '#000'} />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{ color: focused ? '#519377' : '#000', fontSize: 12 }}>Payments</Text>
                    ),
                    tabBarStyle: (() => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'User';
                        if (routeName === 'PaymentDetails' || routeName === "UserSubmitPayment") {
                            return { display: 'none' };
                        }
                        return defaultTabBarStyle;
                    })(),
                })}
            />
            <Tab.Screen
                name="Updates"
                component={AnnouncementNavigator}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name='reload' size={28} color={focused ? '#519377' : '#000'} />
                        // <Image source={focused ? imagePath.Updates : imagePath.InActiveUpdates} style={{
                        //     width: 28
                        //     , height: 20
                        // }} />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text numberOfLines={1} style={{ color: focused ? '#519377' : '#000', fontSize: 12 }}>Announcements</Text>
                    ),
                    tabBarStyle: (() => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'AnnouncementNavigator'
                        if (routeName === 'AddUpdates') {
                            return { display: 'none' };
                        }
                        return defaultTabBarStyle;
                    })(),
                })}
            />


            <Tab.Screen
                name="Profile"
                component={ProfileNavigator}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (

                        <Ionicons name='person-circle-outline' size={28} color={focused ? '#519377' : '#000'} />
                        // <Image source={focused ? imagePath.Profile : imagePath.InactiveProfile} style={{ width: width / 14, height: height / 34 }} />

                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{ color: focused ? '#519377' : '#000', fontSize: 12 }}>Profile</Text>
                    ),
                    tabBarStyle: (() => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profile';
                        if (routeName === 'SocietyInfoScreen' || routeName === 'ResdentsList' || routeName === 'UserSubmitPayment' || routeName === 'ContactUs' || routeName === 'Notification' || routeName === 'AddMember'
                            || routeName === 'TerminationRequest' || routeName === 'ComplaintsList' || routeName === 'ComplaintDetail' || routeName === 'ChangePassword'
                        ) {
                            return { display: 'none' };
                        }
                        return defaultTabBarStyle;
                    })(),
                })}
            />
        </Tab.Navigator>
    );
};

export default AdminBottomTabs;
