import React, { useState } from "react";
import { ToastAndroid, Image, Dimensions, Alert, Pressable } from 'react-native';
import { Button, Text } from "native-base";
import { launchCamera, launchImageLibrary, ImageLibraryOptions, ImagePickerResponse } from 'react-native-image-picker';
//import ImgToBase64 from 'react-native-image-base64';

//import AsyncStorage from '@react-native-async-storage/async-storage';
//import ImageResizer from 'react-native-image-resizer';

const { width } = Dimensions.get('window');

function UploadPhoto(props: any) {
    const [photoUri, setPhotoUri] = useState('');
    const handleChoosePhoto = () => {
        const IMAGE_PICKER_OPTIONS: ImageLibraryOptions  = {
            mediaType: 'photo',
            selectionLimit: 1,
            includeBase64: false
        }


        launchImageLibrary(IMAGE_PICKER_OPTIONS, (response: ImagePickerResponse) => {
            const { didCancel, errorCode, errorMessage = "", assets = [] } = response;
            if (!didCancel) {
                if(errorCode == 'camera_unavailable') {
                    Alert.alert(errorMessage)
                } else if(errorCode == 'permission') {
                    Alert.alert(errorMessage)
                } else if(errorCode == 'others') {
                    Alert.alert(errorMessage)
                } else {
                    // Alert.alert(originalRotation);
                    // let rotation = 0

                    // if (originalRotation === 90) {
                    //     rotation = 90
                    // } else if (originalRotation === 270) {
                    //     rotation = -90
                    // }
                    if(assets.length > 0) {
                        let uri = assets[0].uri ? assets[0].uri : '';
                        setPhotoUri(uri);
                        props.onChange(assets[0].uri);
                    }
                    // ImageResizer.createResizedImage(uri, 800, 600, "PNG", 80, rotation)
                    //     .then(async ({ uri }) => {
                    //         let imgBase64;
                    //         await ImgToBase64.getBase64String(uri)
                    //             .then(base64String => {
                    //                 imgBase64 = base64String;
                    //                 props.onChange(imgBase64);
                    //             })
                    //             .catch(err => console.log(error));

                    //     }).catch((error) => {
                    //         console.log(error);
                    //     })
                }
            } else {
                Alert.alert('user cancelled');
            };
        });
    };

    return (
        <React.Fragment>
            {props.showPhotos && photoUri != '' && (
            <Pressable onPress={() => handleChoosePhoto()}>
                   <Image
                    source={{ uri: photoUri }}
                    style={{ height: 300, resizeMode: 'contain', backgroundColor: "#000" }}
                />
            </Pressable>
            )}
            {photoUri == '' && <Button w="full" onPress={() => handleChoosePhoto()}>
                <Text>Choose Photo</Text>
            </Button> }
        </React.Fragment>
    );

}

export default UploadPhoto;