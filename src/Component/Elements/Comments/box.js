import React, { useState, useContext} from 'react';
import { useIsFocused } from '@react-navigation/core';
import { AuthContext } from '../../../Provider/authProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Keyboard, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Box, View, TextArea, KeyboardAvoidingView, FormControl } from 'native-base';
import dataService, { apiEndPoints } from '../../../Services/NetworkServices';


export default function CommentBox(props) {
    const [message, setMessage] = useState('');
    const { _event, getLatest } = props;
    const isFocused = useIsFocused();

    const { state:{ userToken } }  = useContext(AuthContext);

    const postMessage = async () => {
        try {
            if (userToken && message.trim() != "") {
                dataService.post(apiEndPoints.comments, {}, {
                    data: {
                        comment: message,
                        event_id: _event.id,
                        member_id: userToken.id
                    }
                }).then((res) => {
                    if (res.internetStatus && res.data) {
                        dataService.bottomToastMessage('Comment Added');
                        if(isFocused) {
                            setMessage('');
                            getLatest();
                            Keyboard.dismiss();
                        }
                    }
                }).catch((err) => {
                    dataService.bottomToastMessage(err.message)
                })
            }
        } catch (e) {
           dataService.bottomToastMessage(e.message);
        }
    }
    return (
    <View w="full" position="absolute" bottom="1" >
    <Box m={1} borderWidth={0.5} rounded="2xl" bg={"white"}>
        <KeyboardAvoidingView>
            <FormControl>
                <TextArea
                    variant="unstyled"
                    size="xl"
                    height={16}
                    px={3}
                    w={'85%'}
                    textAlignVertical='top'
                    numberOfLines={4}
                    placeholder="Enter Comment (Max. 140)"
                    value={message}
                    maxLength={140}
                    onChangeText={(value) => {
                        if(value.length <= 140) {
                            setMessage(value);
                        } else {
                            dataService.bottomToastMessage('Max Length 140 Character Only.')
                        }

                    }}
                />
            </FormControl>
            <TouchableOpacity onPress={() => postMessage()}  style={{position: 'absolute', right: 20, top: 20 }}>
                <Icon name="send" size={24}></Icon>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    </Box>
    </View>
    )
}