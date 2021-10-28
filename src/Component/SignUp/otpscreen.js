import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNetInfo } from "@react-native-community/netinfo";
import { BackHandler, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../../Provider/authProvider';
import { Heading, Box, Text, Link, Stack, HStack, VStack, Center, Spinner, Input, FormControl, Button, Modal, Divider } from "native-base";
import dataService from '../../Services/NetworkServices';
import firebase from '@react-native-firebase/app';
import { reportIssue as reportIssueFn } from '../Elements/Report';
import { useIsFocused } from "@react-navigation/native";

function OTPScreen(props) {
    const { phoneNumber, ISDCode, name } = props.route.params;

    const { signIn } = useContext(AuthContext);
    const netInfo = useNetInfo();
    let isFocused = useIsFocused();

    const [loading, setLoading] = useState(false);

    const [code, setCode] = useState('');

    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(3);

    const RESEND_OTP_TIME_LIMIT = 30;
    const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(RESEND_OTP_TIME_LIMIT);
    const [intervalId, setIntervalId] = useState('');

    const [user, setUser] = useState(null);
    const [verificationId, setVerificationId] = useState('');

    const [message, setMessage] = useState('');

    let phoneAuthListner;
    async function authVerification(number, codeResent = false,) {
        setMessage('Please Wait Verifying Phone Number...');
        setLoading(true);
        phoneAuthListner = auth().verifyPhoneNumber(number, 5, codeResent)
            .on('state_changed', (phoneAuthSnapshot) => {
                const state = phoneAuthSnapshot.state;
                //The snapshot contains the verification ID & code to create a credential
                if (phoneAuthSnapshot.code && isFocused) setCode(phoneAuthSnapshot.code);
                if(isFocused) setVerificationId(phoneAuthSnapshot.verificationId);
                if (state === "verified") {
                    setUsersCredential();
                } else if (state === "sent") {
                    //show a visible input box asking the user to enter the verification code.
                    if (isFocused) {
                        setLoading(false);
                        setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
                        startResendOtpTimer();
                        dataService.bottomLongToastMessage('OTP Sent To Mobile');
                    }
                } else if (state === "timeout") {
                    //Show a visible input box asking the user to enter the verification code
                } else {
                    //handle error
                    if(isFocused)
                    setLoading(false);
                    const errorVerify = phoneAuthSnapshot.error;
                    dataService.bottomToastMessage(errorVerify.message);
                }
            }).catch((error) => {
                dataService.bottomToastMessage(error.message);
            });
    }

    useEffect(() => {
        authVerification(ISDCode + ' ' + phoneNumber);
        return () => {
            phoneAuthListner;
        }
    }, []);


    async function setUsersCredential() {
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
            const userItem = await auth().signInWithCredential(credential);
            if(isFocused) {
                setLoading(false);
                setUser(userItem);
            }
        } catch (e) {
            if(isFocused) {
                setLoading(false);
                if (e.message) {
                    setError(error.message);
                }
            }
            dataService.bottomLongToastMessage('Invalid OTP.');
        }

    }

    async function confirmCode() {
        if (code.length === 6) {
            if (netInfo.isInternetReachable) {
                setLoading(true);
                setMessage('Please Wait Verifying Your OTP');
                setUsersCredential();
            } else {
                dataService.bottomToastMessage('No Internet Access.');
            }
        } else {
            dataService.bottomToastMessage('OTP must be 6 digit.');
        }
    }

    const reportIssue = () => {
        reportIssueFn({
            title: "Sorry for the inconvenience.",
            message: "Please log in with some other number. If you feel there is some error from our side. Please report to us.",
            reportData: {
                subject: "Facing issue with otp & login in auth screens.",
                body: (error) ? error : 'Unknown Error'
            },
            updateButton: false
        });
    }



    const resendOtpTimerInterval = useRef();
    const startResendOtpTimer = () => {
        if (resendOtpTimerInterval.current) {
            clearInterval(resendOtpTimerInterval.current);
        }

        let time = RESEND_OTP_TIME_LIMIT;
        resendOtpTimerInterval.current = setInterval(() => {
            if (time <= 0) {
                clearInterval(resendOtpTimerInterval.current);
            } else {
                time = time - 1;
                if(isFocused)
                setResendButtonDisabledTime(time);
            }

        }, 1000);
    };

    useEffect(() => {
        if (user) {
            signIn(user, phoneNumber, name);
        }
    }, [user]);

    useEffect(() => {
        return () => {
            isFocused=false;
            if (resendOtpTimerInterval.current) {
                clearInterval(resendOtpTimerInterval.current)
            }
        }
    }, []);

    const useOtherMobile = () => {
        props.navigation.replace('SignUp');
    }

    const onResendOtpButtonPress = () => {
        if(isFocused) {
            let item = attempt - 1;
            setAttempt(item);
            setCode('');
            authVerification(ISDCode + ' ' + phoneNumber, true);
        }
    };

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
                    size={'lg'}
                    closeOnOverlayClick={false}
                >
                    <Modal.Content maxWidth="400px">
                        <Modal.Body minHeight="200px" alignItems="center" justifyContent="center">
                            <Spinner accessibilityLabel="Loading posts" />
                            <Heading fontSize="md">
                                {message}
                            </Heading>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
                <VStack space={3}>
                    {(attempt > 0) &&
                        <VStack space={5}>
                            <FormControl>
                                <FormControl.Label>Enter 6 Digit OTP Sent To:</FormControl.Label>
                                <FormControl.Label>{ISDCode + ' ' + phoneNumber}</FormControl.Label>
                                <Input
                                    size={'2xl'}
                                    value={code}
                                    onChangeText={text => setCode(text)}
                                    keyboardType={"numeric"}
                                    maxLength={6}
                                    autoFocus={true}
                                />
                            </FormControl>
                            <VStack space={5}>
                                <Button w="full" disabled={code.length != 6} onPress={() => confirmCode()} >
                                    Confirm
                                </Button>
                                <Center>
                                    {resendButtonDisabledTime > 0 ?
                                        <Text color="gray.700" >Resend OTP code in {resendButtonDisabledTime}</Text>
                                        : <Button w="full" onPress={() => onResendOtpButtonPress()}>Resend OTP Code</Button>
                                    }
                                </Center>
                                <Center>
                                    <Text color="gray.400" >Attempt Remaining: {attempt}</Text>
                                </Center>
                            </VStack>
                        </VStack>
                    }
                    <VStack space={3}>
                        <Divider my={2} />
                        <Center>
                            <Text style={{ color: '#004080' }} button onPress={() => useOtherMobile()}>Sign in with different mobile number.</Text>
                        </Center>
                        <Divider my={2} />
                        <Center>
                            <Text style={{ color: '#004080' }} button onPress={reportIssue}>If any error, click here to report us.</Text>
                        </Center>
                        <Divider my={2} />
                    </VStack>
                </VStack>
                <HStack mt="5" alignItems="center">
                    <Text>By continuing, you agree to our <Link onPress={() => props.navigation.navigate('Terms And Condition')} style={{ color: '#004080' }}>Terms of Service and Privacy Policy.</Link> </Text>
                </HStack>
            </VStack>
        </Box >
    )
}



export default OTPScreen;