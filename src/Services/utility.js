import { Share } from 'react-native';
import { updateUrl } from './NetworkServices';


export const validatePhoneNumber = (number) => {
    var regexp = /^[6-9]{1}[0-9]{9}$/;
    return regexp.test(number)
}


export const onShare = async (message) => {
    try {
      const result = await Share.share({
        message: message,
        url: updateUrl
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {

    }
  };