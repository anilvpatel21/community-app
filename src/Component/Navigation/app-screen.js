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

    const { state:{ userToken }, setUpdateProfile }  = React.useContext(AuthContext);

    const isFocused = useIsFocused();

    const fcmRegister = () => {
        fcmService.register(onRegister, onNotification, onOpenNotification)
    }

    React.useEffect(() => {
        if (isFocused) {
            fcmRegister();
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

    const fetchSettings = () => {
        dataService.get(apiEndPoints.settings,{},{})
        .then((res) => {
            if(res.internetStatus && res.data) {
                if(res.data.data.length > 0) {
                    const settings = res.data.data[0];
                    const versionDiff = parseFloat(settings.currentVersion) - parseFloat(version);
                    if(versionDiff > 0 && isFocused) {
                        const forceUpdate = (versionDiff > 1 || settings.forceUpdate == "1");
                        updateFunction(forceUpdate, settings.currentVersion)
                    }
                }
            }
        }).catch((err) => {
            dataService.bottomToastMessage('error in settings ' + err.message);
        })
    }

    const updateFunction = (forceUpdate, versionNo) => {
        Alert.alert(
            `New version ${versionNo} of app is available.`,
            "Please update your app.",
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
            fetchSettings();
        }
    }

    const onNotification = (notify) => {
        if(notify) {
            Alert.alert('Notification', notify.notification.body + '\n\n' + notify.notification.title);
        }
        //console.log("[NotificationFCM] onNotification", notify);
    }

    const onOpenNotification = (notify) => {
        if(notify) {
            Alert.alert('Notification', notify.notification.body + '\n\n' + notify.notification.title);
        }
        //console.log("[NotificationFCM] onOpenNotification", notify);
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

function Root() {
    return (
        <Drawer.Navigator drawerContent={props => <DrawerScreen {...props} />} initialRouteName={'Main'}>
            <Drawer.Screen name="Main" component={Main} />
            <Drawer.Screen name="Profile"  component={Profile} />
        </Drawer.Navigator>
    );
}

