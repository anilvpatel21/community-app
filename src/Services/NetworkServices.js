import appConstants from './Constants';
import axios from 'axios';
import { ToastAndroid, Linking } from 'react-native';
import NetInfo from "@react-native-community/netinfo";


export const backendUrl = appConstants.getEnvironmentBasedUrl('production', 'backendUrl');
export const apiUrl = appConstants.getEnvironmentBasedUrl('production', 'apiUrl');
export const publicUrl = appConstants.getEnvironmentBasedUrl('production', 'publicUrl');
export const updateUrl = appConstants.getUpdateUrl();



export const apiEndPoints = {
   invites: '/invites',
   members: '/members',
   events: '/events',
   comments: '/comments',
   types: '/types'
}

const getIn = function (keyList) {
    let baseObject = this;
    try {
        keyList.forEach((key) => {
            baseObject = baseObject[key];
        });
        return baseObject;
    } catch (e) {
        return null;
    }
}

class DataService {
    // urlData is for the url to parse
    // For sending body data, we need to add config.data
    // Individual functions are available for tweaking a request before sending

    checkInternet() {
        return NetInfo.fetch();
    }

    request(url, urlData = {}, config = {}, axiosProperties = {}) {
        // Convert query params to URL search params
        return this.checkInternet().then((state) => {
            if (state.isConnected && state.isInternetReachable) {
                let params = new window.URLSearchParams();
                if (config.params) {
                    let keys = Object.keys(config.params);
                    keys.forEach((key) => {
                        let value = config.params[key];
                        if (Array.isArray(value)) {
                            value.forEach((value) => {
                                params.append(key, value);
                            });
                        } else {
                            params.append(key, value);
                        }
                    });
                }
                config.params = params;
                // Header
                config.headers = Object.assign({
                    "Content-Type": "application/json",
                }, config.headers || {});

                config.url = apiEndPoints[url] || url;

                let instance = axios.create(Object.assign({
                    baseURL: apiUrl,
                    headers: config.headers,
                    withCredentials: true
                }, axiosProperties));

                return instance.request(config).then((response) => {
                    return { internetStatus: true , data: response.data };
                }, (error) => {
                    // if (error.response.status === 404) {

                    // } else {
                    //     this.bottomToastMessage("Sorry! Something Went Wrong!");
                    // }

                    throw error;
                });
            } else {
                this.bottomLongToastMessage("No Internet Access!");
                return { internetStatus: false, data: null }
            }
        })
    }

    post(url, urlData = {}, config = {}, axiosProperties) {
        config.method = "post";
        return this.request(url, urlData, config, axiosProperties);
    }
    delete(url, urlData = {}, config = {}, axiosProperties) {
        config.method = "delete";
        return this.request(url, urlData, config, axiosProperties);
    }
    get(url, urlData = {}, config = {}, axiosProperties) {
        config.method = "get";
        return this.request(url, urlData, config, axiosProperties);
    }
    put(url, urlData = {}, config = {}, axiosProperties) {
        config.method = "put";
        return this.request(url, urlData, config, axiosProperties);
    }
    patch(url, urlData = {}, config = {}, axiosProperties) {
        config.method = "patch";
        return this.request(url, urlData, config, axiosProperties);
    }
    reportUrl(params) {
        return appConstants.getReportUrl(params)
    }
    openExternalApp(url) {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                this.bottomToastMessage('Not supported. Unable to open it.');
            }
        });
    }
    bottomToastMessage = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            75
        );
    }
    bottomLongToastMessage = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            75
        );
    }
}

const dataService = new DataService();
export default dataService;