import firebase from '@react-native-firebase/app'
import messaging from '@react-native-firebase/messaging';
import type { Notification, NotificationOpen } from '@react-native-firebase/messaging';


class FCMSerivce {

    register = async (onRegister, onNotification, onOpenNotification) => {
        await this.checkPermission(onRegister);
        await this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
    }

    checkPermission = async (onRegister) => {
        await messaging().hasPermission()
        .then(enabled => {
            if (enabled) {
                //User has permission
                this.getToken(onRegister);
            } else {
                this.requestPermission(onRegister);
            }
        }).catch( error => {
            console.log('Permission Denied', error);
        })
    }

    getToken = async (onRegister) => {
        await messaging().getToken()
        .then(fcmToken => {
            if(fcmToken){
                onRegister(fcmToken);
            } else {
                console.log('User does not have device token');
            }
        }).catch( error => {
            console.log('getToken Rejected', error);
        })
    }

    requestPermission = async (onRegister) => {
        await messaging().requestPermission()
        .then(() => {
            this.getToken(onRegister)
        }).catch( error => {
            console.log('requestPermission Rejected', error);
        })
    }

    deleteToken = async () => {
        await messaging().deleteToken()
        .catch( error => {
            console.log('delete token error', error);
        })
    }

    createNotificationListeners = async (onRegister, onNotification, onOpenNotification) => {
        //Triggered when a particular notification has been register in foreground
        // this.notificationListener =  messaging().onNotification((notification: Notification) => {
        //     onNotification(notification);
        // })

        //Received in background state
        this.notificationOpenedListener = messaging()
        .onNotificationOpenedApp((notificationOpen: NotificationOpen) => {
            //alert('aaya onNotificationOpenedApp');
            onOpenNotification(notificationOpen);
        })


        //Received in a quite state
        messaging().getInitialNotification()
        .then(notificationOpen => {
            if (notificationOpen) {
                const notification: Notification = notificationOpen.notification;
                //alert('aaya getInitialNotification');
                onOpenNotification(notification);
                console.log(
                    'Notification caused app to open from quit state:',
                    notificationOpen.notification,
                );
            }
        });

        this.messageListener = messaging().onMessage((message) => {
            onNotification(message);
        })

        this.onTokenRefreshListener = messaging().onTokenRefresh((fcmToken)=> {
            console.log('New Token refresh', fcmToken)
            onRegister(fcmToken);
        })
    }

    unRegister = () => {
        //this.notificationListener();
        this.notificationOpenedListener();
        this.messageListener();
        this.onTokenRefreshListener();
    }

    buildChannel = (obj) => {
        return new messaging().Android.Channel(
            obj.channelID, obj.channelName,
            firebase.notifications.Android.Importance.High)
            .setDescription(obj.channelDes)
    }

    buildNotification = (obj) => {
        messaging().android.createChannel(obj.channel)

        return new messaging()
        .setSound(obj.sound)
        .setNotification(obj.dateId)
        .setTitle(obj.title)
        .setBody(obj.content)
        .setData(obj.data)

        .android.setChannelId(obj.channel.channelID)
        .android.setLargeIcon(obj.largeIcon) //create this icon in android studio app/res/minmap
        .android.setSmallIcon(obj.smallIcon) //create this icon in android studio app/res/drawable
        .android.setColor(obj.colorBgIcon)
        .android.setPriority(messaging().Android.Priority.High)
        .android.setVibrate(obj.vibrate)
        //.android.setAutoCancel(true) //Auto cancel after receving notification
    }

    scheduleNotification = async (notification, days, minutes) => {
        const date = new Date();
        if(days) {
            date.setDate(date.getDate() + days)
        }

        if(minutes) {
            data.setMinutes(date.getMinutes() + minutes);
        }

        await messaging()
        .scheduleNotification(notification, { fireDate: date.getTime()})
    }

    displayNotification = async (notification) => {
        await messaging().displayNotification(notification)
        .catch(error => console.log('Display Notifcation error',error))
    }

    removeDeliveredNotification = async (notification) => {
        await messaging().removeDeliveredNotification(notification.notificationId)
    }
}

export const fcmService = new FCMSerivce();