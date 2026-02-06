import axios, { Axios } from "axios";

export const ERROR_RESPONSE = {
    status: "error",
    message: "Internal server error",
} as const;

class MainService {
    client: Axios;

    constructor() {
        const instance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            /// timeout: process.env?.NEXT_PUBLIC_TIMEOUT ?? 30,
            headers: {
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                    "GET, DELETE, PATCH, POST, PUT, OPTIONS",
                "Access-Control-Allow-Headers":
                    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
                "Content-Type": "application/json",
            },
        });

        this.client = instance;
    }


}

export default MainService;
