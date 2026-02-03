import { EUserBroadcastingChannel } from "@/enum/websockets/enum.user.broadcasting";
import { RefObject } from "react";

const useWebsocketsTradingTicker = ({ parameters, wsRef }: Props) => {
    const WS_TRADING_TICKER_URL: string | undefined = process.env.NEXT_PUBLIC_USER_BROADCASTING;
    const WS_CONNECT = () => {
        try {
            if (!WS_TRADING_TICKER_URL) {
                console.error("No websockets url");
                return;
            }

            const transformedSymbol = parameters.symbol.replace(/-/g, "").toLocaleLowerCase();
            const interval = parameters.interval;
            const channel = `${EUserBroadcastingChannel.TICKER}:${transformedSymbol}:${interval}`.toLowerCase();

            console.log("You are subscribing to this channel", channel);

            const subscriptionMessage: {
                action: "subscribe",
                data: {
                    channel: string
                }
            } = {
                action: "subscribe",
                data: {
                    channel
                }
            }

            const STRING_subscriptionMessage = JSON.stringify(subscriptionMessage);
            console.log("This is the subscription message", subscriptionMessage);

            const ws = new WebSocket(WS_TRADING_TICKER_URL);
            ws.binaryType = 'arraybuffer';
            wsRef.current = ws;

            ws.onopen = () => {
                try {
                    console.log("[WebSocket] Connected to ticker");
                    ws.send(STRING_subscriptionMessage);
                    console.log("[WebSocket] Subscription message sent:", subscriptionMessage);
                }
                catch (error) {
                    console.error("Connection not established", error)
                    return;
                }
            }

            ws.onmessage = (event) => {
                try {
                    const data = event?.data;
                    console.log("event11111", data)
                }
                catch (error) {
                    console.error("failed to capture event", error);
                    return;
                }
            }

        }
        catch (error) {
            console.error(error);
            return;
        }
    }

    return {
        WS_CONNECT
    }
}

export default useWebsocketsTradingTicker;

type Props = {
    parameters: any;
    wsRef: RefObject<WebSocket | null>,

}