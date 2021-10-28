import React from 'react';
import { Text, View, Image} from "react-native";
import { logo } from '../Assets/logo';
export default function Splash() {
    return (
        <View style={{height:'100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <Image
                style={{ width: '60%', height: '50%', resizeMode:'contain' }}
                source={{
                    uri: logo
                }}
            />
            <Text style={{fontSize: 24, fontWeight: 'bold', color: 'red'}}>Jai Umiya Mataji</Text>
        </View>
    )
}