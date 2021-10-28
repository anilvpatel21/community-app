import React from 'react';
import { Alert, Pressable, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { VStack, Stack, HStack, Text, Box, Divider, AspectRatio, Image, Heading, Center } from 'native-base';
import moment from 'moment';
import { AuthContext } from '../../../Provider/authProvider';

export default function (props) {
    const { comment, commentIndex } = props;
    const { state: { userToken } } = React.useContext(AuthContext);

    const inputConfig = {};

    if (comment.member && comment.member.id == userToken.id) {
        inputConfig['underlayColor'] = "white";
        inputConfig['onLongPress'] = () => props.deleteFn(comment.id, comment.comment, commentIndex)
    }

    return (
        <TouchableHighlight {...inputConfig} >
            <Box mx={3} my={1.5} bg={'white'} border={1} borderRadius='md' rounded='lg' borderColor="coolGray.200" shadow={2}>
                <Stack p="4" space={3}>
                    <Text fontWeight="400">
                        {comment.comment}
                    </Text>
                    <HStack alignItems="center" space={4} justifyContent="space-between">
                        <HStack alignItems="center" space={2}>
                            <Text color="gray.500" fontWeight="400">
                                - {moment(comment.created_at).toNow(true)} ago
                            </Text>
                            {comment.member && <Text color="gray.500" fontWeight="400">
                                - {comment.member.name}
                            </Text>}
                        </HStack>
                    </HStack>
                </Stack>
            </Box>
        </TouchableHighlight>
    );
}