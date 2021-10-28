import React, { useState } from 'react';
import {
    Button,
    Modal,
    FormControl,
    Input,
    VStack,
    HStack
} from "native-base";
import dataService, { apiEndPoints, updateUrl } from '../../../Services/NetworkServices';
import { onShare, validatePhoneNumber } from '../../../Services/utility';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export default function InviteModal(props) {
    const { closeModal } = props;
    const [name, setName] = useState('');
    const [ISDCode, setISDCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');


    const sendInvite = async() => {
        let userInfo = await AsyncStorage.getItem('userToken');
        userInfo = JSON.parse(userInfo);
        if (validatePhoneNumber(phoneNumber) && userInfo.id) {
            dataService.post(apiEndPoints.invites,{},{
                data: {
                    name: name,
                    phone: phoneNumber,
                    member_id: userInfo.id
                }
            }).then(() => {
                closeModal();
                Alert.alert(
                    'Member Added Successfully',
                    'Now, share a link in whatsapp, to help them download an application',
                    [
                        {
                            text: "Cancel",
                            onPress: () => { },
                            style: "cancel"
                        },
                        {
                            text: "Share",
                            onPress: () => onShare('Download an our own kkp samaj app using this link ' + updateUrl),
                        }
                    ],
                    { cancelable: false }
                )
            }).catch((error) => {
                dataService.bottomToastMessage(error.message);
                closeModal();
            });
        } else {
            dataService.bottomToastMessage("Invalid Phone Number");
        }
    }

    return (
        <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Invite Member</Modal.Header>
            <Modal.Body>
                <FormControl>
                    <FormControl.Label>Name</FormControl.Label>
                    <Input
                        size={'2xl'}
                        value={name}
                        onChangeText={name => setName(name)}
                    />
                </FormControl>
                <VStack space={2} mt={3}>
                    <FormControl.Label>Enter 10 Digit Mobile Number</FormControl.Label>
                    <HStack>
                        <FormControl w="20%">
                            <Input
                                size={'2xl'}
                                value={ISDCode}
                                style={{ textAlign: 'center' }}
                                disabled={true}
                                editable={false}
                            />
                        </FormControl>
                        <FormControl w="80%">
                            <Input
                                size={'2xl'}
                                value={phoneNumber}
                                onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
                                keyboardType={"numeric"}
                                maxLength={10}
                            />
                        </FormControl>
                    </HStack>
                </VStack>
            </Modal.Body>
            <Modal.Footer>
                <Button.Group space={2}>
                    <Button
                        variant="ghost"
                        colorScheme="blueGray"
                        onPress={() => {
                            closeModal()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onPress={() => {
                            sendInvite(false)
                        }}
                    >
                        Invite
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal.Content>

    )
}
