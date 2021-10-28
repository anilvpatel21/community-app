import React, { useEffect, useState, useContext } from 'react';
import { useNetInfo } from "@react-native-community/netinfo";
import { BackHandler, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../../Provider/authProvider';
import { Heading, Box, Text, Link, Stack, HStack, VStack, Center, Spinner, Input, FormControl, Button, ScrollView, Divider } from "native-base";
import dataService from '../../Services/NetworkServices';
import firebase from '@react-native-firebase/app';
import { reportIssue as reportIssueFn } from '../Elements/Report';
import { validatePhoneNumber } from '../../Services/utility';

function PhoneSignIn(props) {
    //props.route.params;
    const { signIn } = useContext(AuthContext);
    const netInfo = useNetInfo();

    const [loading, setLoading] = useState(false);
    // If null, no SMS has been sent
    const [confirmBox, setConfirmBox] = useState(false);

    const [ISDCode, setISDCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');

    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(3);

    const RESEND_OTP_TIME_LIMIT = 30;
    const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(RESEND_OTP_TIME_LIMIT);
    const [intervalId, setIntervalId] = useState('');

    const [user, setUser] = useState(null);
    const [verificationId, setVerificationId] = useState('');

    const [message, setMessage] = useState('');
    const [invite, setInvite] = useState(false);


    let authListner;
    async function authVerification(number, codeResent = false,) {
        authListner = auth().verifyPhoneNumber(number, 20, codeResent)
            .on('state_changed', (phoneAuthSnapshot) => {
                const state = phoneAuthSnapshot.state;
                if (state === "verified") {
                    //The snapshot contains the verification ID & code to create a credential
                    setCode(phoneAuthSnapshot.code);
                    autoVerification(phoneAuthSnapshot.verificationId, phoneAuthSnapshot.code);

                } else if (state === "sent") {
                    dataService.bottomToastMessage('OTP Sent To Mobile');

                    //show a visible input box asking the user to enter the verification code.
                    setTimeout(() => {
                        if (user === null) {
                            setCode('');
                            setLoading(false);
                            setVerificationId(phoneAuthSnapshot.verificationId);
                            startResendOtpTimer();
                            setConfirmBox(true);
                        }
                    }, 10000);
                } else if (state === "timeout") {
                    //Show a visible input box asking the user to enter the verification code
                } else {
                    //handle error
                    const errorVerify = phoneAuthSnapshot.error;
                    setLoading(false);

                    dataService.bottomToastMessage(errorVerify.message);
                }
            }).catch(() => { });
    }

    async function signInWithPhoneNumber(number, codeResent = false, inviteVerify = false) {
        const validatePhone = validatePhoneNumber(phoneNumber);
        if (validatePhone) {
            if (netInfo.isInternetReachable) {
                try {
                    setLoading(true);
                    if (!inviteVerify) {
                        setMessage('Please Wait Verifying Your Invitation...');
                        dataService.get('invites',{}, {
                            params: {
                                phone: phoneNumber
                            }
                        }).then((res) => {
                            if (res.internetStatus) {
                                if(res.data.length > 0) {
                                    setInvite(true);
                                    setMessage('Please Wait Auto Verifying Phone Number...');
                                    authVerification(number, codeResent);
                                } else {
                                    Alert.alert('Its a invite only app.', 'Please ask any member to invite you to access this application.');
                                    setLoading(false);
                                }
                            }
                        }).catch(() => {
                            setLoading(false);
                            dataService.bottomToastMessage('Unable to verify invite for your phonenumber');
                        })
                    } else {
                        setMessage('Please Wait Auto Verifying Your OTP');
                        authVerification(number, codeResent);
                    }
                } catch (error) {
                    setLoading(false);
                    dataService.bottomToastMessage(error.message);
                }
            } else {
                dataService.bottomToastMessage('No Internet Access.');
            }
        } else {
            dataService.bottomToastMessage("Mobile number should be valid 10 digit number");
        }
    }

    async function autoVerification(verificationId, code) {
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
            const userItem = await auth().signInWithCredential(credential);
            setUser(userItem);
            dataService.bottomToastMessage('Auto Verified');
        } catch (e) {
            dataService.bottomToastMessage(e.message);
        }

    }

    async function confirmCode() {
        try {
            if (code.length === 6) {
                if (netInfo.isInternetReachable) {
                    setLoading(true);
                    setMessage('Please Wait Auto Verifying Your OTP');
                    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
                    const userItem = await auth().signInWithCredential(credential);
                    setUser(userItem);
                } else {
                    dataService.bottomToastMessage('No Internet Access. Please check your internet.');
                }
            } else {
                dataService.bottomToastMessage('OTP must be 6 digit');
            }
        } catch (error) {
            setLoading(false);
            dataService.bottomLongToastMessage('Invalid OTP Entered');
            dataService.bottomToastMessage(error.message);
            let item = attempt;
            item = item - 1;
            setAttempt(item);
            if (error.message) {
                setError(error.message);
            }
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


    const useOtherMobile = () => {
        setConfirmBox(false);
        setCode('');
        setAttempt(3);
    }

    let resendOtpTimerInterval;

    const startResendOtpTimer = () => {
        if (resendOtpTimerInterval) {
            clearInterval(resendOtpTimerInterval);
        }

        let time = RESEND_OTP_TIME_LIMIT;
        resendOtpTimerInterval = setInterval(() => {
            if (time <= 0) {
                clearInterval(resendOtpTimerInterval);
                setIntervalId('');
            } else {
                time = time - 1;
                setResendButtonDisabledTime(time);
            }

        }, 1000);
        setIntervalId(resendOtpTimerInterval);
    };

    useEffect(() => {
        if (user) {
            signIn(user);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
            authListner;
        };
    }, [user]);


    const onResendOtpButtonPress = () => {
        setCode('');
        setAttempt(3);
        signInWithPhoneNumber(ISDCode + ' ' + phoneNumber, true, invite);
        setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
        startResendOtpTimer();
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
                {loading && <Stack mb={5} h={5} alignItems="center">
                    <Spinner accessibilityLabel="Loading posts" />
                    <Heading color="primary.500" fontSize="md">
                        {message}
                    </Heading>
                </Stack>}

                {(!confirmBox) ? (
                    <>
                        {!loading &&
                            <MobileNumberScreen
                                ISDCode={ISDCode}
                                phoneNumber={phoneNumber}
                                setISDCode={setISDCode}
                                setPhoneNumber={setPhoneNumber}
                                signInWithPhoneNumber={signInWithPhoneNumber}
                                navigation={props.navigation}
                            />}
                    </>
                ) : (
                    <>
                        {!loading && <OTPScreen
                            code={code}
                            attempt={attempt}
                            ISDCode={ISDCode}
                            phoneNumber={phoneNumber}
                            resendButtonDisabledTime={resendButtonDisabledTime}
                            setCode={setCode}
                            confirmCode={confirmCode}
                            onResendOtpButtonPress={onResendOtpButtonPress}
                            useOtherMobile={useOtherMobile}
                            reportIssue={reportIssue}
                            navigation={props.navigation}
                        />
                        }
                    </>
                )}
                <HStack mt="5" alignItems="center">
                    <Text>By continuing, you agree to our <Link onPress={() => props.navigation.navigate('Terms And Condition')} style={{ color: '#004080' }}>Terms of Service and Privacy Policy.</Link> </Text>
                </HStack>

            </VStack>
        </Box >
    )
}

function MobileNumberScreen(props) {
    const { ISDCode, setISDCode, phoneNumber, setPhoneNumber, signInWithPhoneNumber, navigation } = props;
    return (
        <VStack space={10}>
            <VStack space={2}>
                <FormControl.Label>Enter 10 Digit Mobile Number</FormControl.Label>
                <HStack>
                    <FormControl w="20%">
                        <Input
                            size={'2xl'}
                            value={ISDCode}
                            onChangeText={ISDCode => setISDCode(ISDCode)}
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
            <Button w="100%" colorScheme="indigo" _text={{ color: 'white' }} onPress={() => signInWithPhoneNumber(ISDCode + ' ' + phoneNumber, false, false )}>
                Sign in
            </Button>
            <Divider my={2} />
        </VStack>
    )
}

function OTPScreen(props) {
    const { ISDCode, phoneNumber, code, setCode, confirmCode, attempt, resendButtonDisabledTime, onResendOtpButtonPress, useOtherMobile, reportIssue } = props;
    return (
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
                        <Button success w="full" disabled={code.length != 6} onPress={() => confirmCode()} >
                            <Text>Confirm</Text>
                        </Button>
                        <Center>
                            {resendButtonDisabledTime > 0 ?
                                <Text note >Resend OTP code in {resendButtonDisabledTime}</Text>
                                : <Button w="full" onPress={() => onResendOtpButtonPress()}>Click here to resend OTP code.</Button>
                            }
                        </Center>
                        <Center>
                            <Text note>Attempt Remaining: {attempt}</Text>
                        </Center>
                    </VStack>
                </VStack>
            }
            <Divider my={2} />
            <Center>
                <Text style={{ color: '#004080' }} button onPress={() => useOtherMobile()}>Sign in with different mobile number.</Text>
            </Center>
            {(attempt <= 0) && <VStack>
                <Center >
                    <Text style={{ color: '#004080' }} button onPress={reportIssue}>If any error, click here to report us.</Text>
                </Center>
            </VStack>}
            <Divider my={2} />
        </VStack>
    )
}

export default PhoneSignIn;