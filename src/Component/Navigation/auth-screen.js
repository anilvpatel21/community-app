import React, { Component, useEffect } from "react";
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import SignUp from "../SignUp/index";
import TermsAndCondition from '../Terms&Policy';
import OTPScreen from "../SignUp/otpscreen";
import { Alert, BackHandler } from "react-native";


const Stack = createStackNavigator();
function AuthNavigation() {
    useEffect(() => {
        const backAction = () => {
            Alert.alert("Exit App", "Are you sure you want to close it?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "Yes", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);
   return (
        <Stack.Navigator
            initialRouteName={'SignUp'}
            screenOptions={{
                gestureEnabled: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
            }}
        >
            <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUp} />
            <Stack.Screen name="OTP" options={{headerShown: false}} component={OTPScreen} />
            <Stack.Screen name="Terms And Condition"  component={TermsAndCondition} />
        </Stack.Navigator>
   )
}

export default AuthNavigation;