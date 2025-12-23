import { useEffect, useState } from 'react';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import AdminNavigator from './AdminRoute/AdminNavigator';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadInitialState } from '../app/features/authSlice';

const RootNavigator = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, mainloading, userRole, token } = useSelector((state) => state.auth);
    
    useEffect(() => {
        dispatch(loadInitialState());
    }, [dispatch]);

    if (mainloading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#519377" />
            </View>
        );
    }

    console.log(token, 'token++++++++')

    if (isLoggedIn && token) {
        if (userRole === "residential") {
            return <MainNavigator />
        } else if (userRole === "admin") {
            return <AdminNavigator />
        }
    }
    return <AuthNavigator />
};

export default RootNavigator;


const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});
