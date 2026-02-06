/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const marketdata = $root.marketdata = (() => {

    /**
     * Namespace marketdata.
     * @exports marketdata
     * @namespace
     */
    const marketdata = {};

    marketdata.OrderBookLevel = (function() {

        /**
         * Properties of an OrderBookLevel.
         * @memberof marketdata
         * @interface IOrderBookLevel
         * @property {number|null} [price] OrderBookLevel price
         * @property {number|null} [quantity] OrderBookLevel quantity
         */

        /**
         * Constructs a new OrderBookLevel.
         * @memberof marketdata
         * @classdesc Represents an OrderBookLevel.
         * @implements IOrderBookLevel
         * @constructor
         * @param {marketdata.IOrderBookLevel=} [properties] Properties to set
         */
        function OrderBookLevel(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OrderBookLevel price.
         * @member {number} price
         * @memberof marketdata.OrderBookLevel
         * @instance
         */
        OrderBookLevel.prototype.price = 0;

        /**
         * OrderBookLevel quantity.
         * @member {number} quantity
         * @memberof marketdata.OrderBookLevel
         * @instance
         */
        OrderBookLevel.prototype.quantity = 0;

        /**
         * Creates a new OrderBookLevel instance using the specified properties.
         * @function create
         * @memberof marketdata.OrderBookLevel
         * @static
         * @param {marketdata.IOrderBookLevel=} [properties] Properties to set
         * @returns {marketdata.OrderBookLevel} OrderBookLevel instance
         */
        OrderBookLevel.create = function create(properties) {
            return new OrderBookLevel(properties);
        };

        /**
         * Encodes the specified OrderBookLevel message. Does not implicitly {@link marketdata.OrderBookLevel.verify|verify} messages.
         * @function encode
         * @memberof marketdata.OrderBookLevel
         * @static
         * @param {marketdata.IOrderBookLevel} message OrderBookLevel message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OrderBookLevel.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.price != null && Object.hasOwnProperty.call(message, "price"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.price);
            if (message.quantity != null && Object.hasOwnProperty.call(message, "quantity"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.quantity);
            return writer;
        };

        /**
         * Encodes the specified OrderBookLevel message, length delimited. Does not implicitly {@link marketdata.OrderBookLevel.verify|verify} messages.
         * @function encodeDelimited
         * @memberof marketdata.OrderBookLevel
         * @static
         * @param {marketdata.IOrderBookLevel} message OrderBookLevel message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OrderBookLevel.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OrderBookLevel message from the specified reader or buffer.
         * @function decode
         * @memberof marketdata.OrderBookLevel
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {marketdata.OrderBookLevel} OrderBookLevel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OrderBookLevel.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.marketdata.OrderBookLevel();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.price = reader.double();
                        break;
                    }
                case 2: {
                        message.quantity = reader.double();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an OrderBookLevel message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof marketdata.OrderBookLevel
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {marketdata.OrderBookLevel} OrderBookLevel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OrderBookLevel.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OrderBookLevel message.
         * @function verify
         * @memberof marketdata.OrderBookLevel
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OrderBookLevel.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.price != null && message.hasOwnProperty("price"))
                if (typeof message.price !== "number")
                    return "price: number expected";
            if (message.quantity != null && message.hasOwnProperty("quantity"))
                if (typeof message.quantity !== "number")
                    return "quantity: number expected";
            return null;
        };

        /**
         * Creates an OrderBookLevel message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof marketdata.OrderBookLevel
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {marketdata.OrderBookLevel} OrderBookLevel
         */
        OrderBookLevel.fromObject = function fromObject(object) {
            if (object instanceof $root.marketdata.OrderBookLevel)
                return object;
            let message = new $root.marketdata.OrderBookLevel();
            if (object.price != null)
                message.price = Number(object.price);
            if (object.quantity != null)
                message.quantity = Number(object.quantity);
            return message;
        };

        /**
         * Creates a plain object from an OrderBookLevel message. Also converts values to other types if specified.
         * @function toObject
         * @memberof marketdata.OrderBookLevel
         * @static
         * @param {marketdata.OrderBookLevel} message OrderBookLevel
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OrderBookLevel.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.price = 0;
                object.quantity = 0;
            }
            if (message.price != null && message.hasOwnProperty("price"))
                object.price = options.json && !isFinite(message.price) ? String(message.price) : message.price;
            if (message.quantity != null && message.hasOwnProperty("quantity"))
                object.quantity = options.json && !isFinite(message.quantity) ? String(message.quantity) : message.quantity;
            return object;
        };

        /**
         * Converts this OrderBookLevel to JSON.
         * @function toJSON
         * @memberof marketdata.OrderBookLevel
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OrderBookLevel.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for OrderBookLevel
         * @function getTypeUrl
         * @memberof marketdata.OrderBookLevel
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        OrderBookLevel.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/marketdata.OrderBookLevel";
        };

        return OrderBookLevel;
    })();

    marketdata.MessageHeader = (function() {

        /**
         * Properties of a MessageHeader.
         * @memberof marketdata
         * @interface IMessageHeader
         * @property {string|null} [exchange] MessageHeader exchange
         * @property {number|Long|null} [timestamp] MessageHeader timestamp
         * @property {string|null} [symbol] MessageHeader symbol
         */

        /**
         * Constructs a new MessageHeader.
         * @memberof marketdata
         * @classdesc Represents a MessageHeader.
         * @implements IMessageHeader
         * @constructor
         * @param {marketdata.IMessageHeader=} [properties] Properties to set
         */
        function MessageHeader(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MessageHeader exchange.
         * @member {string} exchange
         * @memberof marketdata.MessageHeader
         * @instance
         */
        MessageHeader.prototype.exchange = "";

        /**
         * MessageHeader timestamp.
         * @member {number|Long} timestamp
         * @memberof marketdata.MessageHeader
         * @instance
         */
        MessageHeader.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * MessageHeader symbol.
         * @member {string} symbol
         * @memberof marketdata.MessageHeader
         * @instance
         */
        MessageHeader.prototype.symbol = "";

        /**
         * Creates a new MessageHeader instance using the specified properties.
         * @function create
         * @memberof marketdata.MessageHeader
         * @static
         * @param {marketdata.IMessageHeader=} [properties] Properties to set
         * @returns {marketdata.MessageHeader} MessageHeader instance
         */
        MessageHeader.create = function create(properties) {
            return new MessageHeader(properties);
        };

        /**
         * Encodes the specified MessageHeader message. Does not implicitly {@link marketdata.MessageHeader.verify|verify} messages.
         * @function encode
         * @memberof marketdata.MessageHeader
         * @static
         * @param {marketdata.IMessageHeader} message MessageHeader message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MessageHeader.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.exchange != null && Object.hasOwnProperty.call(message, "exchange"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.exchange);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestamp);
            if (message.symbol != null && Object.hasOwnProperty.call(message, "symbol"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.symbol);
            return writer;
        };

        /**
         * Encodes the specified MessageHeader message, length delimited. Does not implicitly {@link marketdata.MessageHeader.verify|verify} messages.
         * @function encodeDelimited
         * @memberof marketdata.MessageHeader
         * @static
         * @param {marketdata.IMessageHeader} message MessageHeader message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MessageHeader.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MessageHeader message from the specified reader or buffer.
         * @function decode
         * @memberof marketdata.MessageHeader
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {marketdata.MessageHeader} MessageHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MessageHeader.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.marketdata.MessageHeader();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.exchange = reader.string();
                        break;
                    }
                case 2: {
                        message.timestamp = reader.int64();
                        break;
                    }
                case 3: {
                        message.symbol = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MessageHeader message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof marketdata.MessageHeader
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {marketdata.MessageHeader} MessageHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MessageHeader.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MessageHeader message.
         * @function verify
         * @memberof marketdata.MessageHeader
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MessageHeader.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.exchange != null && message.hasOwnProperty("exchange"))
                if (!$util.isString(message.exchange))
                    return "exchange: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.symbol != null && message.hasOwnProperty("symbol"))
                if (!$util.isString(message.symbol))
                    return "symbol: string expected";
            return null;
        };

        /**
         * Creates a MessageHeader message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof marketdata.MessageHeader
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {marketdata.MessageHeader} MessageHeader
         */
        MessageHeader.fromObject = function fromObject(object) {
            if (object instanceof $root.marketdata.MessageHeader)
                return object;
            let message = new $root.marketdata.MessageHeader();
            if (object.exchange != null)
                message.exchange = String(object.exchange);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.symbol != null)
                message.symbol = String(object.symbol);
            return message;
        };

        /**
         * Creates a plain object from a MessageHeader message. Also converts values to other types if specified.
         * @function toObject
         * @memberof marketdata.MessageHeader
         * @static
         * @param {marketdata.MessageHeader} message MessageHeader
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MessageHeader.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.exchange = "";
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.symbol = "";
            }
            if (message.exchange != null && message.hasOwnProperty("exchange"))
                object.exchange = message.exchange;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.symbol != null && message.hasOwnProperty("symbol"))
                object.symbol = message.symbol;
            return object;
        };

        /**
         * Converts this MessageHeader to JSON.
         * @function toJSON
         * @memberof marketdata.MessageHeader
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MessageHeader.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MessageHeader
         * @function getTypeUrl
         * @memberof marketdata.MessageHeader
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MessageHeader.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/marketdata.MessageHeader";
        };

        return MessageHeader;
    })();

    marketdata.TickerMessage = (function() {

        /**
         * Properties of a TickerMessage.
         * @memberof marketdata
         * @interface ITickerMessage
         * @property {marketdata.IMessageHeader|null} [header] TickerMessage header
         */

        /**
         * Constructs a new TickerMessage.
         * @memberof marketdata
         * @classdesc Represents a TickerMessage.
         * @implements ITickerMessage
         * @constructor
         * @param {marketdata.ITickerMessage=} [properties] Properties to set
         */
        function TickerMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TickerMessage header.
         * @member {marketdata.IMessageHeader|null|undefined} header
         * @memberof marketdata.TickerMessage
         * @instance
         */
        TickerMessage.prototype.header = null;

        /**
         * Creates a new TickerMessage instance using the specified properties.
         * @function create
         * @memberof marketdata.TickerMessage
         * @static
         * @param {marketdata.ITickerMessage=} [properties] Properties to set
         * @returns {marketdata.TickerMessage} TickerMessage instance
         */
        TickerMessage.create = function create(properties) {
            return new TickerMessage(properties);
        };

        /**
         * Encodes the specified TickerMessage message. Does not implicitly {@link marketdata.TickerMessage.verify|verify} messages.
         * @function encode
         * @memberof marketdata.TickerMessage
         * @static
         * @param {marketdata.ITickerMessage} message TickerMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TickerMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                $root.marketdata.MessageHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TickerMessage message, length delimited. Does not implicitly {@link marketdata.TickerMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof marketdata.TickerMessage
         * @static
         * @param {marketdata.ITickerMessage} message TickerMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TickerMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TickerMessage message from the specified reader or buffer.
         * @function decode
         * @memberof marketdata.TickerMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {marketdata.TickerMessage} TickerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TickerMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.marketdata.TickerMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.header = $root.marketdata.MessageHeader.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TickerMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof marketdata.TickerMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {marketdata.TickerMessage} TickerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TickerMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TickerMessage message.
         * @function verify
         * @memberof marketdata.TickerMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TickerMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.header != null && message.hasOwnProperty("header")) {
                let error = $root.marketdata.MessageHeader.verify(message.header);
                if (error)
                    return "header." + error;
            }
            return null;
        };

        /**
         * Creates a TickerMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof marketdata.TickerMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {marketdata.TickerMessage} TickerMessage
         */
        TickerMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.marketdata.TickerMessage)
                return object;
            let message = new $root.marketdata.TickerMessage();
            if (object.header != null) {
                if (typeof object.header !== "object")
                    throw TypeError(".marketdata.TickerMessage.header: object expected");
                message.header = $root.marketdata.MessageHeader.fromObject(object.header);
            }
            return message;
        };

        /**
         * Creates a plain object from a TickerMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof marketdata.TickerMessage
         * @static
         * @param {marketdata.TickerMessage} message TickerMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TickerMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.header = null;
            if (message.header != null && message.hasOwnProperty("header"))
                object.header = $root.marketdata.MessageHeader.toObject(message.header, options);
            return object;
        };

        /**
         * Converts this TickerMessage to JSON.
         * @function toJSON
         * @memberof marketdata.TickerMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TickerMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TickerMessage
         * @function getTypeUrl
         * @memberof marketdata.TickerMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TickerMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/marketdata.TickerMessage";
        };

        return TickerMessage;
    })();

    marketdata.TradeMessage = (function() {

        /**
         * Properties of a TradeMessage.
         * @memberof marketdata
         * @interface ITradeMessage
         * @property {marketdata.IMessageHeader|null} [header] TradeMessage header
         * @property {string|null} [price] TradeMessage price
         * @property {number|null} [side] TradeMessage side
         * @property {string|null} [size] TradeMessage size
         * @property {string|null} [tradeId] TradeMessage tradeId
         */

        /**
         * Constructs a new TradeMessage.
         * @memberof marketdata
         * @classdesc Represents a TradeMessage.
         * @implements ITradeMessage
         * @constructor
         * @param {marketdata.ITradeMessage=} [properties] Properties to set
         */
        function TradeMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TradeMessage header.
         * @member {marketdata.IMessageHeader|null|undefined} header
         * @memberof marketdata.TradeMessage
         * @instance
         */
        TradeMessage.prototype.header = null;

        /**
         * TradeMessage price.
         * @member {string} price
         * @memberof marketdata.TradeMessage
         * @instance
         */
        TradeMessage.prototype.price = "";

        /**
         * TradeMessage side.
         * @member {number} side
         * @memberof marketdata.TradeMessage
         * @instance
         */
        TradeMessage.prototype.side = 0;

        /**
         * TradeMessage size.
         * @member {string} size
         * @memberof marketdata.TradeMessage
         * @instance
         */
        TradeMessage.prototype.size = "";

        /**
         * TradeMessage tradeId.
         * @member {string} tradeId
         * @memberof marketdata.TradeMessage
         * @instance
         */
        TradeMessage.prototype.tradeId = "";

        /**
         * Creates a new TradeMessage instance using the specified properties.
         * @function create
         * @memberof marketdata.TradeMessage
         * @static
         * @param {marketdata.ITradeMessage=} [properties] Properties to set
         * @returns {marketdata.TradeMessage} TradeMessage instance
         */
        TradeMessage.create = function create(properties) {
            return new TradeMessage(properties);
        };

        /**
         * Encodes the specified TradeMessage message. Does not implicitly {@link marketdata.TradeMessage.verify|verify} messages.
         * @function encode
         * @memberof marketdata.TradeMessage
         * @static
         * @param {marketdata.ITradeMessage} message TradeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TradeMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                $root.marketdata.MessageHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.price != null && Object.hasOwnProperty.call(message, "price"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.price);
            if (message.side != null && Object.hasOwnProperty.call(message, "side"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.side);
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.size);
            if (message.tradeId != null && Object.hasOwnProperty.call(message, "tradeId"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.tradeId);
            return writer;
        };

        /**
         * Encodes the specified TradeMessage message, length delimited. Does not implicitly {@link marketdata.TradeMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof marketdata.TradeMessage
         * @static
         * @param {marketdata.ITradeMessage} message TradeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TradeMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TradeMessage message from the specified reader or buffer.
         * @function decode
         * @memberof marketdata.TradeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {marketdata.TradeMessage} TradeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TradeMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.marketdata.TradeMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.header = $root.marketdata.MessageHeader.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.price = reader.string();
                        break;
                    }
                case 3: {
                        message.side = reader.int32();
                        break;
                    }
                case 4: {
                        message.size = reader.string();
                        break;
                    }
                case 5: {
                        message.tradeId = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TradeMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof marketdata.TradeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {marketdata.TradeMessage} TradeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TradeMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TradeMessage message.
         * @function verify
         * @memberof marketdata.TradeMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TradeMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.header != null && message.hasOwnProperty("header")) {
                let error = $root.marketdata.MessageHeader.verify(message.header);
                if (error)
                    return "header." + error;
            }
            if (message.price != null && message.hasOwnProperty("price"))
                if (!$util.isString(message.price))
                    return "price: string expected";
            if (message.side != null && message.hasOwnProperty("side"))
                if (!$util.isInteger(message.side))
                    return "side: integer expected";
            if (message.size != null && message.hasOwnProperty("size"))
                if (!$util.isString(message.size))
                    return "size: string expected";
            if (message.tradeId != null && message.hasOwnProperty("tradeId"))
                if (!$util.isString(message.tradeId))
                    return "tradeId: string expected";
            return null;
        };

        /**
         * Creates a TradeMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof marketdata.TradeMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {marketdata.TradeMessage} TradeMessage
         */
        TradeMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.marketdata.TradeMessage)
                return object;
            let message = new $root.marketdata.TradeMessage();
            if (object.header != null) {
                if (typeof object.header !== "object")
                    throw TypeError(".marketdata.TradeMessage.header: object expected");
                message.header = $root.marketdata.MessageHeader.fromObject(object.header);
            }
            if (object.price != null)
                message.price = String(object.price);
            if (object.side != null)
                message.side = object.side | 0;
            if (object.size != null)
                message.size = String(object.size);
            if (object.tradeId != null)
                message.tradeId = String(object.tradeId);
            return message;
        };

        /**
         * Creates a plain object from a TradeMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof marketdata.TradeMessage
         * @static
         * @param {marketdata.TradeMessage} message TradeMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TradeMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.header = null;
                object.price = "";
                object.side = 0;
                object.size = "";
                object.tradeId = "";
            }
            if (message.header != null && message.hasOwnProperty("header"))
                object.header = $root.marketdata.MessageHeader.toObject(message.header, options);
            if (message.price != null && message.hasOwnProperty("price"))
                object.price = message.price;
            if (message.side != null && message.hasOwnProperty("side"))
                object.side = message.side;
            if (message.size != null && message.hasOwnProperty("size"))
                object.size = message.size;
            if (message.tradeId != null && message.hasOwnProperty("tradeId"))
                object.tradeId = message.tradeId;
            return object;
        };

        /**
         * Converts this TradeMessage to JSON.
         * @function toJSON
         * @memberof marketdata.TradeMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TradeMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TradeMessage
         * @function getTypeUrl
         * @memberof marketdata.TradeMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TradeMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/marketdata.TradeMessage";
        };

        return TradeMessage;
    })();

    marketdata.OrderBookMessage = (function() {

        /**
         * Properties of an OrderBookMessage.
         * @memberof marketdata
         * @interface IOrderBookMessage
         * @property {marketdata.IMessageHeader|null} [header] OrderBookMessage header
         * @property {Array.<marketdata.IOrderBookLevel>|null} [bids] OrderBookMessage bids
         * @property {Array.<marketdata.IOrderBookLevel>|null} [asks] OrderBookMessage asks
         */

        /**
         * Constructs a new OrderBookMessage.
         * @memberof marketdata
         * @classdesc Represents an OrderBookMessage.
         * @implements IOrderBookMessage
         * @constructor
         * @param {marketdata.IOrderBookMessage=} [properties] Properties to set
         */
        function OrderBookMessage(properties) {
            this.bids = [];
            this.asks = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OrderBookMessage header.
         * @member {marketdata.IMessageHeader|null|undefined} header
         * @memberof marketdata.OrderBookMessage
         * @instance
         */
        OrderBookMessage.prototype.header = null;

        /**
         * OrderBookMessage bids.
         * @member {Array.<marketdata.IOrderBookLevel>} bids
         * @memberof marketdata.OrderBookMessage
         * @instance
         */
        OrderBookMessage.prototype.bids = $util.emptyArray;

        /**
         * OrderBookMessage asks.
         * @member {Array.<marketdata.IOrderBookLevel>} asks
         * @memberof marketdata.OrderBookMessage
         * @instance
         */
        OrderBookMessage.prototype.asks = $util.emptyArray;

        /**
         * Creates a new OrderBookMessage instance using the specified properties.
         * @function create
         * @memberof marketdata.OrderBookMessage
         * @static
         * @param {marketdata.IOrderBookMessage=} [properties] Properties to set
         * @returns {marketdata.OrderBookMessage} OrderBookMessage instance
         */
        OrderBookMessage.create = function create(properties) {
            return new OrderBookMessage(properties);
        };

        /**
         * Encodes the specified OrderBookMessage message. Does not implicitly {@link marketdata.OrderBookMessage.verify|verify} messages.
         * @function encode
         * @memberof marketdata.OrderBookMessage
         * @static
         * @param {marketdata.IOrderBookMessage} message OrderBookMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OrderBookMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                $root.marketdata.MessageHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.bids != null && message.bids.length)
                for (let i = 0; i < message.bids.length; ++i)
                    $root.marketdata.OrderBookLevel.encode(message.bids[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.asks != null && message.asks.length)
                for (let i = 0; i < message.asks.length; ++i)
                    $root.marketdata.OrderBookLevel.encode(message.asks[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified OrderBookMessage message, length delimited. Does not implicitly {@link marketdata.OrderBookMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof marketdata.OrderBookMessage
         * @static
         * @param {marketdata.IOrderBookMessage} message OrderBookMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OrderBookMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OrderBookMessage message from the specified reader or buffer.
         * @function decode
         * @memberof marketdata.OrderBookMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {marketdata.OrderBookMessage} OrderBookMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OrderBookMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.marketdata.OrderBookMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.header = $root.marketdata.MessageHeader.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        if (!(message.bids && message.bids.length))
                            message.bids = [];
                        message.bids.push($root.marketdata.OrderBookLevel.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        if (!(message.asks && message.asks.length))
                            message.asks = [];
                        message.asks.push($root.marketdata.OrderBookLevel.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an OrderBookMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof marketdata.OrderBookMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {marketdata.OrderBookMessage} OrderBookMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OrderBookMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OrderBookMessage message.
         * @function verify
         * @memberof marketdata.OrderBookMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OrderBookMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.header != null && message.hasOwnProperty("header")) {
                let error = $root.marketdata.MessageHeader.verify(message.header);
                if (error)
                    return "header." + error;
            }
            if (message.bids != null && message.hasOwnProperty("bids")) {
                if (!Array.isArray(message.bids))
                    return "bids: array expected";
                for (let i = 0; i < message.bids.length; ++i) {
                    let error = $root.marketdata.OrderBookLevel.verify(message.bids[i]);
                    if (error)
                        return "bids." + error;
                }
            }
            if (message.asks != null && message.hasOwnProperty("asks")) {
                if (!Array.isArray(message.asks))
                    return "asks: array expected";
                for (let i = 0; i < message.asks.length; ++i) {
                    let error = $root.marketdata.OrderBookLevel.verify(message.asks[i]);
                    if (error)
                        return "asks." + error;
                }
            }
            return null;
        };

        /**
         * Creates an OrderBookMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof marketdata.OrderBookMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {marketdata.OrderBookMessage} OrderBookMessage
         */
        OrderBookMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.marketdata.OrderBookMessage)
                return object;
            let message = new $root.marketdata.OrderBookMessage();
            if (object.header != null) {
                if (typeof object.header !== "object")
                    throw TypeError(".marketdata.OrderBookMessage.header: object expected");
                message.header = $root.marketdata.MessageHeader.fromObject(object.header);
            }
            if (object.bids) {
                if (!Array.isArray(object.bids))
                    throw TypeError(".marketdata.OrderBookMessage.bids: array expected");
                message.bids = [];
                for (let i = 0; i < object.bids.length; ++i) {
                    if (typeof object.bids[i] !== "object")
                        throw TypeError(".marketdata.OrderBookMessage.bids: object expected");
                    message.bids[i] = $root.marketdata.OrderBookLevel.fromObject(object.bids[i]);
                }
            }
            if (object.asks) {
                if (!Array.isArray(object.asks))
                    throw TypeError(".marketdata.OrderBookMessage.asks: array expected");
                message.asks = [];
                for (let i = 0; i < object.asks.length; ++i) {
                    if (typeof object.asks[i] !== "object")
                        throw TypeError(".marketdata.OrderBookMessage.asks: object expected");
                    message.asks[i] = $root.marketdata.OrderBookLevel.fromObject(object.asks[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an OrderBookMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof marketdata.OrderBookMessage
         * @static
         * @param {marketdata.OrderBookMessage} message OrderBookMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OrderBookMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.bids = [];
                object.asks = [];
            }
            if (options.defaults)
                object.header = null;
            if (message.header != null && message.hasOwnProperty("header"))
                object.header = $root.marketdata.MessageHeader.toObject(message.header, options);
            if (message.bids && message.bids.length) {
                object.bids = [];
                for (let j = 0; j < message.bids.length; ++j)
                    object.bids[j] = $root.marketdata.OrderBookLevel.toObject(message.bids[j], options);
            }
            if (message.asks && message.asks.length) {
                object.asks = [];
                for (let j = 0; j < message.asks.length; ++j)
                    object.asks[j] = $root.marketdata.OrderBookLevel.toObject(message.asks[j], options);
            }
            return object;
        };

        /**
         * Converts this OrderBookMessage to JSON.
         * @function toJSON
         * @memberof marketdata.OrderBookMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OrderBookMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for OrderBookMessage
         * @function getTypeUrl
         * @memberof marketdata.OrderBookMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        OrderBookMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/marketdata.OrderBookMessage";
        };

        return OrderBookMessage;
    })();

    marketdata.CandleMessage = (function() {

        /**
         * Properties of a CandleMessage.
         * @memberof marketdata
         * @interface ICandleMessage
         * @property {marketdata.IMessageHeader|null} [header] CandleMessage header
         * @property {string|null} [interval] CandleMessage interval
         * @property {number|Long|null} [openTime] CandleMessage openTime
         * @property {number|Long|null} [closeTime] CandleMessage closeTime
         * @property {string|null} [open] CandleMessage open
         * @property {string|null} [high] CandleMessage high
         * @property {string|null} [low] CandleMessage low
         * @property {string|null} [close] CandleMessage close
         * @property {string|null} [volume] CandleMessage volume
         * @property {number|Long|null} [trades] CandleMessage trades
         */

        /**
         * Constructs a new CandleMessage.
         * @memberof marketdata
         * @classdesc Represents a CandleMessage.
         * @implements ICandleMessage
         * @constructor
         * @param {marketdata.ICandleMessage=} [properties] Properties to set
         */
        function CandleMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CandleMessage header.
         * @member {marketdata.IMessageHeader|null|undefined} header
         * @memberof marketdata.CandleMessage
         * @instance
         */
        CandleMessage.prototype.header = null;

        /**
         * CandleMessage interval.
         * @member {string} interval
         * @memberof marketdata.CandleMessage
         * @instance
         */
        CandleMessage.prototype.interval = "";

        /**
         * CandleMessage openTime.
         * @member {number|Long} openTime
         * @memberof marketdata.CandleMessage
         * @instance
         */
        CandleMessage.prototype.openTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CandleMessage closeTime.
         * @member {number|Long} closeTime
         * @memberof marketdata.CandleMessage
         * @instance
         */
        CandleMessage.prototype.closeTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CandleMessage open.
         * @member {string} open
         * @memberof marketdata.CandleMessage
         * @instance
         */
        CandleMessage.prototype.open = "";

        /**
         * CandleMessage high.
         * @member {string} high
         * @memberof marketdata.CandleMessage
         * @instance
         */
        CandleMessage.prototype.high = "";

        /**
         * CandleMessage low.
         * @member {string} low
         * @memberof marketdata.CandleMessage
         * @instance
         */
        CandleMessage.prototype.low = "";

        /**
         * CandleMessage close.
         * @member {string} close
         * @memberof marketdata.CandleMessage
         * @instance
         */
        CandleMessage.prototype.close = "";

        /**
         * CandleMessage volume.
         * @member {string} volume
         * @memberof marketdata.CandleMessage
         * @instance
         */
        CandleMessage.prototype.volume = "";

        /**
         * CandleMessage trades.
         * @member {number|Long} trades
         * @memberof marketdata.CandleMessage
         * @instance
         */
        CandleMessage.prototype.trades = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new CandleMessage instance using the specified properties.
         * @function create
         * @memberof marketdata.CandleMessage
         * @static
         * @param {marketdata.ICandleMessage=} [properties] Properties to set
         * @returns {marketdata.CandleMessage} CandleMessage instance
         */
        CandleMessage.create = function create(properties) {
            return new CandleMessage(properties);
        };

        /**
         * Encodes the specified CandleMessage message. Does not implicitly {@link marketdata.CandleMessage.verify|verify} messages.
         * @function encode
         * @memberof marketdata.CandleMessage
         * @static
         * @param {marketdata.ICandleMessage} message CandleMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CandleMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                $root.marketdata.MessageHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.interval != null && Object.hasOwnProperty.call(message, "interval"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.interval);
            if (message.openTime != null && Object.hasOwnProperty.call(message, "openTime"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.openTime);
            if (message.closeTime != null && Object.hasOwnProperty.call(message, "closeTime"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.closeTime);
            if (message.open != null && Object.hasOwnProperty.call(message, "open"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.open);
            if (message.high != null && Object.hasOwnProperty.call(message, "high"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.high);
            if (message.low != null && Object.hasOwnProperty.call(message, "low"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.low);
            if (message.close != null && Object.hasOwnProperty.call(message, "close"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.close);
            if (message.volume != null && Object.hasOwnProperty.call(message, "volume"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.volume);
            if (message.trades != null && Object.hasOwnProperty.call(message, "trades"))
                writer.uint32(/* id 10, wireType 0 =*/80).int64(message.trades);
            return writer;
        };

        /**
         * Encodes the specified CandleMessage message, length delimited. Does not implicitly {@link marketdata.CandleMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof marketdata.CandleMessage
         * @static
         * @param {marketdata.ICandleMessage} message CandleMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CandleMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CandleMessage message from the specified reader or buffer.
         * @function decode
         * @memberof marketdata.CandleMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {marketdata.CandleMessage} CandleMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CandleMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.marketdata.CandleMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.header = $root.marketdata.MessageHeader.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.interval = reader.string();
                        break;
                    }
                case 3: {
                        message.openTime = reader.int64();
                        break;
                    }
                case 4: {
                        message.closeTime = reader.int64();
                        break;
                    }
                case 5: {
                        message.open = reader.string();
                        break;
                    }
                case 6: {
                        message.high = reader.string();
                        break;
                    }
                case 7: {
                        message.low = reader.string();
                        break;
                    }
                case 8: {
                        message.close = reader.string();
                        break;
                    }
                case 9: {
                        message.volume = reader.string();
                        break;
                    }
                case 10: {
                        message.trades = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CandleMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof marketdata.CandleMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {marketdata.CandleMessage} CandleMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CandleMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CandleMessage message.
         * @function verify
         * @memberof marketdata.CandleMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CandleMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.header != null && message.hasOwnProperty("header")) {
                let error = $root.marketdata.MessageHeader.verify(message.header);
                if (error)
                    return "header." + error;
            }
            if (message.interval != null && message.hasOwnProperty("interval"))
                if (!$util.isString(message.interval))
                    return "interval: string expected";
            if (message.openTime != null && message.hasOwnProperty("openTime"))
                if (!$util.isInteger(message.openTime) && !(message.openTime && $util.isInteger(message.openTime.low) && $util.isInteger(message.openTime.high)))
                    return "openTime: integer|Long expected";
            if (message.closeTime != null && message.hasOwnProperty("closeTime"))
                if (!$util.isInteger(message.closeTime) && !(message.closeTime && $util.isInteger(message.closeTime.low) && $util.isInteger(message.closeTime.high)))
                    return "closeTime: integer|Long expected";
            if (message.open != null && message.hasOwnProperty("open"))
                if (!$util.isString(message.open))
                    return "open: string expected";
            if (message.high != null && message.hasOwnProperty("high"))
                if (!$util.isString(message.high))
                    return "high: string expected";
            if (message.low != null && message.hasOwnProperty("low"))
                if (!$util.isString(message.low))
                    return "low: string expected";
            if (message.close != null && message.hasOwnProperty("close"))
                if (!$util.isString(message.close))
                    return "close: string expected";
            if (message.volume != null && message.hasOwnProperty("volume"))
                if (!$util.isString(message.volume))
                    return "volume: string expected";
            if (message.trades != null && message.hasOwnProperty("trades"))
                if (!$util.isInteger(message.trades) && !(message.trades && $util.isInteger(message.trades.low) && $util.isInteger(message.trades.high)))
                    return "trades: integer|Long expected";
            return null;
        };

        /**
         * Creates a CandleMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof marketdata.CandleMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {marketdata.CandleMessage} CandleMessage
         */
        CandleMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.marketdata.CandleMessage)
                return object;
            let message = new $root.marketdata.CandleMessage();
            if (object.header != null) {
                if (typeof object.header !== "object")
                    throw TypeError(".marketdata.CandleMessage.header: object expected");
                message.header = $root.marketdata.MessageHeader.fromObject(object.header);
            }
            if (object.interval != null)
                message.interval = String(object.interval);
            if (object.openTime != null)
                if ($util.Long)
                    (message.openTime = $util.Long.fromValue(object.openTime)).unsigned = false;
                else if (typeof object.openTime === "string")
                    message.openTime = parseInt(object.openTime, 10);
                else if (typeof object.openTime === "number")
                    message.openTime = object.openTime;
                else if (typeof object.openTime === "object")
                    message.openTime = new $util.LongBits(object.openTime.low >>> 0, object.openTime.high >>> 0).toNumber();
            if (object.closeTime != null)
                if ($util.Long)
                    (message.closeTime = $util.Long.fromValue(object.closeTime)).unsigned = false;
                else if (typeof object.closeTime === "string")
                    message.closeTime = parseInt(object.closeTime, 10);
                else if (typeof object.closeTime === "number")
                    message.closeTime = object.closeTime;
                else if (typeof object.closeTime === "object")
                    message.closeTime = new $util.LongBits(object.closeTime.low >>> 0, object.closeTime.high >>> 0).toNumber();
            if (object.open != null)
                message.open = String(object.open);
            if (object.high != null)
                message.high = String(object.high);
            if (object.low != null)
                message.low = String(object.low);
            if (object.close != null)
                message.close = String(object.close);
            if (object.volume != null)
                message.volume = String(object.volume);
            if (object.trades != null)
                if ($util.Long)
                    (message.trades = $util.Long.fromValue(object.trades)).unsigned = false;
                else if (typeof object.trades === "string")
                    message.trades = parseInt(object.trades, 10);
                else if (typeof object.trades === "number")
                    message.trades = object.trades;
                else if (typeof object.trades === "object")
                    message.trades = new $util.LongBits(object.trades.low >>> 0, object.trades.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a CandleMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof marketdata.CandleMessage
         * @static
         * @param {marketdata.CandleMessage} message CandleMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CandleMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.header = null;
                object.interval = "";
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.openTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.openTime = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.closeTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.closeTime = options.longs === String ? "0" : 0;
                object.open = "";
                object.high = "";
                object.low = "";
                object.close = "";
                object.volume = "";
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.trades = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.trades = options.longs === String ? "0" : 0;
            }
            if (message.header != null && message.hasOwnProperty("header"))
                object.header = $root.marketdata.MessageHeader.toObject(message.header, options);
            if (message.interval != null && message.hasOwnProperty("interval"))
                object.interval = message.interval;
            if (message.openTime != null && message.hasOwnProperty("openTime"))
                if (typeof message.openTime === "number")
                    object.openTime = options.longs === String ? String(message.openTime) : message.openTime;
                else
                    object.openTime = options.longs === String ? $util.Long.prototype.toString.call(message.openTime) : options.longs === Number ? new $util.LongBits(message.openTime.low >>> 0, message.openTime.high >>> 0).toNumber() : message.openTime;
            if (message.closeTime != null && message.hasOwnProperty("closeTime"))
                if (typeof message.closeTime === "number")
                    object.closeTime = options.longs === String ? String(message.closeTime) : message.closeTime;
                else
                    object.closeTime = options.longs === String ? $util.Long.prototype.toString.call(message.closeTime) : options.longs === Number ? new $util.LongBits(message.closeTime.low >>> 0, message.closeTime.high >>> 0).toNumber() : message.closeTime;
            if (message.open != null && message.hasOwnProperty("open"))
                object.open = message.open;
            if (message.high != null && message.hasOwnProperty("high"))
                object.high = message.high;
            if (message.low != null && message.hasOwnProperty("low"))
                object.low = message.low;
            if (message.close != null && message.hasOwnProperty("close"))
                object.close = message.close;
            if (message.volume != null && message.hasOwnProperty("volume"))
                object.volume = message.volume;
            if (message.trades != null && message.hasOwnProperty("trades"))
                if (typeof message.trades === "number")
                    object.trades = options.longs === String ? String(message.trades) : message.trades;
                else
                    object.trades = options.longs === String ? $util.Long.prototype.toString.call(message.trades) : options.longs === Number ? new $util.LongBits(message.trades.low >>> 0, message.trades.high >>> 0).toNumber() : message.trades;
            return object;
        };

        /**
         * Converts this CandleMessage to JSON.
         * @function toJSON
         * @memberof marketdata.CandleMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CandleMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CandleMessage
         * @function getTypeUrl
         * @memberof marketdata.CandleMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CandleMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/marketdata.CandleMessage";
        };

        return CandleMessage;
    })();

    marketdata.MarketDataMessage = (function() {

        /**
         * Properties of a MarketDataMessage.
         * @memberof marketdata
         * @interface IMarketDataMessage
         * @property {marketdata.IMessageHeader|null} [header] MarketDataMessage header
         * @property {marketdata.ITickerMessage|null} [ticker] MarketDataMessage ticker
         * @property {marketdata.ITradeMessage|null} [trade] MarketDataMessage trade
         * @property {marketdata.IOrderBookMessage|null} [orderbook] MarketDataMessage orderbook
         * @property {marketdata.ICandleMessage|null} [candle] MarketDataMessage candle
         * @property {Uint8Array|null} [extraData] MarketDataMessage extraData
         */

        /**
         * Constructs a new MarketDataMessage.
         * @memberof marketdata
         * @classdesc Represents a MarketDataMessage.
         * @implements IMarketDataMessage
         * @constructor
         * @param {marketdata.IMarketDataMessage=} [properties] Properties to set
         */
        function MarketDataMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MarketDataMessage header.
         * @member {marketdata.IMessageHeader|null|undefined} header
         * @memberof marketdata.MarketDataMessage
         * @instance
         */
        MarketDataMessage.prototype.header = null;

        /**
         * MarketDataMessage ticker.
         * @member {marketdata.ITickerMessage|null|undefined} ticker
         * @memberof marketdata.MarketDataMessage
         * @instance
         */
        MarketDataMessage.prototype.ticker = null;

        /**
         * MarketDataMessage trade.
         * @member {marketdata.ITradeMessage|null|undefined} trade
         * @memberof marketdata.MarketDataMessage
         * @instance
         */
        MarketDataMessage.prototype.trade = null;

        /**
         * MarketDataMessage orderbook.
         * @member {marketdata.IOrderBookMessage|null|undefined} orderbook
         * @memberof marketdata.MarketDataMessage
         * @instance
         */
        MarketDataMessage.prototype.orderbook = null;

        /**
         * MarketDataMessage candle.
         * @member {marketdata.ICandleMessage|null|undefined} candle
         * @memberof marketdata.MarketDataMessage
         * @instance
         */
        MarketDataMessage.prototype.candle = null;

        /**
         * MarketDataMessage extraData.
         * @member {Uint8Array} extraData
         * @memberof marketdata.MarketDataMessage
         * @instance
         */
        MarketDataMessage.prototype.extraData = $util.newBuffer([]);

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * MarketDataMessage messageType.
         * @member {"ticker"|"trade"|"orderbook"|"candle"|undefined} messageType
         * @memberof marketdata.MarketDataMessage
         * @instance
         */
        Object.defineProperty(MarketDataMessage.prototype, "messageType", {
            get: $util.oneOfGetter($oneOfFields = ["ticker", "trade", "orderbook", "candle"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new MarketDataMessage instance using the specified properties.
         * @function create
         * @memberof marketdata.MarketDataMessage
         * @static
         * @param {marketdata.IMarketDataMessage=} [properties] Properties to set
         * @returns {marketdata.MarketDataMessage} MarketDataMessage instance
         */
        MarketDataMessage.create = function create(properties) {
            return new MarketDataMessage(properties);
        };

        /**
         * Encodes the specified MarketDataMessage message. Does not implicitly {@link marketdata.MarketDataMessage.verify|verify} messages.
         * @function encode
         * @memberof marketdata.MarketDataMessage
         * @static
         * @param {marketdata.IMarketDataMessage} message MarketDataMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MarketDataMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                $root.marketdata.MessageHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.ticker != null && Object.hasOwnProperty.call(message, "ticker"))
                $root.marketdata.TickerMessage.encode(message.ticker, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.trade != null && Object.hasOwnProperty.call(message, "trade"))
                $root.marketdata.TradeMessage.encode(message.trade, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.orderbook != null && Object.hasOwnProperty.call(message, "orderbook"))
                $root.marketdata.OrderBookMessage.encode(message.orderbook, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.candle != null && Object.hasOwnProperty.call(message, "candle"))
                $root.marketdata.CandleMessage.encode(message.candle, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.extraData != null && Object.hasOwnProperty.call(message, "extraData"))
                writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.extraData);
            return writer;
        };

        /**
         * Encodes the specified MarketDataMessage message, length delimited. Does not implicitly {@link marketdata.MarketDataMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof marketdata.MarketDataMessage
         * @static
         * @param {marketdata.IMarketDataMessage} message MarketDataMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MarketDataMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MarketDataMessage message from the specified reader or buffer.
         * @function decode
         * @memberof marketdata.MarketDataMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {marketdata.MarketDataMessage} MarketDataMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MarketDataMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.marketdata.MarketDataMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.header = $root.marketdata.MessageHeader.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.ticker = $root.marketdata.TickerMessage.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.trade = $root.marketdata.TradeMessage.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.orderbook = $root.marketdata.OrderBookMessage.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.candle = $root.marketdata.CandleMessage.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.extraData = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MarketDataMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof marketdata.MarketDataMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {marketdata.MarketDataMessage} MarketDataMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MarketDataMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MarketDataMessage message.
         * @function verify
         * @memberof marketdata.MarketDataMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MarketDataMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.header != null && message.hasOwnProperty("header")) {
                let error = $root.marketdata.MessageHeader.verify(message.header);
                if (error)
                    return "header." + error;
            }
            if (message.ticker != null && message.hasOwnProperty("ticker")) {
                properties.messageType = 1;
                {
                    let error = $root.marketdata.TickerMessage.verify(message.ticker);
                    if (error)
                        return "ticker." + error;
                }
            }
            if (message.trade != null && message.hasOwnProperty("trade")) {
                if (properties.messageType === 1)
                    return "messageType: multiple values";
                properties.messageType = 1;
                {
                    let error = $root.marketdata.TradeMessage.verify(message.trade);
                    if (error)
                        return "trade." + error;
                }
            }
            if (message.orderbook != null && message.hasOwnProperty("orderbook")) {
                if (properties.messageType === 1)
                    return "messageType: multiple values";
                properties.messageType = 1;
                {
                    let error = $root.marketdata.OrderBookMessage.verify(message.orderbook);
                    if (error)
                        return "orderbook." + error;
                }
            }
            if (message.candle != null && message.hasOwnProperty("candle")) {
                if (properties.messageType === 1)
                    return "messageType: multiple values";
                properties.messageType = 1;
                {
                    let error = $root.marketdata.CandleMessage.verify(message.candle);
                    if (error)
                        return "candle." + error;
                }
            }
            if (message.extraData != null && message.hasOwnProperty("extraData"))
                if (!(message.extraData && typeof message.extraData.length === "number" || $util.isString(message.extraData)))
                    return "extraData: buffer expected";
            return null;
        };

        /**
         * Creates a MarketDataMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof marketdata.MarketDataMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {marketdata.MarketDataMessage} MarketDataMessage
         */
        MarketDataMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.marketdata.MarketDataMessage)
                return object;
            let message = new $root.marketdata.MarketDataMessage();
            if (object.header != null) {
                if (typeof object.header !== "object")
                    throw TypeError(".marketdata.MarketDataMessage.header: object expected");
                message.header = $root.marketdata.MessageHeader.fromObject(object.header);
            }
            if (object.ticker != null) {
                if (typeof object.ticker !== "object")
                    throw TypeError(".marketdata.MarketDataMessage.ticker: object expected");
                message.ticker = $root.marketdata.TickerMessage.fromObject(object.ticker);
            }
            if (object.trade != null) {
                if (typeof object.trade !== "object")
                    throw TypeError(".marketdata.MarketDataMessage.trade: object expected");
                message.trade = $root.marketdata.TradeMessage.fromObject(object.trade);
            }
            if (object.orderbook != null) {
                if (typeof object.orderbook !== "object")
                    throw TypeError(".marketdata.MarketDataMessage.orderbook: object expected");
                message.orderbook = $root.marketdata.OrderBookMessage.fromObject(object.orderbook);
            }
            if (object.candle != null) {
                if (typeof object.candle !== "object")
                    throw TypeError(".marketdata.MarketDataMessage.candle: object expected");
                message.candle = $root.marketdata.CandleMessage.fromObject(object.candle);
            }
            if (object.extraData != null)
                if (typeof object.extraData === "string")
                    $util.base64.decode(object.extraData, message.extraData = $util.newBuffer($util.base64.length(object.extraData)), 0);
                else if (object.extraData.length >= 0)
                    message.extraData = object.extraData;
            return message;
        };

        /**
         * Creates a plain object from a MarketDataMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof marketdata.MarketDataMessage
         * @static
         * @param {marketdata.MarketDataMessage} message MarketDataMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MarketDataMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.header = null;
                if (options.bytes === String)
                    object.extraData = "";
                else {
                    object.extraData = [];
                    if (options.bytes !== Array)
                        object.extraData = $util.newBuffer(object.extraData);
                }
            }
            if (message.header != null && message.hasOwnProperty("header"))
                object.header = $root.marketdata.MessageHeader.toObject(message.header, options);
            if (message.ticker != null && message.hasOwnProperty("ticker")) {
                object.ticker = $root.marketdata.TickerMessage.toObject(message.ticker, options);
                if (options.oneofs)
                    object.messageType = "ticker";
            }
            if (message.trade != null && message.hasOwnProperty("trade")) {
                object.trade = $root.marketdata.TradeMessage.toObject(message.trade, options);
                if (options.oneofs)
                    object.messageType = "trade";
            }
            if (message.orderbook != null && message.hasOwnProperty("orderbook")) {
                object.orderbook = $root.marketdata.OrderBookMessage.toObject(message.orderbook, options);
                if (options.oneofs)
                    object.messageType = "orderbook";
            }
            if (message.candle != null && message.hasOwnProperty("candle")) {
                object.candle = $root.marketdata.CandleMessage.toObject(message.candle, options);
                if (options.oneofs)
                    object.messageType = "candle";
            }
            if (message.extraData != null && message.hasOwnProperty("extraData"))
                object.extraData = options.bytes === String ? $util.base64.encode(message.extraData, 0, message.extraData.length) : options.bytes === Array ? Array.prototype.slice.call(message.extraData) : message.extraData;
            return object;
        };

        /**
         * Converts this MarketDataMessage to JSON.
         * @function toJSON
         * @memberof marketdata.MarketDataMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MarketDataMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MarketDataMessage
         * @function getTypeUrl
         * @memberof marketdata.MarketDataMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MarketDataMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/marketdata.MarketDataMessage";
        };

        return MarketDataMessage;
    })();

    return marketdata;
})();

export { $root as default };
