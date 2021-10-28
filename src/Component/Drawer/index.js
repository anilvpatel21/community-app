import React from "react";
import { Alert } from "react-native";
import { Text, Button, VStack } from "native-base";
import { AuthContext } from '../../Provider/authProvider';
import { version } from "../../../package.json";
import dataService, { updateUrl } from "../../Services/NetworkServices";
import { reportIssue as reportIssueFn } from '../Elements/Report';


const routes = [
    { id: "1", name: "Home", path: "Main", icon: "home" },
    { id: "2", name: "Profile", path: "Profile", icon: "person" },
];


const adminRoutes = [
    { id: "1", name: "Send Event", path: "Post", icon: "" },
];


export default function Drawer(props) {
    const { signOut, state:{ userToken:user } } = React.useContext(AuthContext);

    const handleSignOut = () => {
        Alert.alert("Signing Out", "Are you sure?", [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            { text: "Yes", onPress: () => signOut() }
        ]);
    }

    const reportUs = async () => {
        reportIssueFn({
            title: "Sorry for the inconvenience.",
            message: "Please update your app to the latest version. If you still get an error, please report to us. We will do our best to resolve it soon.",
            reportData: {
                subject: "Facing issue with otp & login in auth screens.",
                body: `Hi, I am using this mobile number ${user} & currently have this ${version}.`
            },
            updateButton: true
        });
    }

    return (
        <>
            <VStack h="full" justifyContent="space-between">
                <VStack>
                    <Text style={{ margin: 10, fontWeight: "bold", alignSelf: 'center', fontSize: 18 }}>Hi, {user.name}</Text>
                    <Text style={{ margin: 5, fontWeight: "bold", alignSelf: 'center', fontSize: 18 }}>{user.phone}</Text>
                    {routes.map((route, index) => <Button variant="ghost" colorScheme="dark" key={index} onPress={() => props.navigation.navigate(route.path)}>
                        <Text style={{ fontSize: 16 }}>{route.name}</Text>
                    </Button>)}
                    {user.isAdmin == "1" && adminRoutes.map((route, index) => <Button variant="ghost" colorScheme="dark"   key={index} onPress={() => props.navigation.navigate(route.path)}>
                        <Text style={{ fontSize: 16 }}>{route.name}</Text>
                    </Button>)}
                </VStack>
                <VStack alignItems={'center'} space={3} my={3}>
                    <Button variant="ghost" colorScheme="dark"  onPress={() => props.navigation.navigate('AboutUs')}>
                        <Text style={{ fontSize: 16 }}>About Us</Text>
                    </Button>
                    <Button variant="ghost" colorScheme="dark"  onPress={() => dataService.openExternalApp(updateUrl)}>
                        <Text style={{ fontSize: 16 }}>Rate Us</Text>
                    </Button>
                    <Button variant="ghost" colorScheme="dark"  onPress={() => handleSignOut()}>
                        <Text style={{ fontSize: 16 }}>Sign Out</Text>
                    </Button>
                    <Button variant="ghost" colorScheme="dark"  onPress={() => reportUs()}>
                        <Text style={{ fontSize: 16 }}>Report Issue</Text>
                    </Button>
                    <Text>Version: v{version}</Text>
                </VStack>
            </VStack>
        </>
    );
}