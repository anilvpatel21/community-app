import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import AppScreen from './src/Component/Navigation/app-screen';
import AuthScreen from './src/Component/Navigation/auth-screen';
import { enableScreens } from 'react-native-screens';
import { AuthContext } from './src/Provider/authProvider';
import { Alert, Text } from 'react-native';
import { NativeBaseProvider, Box, StatusBar, extendTheme} from 'native-base';
import Splash from './src/Component/Splash';

enableScreens(true);

function createRootNavigator(isSignout = false, userToken = null){
  if (isSignout || userToken === null) {
    return () => <AuthScreen />;
  } else {
    return () => <AppScreen />;
  }
};

const newColorTheme = {
    primary: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
    },
    event: {
        posttext: "#78350f",
        tagbg: "#b45309",
        location: '#78350f',
    },
    comment: {
        placeholder: '#b45309'
    }
};

const componentTheme = {
    Heading: {
        // Can pass also function, giving you access theming tools
        baseStyle: ({ colorMode }) => {
            return {
            color: colorMode === 'dark' ? '#fcd34d' : '#f59e0b',
            fontWeight: 'normal',
            };
        },
    },
}

const theme = extendTheme({ colors: newColorTheme, components: componentTheme});


function App() {
  const { state }  = React.useContext(AuthContext);
  const [ splashEnded, setSplashEnd ] = React.useState(false);

  useEffect(() => {
    let timeout = setTimeout(() => {
        setSplashEnd(true);
    }, 1000);
    return () => {
        if(timeout) {
            clearTimeout(timeout)
        }
    }
  },[])

  if (state.isLoading || !splashEnded) {
    return <Splash />;
  }

  const Layout = createRootNavigator(state.isSignout, state.userToken);

  return (
    <NativeBaseProvider theme={theme}>
        <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <Box safeAreaTop backgroundColor="primary.500" />
            <Layout />
        </NavigationContainer>
    </NativeBaseProvider>
  )
}

export default App;
// Splash Screen --> Time till Async loading