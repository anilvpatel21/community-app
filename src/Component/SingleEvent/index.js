import { Box, Text, VStack, View, HStack, TextArea, KeyboardAvoidingView, FormControl, Divider, FlatList, Heading, Button, Input, Spinner } from 'native-base';
import React, { Component, useState, useContext } from 'react';
import { Alert, ToastAndroid} from 'react-native';
import Card from '../Elements/Card';
import Comments from '../Elements/Comments';
import CommentBox from '../Elements/Comments/box';
import dataService, { apiEndPoints } from '../../Services/NetworkServices';
import { AuthContext } from '../../Provider/authProvider';

class SingleEvent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            collection: {},
            comments: [],
            isLoading: false,
            isRefreshing: false,
            total: 0,
            currentPage: 1,
            latestId: 0
        }
    }

    _isMounted = false;

    renderItem = ({ item, index }) => {
        return <Comments key={index} comment={item} commentIndex={index} deleteFn={this.deleteConfirmation}/>
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchComments(1, true);

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchComments = (pageNo, toStart) => {
        const { _event } = this.props.route.params;
        if (this._isMounted && _event.isCommentAllowed == "1" ) {
            this.setState({
                isLoading: true,
                currentPage: pageNo
            })
            dataService.get(apiEndPoints.comments, {}, {
                params: {
                    page: pageNo,
                    eventId: _event.id
                }
            })
                .then((res) => {
                    if (res.internetStatus && res.data) {
                        this.mergeData(res.data, toStart);
                    }
                }).catch((err) => {
                    dataService.bottomToastMessage(err.message);
                })
        }
    }

    mergeData = (collection, toStart = false) => {
        const { comments, latestId, isRefreshing, total } = this.state;
        if (this._isMounted && collection.data.length > 0) {
            if (toStart && isRefreshing) {
                let i = 0;
                while (collection.data[i] && collection.data[i].id > latestId) {
                    comments.unshift(collection.data[i]);
                    ++i;
                }
                if (i == 0) {
                    ToastAndroid.showWithGravity(
                        "No New Comments",
                        4,
                        ToastAndroid.CENTER
                    )
                }
            } else {
                comments.push(...collection.data)
            }

            this.setState({
                comments: comments,
                collection: collection,
                total: collection.total,
                isLoading: false,
                isRefreshing: false,
                latestId: (collection.current_page == 1) ? collection.data[0].id : latestId,
                lastPage: collection.last_page
            })
        } else {
            if (this._isMounted) {
                this.setState({
                    isLoading: false,
                    isRefreshing: false
                })
            }
        }
    }

    sendNotification = (eventId) => {
        dataService.post(apiEndPoints.pushNotification + '/' + eventId,{},{})
        .then((res) => {
            if(res.internetStatus && res.data) {
                dataService.bottomToastMessage(res.data.message);
            }
        }).catch((err)=> {
            dataService.bottomToastMessage(err.message)
        })
    }

    sendNotificationConfirmation = (eventId) => {
        Alert.alert(
            'Are you sure want to send notification?',
            '',
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Sure",
                    onPress: () => this.sendNotification(eventId),
                }
            ],
            { cancelable: false }
        )
    }



    getLatest = () => {
        if (this._isMounted) {
            this.setState({
                isRefreshing: true
            }, () => {
                this.fetchComments(1, true);
            })
        }
    }

    getOldPosts = () => {
        const { comments, total, currentPage, lastPage, isLoading } = this.state;
        if (!isLoading) {
            let pageNo = currentPage + 1;
            if (comments.length < total && pageNo <= lastPage) {
                this.fetchComments(pageNo, false);
            }
        }
    }

    removeComment = (commentIndex) => {
        let { comments } = this.state;
        comments.splice(commentIndex,1);
        if(this._isMounted) {
            this.setState({
                comments
            })
        }
    }

    deleteComment = (commentId, commentIndex) => {
        dataService.delete(apiEndPoints.comments + "/" + commentId,{},{})
        .then((res) => {
            if(res.internetStatus && res.data) {
                if(res.data.success) {
                    dataService.bottomToastMessage(res.data.message);
                    this.removeComment(commentIndex);
                } else {
                   dataService.bottomToastMessage(res.data.message);
                }
            }
        }).catch((err) => {
            dataService.bottomToastMessage(err.message);
        })
    }

    deleteConfirmation = (commentId, comment , commentIndex) => {
        Alert.alert(
            'Are you sure want to delete comment?',
            comment,
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Sure",
                    onPress: () => this.deleteComment(commentId, commentIndex),
                }
            ],
            { cancelable: false }
        )
    }


    render() {
        const { _event } = this.props.route.params;
        return (
            <>
                <FlatList
                    my={3}
                    mb={_event.isCommentAllowed == "1" ? "20" : 3}
                    onRefresh={this.getLatest}
                    refreshing={this.state.isRefreshing}
                    ListHeaderComponent={() => <>
                        <Card _event={_event}/>
                        <HStack justifyContent="space-between" mx={3}>
                            {_event.isCommentAllowed == "1" && <Heading size={'sm'}>Comments:</Heading>}
                            {this.props.isAdmin == "1" && <Button size={'xs'} onPress={() => this.sendNotificationConfirmation(_event.id)}>Send Notification</Button>}
                        </HStack>

                    </>}
                    ListFooterComponent={() => {
                        return (
                            <>
                                {_event.isCommentAllowed == "1" && this.state.isLoading && <VStack height={100} alignItems="center" justifyContent="center">
                                    <Spinner />
                                </VStack>}
                                {_event.isCommentAllowed == "1" && !this.state.isLoading && this.state.comments.length == 0 && <VStack height={100} alignItems="center" justifyContent="center">
                                    <Text>No Comments</Text>
                                </VStack>}
                            </>
                        )
                    }}
                    data={this.state.comments}
                    renderItem={(value) => this.renderItem(value)}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.3}
                    onEndReached={this.getOldPosts}
                    removeClippedSubviews={true}
                    initialNumToRender={3}
                    maxToRenderPerBatch={3}
                />
                {_event.isCommentAllowed == "1" && <CommentBox _event={_event} getLatest={this.getLatest} />}
            </>
        )
    }
}

export default function Event(props) {
    const { state:{ userToken }  } = useContext(AuthContext);
    return <SingleEvent {...props} isAdmin={userToken.isAdmin} />
}