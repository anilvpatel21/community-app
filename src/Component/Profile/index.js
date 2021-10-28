import { FormControl, View, VStack, Input, Button, Text } from 'native-base';
import React, { useState, useContext } from 'react';
import dataService, { apiEndPoints } from '../../Services/NetworkServices';
import { AuthContext } from '../../Provider/authProvider';

export default function Profile(props) {
    const { state:{ userToken:initialUser }, setUpdateProfile } = useContext(AuthContext);

    const [user, setUser] = useState(initialUser);

    const setFormControl = (id, value) => {
        let newUser = { ...user, [id]: value};
        setUser(newUser);
    }

    const updateProfile = () => {
        if(user.id) {
            dataService.put(apiEndPoints.members + '/' + user.id, {}, {
                data: {
                    name: user.name
                }
            }).then(async(res) => {
                if(res.internetStatus && res.data) {
                    dataService.bottomLongToastMessage('Updated Successfully');
                    setUpdateProfile(res.data);
                }
            }).catch((e) => {
                dataService.bottomLongToastMessage(e.message);
            })
        }
    }

    return (
        <View bg="white" h={"full"}>
            <VStack space={3} m={3}>
                <FormControl>
                    <FormControl.Label>Name</FormControl.Label>
                    <Input
                        size={'2xl'}
                        value={user.name}
                        onChangeText={name => setFormControl('name', name)}
                    />
                </FormControl>
                <FormControl>
                    <FormControl.Label>Mobile</FormControl.Label>
                    <Input
                        size={'2xl'}
                        value={user.phone}
                        isDisabled={true}
                    />
                </FormControl>
                <Button w="full"
                        onPress={() => {
                            updateProfile()
                        }}
                    >
                        Update
                    </Button>
            </VStack>
        </View>
    )
}
