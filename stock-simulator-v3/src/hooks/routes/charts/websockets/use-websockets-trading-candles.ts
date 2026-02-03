import { TParamsTradingCandles } from "@/types/services/dev-coin-user/types.candles";
import { RefObject } from "react";

const useWebsocketsTradingCandles = ({ parameters, wsRef }: Props) => {
    const WS_TRADING_CANDLES_URL: string | undefined = process.env.NEXT_PUBLIC_CANDLES_WEBSOCKET_URL;
    const WS_CONNECT = () => {
        try {
            if (!WS_TRADING_CANDLES_URL) {
                console.error("No websockets url");
                return;
            }

            const transformedSymbol = parameters.symbol.replace(/-/g, "").toLocaleLowerCase();
            const interval = parameters.interval;
            const channel = `candle:${transformedSymbol}:${interval}`.toLowerCase();

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

            const ws = new WebSocket(WS_TRADING_CANDLES_URL);
            ws.binaryType = 'arraybuffer';
            wsRef.current = ws;

            ws.onopen = () => {
                try {
                    console.log("[WebSocket] Connected to Orderbook");
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

export default useWebsocketsTradingCandles;

type Props = {
    parameters: Pick<TParamsTradingCandles, "symbol" | "interval">;
    wsRef: RefObject<WebSocket | null>,

}