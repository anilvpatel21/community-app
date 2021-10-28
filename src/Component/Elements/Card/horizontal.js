import { HStack, Text, View, Stack, Box, VStack, Divider, AspectRatio, Image, Heading, Center } from 'native-base'
import React from 'react'
import { Alert, Pressable, TouchableHighlight } from 'react-native';
import { publicUrl } from '../../../Services/NetworkServices';
import moment from 'moment';
import { AuthContext } from '../../../Provider/authProvider';

export default function HorizontalCard(props) {
    const { _event, _eventIndex } = props;
    const { state: { userToken }} = React.useContext(AuthContext);
    const inputConfig = {
        underlayColor:"white",
        onPress: () => props.navigation.navigate('Event', {
                _event: _event
        })
    }
    if(userToken.isAdmin == 1) {
        inputConfig['onLongPress'] = () => props.deleteFn(_event.id, _event.title, _eventIndex)
    }
    return (
        <TouchableHighlight
            {...inputConfig}
        >
        <Box mx={3} my={1.5} bg="white" rounded={'lg'}>
            <HStack height="32" alignContent="flex-start">
                <Stack p="4" space={3} width="65%">
                    <Stack space={2}>
                        <Heading size="sm" ml="-1"  >
                            {_event.title}
                        </Heading>
                        <Text
                            fontSize="xs"
                            _light={{ color: "event.location" }}
                            _dark={{ color: "event.location" }}
                            fontWeight="500"
                            ml="-0.5"
                            mt="-1"
                        >
                            {_event.location}
                        </Text>
                    </Stack>
                </Stack>
                {_event.photo &&
                <Box width="35%">
                    <AspectRatio ratio={16 / 9}>
                        <Image
                            key={_event.photo}
                            bg="amber.100"
                            width="100%"
                            height="32"
                            resizeMode="cover"
                            roundedRight={'lg'}
                            source={{
                                uri: publicUrl + _event.photo
                            }}
                            alt={_event.title}
                        />
                    </AspectRatio>
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
                }
            </HStack>
            <Divider/>
            <VStack mx={3} my={1}>
                <HStack>
                    <Text color="event.posttext" fontWeight="400" w={'50%'}>
                        - Posted: {moment(_event.created_at).toNow(true)} ago
                    </Text>
                    {_event.member && <Text color="event.posttext" fontWeight="400" w={'50%'}>
                        - By: {_event.member.name}
                    </Text>}
                </HStack>
            </VStack>
        </Box>
    </TouchableHighlight>
    )
}
