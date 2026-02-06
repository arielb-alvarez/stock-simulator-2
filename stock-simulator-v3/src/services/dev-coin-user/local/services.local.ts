import axios, { AxiosInstance } from "axios";

// import { ERROR_RESPONSE } from "@/constants/response";
// import { ACCEPTED_STATUS } from "@/constants/status";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from '@/pages/api/auth/[...nextauth]';

interface GetParams {
    url: string;
    config?: any;
}

interface PostParams {
    url: string;
    data?: any;
    config?: any;
}

export class LocalService {
    protected client: AxiosInstance;
    public static token: string;

    constructor() {
        const client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_HOST_API,
            headers: { "Content-Type": "application/json" },
        });

        client.interceptors.request.use(
            async (c) => {
                const isTokenMissing =
                    !c.headers["Authorization"] || !c.headers["authorization"];
                // // console.log(c.data.sessionToken);
                // console.log(isTokenMissing, "EDRIAN");
                // if (isTokenMissing) {
                //     // console.log(`useSession`, useSession())
                //     // const session = (await getSession()) as any;

                //     console.log(` c.headers`,  c.headers);
                //     c.headers['Authorization'] = c.headers?.Authorization;
                // }

                return c;
            },
            (e) => {
                console.log("AXIOS_INTERCEPTOR_REQUEST_ERROR", e);
                Promise.reject(e);
            },
        );

        // client.interceptors.response.use(
        //     async r => {},
        //     async e => {
        //         console.log('AXIOS_INTERCEPTOR_RESPONSE_ERROR', e);

        //         return ERROR_RESPONSE;
        //     },
        // );

        // client.interceptors.response.use(
        //     async r => r.data,
        //     async e => {
        //         console.log('AXIOS_INTERCEPTOR_RESPONSE_ERROR', e);

        //         return ERROR_RESPONSE;
        //     },
        // );

        client.interceptors.response.use(
            async (r) => r.data,
            async (e) => {
                console.log("AXIOS_INTERCEPTOR_RESPONSE_ERROR", e);

                return e;
            },
        );

        this.client = client;
    }

    public static setToken(token: string) {
        LocalService.token = token;
    }

    protected async sendByGet({ url, config }: GetParams) {
        try {
            const res = await this.client.get(url, config);

            //   if (!ACCEPTED_STATUS.includes(res?.data?.status)) throw new Error();

            return res;
        } catch (e: any) {
            return e;
        }
    }

    protected async sendByPost({ url, data, config }: PostParams): Promise<any> {
        try {
            //const res = await this.client.post(url, data, config);
            const res = await this.client.post(url, data, config);

            // console.log(`res`, res.data)
            // auto-terminate next-auth session
            // if (res?.data?.state === 'login') signOut();

            // if (!ACCEPTED_STATUS.includes(res?.data?.status)) throw new Error();

            return res;
        } catch (e: any) {
            return e;
        }
    }
}
