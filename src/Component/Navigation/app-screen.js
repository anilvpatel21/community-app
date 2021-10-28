import React, { Component, useState } from 'react';
import { ToastAndroid, Alert, Linking,  } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';


import { version } from "../../../package.json";
import AsyncStorage from '@react-native-async-storage/async-storage';


import { fcmService } from '../../Services/FCMService';
import dataService, { backendUrl, updateUrl, apiEndPoints } from '../../Services/NetworkServices';

import AboutUs from '../AboutUs';
import Main from '../Main';
import PostEvents from "../Post";
import DrawerScreen from '../Drawer';
import SingleEvent from '../SingleEvent';
import Profile from '../Profile';
import { useIsFocused } from '@react-navigation/core';

import { AuthContext } from '../../Provider/authProvider';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


export default function HomeScreenRouter(props) {

    const [once, setOnce] = React.useState(0);
    const { state:{ userToken }, setUpdateProfile }  = React.useContext(AuthContext);

    const isFocused = useIsFocused();

    const fcmRegister = () => {
        fcmService.register(onRegister, onNotification, onOpenNotification)
    }

    React.useEffect(() => {
        if (once == 0 && isFocused) {
            fcmRegister();
            setOnce(1);
        }
        return () => {
            fcmService.unRegister();
        }
    }, [])

    const sendFCMInformation = async (fcmToken) => {
        if (userToken && userToken.id) {
            const data = {
                fcmToken: fcmToken,
                version: version
            }
            dataService.put(apiEndPoints.members + '/' + userToken.id , {}, {
                data: data
            })
            .then(async (res) => {
                if (res.internetStatus && res.data) {
                    setUpdateProfile(res.data);
                }
            }).catch(err => {
                dataService.bottomToastMessage(err.message);
            })
        }
    }

    const updateFunction = (forceUpdate, versionNo) => {
        Alert.alert(
            `New version ${versionNo} of app is available.`,
            "Hello Buddy, please update your app to continue enjoy our services.",
            [
                (!forceUpdate) ? {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                } : null,
                {
                    text: "Update", onPress: () => {
                        dataService.openExternalApp(updateUrl);
                    }
                }
            ],
            { cancelable: false }
        );
    }


    const onRegister = async (token) => {
        //console.log("[NotificationFCM] onRegister", token);
        if(userToken) {
            if(!userToken.fcmToken || userToken.fcmToken != token) {
                sendFCMInformation(token);
            }
        }
    }

    const onNotification = (notify) => {
        Alert.alert('A new FCM message arrived!', JSON.stringify(notify));
        console.log("[NotificationFCM] onNotification", notify);
    }

    const onOpenNotification = (notify) => {
        console.log("[NotificationFCM] onOpenNotification", notify);
    }

    function Root() {
        return (
            <Drawer.Navigator drawerContent={props => <DrawerScreen {...props} />} initialRouteName={'Main'}>
                <Drawer.Screen name="Main" component={Main} />
                <Drawer.Screen name="Profile"  component={Profile} />
            </Drawer.Navigator>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
            }}

        >
            <Stack.Screen
                name="Root"
                component={Root}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="AboutUs" component={AboutUs} />
            <Stack.Screen name="Event" component={SingleEvent} />
            <Stack.Screen name="Post" component={PostEvents} />
        </Stack.Navigator>
    )
}

