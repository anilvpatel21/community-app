import React, { useReducer, useMemo, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import dataService, { apiEndPoints } from '../Services/NetworkServices';
import { version } from '../../package.json';

const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    forceUpdate: false
}

const AuthContext = React.createContext();

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...prevState,
                userToken: action.token,
                isLoading: false,
                isSignout: false
            };
        case 'SIGN_IN':
            return {
                ...prevState,
                isSignout: false,
                userToken: action.token,
            };
        case 'SIGN_OUT':
            return {
                ...prevState,
                isSignout: true,
                userToken: null,
            };
        case 'UPDATE_PROFILE':
            return {
                ...prevState,
                userToken: action.token
            }
        case 'FORCE_UPDATE':
            return {
                ...prevState,
                forceUpdate: action.data
            }
    }
}



function AuthProvider(props) {

    const [state, dispatch] = React.useReducer(reducer, initialState);

    // Handle user state changes //Check after sign out ... users getting notification
    // const onAuthStateChanged = async (firebaseAuth) => {
    //     try {
    //         if (firebaseAuth) {
    //             if (firebaseAuth.user) {

    //             }
    //         } else {
    //             await auth().signOut();
    //         }
    //     } catch (e) {
    //     }
    // }
    React.useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken;
            try {
                userToken = await AsyncStorage.getItem('userToken');
                if(userToken) {
                    userToken = JSON.parse(userToken);
                }
            } catch (e) {
                // Restoring token failed
            }


            // After restoring token, we may need to validate it in production apps
            //Todo -- we may also do a check after 30days
            //const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
            //return subscriber; // unsubscribe on unmount

            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };
        bootstrapAsync();
    }, []);

    const authContext = React.useMemo(
        () => ({
            signIn: async (authenticationData, phoneNumber, name) => {
                // In a production app, we need to send some data (usually username, password) to server and get a token
                // We will also need to handle errors if sign in failed
                // After getting token, we need to persist the token using `AsyncStorage`
                // In the example, we'll use a dummy token
                //If new user

                if (authenticationData.additionalUserInfo && authenticationData.additionalUserInfo.isNewUser) {
                    dataService.post(apiEndPoints.members, {}, {
                        data: {
                            phone: phoneNumber,
                            name: name,
                            appVersion: version,
                            isAdmin: false,
                            uid: authenticationData.user.uid
                        }
                    }).then(async (res) => {
                        if (res.internetStatus && res.data) {
                            let userInfo = res.data;
                            await AsyncStorage.setItem('userToken', JSON.stringify(userInfo));
                            dispatch({ type: 'SIGN_IN', token: userInfo });
                        }
                    }).catch(() => {
                        dataService.bottomLongToastMessage("OTP Verfied Successfully, But an error occur in the fetching user details, please update an application or report it.");
                    })
                } else if (authenticationData.user) {
                    dataService.get(apiEndPoints.members, {}, {
                        params: {
                            "phone": phoneNumber
                        }
                    }).then(async (res) => {
                        if (res.internetStatus && res.data) {
                            try {
                                let userInfo = res.data[0];
                                await AsyncStorage.setItem('userToken', JSON.stringify(userInfo));
                                dataService.bottomToastMessage('Welcome Back');
                                dispatch({ type: 'SIGN_IN', token: userInfo });
                            } catch (e) {
                                return Promise.reject();
                            }
                        }
                    }).catch(() => {
                        dataService.bottomLongToastMessage("OTP Verfied Successfully, But an error occur in the fetching user details, please update an application or report it.");
                    })
                }
            },
            signOut: async () => {
                await AsyncStorage.getAllKeys()
                    .then(keys => AsyncStorage.multiRemove(keys))
                    .then(() => dispatch({ type: 'SIGN_OUT' }));
            },
            signUp: async data => {
                // In a production app, we need to send user data to server and get a token
                // We will also need to handle errors if sign up failed
                // After getting token, we need to persist the token using `AsyncStorage`
                // In the example, we'll use a dummy token

                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
            setUpdateProfile: async userInfo => {
                await AsyncStorage.setItem('userToken',JSON.stringify(userInfo));
                dispatch({ type: 'UPDATE_PROFILE', token: userInfo });
            },
            setForceUpdate: async (data) => {
                dispatch({ type: 'FORCE_UPDATE', data: data });
            }
        }),
        []
    );


    return (
        <AuthContext.Provider value={{
            state,
            ...authContext
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext };