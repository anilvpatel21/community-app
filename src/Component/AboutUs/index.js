import { Spinner, Text, VStack } from 'native-base';
import React, { Component } from 'react';
import dataService, { apiEndPoints } from '../../Services/NetworkServices';

export default class AboutUs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            aboutUs: null
        }
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
            this.setState({
                isLoading: true
            })
            dataService.get(apiEndPoints.settings,{},{})
            .then((res) => {
                if(res.internetStatus && res.data) {
                    if(res.data.data && res.data.data[0]) {
                        const settings = res.data.data[0];
                        if(this._isMounted) {
                            this.setState({
                                aboutUs: settings.aboutUs,
                                isLoading: false
                            })
                        }
                    }
                }

            }).catch((err) => {
                dataService.bottomToastMessage('error in about page ' + err.message)
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <VStack space={3} m={3}>
                {this.state.isLoading && <Spinner />}
                <Text>{this.state.aboutUs}</Text>
            </VStack>
        )
    }
}