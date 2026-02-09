
import { EUserBroadcastingAction, EUserBroadcastingChannel } from "@/enum/websockets/enum.user.broadcasting";
import { TDataCandlesWebsockets, TDataTradingCandles, TParamsTradingCandles } from "@/types/services/dev-coin-user/types.candles";
import { RefObject } from "react";
import { marketdata } from '@/proto/candles';


const useWebsocketsTradingCandles = ({ parameters, wsRef, wsQueueRef }: Props) => {
    const WS_TRADING_CANDLES_URL: string | undefined = process.env.NEXT_PUBLIC_USER_BROADCASTING;
    const WS_CONNECT = () => {
        try {
            if (!WS_TRADING_CANDLES_URL) {
                console.error("No websockets url");
                return;
            }

            const transformedSymbol = parameters.symbol.replace(/-/g, "").toLocaleLowerCase();
            const interval = parameters.interval;
            const channel = `${EUserBroadcastingChannel.CANDLE}:${transformedSymbol}:${interval}`.toLowerCase();

            console.log("You are subscribing to this channel", channel);

            const subscriptionMessage: {
                action: EUserBroadcastingAction.SUBSCRIBE,
                data: {
                    channel: string
                }
            } = {
                action: EUserBroadcastingAction.SUBSCRIBE,
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
                    console.log("[WebSocket] Connected to candles");
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
                    if(data instanceof ArrayBuffer){

                        const bytes = new Uint8Array(data);
                        const DecodedMessage = marketdata.MarketDataMessage.decode(bytes);
                        const transformedMessage: TDataTradingCandles = {
                            timestamp: DecodedMessage?.header?.timestamp,
                            open: Number(DecodedMessage?.candle?.open || 0),
                            high: Number(DecodedMessage?.candle?.high),
                            low: Number(DecodedMessage?.candle?.low),
                            close: Number(DecodedMessage?.candle?.close || 0),
                            volume: Number(DecodedMessage?.candle?.volume)
                        }
                        wsQueueRef.current.push(transformedMessage);                      
                    }
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
    wsQueueRef: RefObject<TDataTradingCandles[]>
}