import { Box, Text, ScrollView, VStack, Input, Radio, FormControl, KeyboardAvoidingView, CheckIcon, TextArea, Button, Heading, Spinner, Modal, Select, HStack } from 'native-base';
import { ToastAndroid, Image, Dimensions, Alert, BackHandler } from 'react-native';
import dataService, { backendUrl, apiEndPoints } from '../../Services/NetworkServices';
import React, { Component } from 'react';
import UploadPhoto from './upload';
import ImgToBase64 from 'react-native-image-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class PostEvents extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                title: '',
                location: '',
                message: '',
                photo: '',
                type: 'RIP',
                isCommentAllowed: "0",
                sendNotification: "0"
            },
            types: [],
            height: 0,
            loading: false,
            status: ''
        }
    }
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;

        dataService.get(apiEndPoints.types, {}, {})
            .then((res) => {
                if (res.internetStatus && res.data) {
                    if (this._isMounted) {
                        this.setState({
                            types: res.data.data
                        })
                    }
                }
            }).catch((err) => {
                dataService.bottomToastMessage(err.message)
            })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setFormControl = (id, value) => {
        let { data } = this.state;
        data[id] = value;
        if (this._isMounted) {
            this.setState({
                data: data
            })
        }
    }

    validation = () => {
        let keys = Object.keys(this.state.data);
        for (var i = 0; i < keys.length; i++) {
            if (!this.state.data[keys[i]]) {
                dataService.bottomToastMessage(keys[i] + " " + "is required.");
                return false;
            }
        }
        return true;
    }

    submitPhoto = async () => {
        const { title, location, message, photo, type, isCommentAllowed, sendNotification } = this.state.data;
        if (this.validation() && this._isMounted) {
            let imgBase64;
            await ImgToBase64.getBase64String(photo)
                .then(base64String => imgBase64 = base64String)
                .catch(err => dataService.bottomToastMessage('error in converting base64 image'));

            let userInfo = await AsyncStorage.getItem('userToken');
            userInfo = JSON.parse(userInfo);

            var formData = new FormData();
            formData.append('member_id', userInfo.id);
            formData.append('title', title);
            formData.append('message', message);
            formData.append('location', location);
            formData.append('type', type);
            formData.append('photo', imgBase64);
            formData.append('isCommentAllowed', isCommentAllowed);
            formData.append('sendNotification', sendNotification);

            this.setState({
                loading: true,
                status: 'Wait Uploading...'
            })

            dataService.post(apiEndPoints.events, {}, {
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data; ',
                }
            })
            .then((res) => {
                if (res.internetStatus) {
                    if (res.data && res.data.success) {
                        if (this._isMounted) {
                            this.setState({
                                status: 'Uploaded Successfully...'
                            });
                            dataService.bottomToastMessage('Uploaded Successfully...');
                            dataService.bottomToastMessage(res.data.message);
                            this.props.navigation.navigate('Main', {
                                forceUpdate: true
                            });
                        }
                    } else {
                        dataService.bottomToastMessage(res.data.message);
                    }
                }
            })
            .catch(error => {
                ToastAndroid.showWithGravity(
                    "Error",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
            }).finally(() => {
                if (this._isMounted) {
                    this.setState({
                        loading: false
                    })
                }
            });
        }
    }

    updateSize = (height) => {
        if (this._isMounted) {
            this.setState({
                height: (height < 100) ? 100 : height + 10
            });
        }
    }

    render() {
        const { types, loading, status } = this.state;
        let { title, location, message, height, type, isCommentAllowed, sendNotification } = this.state.data;
        return (
            <ScrollView>
                <Box
                    bg={'white'}
                    m={3}
                    rounded={'lg'}
                >
                    <VStack mx={3} my={3} space={3}>
                        <Modal
                            isOpen={loading}
                            onClose={() => {
                                if (this._isMounted) {
                                    this.setState({
                                        loading: false
                                    })
                                }
                            }}
                            size={'lg'}
                            closeOnOverlayClick={false}
                        >
                            <Modal.Content maxWidth="400px">
                                <Modal.Body minHeight="200px" alignItems="center" justifyContent="center">
                                    <Spinner accessibilityLabel="Loading posts" />
                                    <Heading color="primary.500" fontSize="md">
                                        {status}
                                    </Heading>
                                </Modal.Body>
                            </Modal.Content>
                        </Modal>
                        <KeyboardAvoidingView flex={1} space={3}>
                            <FormControl mt={3}>
                                <FormControl.Label>Title</FormControl.Label>
                                <Input
                                    type="text"
                                    size="2xl"
                                    value={title}
                                    onChangeText={(value) => this.setFormControl('title', value)}
                                ></Input>
                            </FormControl>
                            <FormControl mt={3}>
                                <FormControl.Label>Location</FormControl.Label>
                                <Input
                                    type="text"
                                    size="2xl"
                                    value={location}
                                    onChangeText={(value) => this.setFormControl('location', value)}
                                ></Input>
                            </FormControl>
                            <FormControl mt={3}>
                                <FormControl.Label>Type</FormControl.Label>
                                <Select
                                    selectedValue={type}
                                    minWidth="200"
                                    accessibilityLabel="Choose Event Type"
                                    placeholder="Choose Event Type"
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size="5" />,
                                    }}
                                    mt={1}
                                    onValueChange={(itemValue) => this.setFormControl('type', itemValue)}
                                >
                                    {types.map((type, index) => {
                                        return <Select.Item key={index} label={type.name} value={type.name} />
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl mt={3}>
                                <FormControl.Label>Allowed Comments:</FormControl.Label>
                                <Radio.Group
                                    name="isCommentAllowed"
                                    value={isCommentAllowed}
                                    onChange={(nextValue) => this.setFormControl('isCommentAllowed',nextValue)}
                                >
                                    <HStack space={20}>
                                        <Radio value="1" my={1}>
                                            Yes
                                        </Radio>
                                        <Radio value="0" my={1}>
                                            No
                                        </Radio>
                                    </HStack>
                                </Radio.Group>
                            </FormControl>
                            <FormControl mt={3}>
                                <FormControl.Label >Message</FormControl.Label>
                                <TextArea
                                    h={height}
                                    size="xl"
                                    textAlignVertical='top'
                                    numberOfLines={10}
                                    value={message}
                                    onChangeText={(value) => this.setFormControl('message', value)}
                                    onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                                />
                            </FormControl>
                            <FormControl mt={3}>
                                <FormControl.Label>Send Notification (Immediately):</FormControl.Label>
                                <Radio.Group
                                    name="sendNotification"
                                    value={sendNotification}
                                    onChange={(nextValue) => this.setFormControl('sendNotification',nextValue)}
                                >
                                    <HStack space={20}>
                                        <Radio value="1" my={1}>
                                            Yes
                                        </Radio>
                                        <Radio value="0" my={1}>
                                            No
                                        </Radio>
                                    </HStack>
                                </Radio.Group>
                            </FormControl>
                            <FormControl.Label mt={3}>Photo:</FormControl.Label>
                            <UploadPhoto
                                showPhotos={true}
                                onChange={(value) => this.setFormControl('photo', value)}
                            />
                        </KeyboardAvoidingView>
                        <Button w="full" onPress={() => this.submitPhoto()}>
                            <Text>Upload</Text>
                        </Button>
                    </VStack>

                </Box>
            </ScrollView>
        )
    }
}