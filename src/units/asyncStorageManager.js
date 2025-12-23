import AsyncStorage from '@react-native-async-storage/async-storage';


export const saveUserData = async (userData) => {
  try {
    if (userData?.data) {
      await AsyncStorage.setItem('user', JSON.stringify(userData?.data));
      await AsyncStorage.setItem('userRole', JSON.stringify(userData?.data?.role));
      if (userData?.data?.token) {
        await AsyncStorage.setItem('token', JSON.stringify(userData?.data?.token));
      }
    }
  } catch (error) {
    console.log('Error saving user data:', error);
  }
};

export const saveProfileData = async (user) => {
  try {
    if (user) {
      await AsyncStorage.setItem('userProfile', JSON.stringify(user));
    }
  } catch (error) {
    console.log('Error saving user data:', error);
  }
}

export const getUserData = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    const userRole = await AsyncStorage.getItem('userRole');
    const token = await AsyncStorage.getItem('token');
    return {
      user: user ? JSON.parse(user) : null,
      userRole: userRole ? JSON.parse(userRole) : null,
      token: token ? JSON.parse(token) : null,
    };
  } catch (error) {
    console.log('Error getting user data:', error);
    return null;
  }
};

// export const getProfileData = async () => {
//   try {
//     const UserProfile = await AsyncStorage.getItem('userProfile')
//     return {
//       UserProfile: UserProfile ? JSON.parse(UserProfile) : null
//     }
//   } catch (error) {
//     console.log('Error getting user data:', error);
//     return null;
//   }
// }


export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('token');
    // await AsyncStorage.removeItem('userProfile')
  } catch (error) {
    console.log('Error clearing user data:', error);
  }
};
