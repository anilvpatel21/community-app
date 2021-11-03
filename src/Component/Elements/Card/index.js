import React from 'react';
import { Alert, Pressable, TouchableOpacity } from 'react-native';
import { VStack, Stack, Button, HStack, Text, Box, Divider, AspectRatio, Image, Heading, Center } from 'native-base';
import { publicUrl } from '../../../Services/NetworkServices';
import moment, { now } from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function (props) {
    const { _event, isAdmin, sNotifiyConfirm } = props;
    return (

        <Box m={3} bg={'white'} border={1} borderRadius='md' rounded='lg' borderColor="coolGray.200" shadow={2}>
            <Box>
                {_event.photo && <AspectRatio ratio={16 / 9}>
                    <Image
                        key={_event.photo}
                        resizeMode="contain"
                        roundedTop={'lg'}
                        source={{
                            uri: publicUrl + _event.photo
                        }}
                        alt="image"
                    />
                </AspectRatio>}
                <Center
                    bg="event.tagbg"
                    _text={{ color: 'white', fontWeight: '700', fontSize: 'xs' }}
                    position="absolute"
                    bottom={0}
                    px="3"
                    py="1.5"
                >
                    {_event.type}
                </Center>
            </Box>
            <Stack p="4" space={3}>
                <Stack space={2}>
                    <HStack justifyContent="space-between" alignItems="center">
                        <Heading size="md" ml="-1">
                            {_event.title}
                        </Heading>
                        {isAdmin == "1" && <TouchableOpacity onPress={() => sNotifiyConfirm(_event.id)}><Icon size={24} style={{color: '#f59e0b'}} name="bell"></Icon></TouchableOpacity>}
                    </HStack>
                    <Text
                        fontSize="xs"
                        color="event.location"
                        fontWeight="500"
                        ml="-0.5"
                        mt="-1"
                    >
                        {_event.location}
                    </Text>
                </Stack>
                <Text fontWeight="400">
                    {_event.message}
                </Text>
                <HStack alignItems="center" space={4} justifyContent="space-between">
                    <HStack alignItems="center" space={2}>
                        <Text color="event.posttext" fontWeight="400">
                            - {moment(_event.created_at).toNow(true)} ago
                        </Text>
                        {_event.member && <Text color="event.posttext" fontWeight="400">
                            - {_event.member.name}
                        </Text>}
                    </HStack>
                </HStack>
            </Stack>
        </Box>
    );
}