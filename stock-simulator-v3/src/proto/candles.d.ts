import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace marketdata. */
export namespace marketdata {

    /** Properties of an OrderBookLevel. */
    interface IOrderBookLevel {

        /** OrderBookLevel price */
        price?: (number|null);

        /** OrderBookLevel quantity */
        quantity?: (number|null);
    }

    /** Represents an OrderBookLevel. */
    class OrderBookLevel implements IOrderBookLevel {

        /**
         * Constructs a new OrderBookLevel.
         * @param [properties] Properties to set
         */
        constructor(properties?: marketdata.IOrderBookLevel);

        /** OrderBookLevel price. */
        public price: number;

        /** OrderBookLevel quantity. */
        public quantity: number;

        /**
         * Creates a new OrderBookLevel instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OrderBookLevel instance
         */
        public static create(properties?: marketdata.IOrderBookLevel): marketdata.OrderBookLevel;

        /**
         * Encodes the specified OrderBookLevel message. Does not implicitly {@link marketdata.OrderBookLevel.verify|verify} messages.
         * @param message OrderBookLevel message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: marketdata.IOrderBookLevel, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OrderBookLevel message, length delimited. Does not implicitly {@link marketdata.OrderBookLevel.verify|verify} messages.
         * @param message OrderBookLevel message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: marketdata.IOrderBookLevel, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OrderBookLevel message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OrderBookLevel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): marketdata.OrderBookLevel;

        /**
         * Decodes an OrderBookLevel message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OrderBookLevel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): marketdata.OrderBookLevel;

        /**
         * Verifies an OrderBookLevel message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OrderBookLevel message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OrderBookLevel
         */
        public static fromObject(object: { [k: string]: any }): marketdata.OrderBookLevel;

        /**
         * Creates a plain object from an OrderBookLevel message. Also converts values to other types if specified.
         * @param message OrderBookLevel
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: marketdata.OrderBookLevel, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OrderBookLevel to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for OrderBookLevel
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageHeader. */
    interface IMessageHeader {

        /** MessageHeader exchange */
        exchange?: (string|null);

        /** MessageHeader timestamp */
        timestamp?: (number|Long|null);

        /** MessageHeader symbol */
        symbol?: (string|null);
    }

    /** Represents a MessageHeader. */
    class MessageHeader implements IMessageHeader {

        /**
         * Constructs a new MessageHeader.
         * @param [properties] Properties to set
         */
        constructor(properties?: marketdata.IMessageHeader);

        /** MessageHeader exchange. */
        public exchange: string;

        /** MessageHeader timestamp. */
        public timestamp: (number|Long);

        /** MessageHeader symbol. */
        public symbol: string;

        /**
         * Creates a new MessageHeader instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageHeader instance
         */
        public static create(properties?: marketdata.IMessageHeader): marketdata.MessageHeader;

        /**
         * Encodes the specified MessageHeader message. Does not implicitly {@link marketdata.MessageHeader.verify|verify} messages.
         * @param message MessageHeader message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: marketdata.IMessageHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageHeader message, length delimited. Does not implicitly {@link marketdata.MessageHeader.verify|verify} messages.
         * @param message MessageHeader message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: marketdata.IMessageHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageHeader message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): marketdata.MessageHeader;

        /**
         * Decodes a MessageHeader message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): marketdata.MessageHeader;

        /**
         * Verifies a MessageHeader message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageHeader message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageHeader
         */
        public static fromObject(object: { [k: string]: any }): marketdata.MessageHeader;

        /**
         * Creates a plain object from a MessageHeader message. Also converts values to other types if specified.
         * @param message MessageHeader
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: marketdata.MessageHeader, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageHeader to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageHeader
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TickerMessage. */
    interface ITickerMessage {

        /** TickerMessage header */
        header?: (marketdata.IMessageHeader|null);
    }

    /** Represents a TickerMessage. */
    class TickerMessage implements ITickerMessage {

        /**
         * Constructs a new TickerMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: marketdata.ITickerMessage);

        /** TickerMessage header. */
        public header?: (marketdata.IMessageHeader|null);

        /**
         * Creates a new TickerMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TickerMessage instance
         */
        public static create(properties?: marketdata.ITickerMessage): marketdata.TickerMessage;

        /**
         * Encodes the specified TickerMessage message. Does not implicitly {@link marketdata.TickerMessage.verify|verify} messages.
         * @param message TickerMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: marketdata.ITickerMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TickerMessage message, length delimited. Does not implicitly {@link marketdata.TickerMessage.verify|verify} messages.
         * @param message TickerMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: marketdata.ITickerMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TickerMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TickerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): marketdata.TickerMessage;

        /**
         * Decodes a TickerMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TickerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): marketdata.TickerMessage;

        /**
         * Verifies a TickerMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TickerMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TickerMessage
         */
        public static fromObject(object: { [k: string]: any }): marketdata.TickerMessage;

        /**
         * Creates a plain object from a TickerMessage message. Also converts values to other types if specified.
         * @param message TickerMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: marketdata.TickerMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TickerMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TickerMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TradeMessage. */
    interface ITradeMessage {

        /** TradeMessage header */
        header?: (marketdata.IMessageHeader|null);

        /** TradeMessage price */
        price?: (string|null);

        /** TradeMessage side */
        side?: (number|null);

        /** TradeMessage size */
        size?: (string|null);

        /** TradeMessage tradeId */
        tradeId?: (string|null);
    }

    /** Represents a TradeMessage. */
    class TradeMessage implements ITradeMessage {

        /**
         * Constructs a new TradeMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: marketdata.ITradeMessage);

        /** TradeMessage header. */
        public header?: (marketdata.IMessageHeader|null);

        /** TradeMessage price. */
        public price: string;

        /** TradeMessage side. */
        public side: number;

        /** TradeMessage size. */
        public size: string;

        /** TradeMessage tradeId. */
        public tradeId: string;

        /**
         * Creates a new TradeMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeMessage instance
         */
        public static create(properties?: marketdata.ITradeMessage): marketdata.TradeMessage;

        /**
         * Encodes the specified TradeMessage message. Does not implicitly {@link marketdata.TradeMessage.verify|verify} messages.
         * @param message TradeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: marketdata.ITradeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TradeMessage message, length delimited. Does not implicitly {@link marketdata.TradeMessage.verify|verify} messages.
         * @param message TradeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: marketdata.ITradeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TradeMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): marketdata.TradeMessage;

        /**
         * Decodes a TradeMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TradeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): marketdata.TradeMessage;

        /**
         * Verifies a TradeMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TradeMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TradeMessage
         */
        public static fromObject(object: { [k: string]: any }): marketdata.TradeMessage;

        /**
         * Creates a plain object from a TradeMessage message. Also converts values to other types if specified.
         * @param message TradeMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: marketdata.TradeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TradeMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TradeMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an OrderBookMessage. */
    interface IOrderBookMessage {

        /** OrderBookMessage header */
        header?: (marketdata.IMessageHeader|null);

        /** OrderBookMessage bids */
        bids?: (marketdata.IOrderBookLevel[]|null);

        /** OrderBookMessage asks */
        asks?: (marketdata.IOrderBookLevel[]|null);
    }

    /** Represents an OrderBookMessage. */
    class OrderBookMessage implements IOrderBookMessage {

        /**
         * Constructs a new OrderBookMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: marketdata.IOrderBookMessage);

        /** OrderBookMessage header. */
        public header?: (marketdata.IMessageHeader|null);

        /** OrderBookMessage bids. */
        public bids: marketdata.IOrderBookLevel[];

        /** OrderBookMessage asks. */
        public asks: marketdata.IOrderBookLevel[];

        /**
         * Creates a new OrderBookMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OrderBookMessage instance
         */
        public static create(properties?: marketdata.IOrderBookMessage): marketdata.OrderBookMessage;

        /**
         * Encodes the specified OrderBookMessage message. Does not implicitly {@link marketdata.OrderBookMessage.verify|verify} messages.
         * @param message OrderBookMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: marketdata.IOrderBookMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OrderBookMessage message, length delimited. Does not implicitly {@link marketdata.OrderBookMessage.verify|verify} messages.
         * @param message OrderBookMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: marketdata.IOrderBookMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OrderBookMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OrderBookMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): marketdata.OrderBookMessage;

        /**
         * Decodes an OrderBookMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OrderBookMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): marketdata.OrderBookMessage;

        /**
         * Verifies an OrderBookMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OrderBookMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OrderBookMessage
         */
        public static fromObject(object: { [k: string]: any }): marketdata.OrderBookMessage;

        /**
         * Creates a plain object from an OrderBookMessage message. Also converts values to other types if specified.
         * @param message OrderBookMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: marketdata.OrderBookMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OrderBookMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for OrderBookMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CandleMessage. */
    interface ICandleMessage {

        /** CandleMessage header */
        header?: (marketdata.IMessageHeader|null);

        /** CandleMessage interval */
        interval?: (string|null);

        /** CandleMessage openTime */
        openTime?: (number|Long|null);

        /** CandleMessage closeTime */
        closeTime?: (number|Long|null);

        /** CandleMessage open */
        open?: (string|null);

        /** CandleMessage high */
        high?: (string|null);

        /** CandleMessage low */
        low?: (string|null);

        /** CandleMessage close */
        close?: (string|null);

        /** CandleMessage volume */
        volume?: (string|null);

        /** CandleMessage trades */
        trades?: (number|Long|null);
    }

    /** Represents a CandleMessage. */
    class CandleMessage implements ICandleMessage {

        /**
         * Constructs a new CandleMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: marketdata.ICandleMessage);

        /** CandleMessage header. */
        public header?: (marketdata.IMessageHeader|null);

        /** CandleMessage interval. */
        public interval: string;

        /** CandleMessage openTime. */
        public openTime: (number|Long);

        /** CandleMessage closeTime. */
        public closeTime: (number|Long);

        /** CandleMessage open. */
        public open: string;

        /** CandleMessage high. */
        public high: string;

        /** CandleMessage low. */
        public low: string;

        /** CandleMessage close. */
        public close: string;

        /** CandleMessage volume. */
        public volume: string;

        /** CandleMessage trades. */
        public trades: (number|Long);

        /**
         * Creates a new CandleMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CandleMessage instance
         */
        public static create(properties?: marketdata.ICandleMessage): marketdata.CandleMessage;

        /**
         * Encodes the specified CandleMessage message. Does not implicitly {@link marketdata.CandleMessage.verify|verify} messages.
         * @param message CandleMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: marketdata.ICandleMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CandleMessage message, length delimited. Does not implicitly {@link marketdata.CandleMessage.verify|verify} messages.
         * @param message CandleMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: marketdata.ICandleMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CandleMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CandleMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): marketdata.CandleMessage;

        /**
         * Decodes a CandleMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CandleMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): marketdata.CandleMessage;

        /**
         * Verifies a CandleMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CandleMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CandleMessage
         */
        public static fromObject(object: { [k: string]: any }): marketdata.CandleMessage;

        /**
         * Creates a plain object from a CandleMessage message. Also converts values to other types if specified.
         * @param message CandleMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: marketdata.CandleMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CandleMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CandleMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MarketDataMessage. */
    interface IMarketDataMessage {

        /** MarketDataMessage header */
        header?: (marketdata.IMessageHeader|null);

        /** MarketDataMessage ticker */
        ticker?: (marketdata.ITickerMessage|null);

        /** MarketDataMessage trade */
        trade?: (marketdata.ITradeMessage|null);

        /** MarketDataMessage orderbook */
        orderbook?: (marketdata.IOrderBookMessage|null);

        /** MarketDataMessage candle */
        candle?: (marketdata.ICandleMessage|null);

        /** MarketDataMessage extraData */
        extraData?: (Uint8Array|null);
    }

    /** Represents a MarketDataMessage. */
    class MarketDataMessage implements IMarketDataMessage {

        /**
         * Constructs a new MarketDataMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: marketdata.IMarketDataMessage);

        /** MarketDataMessage header. */
        public header?: (marketdata.IMessageHeader|null);

        /** MarketDataMessage ticker. */
        public ticker?: (marketdata.ITickerMessage|null);

        /** MarketDataMessage trade. */
        public trade?: (marketdata.ITradeMessage|null);

        /** MarketDataMessage orderbook. */
        public orderbook?: (marketdata.IOrderBookMessage|null);

        /** MarketDataMessage candle. */
        public candle?: (marketdata.ICandleMessage|null);

        /** MarketDataMessage extraData. */
        public extraData: Uint8Array;

        /** MarketDataMessage messageType. */
        public messageType?: ("ticker"|"trade"|"orderbook"|"candle");

        /**
         * Creates a new MarketDataMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MarketDataMessage instance
         */
        public static create(properties?: marketdata.IMarketDataMessage): marketdata.MarketDataMessage;

        /**
         * Encodes the specified MarketDataMessage message. Does not implicitly {@link marketdata.MarketDataMessage.verify|verify} messages.
         * @param message MarketDataMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: marketdata.IMarketDataMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MarketDataMessage message, length delimited. Does not implicitly {@link marketdata.MarketDataMessage.verify|verify} messages.
         * @param message MarketDataMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: marketdata.IMarketDataMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MarketDataMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MarketDataMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): marketdata.MarketDataMessage;

        /**
         * Decodes a MarketDataMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MarketDataMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): marketdata.MarketDataMessage;

        /**
         * Verifies a MarketDataMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MarketDataMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MarketDataMessage
         */
        public static fromObject(object: { [k: string]: any }): marketdata.MarketDataMessage;

        /**
         * Creates a plain object from a MarketDataMessage message. Also converts values to other types if specified.
         * @param message MarketDataMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: marketdata.MarketDataMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MarketDataMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MarketDataMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
