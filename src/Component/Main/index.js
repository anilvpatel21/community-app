import { Text, Box, ScrollView, HStack, FlatList, VStack, Fab, Modal, View, Spinner } from 'native-base';
import React, { Component } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import InviteModal from '../Elements/Modal/invite';
import Card from './../Elements/Card/horizontal';
import { useIsFocused } from "@react-navigation/native";
import dataService, { apiEndPoints } from '../../Services/NetworkServices';

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            collection: {},
            _events: [],
            isLoading: false,
            isRefreshing: false,
            showModal: false,
            total: 0,
            currentPage: 1,
            latestId: 0
        }
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this.fetchEvents(1, true);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps, prevState) {
        let prevParams = prevProps.route.params;
        let presentParams = this.props.route.params;

        let prevUpdate = (prevParams) ? prevParams.forceUpdate : "";
        let presUpdate = (presentParams) ? presentParams.forceUpdate : ""

        if(presUpdate != "" && presUpdate != prevUpdate && this._isMounted) {
            this.getLatest();
            this.props.navigation.setParams({
                forceUpdate: false
            });
        }
    }

    mergeData = (collection, toStart = false) => {
        const { _events, latestId, isRefreshing, total } = this.state;
        if(this._isMounted && collection.data.length > 0) {
            if(toStart && isRefreshing) {
                let i=0;
                while(collection.data[i] && collection.data[i].id > latestId) {
                    _events.unshift(collection.data[i]);
                    ++i;
                }
                if(i == 0) {
                    ToastAndroid.showWithGravity(
                        "No New Events",
                        4,
                        ToastAndroid.CENTER
                    )
                }
            } else {
                _events.push(...collection.data)
            }

            this.setState({
                _events: _events,
                collection: collection,
                total: collection.total,
                isLoading: false,
                isRefreshing: false,
                latestId: (collection.current_page == 1) ? collection.data[0].id : latestId,
                lastPage: collection.last_page
            })
        } else {
            if(this._isMounted) {
                this.setState({
                    isLoading: false,
                    isRefreshing: false
                })
            }
        }
    }


    fetchEvents = (pageNo, toStart) => {
        if(this._isMounted) {
            this.setState({
                isLoading: true,
                currentPage: pageNo
            })
            dataService.get(apiEndPoints.events,{},{
                params: {
                    page: pageNo
                }
            })
            .then((res) => {
                if(res.internetStatus && res.data) {
                    this.mergeData(res.data, toStart);
                }
            }).catch((err) => {
                dataService.bottomToastMessage(err.message);
            })
        }
    }

    removeEvents = (eventIndex) => {
        if(this._isMounted) {
            let { _events } = this.state;
            _events.splice(eventIndex,1);
            this.setState({
                _events
            })
        }
    }

    deleteEvent = (eventId, eventIndex) => {
        dataService.delete(apiEndPoints.events + "/" + eventId,{},{})
        .then((res) => {
            if(res.internetStatus && res.data) {
                if(res.data.success) {
                    dataService.bottomToastMessage(res.data.message);
                    this.removeEvents(eventIndex);
                } else {
                    dataService.bottomToastMessage(res.data.message);
                }
            }
        }).catch((err) => {
            dataService.bottomToastMessage(err.message);
        })
    }

    deleteConfirmation = (eventId, eventTitle, eventIndex) => {
        Alert.alert(
            'Are you sure want to delete?',
            eventTitle,
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Sure",
                    onPress: () => this.deleteEvent(eventId, eventIndex),
                }
            ],
            { cancelable: false }
        )
    }



    renderItem = ({ item, index }) => {
        return <Card key={index} _event={item} _eventIndex={index} {...this.props} deleteFn={this.deleteConfirmation}/>
    }

    getLatest = () => {
        if(this._isMounted) {
            this.setState({
                isRefreshing: true
            }, () => {
                this.fetchEvents(1, true);
            })
        }
    }

    getOldPosts = () => {
        const { _events, total, currentPage, lastPage, isLoading} = this.state;
        if(!isLoading) {
            let pageNo = currentPage + 1;
            if(_events.length < total && pageNo <= lastPage) {
                this.fetchEvents(pageNo, false);
            }
        }
    }

    setShowModal = (value) => {
        if(this._isMounted) {
            this.setState({
                showModal: value
            })
        }
    }

    render() {
        return (
            <Box>
                <FlatList
                    onRefresh={this.getLatest}
                    refreshing={this.state.isRefreshing}
                    data={this.state._events}
                    renderItem={(value) => this.renderItem(value)}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={() => { return this.state.isLoading ? <VStack height={100} alignItems="center" justifyContent="center">
                        <Spinner />
                    </VStack> : null}}
                    onEndReachedThreshold={0.3}
                    onEndReached={this.getOldPosts}
                    removeClippedSubviews={true}
                    initialNumToRender={3}
                    maxToRenderPerBatch={3}
                    getItemLayout={(data, index) => ({
                        length: 32,
                        offset: 32 * index,
                        index
                    })}
                />
                {this.props.isFocused && <>
                <Fab
                    position="absolute"
                    size="sm"
                    icon={<Icon color="white" name="plus" size={20} />}
                    onPressOut={() => this.setShowModal(true)}
                />
                <Modal
                    isOpen={this.state.showModal}
                    onClose={() => this.setShowModal(false)}
                    size={'lg'}
                >
                    <InviteModal
                        closeModal={() => this.setShowModal(false)}
                    />
                </Modal>
                </>}
            </Box>
        )
    }
}

export default function(props) {
    const isFocused = useIsFocused();
    return <Main {...props} isFocused={isFocused} />;
}