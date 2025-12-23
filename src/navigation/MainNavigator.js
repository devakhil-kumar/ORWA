// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import UserHome from '../screens/UserHome';
// import ProfileScreen from '../screens/Profile/ProfileScreen';

// const Stack = createNativeStackNavigator();

// const MainNavigator = () => {
//     return (
//         <Stack.Navigator initialRouteName="UserHome">
//             <Stack.Screen
//                 name="UserHome"
//                 component={UserHome}
//                 options={{
//                     headerShown: false,
//                     animationDuration: 150,
//                 }}
//             />
//               <Stack.Screen
//                 name="Profile"
//                 component={ProfileScreen}
//                 options={{
//                     headerShown: false,
//                     animationDuration: 150,
//                 }}
//             />
//         </Stack.Navigator>
//     );
// };

// export default MainNavigator;


import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import Lucide from '@react-native-vector-icons/lucide'
import UserHome from '../screens/UserHome.js';
import UserAnnouncements from '../screens/UserAnnoucements.js';
import UserSubmitPayment from '../screens/UserSubmitPayments.js';
import UserHistoryPayments from '../screens/UserHistoryPayments.js';
import UserProfile from '../screens/UserProfile.js';
import imagePath from '../contests/imagePath.jsx';
const { width, height } = Dimensions.get('window');




const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


export const UserHomeDashboard = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='UserHome'>
            <Stack.Screen name='UserHome' component={UserHome} />
            <Stack.Screen name='UserAnnouncements' component={UserAnnouncements} />
        </Stack.Navigator>
    )
}


export const PaymentNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='UserSubmitPayment'>
             <Stack.Screen name="UserSubmitPayment" component={UserSubmitPayment} />
             <Stack.Screen name="UserHistoryPayments" component={UserHistoryPayments} />
        </Stack.Navigator>
    )
}

const UserBottomTabs = () => {
    const insets = useSafeAreaInsets();
    const bottomInset = Platform.OS === 'android' ? insets.bottom : 10;
    const defaultTabBarStyle = {
        borderTopWidth: 0,
        height: 65 + bottomInset,
        paddingBottom: bottomInset,
        paddingTop: 8,

    }

    return (
        <Tab.Navigator
            initialRouteName="UserHome"
            screenOptions={{
                headerShown: false,
                tabBarStyle:defaultTabBarStyle,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    color: '#fff',
                },

            }}
        >
            <Tab.Screen
                name="UserHome"
                component={UserHomeDashboard}
                options={({ route }) => ({
                    tabBarIcon: ({focused}) => (
                        <Feather name='home' color={focused ? '#519377' : '#000'} size={28} />
                    ),
                      tabBarLabel: ({ focused }) => (
                        <Text style={{ color: focused ? '#519377' : '#000', fontSize: 12 }}>Dashboard</Text>
                    ),
                    tabBarStyle: (() => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profile';
                        if (routeName === 'UserAnnouncements') {
                            return { display: 'none' };
                        }
                        return defaultTabBarStyle;
                    })(),
                })}
            />
            <Tab.Screen
                name="UserAnnouncements"
                component={UserAnnouncements}
                options={({ route }) => ({
                    tabBarIcon: ({focused}) => (
                        <Image source={focused ? imagePath.Updates : imagePath.InActiveUpdates} style={{width:width/15, height:height/36}} />
                    ),
                      tabBarLabel: ({ focused }) => (
                        <Text style={{ color: focused ? '#519377' : '#000', fontSize: 12 }}>Updates</Text>
                    ),
                    tabBarStyle: (() => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'User';    
                        if (routeName === '') {
                            return { display: 'none' };
                        }
                        return defaultTabBarStyle;
                    })(),
                })}
            />
            <Tab.Screen
                name="Payments"
                component={PaymentNavigator}
                options={({ route }) => ({
                    tabBarIcon: ({focused}) => (
                       <Ionicons name='wallet' size={24} color={focused ? '#519377' : '#000'} />
                    ),
                      tabBarLabel: ({ focused }) => (
                        <Text style={{ color: focused ? '#519377' : '#000', fontSize: 12 }}>Payments</Text>
                    ),
                    tabBarStyle: (() => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'User';    
                        if (routeName === 'UserHistoryPayments') {
                            return { display: 'none' };
                        }
                        return defaultTabBarStyle;
                    })(),
                })}
            />
            <Tab.Screen
                name="Profile"
                component={UserProfile}
                options={({ route }) => ({
                    tabBarIcon: ({focused}) => (
                        <Image source={focused ? imagePath.Profile : imagePath.InactiveProfile} style={{width:width/14, height:height/34}}/>
                    ),
                      tabBarLabel: ({ focused }) => (
                        <Text style={{ color: focused ? '#519377' : '#000', fontSize: 12 }}>Profile</Text>
                    ),
                    tabBarStyle: (() => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profile';
                        if (routeName === '') {
                            return { display: 'none' };
                        }
                        return defaultTabBarStyle;
                    })(),
                })}
            />
        </Tab.Navigator>
    );
};

export default UserBottomTabs;
