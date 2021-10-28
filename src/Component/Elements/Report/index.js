
import { Alert } from 'react-native';
import dataService, { updateUrl } from "../../../Services/NetworkServices";
export const reportIssue = function(props) {
    const body = { updateButton: false, ...props};
    return (
        Alert.alert(
            body.title,
            body.message,
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Report",
                    onPress: () => {
                        const reportData = body.reportData;
                        const reportUrl = dataService.reportUrl(reportData);
                        dataService.openExternalApp(reportUrl);
                    },
                    style: "Report"
                },
                ...((body.updateButton) ? [{
                    text: "Update", onPress: () => {
                        dataService.openExternalApp(updateUrl);
                    }}] : []
                )
            ],
            { cancelable: false }
        )
    )
}
