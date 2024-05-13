import axios from "axios";
import { NETWORK_CALL_TIMEOUT } from "../utils";

const httpClient = axios.create({
    timeout: NETWORK_CALL_TIMEOUT,
});

httpClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default httpClient;
