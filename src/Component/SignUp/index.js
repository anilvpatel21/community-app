import React, { useState, useEffect } from 'react';
import { useNetInfo } from "@react-native-community/netinfo";
import { Heading, Box, Text, Link, Stack, HStack, VStack, Center, Spinner, Input, FormControl, Button, ScrollView, Divider, Modal } from "native-base";
import dataService, { apiEndPoints, publicUrl } from '../../Services/NetworkServices';
import { validatePhoneNumber } from '../../Services/utility';


function PhoneSignIn(props) {

    const netInfo = useNetInfo();
    const [loading, setLoading] = useState(false);
    const [ISDCode, setISDCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [fetching, setFetching] = useState(false);

    function signInWithPhoneNumber() {
        const validatePhone = validatePhoneNumber(phoneNumber);
        if (validatePhone) {
            if (netInfo.isInternetReachable) {
                try {
                    setLoading(true);
                    setFetching(false);
                    setMessage('Please Wait Verifying Your Invitation...');
                    dataService.get(apiEndPoints.invites, {}, {
                        params: {
                            phone: phoneNumber
                        }
                    }).then(async (res) => {
                        if (res.internetStatus) {
                            if (res.data.length > 0) {
                                let user = res.data[0];
                                setLoading(false);
                                props.navigation.replace('OTP', {
                                    ISDCode: ISDCode,
                                    phoneNumber: phoneNumber,
                                    name: user.name
                                })
                            } else {
                                setFetching(true);
                                setMessage('Its a invite only app, Please ask any member to invite you to access this application.');
                            }
                        }
                    }).catch((error) => {
                        setLoading(false);
                        setFetching(true);
                        dataService.bottomToastMessage(error.message);
                    })
                } catch (error) {
                    setLoading(false);
                    dataService.bottomToastMessage(error.message);
                }
            } else {
                setLoading(false);
                dataService.bottomToastMessage('No Internet Access.');
            }
        } else {
            dataService.bottomToastMessage("Invalid Mobile Number.");
        }
    }

    return (
        <Box
            rounded="lg"
            overflow="hidden"
            marginX={3}
            marginTop={6}
            paddingX={3}
            shadow={3}
            height="full"
            _light={{ backgroundColor: 'gray.50' }}
            _dark={{ backgroundColor: 'gray.700' }}
        >
            <VStack p="4" space={1}>
                <Heading fontSize={36}>
                    Welcome
                </Heading>
                <Heading fontSize={36} mb="3">
                    KKP Samaj, Raipur
                </Heading>

                <Modal
                    isOpen={loading}
                    onClose={() => setLoading(false)}
                    size={'lg'}
                    closeOnOverlayClick={fetching}
                >
                    <Modal.Content maxWidth="400px">
                        <Modal.Body minHeight="200px" alignItems="center" justifyContent="center">
                            {fetching && <Modal.CloseButton />}
                            {!fetching && <Spinner accessibilityLabel="Loading posts" />}
                            <Heading fontSize="md">
                                {message}
                            </Heading>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>

                <VStack space={10}>
                    <VStack space={2}>
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
                                    autoFocus={true}
                                />
                            </FormControl>
                        </HStack>
                    </VStack>
                    <Button w="100%" _text={{ color: 'white' }} onPress={() => signInWithPhoneNumber()}>
                        Sign in
                    </Button>
                </VStack>

                <Divider my={2} />
                <HStack mt="5" alignItems="center">
                    <Text>By continuing, you agree to our <Link onPress={() => dataService.openExternalApp(publicUrl +'terms.html')} style={{ color: '#004080' }}>Terms of Service and Privacy Policy.</Link> </Text>
                </HStack>
            </VStack>
        </Box >
    )
}
export default PhoneSignIn;