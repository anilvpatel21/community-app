import { Alert } from "react-native";

class Constants {
    apiServerConfig = {
        stage: {
            backendUrl: "",
            apiUrl: ""
        },
        production: {
            backendUrl: "https://anilpatel.online/api",
            apiUrl: "https://anilpatel.online/api/public/api",
            publicUrl: "https://anilpatel.online/api/public/"
        },
        development: {
            backendUrl: "",
            apiUrl: ""
        }
    };
    email = "anilpatel.gondia@gmail.com";
    updateUrl = "https://play.google.com/store/apps/details?id=in.codebucket.gondiacityapp&hl=en";
    getReportUrl({email = this.email, subject, body}) {
        return `mailto:${email}?subject=${subject}&body=${body}`;
    }
    getEnvironmentBasedUrl(environment, urlKey) {
        return this.apiServerConfig[environment][urlKey];
    }
    getUpdateUrl() {
        return this.updateUrl;
    }
};

export default new Constants();