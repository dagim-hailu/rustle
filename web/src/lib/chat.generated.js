/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const chat = $root.chat = (() => {

    /**
     * Namespace chat.
     * @exports chat
     * @namespace
     */
    const chat = {};

    chat.v1 = (function() {

        /**
         * Namespace v1.
         * @memberof chat
         * @namespace
         */
        const v1 = {};

        /**
         * PresenceStatus enum.
         * @name chat.v1.PresenceStatus
         * @enum {number}
         * @property {number} PRESENCE_STATUS_UNSPECIFIED=0 PRESENCE_STATUS_UNSPECIFIED value
         * @property {number} PRESENCE_STATUS_ONLINE=1 PRESENCE_STATUS_ONLINE value
         * @property {number} PRESENCE_STATUS_IDLE=2 PRESENCE_STATUS_IDLE value
         * @property {number} PRESENCE_STATUS_DO_NOT_DISTURB=3 PRESENCE_STATUS_DO_NOT_DISTURB value
         * @property {number} PRESENCE_STATUS_OFFLINE=4 PRESENCE_STATUS_OFFLINE value
         */
        v1.PresenceStatus = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "PRESENCE_STATUS_UNSPECIFIED"] = 0;
            values[valuesById[1] = "PRESENCE_STATUS_ONLINE"] = 1;
            values[valuesById[2] = "PRESENCE_STATUS_IDLE"] = 2;
            values[valuesById[3] = "PRESENCE_STATUS_DO_NOT_DISTURB"] = 3;
            values[valuesById[4] = "PRESENCE_STATUS_OFFLINE"] = 4;
            return values;
        })();

        /**
         * ChannelKind enum.
         * @name chat.v1.ChannelKind
         * @enum {number}
         * @property {number} CHANNEL_KIND_UNSPECIFIED=0 CHANNEL_KIND_UNSPECIFIED value
         * @property {number} CHANNEL_KIND_TEXT=1 CHANNEL_KIND_TEXT value
         * @property {number} CHANNEL_KIND_VOICE=2 CHANNEL_KIND_VOICE value
         */
        v1.ChannelKind = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "CHANNEL_KIND_UNSPECIFIED"] = 0;
            values[valuesById[1] = "CHANNEL_KIND_TEXT"] = 1;
            values[valuesById[2] = "CHANNEL_KIND_VOICE"] = 2;
            return values;
        })();

        /**
         * AckStatus enum.
         * @name chat.v1.AckStatus
         * @enum {number}
         * @property {number} ACK_STATUS_UNSPECIFIED=0 ACK_STATUS_UNSPECIFIED value
         * @property {number} ACK_STATUS_COMMITTED=1 ACK_STATUS_COMMITTED value
         * @property {number} ACK_STATUS_FAILED=2 ACK_STATUS_FAILED value
         */
        v1.AckStatus = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ACK_STATUS_UNSPECIFIED"] = 0;
            values[valuesById[1] = "ACK_STATUS_COMMITTED"] = 1;
            values[valuesById[2] = "ACK_STATUS_FAILED"] = 2;
            return values;
        })();

        /**
         * CallEventType enum.
         * @name chat.v1.CallEventType
         * @enum {number}
         * @property {number} CALL_EVENT_TYPE_UNSPECIFIED=0 CALL_EVENT_TYPE_UNSPECIFIED value
         * @property {number} CALL_EVENT_TYPE_JOIN=1 CALL_EVENT_TYPE_JOIN value
         * @property {number} CALL_EVENT_TYPE_LEAVE=2 CALL_EVENT_TYPE_LEAVE value
         * @property {number} CALL_EVENT_TYPE_OFFER=3 CALL_EVENT_TYPE_OFFER value
         * @property {number} CALL_EVENT_TYPE_ANSWER=4 CALL_EVENT_TYPE_ANSWER value
         * @property {number} CALL_EVENT_TYPE_ICE=5 CALL_EVENT_TYPE_ICE value
         * @property {number} CALL_EVENT_TYPE_MEDIA=6 CALL_EVENT_TYPE_MEDIA value
         */
        v1.CallEventType = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "CALL_EVENT_TYPE_UNSPECIFIED"] = 0;
            values[valuesById[1] = "CALL_EVENT_TYPE_JOIN"] = 1;
            values[valuesById[2] = "CALL_EVENT_TYPE_LEAVE"] = 2;
            values[valuesById[3] = "CALL_EVENT_TYPE_OFFER"] = 3;
            values[valuesById[4] = "CALL_EVENT_TYPE_ANSWER"] = 4;
            values[valuesById[5] = "CALL_EVENT_TYPE_ICE"] = 5;
            values[valuesById[6] = "CALL_EVENT_TYPE_MEDIA"] = 6;
            return values;
        })();

        v1.User = (function() {

            /**
             * Properties of a User.
             * @memberof chat.v1
             * @interface IUser
             * @property {string|null} [id] User id
             * @property {string|null} [displayName] User displayName
             * @property {string|null} [avatarColor] User avatarColor
             * @property {string|null} [locale] User locale
             * @property {chat.v1.PresenceStatus|null} [presence] User presence
             * @property {string|null} [avatarUrl] User avatarUrl
             * @property {string|null} [bio] User bio
             * @property {string|null} [pronouns] User pronouns
             * @property {string|null} [bannerUrl] User bannerUrl
             * @property {string|null} [bannerColor] User bannerColor
             * @property {string|null} [createdAt] User createdAt
             */

            /**
             * Constructs a new User.
             * @memberof chat.v1
             * @classdesc Represents a User.
             * @implements IUser
             * @constructor
             * @param {chat.v1.IUser=} [properties] Properties to set
             */
            function User(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * User id.
             * @member {string} id
             * @memberof chat.v1.User
             * @instance
             */
            User.prototype.id = "";

            /**
             * User displayName.
             * @member {string} displayName
             * @memberof chat.v1.User
             * @instance
             */
            User.prototype.displayName = "";

            /**
             * User avatarColor.
             * @member {string} avatarColor
             * @memberof chat.v1.User
             * @instance
             */
            User.prototype.avatarColor = "";

            /**
             * User locale.
             * @member {string} locale
             * @memberof chat.v1.User
             * @instance
             */
            User.prototype.locale = "";

            /**
             * User presence.
             * @member {chat.v1.PresenceStatus} presence
             * @memberof chat.v1.User
             * @instance
             */
            User.prototype.presence = 0;

            /**
             * User avatarUrl.
             * @member {string} avatarUrl
             * @memberof chat.v1.User
             * @instance
             */
            User.prototype.avatarUrl = "";

            /**
             * User bio.
             * @member {string} bio
             * @memberof chat.v1.User
             * @instance
             */
            User.prototype.bio = "";

            /**
             * User pronouns.
             * @member {string} pronouns
             * @memberof chat.v1.User
             * @instance
             */
            User.prototype.pronouns = "";

            /**
             * User bannerUrl.
             * @member {string} bannerUrl
             * @memberof chat.v1.User
             * @instance
             */
            User.prototype.bannerUrl = "";

            /**
             * User bannerColor.
             * @member {string} bannerColor
             * @memberof chat.v1.User
             * @instance
             */
            User.prototype.bannerColor = "";

            /**
             * User createdAt.
             * @member {string} createdAt
             * @memberof chat.v1.User
             * @instance
             */
            User.prototype.createdAt = "";

            /**
             * Creates a new User instance using the specified properties.
             * @function create
             * @memberof chat.v1.User
             * @static
             * @param {chat.v1.IUser=} [properties] Properties to set
             * @returns {chat.v1.User} User instance
             */
            User.create = function create(properties) {
                return new User(properties);
            };

            /**
             * Encodes the specified User message. Does not implicitly {@link chat.v1.User.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.User
             * @static
             * @param {chat.v1.IUser} message User message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            User.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.displayName);
                if (message.avatarColor != null && Object.hasOwnProperty.call(message, "avatarColor"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.avatarColor);
                if (message.locale != null && Object.hasOwnProperty.call(message, "locale"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.locale);
                if (message.presence != null && Object.hasOwnProperty.call(message, "presence"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.presence);
                if (message.avatarUrl != null && Object.hasOwnProperty.call(message, "avatarUrl"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.avatarUrl);
                if (message.bio != null && Object.hasOwnProperty.call(message, "bio"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.bio);
                if (message.pronouns != null && Object.hasOwnProperty.call(message, "pronouns"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.pronouns);
                if (message.bannerUrl != null && Object.hasOwnProperty.call(message, "bannerUrl"))
                    writer.uint32(/* id 9, wireType 2 =*/74).string(message.bannerUrl);
                if (message.bannerColor != null && Object.hasOwnProperty.call(message, "bannerColor"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.bannerColor);
                if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                    writer.uint32(/* id 11, wireType 2 =*/90).string(message.createdAt);
                return writer;
            };

            /**
             * Encodes the specified User message, length delimited. Does not implicitly {@link chat.v1.User.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.User
             * @static
             * @param {chat.v1.IUser} message User message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            User.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a User message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.User
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.User} User
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            User.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.User();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.string();
                            break;
                        }
                    case 2: {
                            message.displayName = reader.string();
                            break;
                        }
                    case 3: {
                            message.avatarColor = reader.string();
                            break;
                        }
                    case 4: {
                            message.locale = reader.string();
                            break;
                        }
                    case 5: {
                            message.presence = reader.int32();
                            break;
                        }
                    case 6: {
                            message.avatarUrl = reader.string();
                            break;
                        }
                    case 7: {
                            message.bio = reader.string();
                            break;
                        }
                    case 8: {
                            message.pronouns = reader.string();
                            break;
                        }
                    case 9: {
                            message.bannerUrl = reader.string();
                            break;
                        }
                    case 10: {
                            message.bannerColor = reader.string();
                            break;
                        }
                    case 11: {
                            message.createdAt = reader.string();
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
             * Decodes a User message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.User
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.User} User
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            User.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a User message.
             * @function verify
             * @memberof chat.v1.User
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            User.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.displayName != null && message.hasOwnProperty("displayName"))
                    if (!$util.isString(message.displayName))
                        return "displayName: string expected";
                if (message.avatarColor != null && message.hasOwnProperty("avatarColor"))
                    if (!$util.isString(message.avatarColor))
                        return "avatarColor: string expected";
                if (message.locale != null && message.hasOwnProperty("locale"))
                    if (!$util.isString(message.locale))
                        return "locale: string expected";
                if (message.presence != null && message.hasOwnProperty("presence"))
                    switch (message.presence) {
                    default:
                        return "presence: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                if (message.avatarUrl != null && message.hasOwnProperty("avatarUrl"))
                    if (!$util.isString(message.avatarUrl))
                        return "avatarUrl: string expected";
                if (message.bio != null && message.hasOwnProperty("bio"))
                    if (!$util.isString(message.bio))
                        return "bio: string expected";
                if (message.pronouns != null && message.hasOwnProperty("pronouns"))
                    if (!$util.isString(message.pronouns))
                        return "pronouns: string expected";
                if (message.bannerUrl != null && message.hasOwnProperty("bannerUrl"))
                    if (!$util.isString(message.bannerUrl))
                        return "bannerUrl: string expected";
                if (message.bannerColor != null && message.hasOwnProperty("bannerColor"))
                    if (!$util.isString(message.bannerColor))
                        return "bannerColor: string expected";
                if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                    if (!$util.isString(message.createdAt))
                        return "createdAt: string expected";
                return null;
            };

            /**
             * Creates a User message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.User
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.User} User
             */
            User.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.User)
                    return object;
                let message = new $root.chat.v1.User();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.displayName != null)
                    message.displayName = String(object.displayName);
                if (object.avatarColor != null)
                    message.avatarColor = String(object.avatarColor);
                if (object.locale != null)
                    message.locale = String(object.locale);
                switch (object.presence) {
                default:
                    if (typeof object.presence === "number") {
                        message.presence = object.presence;
                        break;
                    }
                    break;
                case "PRESENCE_STATUS_UNSPECIFIED":
                case 0:
                    message.presence = 0;
                    break;
                case "PRESENCE_STATUS_ONLINE":
                case 1:
                    message.presence = 1;
                    break;
                case "PRESENCE_STATUS_IDLE":
                case 2:
                    message.presence = 2;
                    break;
                case "PRESENCE_STATUS_DO_NOT_DISTURB":
                case 3:
                    message.presence = 3;
                    break;
                case "PRESENCE_STATUS_OFFLINE":
                case 4:
                    message.presence = 4;
                    break;
                }
                if (object.avatarUrl != null)
                    message.avatarUrl = String(object.avatarUrl);
                if (object.bio != null)
                    message.bio = String(object.bio);
                if (object.pronouns != null)
                    message.pronouns = String(object.pronouns);
                if (object.bannerUrl != null)
                    message.bannerUrl = String(object.bannerUrl);
                if (object.bannerColor != null)
                    message.bannerColor = String(object.bannerColor);
                if (object.createdAt != null)
                    message.createdAt = String(object.createdAt);
                return message;
            };

            /**
             * Creates a plain object from a User message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.User
             * @static
             * @param {chat.v1.User} message User
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            User.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    object.displayName = "";
                    object.avatarColor = "";
                    object.locale = "";
                    object.presence = options.enums === String ? "PRESENCE_STATUS_UNSPECIFIED" : 0;
                    object.avatarUrl = "";
                    object.bio = "";
                    object.pronouns = "";
                    object.bannerUrl = "";
                    object.bannerColor = "";
                    object.createdAt = "";
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.displayName != null && message.hasOwnProperty("displayName"))
                    object.displayName = message.displayName;
                if (message.avatarColor != null && message.hasOwnProperty("avatarColor"))
                    object.avatarColor = message.avatarColor;
                if (message.locale != null && message.hasOwnProperty("locale"))
                    object.locale = message.locale;
                if (message.presence != null && message.hasOwnProperty("presence"))
                    object.presence = options.enums === String ? $root.chat.v1.PresenceStatus[message.presence] === undefined ? message.presence : $root.chat.v1.PresenceStatus[message.presence] : message.presence;
                if (message.avatarUrl != null && message.hasOwnProperty("avatarUrl"))
                    object.avatarUrl = message.avatarUrl;
                if (message.bio != null && message.hasOwnProperty("bio"))
                    object.bio = message.bio;
                if (message.pronouns != null && message.hasOwnProperty("pronouns"))
                    object.pronouns = message.pronouns;
                if (message.bannerUrl != null && message.hasOwnProperty("bannerUrl"))
                    object.bannerUrl = message.bannerUrl;
                if (message.bannerColor != null && message.hasOwnProperty("bannerColor"))
                    object.bannerColor = message.bannerColor;
                if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                    object.createdAt = message.createdAt;
                return object;
            };

            /**
             * Converts this User to JSON.
             * @function toJSON
             * @memberof chat.v1.User
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            User.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for User
             * @function getTypeUrl
             * @memberof chat.v1.User
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            User.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.User";
            };

            return User;
        })();

        v1.GuildMember = (function() {

            /**
             * Properties of a GuildMember.
             * @memberof chat.v1
             * @interface IGuildMember
             * @property {string|null} [userId] GuildMember userId
             * @property {string|null} [displayName] GuildMember displayName
             * @property {string|null} [avatarColor] GuildMember avatarColor
             * @property {chat.v1.PresenceStatus|null} [presence] GuildMember presence
             * @property {string|null} [role] GuildMember role
             * @property {string|null} [avatarUrl] GuildMember avatarUrl
             * @property {string|null} [bio] GuildMember bio
             * @property {string|null} [pronouns] GuildMember pronouns
             * @property {string|null} [bannerUrl] GuildMember bannerUrl
             * @property {string|null} [bannerColor] GuildMember bannerColor
             * @property {string|null} [createdAt] GuildMember createdAt
             */

            /**
             * Constructs a new GuildMember.
             * @memberof chat.v1
             * @classdesc Represents a GuildMember.
             * @implements IGuildMember
             * @constructor
             * @param {chat.v1.IGuildMember=} [properties] Properties to set
             */
            function GuildMember(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GuildMember userId.
             * @member {string} userId
             * @memberof chat.v1.GuildMember
             * @instance
             */
            GuildMember.prototype.userId = "";

            /**
             * GuildMember displayName.
             * @member {string} displayName
             * @memberof chat.v1.GuildMember
             * @instance
             */
            GuildMember.prototype.displayName = "";

            /**
             * GuildMember avatarColor.
             * @member {string} avatarColor
             * @memberof chat.v1.GuildMember
             * @instance
             */
            GuildMember.prototype.avatarColor = "";

            /**
             * GuildMember presence.
             * @member {chat.v1.PresenceStatus} presence
             * @memberof chat.v1.GuildMember
             * @instance
             */
            GuildMember.prototype.presence = 0;

            /**
             * GuildMember role.
             * @member {string} role
             * @memberof chat.v1.GuildMember
             * @instance
             */
            GuildMember.prototype.role = "";

            /**
             * GuildMember avatarUrl.
             * @member {string} avatarUrl
             * @memberof chat.v1.GuildMember
             * @instance
             */
            GuildMember.prototype.avatarUrl = "";

            /**
             * GuildMember bio.
             * @member {string} bio
             * @memberof chat.v1.GuildMember
             * @instance
             */
            GuildMember.prototype.bio = "";

            /**
             * GuildMember pronouns.
             * @member {string} pronouns
             * @memberof chat.v1.GuildMember
             * @instance
             */
            GuildMember.prototype.pronouns = "";

            /**
             * GuildMember bannerUrl.
             * @member {string} bannerUrl
             * @memberof chat.v1.GuildMember
             * @instance
             */
            GuildMember.prototype.bannerUrl = "";

            /**
             * GuildMember bannerColor.
             * @member {string} bannerColor
             * @memberof chat.v1.GuildMember
             * @instance
             */
            GuildMember.prototype.bannerColor = "";

            /**
             * GuildMember createdAt.
             * @member {string} createdAt
             * @memberof chat.v1.GuildMember
             * @instance
             */
            GuildMember.prototype.createdAt = "";

            /**
             * Creates a new GuildMember instance using the specified properties.
             * @function create
             * @memberof chat.v1.GuildMember
             * @static
             * @param {chat.v1.IGuildMember=} [properties] Properties to set
             * @returns {chat.v1.GuildMember} GuildMember instance
             */
            GuildMember.create = function create(properties) {
                return new GuildMember(properties);
            };

            /**
             * Encodes the specified GuildMember message. Does not implicitly {@link chat.v1.GuildMember.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.GuildMember
             * @static
             * @param {chat.v1.IGuildMember} message GuildMember message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GuildMember.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
                if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.displayName);
                if (message.avatarColor != null && Object.hasOwnProperty.call(message, "avatarColor"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.avatarColor);
                if (message.presence != null && Object.hasOwnProperty.call(message, "presence"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.presence);
                if (message.role != null && Object.hasOwnProperty.call(message, "role"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.role);
                if (message.avatarUrl != null && Object.hasOwnProperty.call(message, "avatarUrl"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.avatarUrl);
                if (message.bio != null && Object.hasOwnProperty.call(message, "bio"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.bio);
                if (message.pronouns != null && Object.hasOwnProperty.call(message, "pronouns"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.pronouns);
                if (message.bannerUrl != null && Object.hasOwnProperty.call(message, "bannerUrl"))
                    writer.uint32(/* id 9, wireType 2 =*/74).string(message.bannerUrl);
                if (message.bannerColor != null && Object.hasOwnProperty.call(message, "bannerColor"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.bannerColor);
                if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                    writer.uint32(/* id 11, wireType 2 =*/90).string(message.createdAt);
                return writer;
            };

            /**
             * Encodes the specified GuildMember message, length delimited. Does not implicitly {@link chat.v1.GuildMember.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.GuildMember
             * @static
             * @param {chat.v1.IGuildMember} message GuildMember message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GuildMember.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GuildMember message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.GuildMember
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.GuildMember} GuildMember
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GuildMember.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.GuildMember();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.userId = reader.string();
                            break;
                        }
                    case 2: {
                            message.displayName = reader.string();
                            break;
                        }
                    case 3: {
                            message.avatarColor = reader.string();
                            break;
                        }
                    case 4: {
                            message.presence = reader.int32();
                            break;
                        }
                    case 5: {
                            message.role = reader.string();
                            break;
                        }
                    case 6: {
                            message.avatarUrl = reader.string();
                            break;
                        }
                    case 7: {
                            message.bio = reader.string();
                            break;
                        }
                    case 8: {
                            message.pronouns = reader.string();
                            break;
                        }
                    case 9: {
                            message.bannerUrl = reader.string();
                            break;
                        }
                    case 10: {
                            message.bannerColor = reader.string();
                            break;
                        }
                    case 11: {
                            message.createdAt = reader.string();
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
             * Decodes a GuildMember message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.GuildMember
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.GuildMember} GuildMember
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GuildMember.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GuildMember message.
             * @function verify
             * @memberof chat.v1.GuildMember
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GuildMember.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.userId != null && message.hasOwnProperty("userId"))
                    if (!$util.isString(message.userId))
                        return "userId: string expected";
                if (message.displayName != null && message.hasOwnProperty("displayName"))
                    if (!$util.isString(message.displayName))
                        return "displayName: string expected";
                if (message.avatarColor != null && message.hasOwnProperty("avatarColor"))
                    if (!$util.isString(message.avatarColor))
                        return "avatarColor: string expected";
                if (message.presence != null && message.hasOwnProperty("presence"))
                    switch (message.presence) {
                    default:
                        return "presence: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                if (message.role != null && message.hasOwnProperty("role"))
                    if (!$util.isString(message.role))
                        return "role: string expected";
                if (message.avatarUrl != null && message.hasOwnProperty("avatarUrl"))
                    if (!$util.isString(message.avatarUrl))
                        return "avatarUrl: string expected";
                if (message.bio != null && message.hasOwnProperty("bio"))
                    if (!$util.isString(message.bio))
                        return "bio: string expected";
                if (message.pronouns != null && message.hasOwnProperty("pronouns"))
                    if (!$util.isString(message.pronouns))
                        return "pronouns: string expected";
                if (message.bannerUrl != null && message.hasOwnProperty("bannerUrl"))
                    if (!$util.isString(message.bannerUrl))
                        return "bannerUrl: string expected";
                if (message.bannerColor != null && message.hasOwnProperty("bannerColor"))
                    if (!$util.isString(message.bannerColor))
                        return "bannerColor: string expected";
                if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                    if (!$util.isString(message.createdAt))
                        return "createdAt: string expected";
                return null;
            };

            /**
             * Creates a GuildMember message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.GuildMember
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.GuildMember} GuildMember
             */
            GuildMember.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.GuildMember)
                    return object;
                let message = new $root.chat.v1.GuildMember();
                if (object.userId != null)
                    message.userId = String(object.userId);
                if (object.displayName != null)
                    message.displayName = String(object.displayName);
                if (object.avatarColor != null)
                    message.avatarColor = String(object.avatarColor);
                switch (object.presence) {
                default:
                    if (typeof object.presence === "number") {
                        message.presence = object.presence;
                        break;
                    }
                    break;
                case "PRESENCE_STATUS_UNSPECIFIED":
                case 0:
                    message.presence = 0;
                    break;
                case "PRESENCE_STATUS_ONLINE":
                case 1:
                    message.presence = 1;
                    break;
                case "PRESENCE_STATUS_IDLE":
                case 2:
                    message.presence = 2;
                    break;
                case "PRESENCE_STATUS_DO_NOT_DISTURB":
                case 3:
                    message.presence = 3;
                    break;
                case "PRESENCE_STATUS_OFFLINE":
                case 4:
                    message.presence = 4;
                    break;
                }
                if (object.role != null)
                    message.role = String(object.role);
                if (object.avatarUrl != null)
                    message.avatarUrl = String(object.avatarUrl);
                if (object.bio != null)
                    message.bio = String(object.bio);
                if (object.pronouns != null)
                    message.pronouns = String(object.pronouns);
                if (object.bannerUrl != null)
                    message.bannerUrl = String(object.bannerUrl);
                if (object.bannerColor != null)
                    message.bannerColor = String(object.bannerColor);
                if (object.createdAt != null)
                    message.createdAt = String(object.createdAt);
                return message;
            };

            /**
             * Creates a plain object from a GuildMember message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.GuildMember
             * @static
             * @param {chat.v1.GuildMember} message GuildMember
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GuildMember.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.userId = "";
                    object.displayName = "";
                    object.avatarColor = "";
                    object.presence = options.enums === String ? "PRESENCE_STATUS_UNSPECIFIED" : 0;
                    object.role = "";
                    object.avatarUrl = "";
                    object.bio = "";
                    object.pronouns = "";
                    object.bannerUrl = "";
                    object.bannerColor = "";
                    object.createdAt = "";
                }
                if (message.userId != null && message.hasOwnProperty("userId"))
                    object.userId = message.userId;
                if (message.displayName != null && message.hasOwnProperty("displayName"))
                    object.displayName = message.displayName;
                if (message.avatarColor != null && message.hasOwnProperty("avatarColor"))
                    object.avatarColor = message.avatarColor;
                if (message.presence != null && message.hasOwnProperty("presence"))
                    object.presence = options.enums === String ? $root.chat.v1.PresenceStatus[message.presence] === undefined ? message.presence : $root.chat.v1.PresenceStatus[message.presence] : message.presence;
                if (message.role != null && message.hasOwnProperty("role"))
                    object.role = message.role;
                if (message.avatarUrl != null && message.hasOwnProperty("avatarUrl"))
                    object.avatarUrl = message.avatarUrl;
                if (message.bio != null && message.hasOwnProperty("bio"))
                    object.bio = message.bio;
                if (message.pronouns != null && message.hasOwnProperty("pronouns"))
                    object.pronouns = message.pronouns;
                if (message.bannerUrl != null && message.hasOwnProperty("bannerUrl"))
                    object.bannerUrl = message.bannerUrl;
                if (message.bannerColor != null && message.hasOwnProperty("bannerColor"))
                    object.bannerColor = message.bannerColor;
                if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                    object.createdAt = message.createdAt;
                return object;
            };

            /**
             * Converts this GuildMember to JSON.
             * @function toJSON
             * @memberof chat.v1.GuildMember
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GuildMember.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GuildMember
             * @function getTypeUrl
             * @memberof chat.v1.GuildMember
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GuildMember.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.GuildMember";
            };

            return GuildMember;
        })();

        v1.Channel = (function() {

            /**
             * Properties of a Channel.
             * @memberof chat.v1
             * @interface IChannel
             * @property {string|null} [id] Channel id
             * @property {string|null} [guildId] Channel guildId
             * @property {string|null} [name] Channel name
             * @property {string|null} [topic] Channel topic
             * @property {chat.v1.ChannelKind|null} [kind] Channel kind
             * @property {number|null} [position] Channel position
             */

            /**
             * Constructs a new Channel.
             * @memberof chat.v1
             * @classdesc Represents a Channel.
             * @implements IChannel
             * @constructor
             * @param {chat.v1.IChannel=} [properties] Properties to set
             */
            function Channel(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Channel id.
             * @member {string} id
             * @memberof chat.v1.Channel
             * @instance
             */
            Channel.prototype.id = "";

            /**
             * Channel guildId.
             * @member {string} guildId
             * @memberof chat.v1.Channel
             * @instance
             */
            Channel.prototype.guildId = "";

            /**
             * Channel name.
             * @member {string} name
             * @memberof chat.v1.Channel
             * @instance
             */
            Channel.prototype.name = "";

            /**
             * Channel topic.
             * @member {string} topic
             * @memberof chat.v1.Channel
             * @instance
             */
            Channel.prototype.topic = "";

            /**
             * Channel kind.
             * @member {chat.v1.ChannelKind} kind
             * @memberof chat.v1.Channel
             * @instance
             */
            Channel.prototype.kind = 0;

            /**
             * Channel position.
             * @member {number} position
             * @memberof chat.v1.Channel
             * @instance
             */
            Channel.prototype.position = 0;

            /**
             * Creates a new Channel instance using the specified properties.
             * @function create
             * @memberof chat.v1.Channel
             * @static
             * @param {chat.v1.IChannel=} [properties] Properties to set
             * @returns {chat.v1.Channel} Channel instance
             */
            Channel.create = function create(properties) {
                return new Channel(properties);
            };

            /**
             * Encodes the specified Channel message. Does not implicitly {@link chat.v1.Channel.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.Channel
             * @static
             * @param {chat.v1.IChannel} message Channel message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Channel.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.guildId);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
                if (message.topic != null && Object.hasOwnProperty.call(message, "topic"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.topic);
                if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.kind);
                if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                    writer.uint32(/* id 6, wireType 0 =*/48).int32(message.position);
                return writer;
            };

            /**
             * Encodes the specified Channel message, length delimited. Does not implicitly {@link chat.v1.Channel.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.Channel
             * @static
             * @param {chat.v1.IChannel} message Channel message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Channel.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Channel message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.Channel
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.Channel} Channel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Channel.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.Channel();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.string();
                            break;
                        }
                    case 2: {
                            message.guildId = reader.string();
                            break;
                        }
                    case 3: {
                            message.name = reader.string();
                            break;
                        }
                    case 4: {
                            message.topic = reader.string();
                            break;
                        }
                    case 5: {
                            message.kind = reader.int32();
                            break;
                        }
                    case 6: {
                            message.position = reader.int32();
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
             * Decodes a Channel message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.Channel
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.Channel} Channel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Channel.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Channel message.
             * @function verify
             * @memberof chat.v1.Channel
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Channel.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isString(message.guildId))
                        return "guildId: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.topic != null && message.hasOwnProperty("topic"))
                    if (!$util.isString(message.topic))
                        return "topic: string expected";
                if (message.kind != null && message.hasOwnProperty("kind"))
                    switch (message.kind) {
                    default:
                        return "kind: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.position != null && message.hasOwnProperty("position"))
                    if (!$util.isInteger(message.position))
                        return "position: integer expected";
                return null;
            };

            /**
             * Creates a Channel message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.Channel
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.Channel} Channel
             */
            Channel.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.Channel)
                    return object;
                let message = new $root.chat.v1.Channel();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.guildId != null)
                    message.guildId = String(object.guildId);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.topic != null)
                    message.topic = String(object.topic);
                switch (object.kind) {
                default:
                    if (typeof object.kind === "number") {
                        message.kind = object.kind;
                        break;
                    }
                    break;
                case "CHANNEL_KIND_UNSPECIFIED":
                case 0:
                    message.kind = 0;
                    break;
                case "CHANNEL_KIND_TEXT":
                case 1:
                    message.kind = 1;
                    break;
                case "CHANNEL_KIND_VOICE":
                case 2:
                    message.kind = 2;
                    break;
                }
                if (object.position != null)
                    message.position = object.position | 0;
                return message;
            };

            /**
             * Creates a plain object from a Channel message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.Channel
             * @static
             * @param {chat.v1.Channel} message Channel
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Channel.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    object.guildId = "";
                    object.name = "";
                    object.topic = "";
                    object.kind = options.enums === String ? "CHANNEL_KIND_UNSPECIFIED" : 0;
                    object.position = 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    object.guildId = message.guildId;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.topic != null && message.hasOwnProperty("topic"))
                    object.topic = message.topic;
                if (message.kind != null && message.hasOwnProperty("kind"))
                    object.kind = options.enums === String ? $root.chat.v1.ChannelKind[message.kind] === undefined ? message.kind : $root.chat.v1.ChannelKind[message.kind] : message.kind;
                if (message.position != null && message.hasOwnProperty("position"))
                    object.position = message.position;
                return object;
            };

            /**
             * Converts this Channel to JSON.
             * @function toJSON
             * @memberof chat.v1.Channel
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Channel.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Channel
             * @function getTypeUrl
             * @memberof chat.v1.Channel
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Channel.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.Channel";
            };

            return Channel;
        })();

        v1.Guild = (function() {

            /**
             * Properties of a Guild.
             * @memberof chat.v1
             * @interface IGuild
             * @property {string|null} [id] Guild id
             * @property {string|null} [name] Guild name
             * @property {string|null} [iconColor] Guild iconColor
             * @property {Array.<chat.v1.IChannel>|null} [channels] Guild channels
             * @property {Array.<chat.v1.IGuildMember>|null} [members] Guild members
             * @property {string|null} [currentUserRole] Guild currentUserRole
             */

            /**
             * Constructs a new Guild.
             * @memberof chat.v1
             * @classdesc Represents a Guild.
             * @implements IGuild
             * @constructor
             * @param {chat.v1.IGuild=} [properties] Properties to set
             */
            function Guild(properties) {
                this.channels = [];
                this.members = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Guild id.
             * @member {string} id
             * @memberof chat.v1.Guild
             * @instance
             */
            Guild.prototype.id = "";

            /**
             * Guild name.
             * @member {string} name
             * @memberof chat.v1.Guild
             * @instance
             */
            Guild.prototype.name = "";

            /**
             * Guild iconColor.
             * @member {string} iconColor
             * @memberof chat.v1.Guild
             * @instance
             */
            Guild.prototype.iconColor = "";

            /**
             * Guild channels.
             * @member {Array.<chat.v1.IChannel>} channels
             * @memberof chat.v1.Guild
             * @instance
             */
            Guild.prototype.channels = $util.emptyArray;

            /**
             * Guild members.
             * @member {Array.<chat.v1.IGuildMember>} members
             * @memberof chat.v1.Guild
             * @instance
             */
            Guild.prototype.members = $util.emptyArray;

            /**
             * Guild currentUserRole.
             * @member {string} currentUserRole
             * @memberof chat.v1.Guild
             * @instance
             */
            Guild.prototype.currentUserRole = "";

            /**
             * Creates a new Guild instance using the specified properties.
             * @function create
             * @memberof chat.v1.Guild
             * @static
             * @param {chat.v1.IGuild=} [properties] Properties to set
             * @returns {chat.v1.Guild} Guild instance
             */
            Guild.create = function create(properties) {
                return new Guild(properties);
            };

            /**
             * Encodes the specified Guild message. Does not implicitly {@link chat.v1.Guild.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.Guild
             * @static
             * @param {chat.v1.IGuild} message Guild message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Guild.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.iconColor != null && Object.hasOwnProperty.call(message, "iconColor"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.iconColor);
                if (message.channels != null && message.channels.length)
                    for (let i = 0; i < message.channels.length; ++i)
                        $root.chat.v1.Channel.encode(message.channels[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.members != null && message.members.length)
                    for (let i = 0; i < message.members.length; ++i)
                        $root.chat.v1.GuildMember.encode(message.members[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.currentUserRole != null && Object.hasOwnProperty.call(message, "currentUserRole"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.currentUserRole);
                return writer;
            };

            /**
             * Encodes the specified Guild message, length delimited. Does not implicitly {@link chat.v1.Guild.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.Guild
             * @static
             * @param {chat.v1.IGuild} message Guild message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Guild.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Guild message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.Guild
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.Guild} Guild
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Guild.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.Guild();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.string();
                            break;
                        }
                    case 2: {
                            message.name = reader.string();
                            break;
                        }
                    case 3: {
                            message.iconColor = reader.string();
                            break;
                        }
                    case 4: {
                            if (!(message.channels && message.channels.length))
                                message.channels = [];
                            message.channels.push($root.chat.v1.Channel.decode(reader, reader.uint32()));
                            break;
                        }
                    case 5: {
                            if (!(message.members && message.members.length))
                                message.members = [];
                            message.members.push($root.chat.v1.GuildMember.decode(reader, reader.uint32()));
                            break;
                        }
                    case 6: {
                            message.currentUserRole = reader.string();
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
             * Decodes a Guild message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.Guild
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.Guild} Guild
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Guild.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Guild message.
             * @function verify
             * @memberof chat.v1.Guild
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Guild.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.iconColor != null && message.hasOwnProperty("iconColor"))
                    if (!$util.isString(message.iconColor))
                        return "iconColor: string expected";
                if (message.channels != null && message.hasOwnProperty("channels")) {
                    if (!Array.isArray(message.channels))
                        return "channels: array expected";
                    for (let i = 0; i < message.channels.length; ++i) {
                        let error = $root.chat.v1.Channel.verify(message.channels[i]);
                        if (error)
                            return "channels." + error;
                    }
                }
                if (message.members != null && message.hasOwnProperty("members")) {
                    if (!Array.isArray(message.members))
                        return "members: array expected";
                    for (let i = 0; i < message.members.length; ++i) {
                        let error = $root.chat.v1.GuildMember.verify(message.members[i]);
                        if (error)
                            return "members." + error;
                    }
                }
                if (message.currentUserRole != null && message.hasOwnProperty("currentUserRole"))
                    if (!$util.isString(message.currentUserRole))
                        return "currentUserRole: string expected";
                return null;
            };

            /**
             * Creates a Guild message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.Guild
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.Guild} Guild
             */
            Guild.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.Guild)
                    return object;
                let message = new $root.chat.v1.Guild();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.iconColor != null)
                    message.iconColor = String(object.iconColor);
                if (object.channels) {
                    if (!Array.isArray(object.channels))
                        throw TypeError(".chat.v1.Guild.channels: array expected");
                    message.channels = [];
                    for (let i = 0; i < object.channels.length; ++i) {
                        if (typeof object.channels[i] !== "object")
                            throw TypeError(".chat.v1.Guild.channels: object expected");
                        message.channels[i] = $root.chat.v1.Channel.fromObject(object.channels[i]);
                    }
                }
                if (object.members) {
                    if (!Array.isArray(object.members))
                        throw TypeError(".chat.v1.Guild.members: array expected");
                    message.members = [];
                    for (let i = 0; i < object.members.length; ++i) {
                        if (typeof object.members[i] !== "object")
                            throw TypeError(".chat.v1.Guild.members: object expected");
                        message.members[i] = $root.chat.v1.GuildMember.fromObject(object.members[i]);
                    }
                }
                if (object.currentUserRole != null)
                    message.currentUserRole = String(object.currentUserRole);
                return message;
            };

            /**
             * Creates a plain object from a Guild message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.Guild
             * @static
             * @param {chat.v1.Guild} message Guild
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Guild.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults) {
                    object.channels = [];
                    object.members = [];
                }
                if (options.defaults) {
                    object.id = "";
                    object.name = "";
                    object.iconColor = "";
                    object.currentUserRole = "";
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.iconColor != null && message.hasOwnProperty("iconColor"))
                    object.iconColor = message.iconColor;
                if (message.channels && message.channels.length) {
                    object.channels = [];
                    for (let j = 0; j < message.channels.length; ++j)
                        object.channels[j] = $root.chat.v1.Channel.toObject(message.channels[j], options);
                }
                if (message.members && message.members.length) {
                    object.members = [];
                    for (let j = 0; j < message.members.length; ++j)
                        object.members[j] = $root.chat.v1.GuildMember.toObject(message.members[j], options);
                }
                if (message.currentUserRole != null && message.hasOwnProperty("currentUserRole"))
                    object.currentUserRole = message.currentUserRole;
                return object;
            };

            /**
             * Converts this Guild to JSON.
             * @function toJSON
             * @memberof chat.v1.Guild
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Guild.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Guild
             * @function getTypeUrl
             * @memberof chat.v1.Guild
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Guild.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.Guild";
            };

            return Guild;
        })();

        v1.Authenticate = (function() {

            /**
             * Properties of an Authenticate.
             * @memberof chat.v1
             * @interface IAuthenticate
             * @property {string|null} [token] Authenticate token
             * @property {string|null} [clientVersion] Authenticate clientVersion
             */

            /**
             * Constructs a new Authenticate.
             * @memberof chat.v1
             * @classdesc Represents an Authenticate.
             * @implements IAuthenticate
             * @constructor
             * @param {chat.v1.IAuthenticate=} [properties] Properties to set
             */
            function Authenticate(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Authenticate token.
             * @member {string} token
             * @memberof chat.v1.Authenticate
             * @instance
             */
            Authenticate.prototype.token = "";

            /**
             * Authenticate clientVersion.
             * @member {string} clientVersion
             * @memberof chat.v1.Authenticate
             * @instance
             */
            Authenticate.prototype.clientVersion = "";

            /**
             * Creates a new Authenticate instance using the specified properties.
             * @function create
             * @memberof chat.v1.Authenticate
             * @static
             * @param {chat.v1.IAuthenticate=} [properties] Properties to set
             * @returns {chat.v1.Authenticate} Authenticate instance
             */
            Authenticate.create = function create(properties) {
                return new Authenticate(properties);
            };

            /**
             * Encodes the specified Authenticate message. Does not implicitly {@link chat.v1.Authenticate.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.Authenticate
             * @static
             * @param {chat.v1.IAuthenticate} message Authenticate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Authenticate.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.token);
                if (message.clientVersion != null && Object.hasOwnProperty.call(message, "clientVersion"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.clientVersion);
                return writer;
            };

            /**
             * Encodes the specified Authenticate message, length delimited. Does not implicitly {@link chat.v1.Authenticate.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.Authenticate
             * @static
             * @param {chat.v1.IAuthenticate} message Authenticate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Authenticate.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Authenticate message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.Authenticate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.Authenticate} Authenticate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Authenticate.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.Authenticate();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.token = reader.string();
                            break;
                        }
                    case 2: {
                            message.clientVersion = reader.string();
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
             * Decodes an Authenticate message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.Authenticate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.Authenticate} Authenticate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Authenticate.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Authenticate message.
             * @function verify
             * @memberof chat.v1.Authenticate
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Authenticate.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.token != null && message.hasOwnProperty("token"))
                    if (!$util.isString(message.token))
                        return "token: string expected";
                if (message.clientVersion != null && message.hasOwnProperty("clientVersion"))
                    if (!$util.isString(message.clientVersion))
                        return "clientVersion: string expected";
                return null;
            };

            /**
             * Creates an Authenticate message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.Authenticate
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.Authenticate} Authenticate
             */
            Authenticate.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.Authenticate)
                    return object;
                let message = new $root.chat.v1.Authenticate();
                if (object.token != null)
                    message.token = String(object.token);
                if (object.clientVersion != null)
                    message.clientVersion = String(object.clientVersion);
                return message;
            };

            /**
             * Creates a plain object from an Authenticate message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.Authenticate
             * @static
             * @param {chat.v1.Authenticate} message Authenticate
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Authenticate.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.token = "";
                    object.clientVersion = "";
                }
                if (message.token != null && message.hasOwnProperty("token"))
                    object.token = message.token;
                if (message.clientVersion != null && message.hasOwnProperty("clientVersion"))
                    object.clientVersion = message.clientVersion;
                return object;
            };

            /**
             * Converts this Authenticate to JSON.
             * @function toJSON
             * @memberof chat.v1.Authenticate
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Authenticate.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Authenticate
             * @function getTypeUrl
             * @memberof chat.v1.Authenticate
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Authenticate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.Authenticate";
            };

            return Authenticate;
        })();

        v1.Authenticated = (function() {

            /**
             * Properties of an Authenticated.
             * @memberof chat.v1
             * @interface IAuthenticated
             * @property {chat.v1.IUser|null} [user] Authenticated user
             * @property {Array.<chat.v1.IGuild>|null} [guilds] Authenticated guilds
             * @property {string|null} [sessionId] Authenticated sessionId
             */

            /**
             * Constructs a new Authenticated.
             * @memberof chat.v1
             * @classdesc Represents an Authenticated.
             * @implements IAuthenticated
             * @constructor
             * @param {chat.v1.IAuthenticated=} [properties] Properties to set
             */
            function Authenticated(properties) {
                this.guilds = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Authenticated user.
             * @member {chat.v1.IUser|null|undefined} user
             * @memberof chat.v1.Authenticated
             * @instance
             */
            Authenticated.prototype.user = null;

            /**
             * Authenticated guilds.
             * @member {Array.<chat.v1.IGuild>} guilds
             * @memberof chat.v1.Authenticated
             * @instance
             */
            Authenticated.prototype.guilds = $util.emptyArray;

            /**
             * Authenticated sessionId.
             * @member {string} sessionId
             * @memberof chat.v1.Authenticated
             * @instance
             */
            Authenticated.prototype.sessionId = "";

            /**
             * Creates a new Authenticated instance using the specified properties.
             * @function create
             * @memberof chat.v1.Authenticated
             * @static
             * @param {chat.v1.IAuthenticated=} [properties] Properties to set
             * @returns {chat.v1.Authenticated} Authenticated instance
             */
            Authenticated.create = function create(properties) {
                return new Authenticated(properties);
            };

            /**
             * Encodes the specified Authenticated message. Does not implicitly {@link chat.v1.Authenticated.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.Authenticated
             * @static
             * @param {chat.v1.IAuthenticated} message Authenticated message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Authenticated.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.user != null && Object.hasOwnProperty.call(message, "user"))
                    $root.chat.v1.User.encode(message.user, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.guilds != null && message.guilds.length)
                    for (let i = 0; i < message.guilds.length; ++i)
                        $root.chat.v1.Guild.encode(message.guilds[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.sessionId != null && Object.hasOwnProperty.call(message, "sessionId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.sessionId);
                return writer;
            };

            /**
             * Encodes the specified Authenticated message, length delimited. Does not implicitly {@link chat.v1.Authenticated.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.Authenticated
             * @static
             * @param {chat.v1.IAuthenticated} message Authenticated message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Authenticated.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Authenticated message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.Authenticated
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.Authenticated} Authenticated
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Authenticated.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.Authenticated();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.user = $root.chat.v1.User.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            if (!(message.guilds && message.guilds.length))
                                message.guilds = [];
                            message.guilds.push($root.chat.v1.Guild.decode(reader, reader.uint32()));
                            break;
                        }
                    case 3: {
                            message.sessionId = reader.string();
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
             * Decodes an Authenticated message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.Authenticated
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.Authenticated} Authenticated
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Authenticated.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Authenticated message.
             * @function verify
             * @memberof chat.v1.Authenticated
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Authenticated.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.user != null && message.hasOwnProperty("user")) {
                    let error = $root.chat.v1.User.verify(message.user);
                    if (error)
                        return "user." + error;
                }
                if (message.guilds != null && message.hasOwnProperty("guilds")) {
                    if (!Array.isArray(message.guilds))
                        return "guilds: array expected";
                    for (let i = 0; i < message.guilds.length; ++i) {
                        let error = $root.chat.v1.Guild.verify(message.guilds[i]);
                        if (error)
                            return "guilds." + error;
                    }
                }
                if (message.sessionId != null && message.hasOwnProperty("sessionId"))
                    if (!$util.isString(message.sessionId))
                        return "sessionId: string expected";
                return null;
            };

            /**
             * Creates an Authenticated message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.Authenticated
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.Authenticated} Authenticated
             */
            Authenticated.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.Authenticated)
                    return object;
                let message = new $root.chat.v1.Authenticated();
                if (object.user != null) {
                    if (typeof object.user !== "object")
                        throw TypeError(".chat.v1.Authenticated.user: object expected");
                    message.user = $root.chat.v1.User.fromObject(object.user);
                }
                if (object.guilds) {
                    if (!Array.isArray(object.guilds))
                        throw TypeError(".chat.v1.Authenticated.guilds: array expected");
                    message.guilds = [];
                    for (let i = 0; i < object.guilds.length; ++i) {
                        if (typeof object.guilds[i] !== "object")
                            throw TypeError(".chat.v1.Authenticated.guilds: object expected");
                        message.guilds[i] = $root.chat.v1.Guild.fromObject(object.guilds[i]);
                    }
                }
                if (object.sessionId != null)
                    message.sessionId = String(object.sessionId);
                return message;
            };

            /**
             * Creates a plain object from an Authenticated message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.Authenticated
             * @static
             * @param {chat.v1.Authenticated} message Authenticated
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Authenticated.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.guilds = [];
                if (options.defaults) {
                    object.user = null;
                    object.sessionId = "";
                }
                if (message.user != null && message.hasOwnProperty("user"))
                    object.user = $root.chat.v1.User.toObject(message.user, options);
                if (message.guilds && message.guilds.length) {
                    object.guilds = [];
                    for (let j = 0; j < message.guilds.length; ++j)
                        object.guilds[j] = $root.chat.v1.Guild.toObject(message.guilds[j], options);
                }
                if (message.sessionId != null && message.hasOwnProperty("sessionId"))
                    object.sessionId = message.sessionId;
                return object;
            };

            /**
             * Converts this Authenticated to JSON.
             * @function toJSON
             * @memberof chat.v1.Authenticated
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Authenticated.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Authenticated
             * @function getTypeUrl
             * @memberof chat.v1.Authenticated
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Authenticated.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.Authenticated";
            };

            return Authenticated;
        })();

        v1.Subscribe = (function() {

            /**
             * Properties of a Subscribe.
             * @memberof chat.v1
             * @interface ISubscribe
             * @property {Array.<string>|null} [channelIds] Subscribe channelIds
             */

            /**
             * Constructs a new Subscribe.
             * @memberof chat.v1
             * @classdesc Represents a Subscribe.
             * @implements ISubscribe
             * @constructor
             * @param {chat.v1.ISubscribe=} [properties] Properties to set
             */
            function Subscribe(properties) {
                this.channelIds = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Subscribe channelIds.
             * @member {Array.<string>} channelIds
             * @memberof chat.v1.Subscribe
             * @instance
             */
            Subscribe.prototype.channelIds = $util.emptyArray;

            /**
             * Creates a new Subscribe instance using the specified properties.
             * @function create
             * @memberof chat.v1.Subscribe
             * @static
             * @param {chat.v1.ISubscribe=} [properties] Properties to set
             * @returns {chat.v1.Subscribe} Subscribe instance
             */
            Subscribe.create = function create(properties) {
                return new Subscribe(properties);
            };

            /**
             * Encodes the specified Subscribe message. Does not implicitly {@link chat.v1.Subscribe.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.Subscribe
             * @static
             * @param {chat.v1.ISubscribe} message Subscribe message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Subscribe.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelIds != null && message.channelIds.length)
                    for (let i = 0; i < message.channelIds.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.channelIds[i]);
                return writer;
            };

            /**
             * Encodes the specified Subscribe message, length delimited. Does not implicitly {@link chat.v1.Subscribe.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.Subscribe
             * @static
             * @param {chat.v1.ISubscribe} message Subscribe message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Subscribe.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Subscribe message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.Subscribe
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.Subscribe} Subscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Subscribe.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.Subscribe();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.channelIds && message.channelIds.length))
                                message.channelIds = [];
                            message.channelIds.push(reader.string());
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
             * Decodes a Subscribe message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.Subscribe
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.Subscribe} Subscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Subscribe.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Subscribe message.
             * @function verify
             * @memberof chat.v1.Subscribe
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Subscribe.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelIds != null && message.hasOwnProperty("channelIds")) {
                    if (!Array.isArray(message.channelIds))
                        return "channelIds: array expected";
                    for (let i = 0; i < message.channelIds.length; ++i)
                        if (!$util.isString(message.channelIds[i]))
                            return "channelIds: string[] expected";
                }
                return null;
            };

            /**
             * Creates a Subscribe message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.Subscribe
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.Subscribe} Subscribe
             */
            Subscribe.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.Subscribe)
                    return object;
                let message = new $root.chat.v1.Subscribe();
                if (object.channelIds) {
                    if (!Array.isArray(object.channelIds))
                        throw TypeError(".chat.v1.Subscribe.channelIds: array expected");
                    message.channelIds = [];
                    for (let i = 0; i < object.channelIds.length; ++i)
                        message.channelIds[i] = String(object.channelIds[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a Subscribe message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.Subscribe
             * @static
             * @param {chat.v1.Subscribe} message Subscribe
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Subscribe.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.channelIds = [];
                if (message.channelIds && message.channelIds.length) {
                    object.channelIds = [];
                    for (let j = 0; j < message.channelIds.length; ++j)
                        object.channelIds[j] = message.channelIds[j];
                }
                return object;
            };

            /**
             * Converts this Subscribe to JSON.
             * @function toJSON
             * @memberof chat.v1.Subscribe
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Subscribe.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Subscribe
             * @function getTypeUrl
             * @memberof chat.v1.Subscribe
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Subscribe.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.Subscribe";
            };

            return Subscribe;
        })();

        v1.Unsubscribe = (function() {

            /**
             * Properties of an Unsubscribe.
             * @memberof chat.v1
             * @interface IUnsubscribe
             * @property {Array.<string>|null} [channelIds] Unsubscribe channelIds
             */

            /**
             * Constructs a new Unsubscribe.
             * @memberof chat.v1
             * @classdesc Represents an Unsubscribe.
             * @implements IUnsubscribe
             * @constructor
             * @param {chat.v1.IUnsubscribe=} [properties] Properties to set
             */
            function Unsubscribe(properties) {
                this.channelIds = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Unsubscribe channelIds.
             * @member {Array.<string>} channelIds
             * @memberof chat.v1.Unsubscribe
             * @instance
             */
            Unsubscribe.prototype.channelIds = $util.emptyArray;

            /**
             * Creates a new Unsubscribe instance using the specified properties.
             * @function create
             * @memberof chat.v1.Unsubscribe
             * @static
             * @param {chat.v1.IUnsubscribe=} [properties] Properties to set
             * @returns {chat.v1.Unsubscribe} Unsubscribe instance
             */
            Unsubscribe.create = function create(properties) {
                return new Unsubscribe(properties);
            };

            /**
             * Encodes the specified Unsubscribe message. Does not implicitly {@link chat.v1.Unsubscribe.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.Unsubscribe
             * @static
             * @param {chat.v1.IUnsubscribe} message Unsubscribe message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Unsubscribe.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelIds != null && message.channelIds.length)
                    for (let i = 0; i < message.channelIds.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.channelIds[i]);
                return writer;
            };

            /**
             * Encodes the specified Unsubscribe message, length delimited. Does not implicitly {@link chat.v1.Unsubscribe.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.Unsubscribe
             * @static
             * @param {chat.v1.IUnsubscribe} message Unsubscribe message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Unsubscribe.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Unsubscribe message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.Unsubscribe
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.Unsubscribe} Unsubscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Unsubscribe.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.Unsubscribe();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.channelIds && message.channelIds.length))
                                message.channelIds = [];
                            message.channelIds.push(reader.string());
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
             * Decodes an Unsubscribe message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.Unsubscribe
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.Unsubscribe} Unsubscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Unsubscribe.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Unsubscribe message.
             * @function verify
             * @memberof chat.v1.Unsubscribe
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Unsubscribe.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelIds != null && message.hasOwnProperty("channelIds")) {
                    if (!Array.isArray(message.channelIds))
                        return "channelIds: array expected";
                    for (let i = 0; i < message.channelIds.length; ++i)
                        if (!$util.isString(message.channelIds[i]))
                            return "channelIds: string[] expected";
                }
                return null;
            };

            /**
             * Creates an Unsubscribe message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.Unsubscribe
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.Unsubscribe} Unsubscribe
             */
            Unsubscribe.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.Unsubscribe)
                    return object;
                let message = new $root.chat.v1.Unsubscribe();
                if (object.channelIds) {
                    if (!Array.isArray(object.channelIds))
                        throw TypeError(".chat.v1.Unsubscribe.channelIds: array expected");
                    message.channelIds = [];
                    for (let i = 0; i < object.channelIds.length; ++i)
                        message.channelIds[i] = String(object.channelIds[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from an Unsubscribe message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.Unsubscribe
             * @static
             * @param {chat.v1.Unsubscribe} message Unsubscribe
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Unsubscribe.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.channelIds = [];
                if (message.channelIds && message.channelIds.length) {
                    object.channelIds = [];
                    for (let j = 0; j < message.channelIds.length; ++j)
                        object.channelIds[j] = message.channelIds[j];
                }
                return object;
            };

            /**
             * Converts this Unsubscribe to JSON.
             * @function toJSON
             * @memberof chat.v1.Unsubscribe
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Unsubscribe.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Unsubscribe
             * @function getTypeUrl
             * @memberof chat.v1.Unsubscribe
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Unsubscribe.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.Unsubscribe";
            };

            return Unsubscribe;
        })();

        v1.SendMessage = (function() {

            /**
             * Properties of a SendMessage.
             * @memberof chat.v1
             * @interface ISendMessage
             * @property {string|null} [channelId] SendMessage channelId
             * @property {string|null} [content] SendMessage content
             * @property {Array.<string>|null} [attachments] SendMessage attachments
             * @property {string|null} [clientId] SendMessage clientId
             */

            /**
             * Constructs a new SendMessage.
             * @memberof chat.v1
             * @classdesc Represents a SendMessage.
             * @implements ISendMessage
             * @constructor
             * @param {chat.v1.ISendMessage=} [properties] Properties to set
             */
            function SendMessage(properties) {
                this.attachments = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SendMessage channelId.
             * @member {string} channelId
             * @memberof chat.v1.SendMessage
             * @instance
             */
            SendMessage.prototype.channelId = "";

            /**
             * SendMessage content.
             * @member {string} content
             * @memberof chat.v1.SendMessage
             * @instance
             */
            SendMessage.prototype.content = "";

            /**
             * SendMessage attachments.
             * @member {Array.<string>} attachments
             * @memberof chat.v1.SendMessage
             * @instance
             */
            SendMessage.prototype.attachments = $util.emptyArray;

            /**
             * SendMessage clientId.
             * @member {string} clientId
             * @memberof chat.v1.SendMessage
             * @instance
             */
            SendMessage.prototype.clientId = "";

            /**
             * Creates a new SendMessage instance using the specified properties.
             * @function create
             * @memberof chat.v1.SendMessage
             * @static
             * @param {chat.v1.ISendMessage=} [properties] Properties to set
             * @returns {chat.v1.SendMessage} SendMessage instance
             */
            SendMessage.create = function create(properties) {
                return new SendMessage(properties);
            };

            /**
             * Encodes the specified SendMessage message. Does not implicitly {@link chat.v1.SendMessage.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.SendMessage
             * @static
             * @param {chat.v1.ISendMessage} message SendMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.channelId);
                if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.content);
                if (message.attachments != null && message.attachments.length)
                    for (let i = 0; i < message.attachments.length; ++i)
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.attachments[i]);
                if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.clientId);
                return writer;
            };

            /**
             * Encodes the specified SendMessage message, length delimited. Does not implicitly {@link chat.v1.SendMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.SendMessage
             * @static
             * @param {chat.v1.ISendMessage} message SendMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SendMessage message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.SendMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.SendMessage} SendMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendMessage.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.SendMessage();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.channelId = reader.string();
                            break;
                        }
                    case 2: {
                            message.content = reader.string();
                            break;
                        }
                    case 3: {
                            if (!(message.attachments && message.attachments.length))
                                message.attachments = [];
                            message.attachments.push(reader.string());
                            break;
                        }
                    case 4: {
                            message.clientId = reader.string();
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
             * Decodes a SendMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.SendMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.SendMessage} SendMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SendMessage message.
             * @function verify
             * @memberof chat.v1.SendMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SendMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isString(message.channelId))
                        return "channelId: string expected";
                if (message.content != null && message.hasOwnProperty("content"))
                    if (!$util.isString(message.content))
                        return "content: string expected";
                if (message.attachments != null && message.hasOwnProperty("attachments")) {
                    if (!Array.isArray(message.attachments))
                        return "attachments: array expected";
                    for (let i = 0; i < message.attachments.length; ++i)
                        if (!$util.isString(message.attachments[i]))
                            return "attachments: string[] expected";
                }
                if (message.clientId != null && message.hasOwnProperty("clientId"))
                    if (!$util.isString(message.clientId))
                        return "clientId: string expected";
                return null;
            };

            /**
             * Creates a SendMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.SendMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.SendMessage} SendMessage
             */
            SendMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.SendMessage)
                    return object;
                let message = new $root.chat.v1.SendMessage();
                if (object.channelId != null)
                    message.channelId = String(object.channelId);
                if (object.content != null)
                    message.content = String(object.content);
                if (object.attachments) {
                    if (!Array.isArray(object.attachments))
                        throw TypeError(".chat.v1.SendMessage.attachments: array expected");
                    message.attachments = [];
                    for (let i = 0; i < object.attachments.length; ++i)
                        message.attachments[i] = String(object.attachments[i]);
                }
                if (object.clientId != null)
                    message.clientId = String(object.clientId);
                return message;
            };

            /**
             * Creates a plain object from a SendMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.SendMessage
             * @static
             * @param {chat.v1.SendMessage} message SendMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SendMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.attachments = [];
                if (options.defaults) {
                    object.channelId = "";
                    object.content = "";
                    object.clientId = "";
                }
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    object.channelId = message.channelId;
                if (message.content != null && message.hasOwnProperty("content"))
                    object.content = message.content;
                if (message.attachments && message.attachments.length) {
                    object.attachments = [];
                    for (let j = 0; j < message.attachments.length; ++j)
                        object.attachments[j] = message.attachments[j];
                }
                if (message.clientId != null && message.hasOwnProperty("clientId"))
                    object.clientId = message.clientId;
                return object;
            };

            /**
             * Converts this SendMessage to JSON.
             * @function toJSON
             * @memberof chat.v1.SendMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SendMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SendMessage
             * @function getTypeUrl
             * @memberof chat.v1.SendMessage
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SendMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.SendMessage";
            };

            return SendMessage;
        })();

        v1.Heartbeat = (function() {

            /**
             * Properties of a Heartbeat.
             * @memberof chat.v1
             * @interface IHeartbeat
             * @property {chat.v1.PresenceStatus|null} [status] Heartbeat status
             */

            /**
             * Constructs a new Heartbeat.
             * @memberof chat.v1
             * @classdesc Represents a Heartbeat.
             * @implements IHeartbeat
             * @constructor
             * @param {chat.v1.IHeartbeat=} [properties] Properties to set
             */
            function Heartbeat(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Heartbeat status.
             * @member {chat.v1.PresenceStatus} status
             * @memberof chat.v1.Heartbeat
             * @instance
             */
            Heartbeat.prototype.status = 0;

            /**
             * Creates a new Heartbeat instance using the specified properties.
             * @function create
             * @memberof chat.v1.Heartbeat
             * @static
             * @param {chat.v1.IHeartbeat=} [properties] Properties to set
             * @returns {chat.v1.Heartbeat} Heartbeat instance
             */
            Heartbeat.create = function create(properties) {
                return new Heartbeat(properties);
            };

            /**
             * Encodes the specified Heartbeat message. Does not implicitly {@link chat.v1.Heartbeat.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.Heartbeat
             * @static
             * @param {chat.v1.IHeartbeat} message Heartbeat message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Heartbeat.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
                return writer;
            };

            /**
             * Encodes the specified Heartbeat message, length delimited. Does not implicitly {@link chat.v1.Heartbeat.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.Heartbeat
             * @static
             * @param {chat.v1.IHeartbeat} message Heartbeat message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Heartbeat.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Heartbeat message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.Heartbeat
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.Heartbeat} Heartbeat
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Heartbeat.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.Heartbeat();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.status = reader.int32();
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
             * Decodes a Heartbeat message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.Heartbeat
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.Heartbeat} Heartbeat
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Heartbeat.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Heartbeat message.
             * @function verify
             * @memberof chat.v1.Heartbeat
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Heartbeat.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.status != null && message.hasOwnProperty("status"))
                    switch (message.status) {
                    default:
                        return "status: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                return null;
            };

            /**
             * Creates a Heartbeat message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.Heartbeat
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.Heartbeat} Heartbeat
             */
            Heartbeat.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.Heartbeat)
                    return object;
                let message = new $root.chat.v1.Heartbeat();
                switch (object.status) {
                default:
                    if (typeof object.status === "number") {
                        message.status = object.status;
                        break;
                    }
                    break;
                case "PRESENCE_STATUS_UNSPECIFIED":
                case 0:
                    message.status = 0;
                    break;
                case "PRESENCE_STATUS_ONLINE":
                case 1:
                    message.status = 1;
                    break;
                case "PRESENCE_STATUS_IDLE":
                case 2:
                    message.status = 2;
                    break;
                case "PRESENCE_STATUS_DO_NOT_DISTURB":
                case 3:
                    message.status = 3;
                    break;
                case "PRESENCE_STATUS_OFFLINE":
                case 4:
                    message.status = 4;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a Heartbeat message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.Heartbeat
             * @static
             * @param {chat.v1.Heartbeat} message Heartbeat
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Heartbeat.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.status = options.enums === String ? "PRESENCE_STATUS_UNSPECIFIED" : 0;
                if (message.status != null && message.hasOwnProperty("status"))
                    object.status = options.enums === String ? $root.chat.v1.PresenceStatus[message.status] === undefined ? message.status : $root.chat.v1.PresenceStatus[message.status] : message.status;
                return object;
            };

            /**
             * Converts this Heartbeat to JSON.
             * @function toJSON
             * @memberof chat.v1.Heartbeat
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Heartbeat.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Heartbeat
             * @function getTypeUrl
             * @memberof chat.v1.Heartbeat
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Heartbeat.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.Heartbeat";
            };

            return Heartbeat;
        })();

        v1.SetPresence = (function() {

            /**
             * Properties of a SetPresence.
             * @memberof chat.v1
             * @interface ISetPresence
             * @property {chat.v1.PresenceStatus|null} [status] SetPresence status
             */

            /**
             * Constructs a new SetPresence.
             * @memberof chat.v1
             * @classdesc Represents a SetPresence.
             * @implements ISetPresence
             * @constructor
             * @param {chat.v1.ISetPresence=} [properties] Properties to set
             */
            function SetPresence(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SetPresence status.
             * @member {chat.v1.PresenceStatus} status
             * @memberof chat.v1.SetPresence
             * @instance
             */
            SetPresence.prototype.status = 0;

            /**
             * Creates a new SetPresence instance using the specified properties.
             * @function create
             * @memberof chat.v1.SetPresence
             * @static
             * @param {chat.v1.ISetPresence=} [properties] Properties to set
             * @returns {chat.v1.SetPresence} SetPresence instance
             */
            SetPresence.create = function create(properties) {
                return new SetPresence(properties);
            };

            /**
             * Encodes the specified SetPresence message. Does not implicitly {@link chat.v1.SetPresence.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.SetPresence
             * @static
             * @param {chat.v1.ISetPresence} message SetPresence message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetPresence.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
                return writer;
            };

            /**
             * Encodes the specified SetPresence message, length delimited. Does not implicitly {@link chat.v1.SetPresence.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.SetPresence
             * @static
             * @param {chat.v1.ISetPresence} message SetPresence message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetPresence.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SetPresence message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.SetPresence
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.SetPresence} SetPresence
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetPresence.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.SetPresence();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.status = reader.int32();
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
             * Decodes a SetPresence message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.SetPresence
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.SetPresence} SetPresence
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetPresence.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SetPresence message.
             * @function verify
             * @memberof chat.v1.SetPresence
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetPresence.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.status != null && message.hasOwnProperty("status"))
                    switch (message.status) {
                    default:
                        return "status: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                return null;
            };

            /**
             * Creates a SetPresence message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.SetPresence
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.SetPresence} SetPresence
             */
            SetPresence.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.SetPresence)
                    return object;
                let message = new $root.chat.v1.SetPresence();
                switch (object.status) {
                default:
                    if (typeof object.status === "number") {
                        message.status = object.status;
                        break;
                    }
                    break;
                case "PRESENCE_STATUS_UNSPECIFIED":
                case 0:
                    message.status = 0;
                    break;
                case "PRESENCE_STATUS_ONLINE":
                case 1:
                    message.status = 1;
                    break;
                case "PRESENCE_STATUS_IDLE":
                case 2:
                    message.status = 2;
                    break;
                case "PRESENCE_STATUS_DO_NOT_DISTURB":
                case 3:
                    message.status = 3;
                    break;
                case "PRESENCE_STATUS_OFFLINE":
                case 4:
                    message.status = 4;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a SetPresence message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.SetPresence
             * @static
             * @param {chat.v1.SetPresence} message SetPresence
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetPresence.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.status = options.enums === String ? "PRESENCE_STATUS_UNSPECIFIED" : 0;
                if (message.status != null && message.hasOwnProperty("status"))
                    object.status = options.enums === String ? $root.chat.v1.PresenceStatus[message.status] === undefined ? message.status : $root.chat.v1.PresenceStatus[message.status] : message.status;
                return object;
            };

            /**
             * Converts this SetPresence to JSON.
             * @function toJSON
             * @memberof chat.v1.SetPresence
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetPresence.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SetPresence
             * @function getTypeUrl
             * @memberof chat.v1.SetPresence
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SetPresence.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.SetPresence";
            };

            return SetPresence;
        })();

        v1.Typing = (function() {

            /**
             * Properties of a Typing.
             * @memberof chat.v1
             * @interface ITyping
             * @property {string|null} [channelId] Typing channelId
             * @property {boolean|null} [active] Typing active
             */

            /**
             * Constructs a new Typing.
             * @memberof chat.v1
             * @classdesc Represents a Typing.
             * @implements ITyping
             * @constructor
             * @param {chat.v1.ITyping=} [properties] Properties to set
             */
            function Typing(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Typing channelId.
             * @member {string} channelId
             * @memberof chat.v1.Typing
             * @instance
             */
            Typing.prototype.channelId = "";

            /**
             * Typing active.
             * @member {boolean} active
             * @memberof chat.v1.Typing
             * @instance
             */
            Typing.prototype.active = false;

            /**
             * Creates a new Typing instance using the specified properties.
             * @function create
             * @memberof chat.v1.Typing
             * @static
             * @param {chat.v1.ITyping=} [properties] Properties to set
             * @returns {chat.v1.Typing} Typing instance
             */
            Typing.create = function create(properties) {
                return new Typing(properties);
            };

            /**
             * Encodes the specified Typing message. Does not implicitly {@link chat.v1.Typing.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.Typing
             * @static
             * @param {chat.v1.ITyping} message Typing message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Typing.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.channelId);
                if (message.active != null && Object.hasOwnProperty.call(message, "active"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.active);
                return writer;
            };

            /**
             * Encodes the specified Typing message, length delimited. Does not implicitly {@link chat.v1.Typing.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.Typing
             * @static
             * @param {chat.v1.ITyping} message Typing message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Typing.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Typing message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.Typing
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.Typing} Typing
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Typing.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.Typing();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.channelId = reader.string();
                            break;
                        }
                    case 2: {
                            message.active = reader.bool();
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
             * Decodes a Typing message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.Typing
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.Typing} Typing
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Typing.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Typing message.
             * @function verify
             * @memberof chat.v1.Typing
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Typing.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isString(message.channelId))
                        return "channelId: string expected";
                if (message.active != null && message.hasOwnProperty("active"))
                    if (typeof message.active !== "boolean")
                        return "active: boolean expected";
                return null;
            };

            /**
             * Creates a Typing message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.Typing
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.Typing} Typing
             */
            Typing.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.Typing)
                    return object;
                let message = new $root.chat.v1.Typing();
                if (object.channelId != null)
                    message.channelId = String(object.channelId);
                if (object.active != null)
                    message.active = Boolean(object.active);
                return message;
            };

            /**
             * Creates a plain object from a Typing message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.Typing
             * @static
             * @param {chat.v1.Typing} message Typing
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Typing.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.channelId = "";
                    object.active = false;
                }
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    object.channelId = message.channelId;
                if (message.active != null && message.hasOwnProperty("active"))
                    object.active = message.active;
                return object;
            };

            /**
             * Converts this Typing to JSON.
             * @function toJSON
             * @memberof chat.v1.Typing
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Typing.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Typing
             * @function getTypeUrl
             * @memberof chat.v1.Typing
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Typing.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.Typing";
            };

            return Typing;
        })();

        v1.ChatMessage = (function() {

            /**
             * Properties of a ChatMessage.
             * @memberof chat.v1
             * @interface IChatMessage
             * @property {number|Long|null} [id] ChatMessage id
             * @property {string|null} [channelId] ChatMessage channelId
             * @property {string|null} [guildId] ChatMessage guildId
             * @property {string|null} [authorId] ChatMessage authorId
             * @property {string|null} [authorName] ChatMessage authorName
             * @property {string|null} [authorColor] ChatMessage authorColor
             * @property {string|null} [content] ChatMessage content
             * @property {Array.<string>|null} [attachments] ChatMessage attachments
             * @property {number|Long|null} [timestampMs] ChatMessage timestampMs
             * @property {string|null} [clientId] ChatMessage clientId
             * @property {string|null} [authorAvatarUrl] ChatMessage authorAvatarUrl
             */

            /**
             * Constructs a new ChatMessage.
             * @memberof chat.v1
             * @classdesc Represents a ChatMessage.
             * @implements IChatMessage
             * @constructor
             * @param {chat.v1.IChatMessage=} [properties] Properties to set
             */
            function ChatMessage(properties) {
                this.attachments = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ChatMessage id.
             * @member {number|Long} id
             * @memberof chat.v1.ChatMessage
             * @instance
             */
            ChatMessage.prototype.id = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * ChatMessage channelId.
             * @member {string} channelId
             * @memberof chat.v1.ChatMessage
             * @instance
             */
            ChatMessage.prototype.channelId = "";

            /**
             * ChatMessage guildId.
             * @member {string} guildId
             * @memberof chat.v1.ChatMessage
             * @instance
             */
            ChatMessage.prototype.guildId = "";

            /**
             * ChatMessage authorId.
             * @member {string} authorId
             * @memberof chat.v1.ChatMessage
             * @instance
             */
            ChatMessage.prototype.authorId = "";

            /**
             * ChatMessage authorName.
             * @member {string} authorName
             * @memberof chat.v1.ChatMessage
             * @instance
             */
            ChatMessage.prototype.authorName = "";

            /**
             * ChatMessage authorColor.
             * @member {string} authorColor
             * @memberof chat.v1.ChatMessage
             * @instance
             */
            ChatMessage.prototype.authorColor = "";

            /**
             * ChatMessage content.
             * @member {string} content
             * @memberof chat.v1.ChatMessage
             * @instance
             */
            ChatMessage.prototype.content = "";

            /**
             * ChatMessage attachments.
             * @member {Array.<string>} attachments
             * @memberof chat.v1.ChatMessage
             * @instance
             */
            ChatMessage.prototype.attachments = $util.emptyArray;

            /**
             * ChatMessage timestampMs.
             * @member {number|Long} timestampMs
             * @memberof chat.v1.ChatMessage
             * @instance
             */
            ChatMessage.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * ChatMessage clientId.
             * @member {string} clientId
             * @memberof chat.v1.ChatMessage
             * @instance
             */
            ChatMessage.prototype.clientId = "";

            /**
             * ChatMessage authorAvatarUrl.
             * @member {string} authorAvatarUrl
             * @memberof chat.v1.ChatMessage
             * @instance
             */
            ChatMessage.prototype.authorAvatarUrl = "";

            /**
             * Creates a new ChatMessage instance using the specified properties.
             * @function create
             * @memberof chat.v1.ChatMessage
             * @static
             * @param {chat.v1.IChatMessage=} [properties] Properties to set
             * @returns {chat.v1.ChatMessage} ChatMessage instance
             */
            ChatMessage.create = function create(properties) {
                return new ChatMessage(properties);
            };

            /**
             * Encodes the specified ChatMessage message. Does not implicitly {@link chat.v1.ChatMessage.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.ChatMessage
             * @static
             * @param {chat.v1.IChatMessage} message ChatMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChatMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.id);
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.channelId);
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.guildId);
                if (message.authorId != null && Object.hasOwnProperty.call(message, "authorId"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.authorId);
                if (message.authorName != null && Object.hasOwnProperty.call(message, "authorName"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.authorName);
                if (message.authorColor != null && Object.hasOwnProperty.call(message, "authorColor"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.authorColor);
                if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.content);
                if (message.attachments != null && message.attachments.length)
                    for (let i = 0; i < message.attachments.length; ++i)
                        writer.uint32(/* id 8, wireType 2 =*/66).string(message.attachments[i]);
                if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                    writer.uint32(/* id 9, wireType 0 =*/72).int64(message.timestampMs);
                if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.clientId);
                if (message.authorAvatarUrl != null && Object.hasOwnProperty.call(message, "authorAvatarUrl"))
                    writer.uint32(/* id 11, wireType 2 =*/90).string(message.authorAvatarUrl);
                return writer;
            };

            /**
             * Encodes the specified ChatMessage message, length delimited. Does not implicitly {@link chat.v1.ChatMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.ChatMessage
             * @static
             * @param {chat.v1.IChatMessage} message ChatMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChatMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ChatMessage message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.ChatMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.ChatMessage} ChatMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChatMessage.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.ChatMessage();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.int64();
                            break;
                        }
                    case 2: {
                            message.channelId = reader.string();
                            break;
                        }
                    case 3: {
                            message.guildId = reader.string();
                            break;
                        }
                    case 4: {
                            message.authorId = reader.string();
                            break;
                        }
                    case 5: {
                            message.authorName = reader.string();
                            break;
                        }
                    case 6: {
                            message.authorColor = reader.string();
                            break;
                        }
                    case 7: {
                            message.content = reader.string();
                            break;
                        }
                    case 8: {
                            if (!(message.attachments && message.attachments.length))
                                message.attachments = [];
                            message.attachments.push(reader.string());
                            break;
                        }
                    case 9: {
                            message.timestampMs = reader.int64();
                            break;
                        }
                    case 10: {
                            message.clientId = reader.string();
                            break;
                        }
                    case 11: {
                            message.authorAvatarUrl = reader.string();
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
             * Decodes a ChatMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.ChatMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.ChatMessage} ChatMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChatMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ChatMessage message.
             * @function verify
             * @memberof chat.v1.ChatMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ChatMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isString(message.channelId))
                        return "channelId: string expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isString(message.guildId))
                        return "guildId: string expected";
                if (message.authorId != null && message.hasOwnProperty("authorId"))
                    if (!$util.isString(message.authorId))
                        return "authorId: string expected";
                if (message.authorName != null && message.hasOwnProperty("authorName"))
                    if (!$util.isString(message.authorName))
                        return "authorName: string expected";
                if (message.authorColor != null && message.hasOwnProperty("authorColor"))
                    if (!$util.isString(message.authorColor))
                        return "authorColor: string expected";
                if (message.content != null && message.hasOwnProperty("content"))
                    if (!$util.isString(message.content))
                        return "content: string expected";
                if (message.attachments != null && message.hasOwnProperty("attachments")) {
                    if (!Array.isArray(message.attachments))
                        return "attachments: array expected";
                    for (let i = 0; i < message.attachments.length; ++i)
                        if (!$util.isString(message.attachments[i]))
                            return "attachments: string[] expected";
                }
                if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                    if (!$util.isInteger(message.timestampMs) && !(message.timestampMs && $util.isInteger(message.timestampMs.low) && $util.isInteger(message.timestampMs.high)))
                        return "timestampMs: integer|Long expected";
                if (message.clientId != null && message.hasOwnProperty("clientId"))
                    if (!$util.isString(message.clientId))
                        return "clientId: string expected";
                if (message.authorAvatarUrl != null && message.hasOwnProperty("authorAvatarUrl"))
                    if (!$util.isString(message.authorAvatarUrl))
                        return "authorAvatarUrl: string expected";
                return null;
            };

            /**
             * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.ChatMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.ChatMessage} ChatMessage
             */
            ChatMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.ChatMessage)
                    return object;
                let message = new $root.chat.v1.ChatMessage();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = false;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber();
                if (object.channelId != null)
                    message.channelId = String(object.channelId);
                if (object.guildId != null)
                    message.guildId = String(object.guildId);
                if (object.authorId != null)
                    message.authorId = String(object.authorId);
                if (object.authorName != null)
                    message.authorName = String(object.authorName);
                if (object.authorColor != null)
                    message.authorColor = String(object.authorColor);
                if (object.content != null)
                    message.content = String(object.content);
                if (object.attachments) {
                    if (!Array.isArray(object.attachments))
                        throw TypeError(".chat.v1.ChatMessage.attachments: array expected");
                    message.attachments = [];
                    for (let i = 0; i < object.attachments.length; ++i)
                        message.attachments[i] = String(object.attachments[i]);
                }
                if (object.timestampMs != null)
                    if ($util.Long)
                        (message.timestampMs = $util.Long.fromValue(object.timestampMs)).unsigned = false;
                    else if (typeof object.timestampMs === "string")
                        message.timestampMs = parseInt(object.timestampMs, 10);
                    else if (typeof object.timestampMs === "number")
                        message.timestampMs = object.timestampMs;
                    else if (typeof object.timestampMs === "object")
                        message.timestampMs = new $util.LongBits(object.timestampMs.low >>> 0, object.timestampMs.high >>> 0).toNumber();
                if (object.clientId != null)
                    message.clientId = String(object.clientId);
                if (object.authorAvatarUrl != null)
                    message.authorAvatarUrl = String(object.authorAvatarUrl);
                return message;
            };

            /**
             * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.ChatMessage
             * @static
             * @param {chat.v1.ChatMessage} message ChatMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ChatMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.attachments = [];
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                    object.channelId = "";
                    object.guildId = "";
                    object.authorId = "";
                    object.authorName = "";
                    object.authorColor = "";
                    object.content = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.timestampMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.timestampMs = options.longs === String ? "0" : 0;
                    object.clientId = "";
                    object.authorAvatarUrl = "";
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber() : message.id;
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    object.channelId = message.channelId;
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    object.guildId = message.guildId;
                if (message.authorId != null && message.hasOwnProperty("authorId"))
                    object.authorId = message.authorId;
                if (message.authorName != null && message.hasOwnProperty("authorName"))
                    object.authorName = message.authorName;
                if (message.authorColor != null && message.hasOwnProperty("authorColor"))
                    object.authorColor = message.authorColor;
                if (message.content != null && message.hasOwnProperty("content"))
                    object.content = message.content;
                if (message.attachments && message.attachments.length) {
                    object.attachments = [];
                    for (let j = 0; j < message.attachments.length; ++j)
                        object.attachments[j] = message.attachments[j];
                }
                if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                    if (typeof message.timestampMs === "number")
                        object.timestampMs = options.longs === String ? String(message.timestampMs) : message.timestampMs;
                    else
                        object.timestampMs = options.longs === String ? $util.Long.prototype.toString.call(message.timestampMs) : options.longs === Number ? new $util.LongBits(message.timestampMs.low >>> 0, message.timestampMs.high >>> 0).toNumber() : message.timestampMs;
                if (message.clientId != null && message.hasOwnProperty("clientId"))
                    object.clientId = message.clientId;
                if (message.authorAvatarUrl != null && message.hasOwnProperty("authorAvatarUrl"))
                    object.authorAvatarUrl = message.authorAvatarUrl;
                return object;
            };

            /**
             * Converts this ChatMessage to JSON.
             * @function toJSON
             * @memberof chat.v1.ChatMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ChatMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ChatMessage
             * @function getTypeUrl
             * @memberof chat.v1.ChatMessage
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ChatMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.ChatMessage";
            };

            return ChatMessage;
        })();

        v1.CallParticipant = (function() {

            /**
             * Properties of a CallParticipant.
             * @memberof chat.v1
             * @interface ICallParticipant
             * @property {string|null} [sessionId] CallParticipant sessionId
             * @property {string|null} [userId] CallParticipant userId
             * @property {string|null} [displayName] CallParticipant displayName
             * @property {string|null} [avatarUrl] CallParticipant avatarUrl
             * @property {string|null} [avatarColor] CallParticipant avatarColor
             * @property {boolean|null} [video] CallParticipant video
             * @property {boolean|null} [muted] CallParticipant muted
             * @property {boolean|null} [deafened] CallParticipant deafened
             * @property {boolean|null} [screenSharing] CallParticipant screenSharing
             */

            /**
             * Constructs a new CallParticipant.
             * @memberof chat.v1
             * @classdesc Represents a CallParticipant.
             * @implements ICallParticipant
             * @constructor
             * @param {chat.v1.ICallParticipant=} [properties] Properties to set
             */
            function CallParticipant(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CallParticipant sessionId.
             * @member {string} sessionId
             * @memberof chat.v1.CallParticipant
             * @instance
             */
            CallParticipant.prototype.sessionId = "";

            /**
             * CallParticipant userId.
             * @member {string} userId
             * @memberof chat.v1.CallParticipant
             * @instance
             */
            CallParticipant.prototype.userId = "";

            /**
             * CallParticipant displayName.
             * @member {string} displayName
             * @memberof chat.v1.CallParticipant
             * @instance
             */
            CallParticipant.prototype.displayName = "";

            /**
             * CallParticipant avatarUrl.
             * @member {string} avatarUrl
             * @memberof chat.v1.CallParticipant
             * @instance
             */
            CallParticipant.prototype.avatarUrl = "";

            /**
             * CallParticipant avatarColor.
             * @member {string} avatarColor
             * @memberof chat.v1.CallParticipant
             * @instance
             */
            CallParticipant.prototype.avatarColor = "";

            /**
             * CallParticipant video.
             * @member {boolean} video
             * @memberof chat.v1.CallParticipant
             * @instance
             */
            CallParticipant.prototype.video = false;

            /**
             * CallParticipant muted.
             * @member {boolean} muted
             * @memberof chat.v1.CallParticipant
             * @instance
             */
            CallParticipant.prototype.muted = false;

            /**
             * CallParticipant deafened.
             * @member {boolean} deafened
             * @memberof chat.v1.CallParticipant
             * @instance
             */
            CallParticipant.prototype.deafened = false;

            /**
             * CallParticipant screenSharing.
             * @member {boolean} screenSharing
             * @memberof chat.v1.CallParticipant
             * @instance
             */
            CallParticipant.prototype.screenSharing = false;

            /**
             * Creates a new CallParticipant instance using the specified properties.
             * @function create
             * @memberof chat.v1.CallParticipant
             * @static
             * @param {chat.v1.ICallParticipant=} [properties] Properties to set
             * @returns {chat.v1.CallParticipant} CallParticipant instance
             */
            CallParticipant.create = function create(properties) {
                return new CallParticipant(properties);
            };

            /**
             * Encodes the specified CallParticipant message. Does not implicitly {@link chat.v1.CallParticipant.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.CallParticipant
             * @static
             * @param {chat.v1.ICallParticipant} message CallParticipant message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallParticipant.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.sessionId != null && Object.hasOwnProperty.call(message, "sessionId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.sessionId);
                if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.userId);
                if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.displayName);
                if (message.avatarUrl != null && Object.hasOwnProperty.call(message, "avatarUrl"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.avatarUrl);
                if (message.avatarColor != null && Object.hasOwnProperty.call(message, "avatarColor"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.avatarColor);
                if (message.video != null && Object.hasOwnProperty.call(message, "video"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.video);
                if (message.muted != null && Object.hasOwnProperty.call(message, "muted"))
                    writer.uint32(/* id 7, wireType 0 =*/56).bool(message.muted);
                if (message.deafened != null && Object.hasOwnProperty.call(message, "deafened"))
                    writer.uint32(/* id 8, wireType 0 =*/64).bool(message.deafened);
                if (message.screenSharing != null && Object.hasOwnProperty.call(message, "screenSharing"))
                    writer.uint32(/* id 9, wireType 0 =*/72).bool(message.screenSharing);
                return writer;
            };

            /**
             * Encodes the specified CallParticipant message, length delimited. Does not implicitly {@link chat.v1.CallParticipant.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.CallParticipant
             * @static
             * @param {chat.v1.ICallParticipant} message CallParticipant message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallParticipant.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CallParticipant message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.CallParticipant
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.CallParticipant} CallParticipant
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallParticipant.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.CallParticipant();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.sessionId = reader.string();
                            break;
                        }
                    case 2: {
                            message.userId = reader.string();
                            break;
                        }
                    case 3: {
                            message.displayName = reader.string();
                            break;
                        }
                    case 4: {
                            message.avatarUrl = reader.string();
                            break;
                        }
                    case 5: {
                            message.avatarColor = reader.string();
                            break;
                        }
                    case 6: {
                            message.video = reader.bool();
                            break;
                        }
                    case 7: {
                            message.muted = reader.bool();
                            break;
                        }
                    case 8: {
                            message.deafened = reader.bool();
                            break;
                        }
                    case 9: {
                            message.screenSharing = reader.bool();
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
             * Decodes a CallParticipant message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.CallParticipant
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.CallParticipant} CallParticipant
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallParticipant.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CallParticipant message.
             * @function verify
             * @memberof chat.v1.CallParticipant
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CallParticipant.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.sessionId != null && message.hasOwnProperty("sessionId"))
                    if (!$util.isString(message.sessionId))
                        return "sessionId: string expected";
                if (message.userId != null && message.hasOwnProperty("userId"))
                    if (!$util.isString(message.userId))
                        return "userId: string expected";
                if (message.displayName != null && message.hasOwnProperty("displayName"))
                    if (!$util.isString(message.displayName))
                        return "displayName: string expected";
                if (message.avatarUrl != null && message.hasOwnProperty("avatarUrl"))
                    if (!$util.isString(message.avatarUrl))
                        return "avatarUrl: string expected";
                if (message.avatarColor != null && message.hasOwnProperty("avatarColor"))
                    if (!$util.isString(message.avatarColor))
                        return "avatarColor: string expected";
                if (message.video != null && message.hasOwnProperty("video"))
                    if (typeof message.video !== "boolean")
                        return "video: boolean expected";
                if (message.muted != null && message.hasOwnProperty("muted"))
                    if (typeof message.muted !== "boolean")
                        return "muted: boolean expected";
                if (message.deafened != null && message.hasOwnProperty("deafened"))
                    if (typeof message.deafened !== "boolean")
                        return "deafened: boolean expected";
                if (message.screenSharing != null && message.hasOwnProperty("screenSharing"))
                    if (typeof message.screenSharing !== "boolean")
                        return "screenSharing: boolean expected";
                return null;
            };

            /**
             * Creates a CallParticipant message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.CallParticipant
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.CallParticipant} CallParticipant
             */
            CallParticipant.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.CallParticipant)
                    return object;
                let message = new $root.chat.v1.CallParticipant();
                if (object.sessionId != null)
                    message.sessionId = String(object.sessionId);
                if (object.userId != null)
                    message.userId = String(object.userId);
                if (object.displayName != null)
                    message.displayName = String(object.displayName);
                if (object.avatarUrl != null)
                    message.avatarUrl = String(object.avatarUrl);
                if (object.avatarColor != null)
                    message.avatarColor = String(object.avatarColor);
                if (object.video != null)
                    message.video = Boolean(object.video);
                if (object.muted != null)
                    message.muted = Boolean(object.muted);
                if (object.deafened != null)
                    message.deafened = Boolean(object.deafened);
                if (object.screenSharing != null)
                    message.screenSharing = Boolean(object.screenSharing);
                return message;
            };

            /**
             * Creates a plain object from a CallParticipant message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.CallParticipant
             * @static
             * @param {chat.v1.CallParticipant} message CallParticipant
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CallParticipant.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.sessionId = "";
                    object.userId = "";
                    object.displayName = "";
                    object.avatarUrl = "";
                    object.avatarColor = "";
                    object.video = false;
                    object.muted = false;
                    object.deafened = false;
                    object.screenSharing = false;
                }
                if (message.sessionId != null && message.hasOwnProperty("sessionId"))
                    object.sessionId = message.sessionId;
                if (message.userId != null && message.hasOwnProperty("userId"))
                    object.userId = message.userId;
                if (message.displayName != null && message.hasOwnProperty("displayName"))
                    object.displayName = message.displayName;
                if (message.avatarUrl != null && message.hasOwnProperty("avatarUrl"))
                    object.avatarUrl = message.avatarUrl;
                if (message.avatarColor != null && message.hasOwnProperty("avatarColor"))
                    object.avatarColor = message.avatarColor;
                if (message.video != null && message.hasOwnProperty("video"))
                    object.video = message.video;
                if (message.muted != null && message.hasOwnProperty("muted"))
                    object.muted = message.muted;
                if (message.deafened != null && message.hasOwnProperty("deafened"))
                    object.deafened = message.deafened;
                if (message.screenSharing != null && message.hasOwnProperty("screenSharing"))
                    object.screenSharing = message.screenSharing;
                return object;
            };

            /**
             * Converts this CallParticipant to JSON.
             * @function toJSON
             * @memberof chat.v1.CallParticipant
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CallParticipant.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CallParticipant
             * @function getTypeUrl
             * @memberof chat.v1.CallParticipant
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CallParticipant.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.CallParticipant";
            };

            return CallParticipant;
        })();

        v1.CallSnapshot = (function() {

            /**
             * Properties of a CallSnapshot.
             * @memberof chat.v1
             * @interface ICallSnapshot
             * @property {string|null} [channelId] CallSnapshot channelId
             * @property {string|null} [selfSessionId] CallSnapshot selfSessionId
             * @property {Array.<chat.v1.ICallParticipant>|null} [participants] CallSnapshot participants
             */

            /**
             * Constructs a new CallSnapshot.
             * @memberof chat.v1
             * @classdesc Represents a CallSnapshot.
             * @implements ICallSnapshot
             * @constructor
             * @param {chat.v1.ICallSnapshot=} [properties] Properties to set
             */
            function CallSnapshot(properties) {
                this.participants = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CallSnapshot channelId.
             * @member {string} channelId
             * @memberof chat.v1.CallSnapshot
             * @instance
             */
            CallSnapshot.prototype.channelId = "";

            /**
             * CallSnapshot selfSessionId.
             * @member {string} selfSessionId
             * @memberof chat.v1.CallSnapshot
             * @instance
             */
            CallSnapshot.prototype.selfSessionId = "";

            /**
             * CallSnapshot participants.
             * @member {Array.<chat.v1.ICallParticipant>} participants
             * @memberof chat.v1.CallSnapshot
             * @instance
             */
            CallSnapshot.prototype.participants = $util.emptyArray;

            /**
             * Creates a new CallSnapshot instance using the specified properties.
             * @function create
             * @memberof chat.v1.CallSnapshot
             * @static
             * @param {chat.v1.ICallSnapshot=} [properties] Properties to set
             * @returns {chat.v1.CallSnapshot} CallSnapshot instance
             */
            CallSnapshot.create = function create(properties) {
                return new CallSnapshot(properties);
            };

            /**
             * Encodes the specified CallSnapshot message. Does not implicitly {@link chat.v1.CallSnapshot.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.CallSnapshot
             * @static
             * @param {chat.v1.ICallSnapshot} message CallSnapshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallSnapshot.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.channelId);
                if (message.selfSessionId != null && Object.hasOwnProperty.call(message, "selfSessionId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.selfSessionId);
                if (message.participants != null && message.participants.length)
                    for (let i = 0; i < message.participants.length; ++i)
                        $root.chat.v1.CallParticipant.encode(message.participants[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified CallSnapshot message, length delimited. Does not implicitly {@link chat.v1.CallSnapshot.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.CallSnapshot
             * @static
             * @param {chat.v1.ICallSnapshot} message CallSnapshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallSnapshot.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CallSnapshot message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.CallSnapshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.CallSnapshot} CallSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallSnapshot.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.CallSnapshot();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.channelId = reader.string();
                            break;
                        }
                    case 2: {
                            message.selfSessionId = reader.string();
                            break;
                        }
                    case 3: {
                            if (!(message.participants && message.participants.length))
                                message.participants = [];
                            message.participants.push($root.chat.v1.CallParticipant.decode(reader, reader.uint32()));
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
             * Decodes a CallSnapshot message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.CallSnapshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.CallSnapshot} CallSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallSnapshot.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CallSnapshot message.
             * @function verify
             * @memberof chat.v1.CallSnapshot
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CallSnapshot.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isString(message.channelId))
                        return "channelId: string expected";
                if (message.selfSessionId != null && message.hasOwnProperty("selfSessionId"))
                    if (!$util.isString(message.selfSessionId))
                        return "selfSessionId: string expected";
                if (message.participants != null && message.hasOwnProperty("participants")) {
                    if (!Array.isArray(message.participants))
                        return "participants: array expected";
                    for (let i = 0; i < message.participants.length; ++i) {
                        let error = $root.chat.v1.CallParticipant.verify(message.participants[i]);
                        if (error)
                            return "participants." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a CallSnapshot message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.CallSnapshot
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.CallSnapshot} CallSnapshot
             */
            CallSnapshot.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.CallSnapshot)
                    return object;
                let message = new $root.chat.v1.CallSnapshot();
                if (object.channelId != null)
                    message.channelId = String(object.channelId);
                if (object.selfSessionId != null)
                    message.selfSessionId = String(object.selfSessionId);
                if (object.participants) {
                    if (!Array.isArray(object.participants))
                        throw TypeError(".chat.v1.CallSnapshot.participants: array expected");
                    message.participants = [];
                    for (let i = 0; i < object.participants.length; ++i) {
                        if (typeof object.participants[i] !== "object")
                            throw TypeError(".chat.v1.CallSnapshot.participants: object expected");
                        message.participants[i] = $root.chat.v1.CallParticipant.fromObject(object.participants[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a CallSnapshot message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.CallSnapshot
             * @static
             * @param {chat.v1.CallSnapshot} message CallSnapshot
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CallSnapshot.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.participants = [];
                if (options.defaults) {
                    object.channelId = "";
                    object.selfSessionId = "";
                }
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    object.channelId = message.channelId;
                if (message.selfSessionId != null && message.hasOwnProperty("selfSessionId"))
                    object.selfSessionId = message.selfSessionId;
                if (message.participants && message.participants.length) {
                    object.participants = [];
                    for (let j = 0; j < message.participants.length; ++j)
                        object.participants[j] = $root.chat.v1.CallParticipant.toObject(message.participants[j], options);
                }
                return object;
            };

            /**
             * Converts this CallSnapshot to JSON.
             * @function toJSON
             * @memberof chat.v1.CallSnapshot
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CallSnapshot.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CallSnapshot
             * @function getTypeUrl
             * @memberof chat.v1.CallSnapshot
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CallSnapshot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.CallSnapshot";
            };

            return CallSnapshot;
        })();

        v1.CallEvent = (function() {

            /**
             * Properties of a CallEvent.
             * @memberof chat.v1
             * @interface ICallEvent
             * @property {string|null} [channelId] CallEvent channelId
             * @property {string|null} [fromSessionId] CallEvent fromSessionId
             * @property {string|null} [fromUserId] CallEvent fromUserId
             * @property {string|null} [fromDisplayName] CallEvent fromDisplayName
             * @property {string|null} [fromAvatarUrl] CallEvent fromAvatarUrl
             * @property {string|null} [fromAvatarColor] CallEvent fromAvatarColor
             * @property {string|null} [targetSessionId] CallEvent targetSessionId
             * @property {chat.v1.CallEventType|null} [type] CallEvent type
             * @property {string|null} [sdp] CallEvent sdp
             * @property {string|null} [candidate] CallEvent candidate
             * @property {boolean|null} [video] CallEvent video
             * @property {boolean|null} [muted] CallEvent muted
             * @property {boolean|null} [deafened] CallEvent deafened
             * @property {boolean|null} [screenSharing] CallEvent screenSharing
             */

            /**
             * Constructs a new CallEvent.
             * @memberof chat.v1
             * @classdesc Represents a CallEvent.
             * @implements ICallEvent
             * @constructor
             * @param {chat.v1.ICallEvent=} [properties] Properties to set
             */
            function CallEvent(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CallEvent channelId.
             * @member {string} channelId
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.channelId = "";

            /**
             * CallEvent fromSessionId.
             * @member {string} fromSessionId
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.fromSessionId = "";

            /**
             * CallEvent fromUserId.
             * @member {string} fromUserId
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.fromUserId = "";

            /**
             * CallEvent fromDisplayName.
             * @member {string} fromDisplayName
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.fromDisplayName = "";

            /**
             * CallEvent fromAvatarUrl.
             * @member {string} fromAvatarUrl
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.fromAvatarUrl = "";

            /**
             * CallEvent fromAvatarColor.
             * @member {string} fromAvatarColor
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.fromAvatarColor = "";

            /**
             * CallEvent targetSessionId.
             * @member {string} targetSessionId
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.targetSessionId = "";

            /**
             * CallEvent type.
             * @member {chat.v1.CallEventType} type
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.type = 0;

            /**
             * CallEvent sdp.
             * @member {string} sdp
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.sdp = "";

            /**
             * CallEvent candidate.
             * @member {string} candidate
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.candidate = "";

            /**
             * CallEvent video.
             * @member {boolean} video
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.video = false;

            /**
             * CallEvent muted.
             * @member {boolean} muted
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.muted = false;

            /**
             * CallEvent deafened.
             * @member {boolean} deafened
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.deafened = false;

            /**
             * CallEvent screenSharing.
             * @member {boolean} screenSharing
             * @memberof chat.v1.CallEvent
             * @instance
             */
            CallEvent.prototype.screenSharing = false;

            /**
             * Creates a new CallEvent instance using the specified properties.
             * @function create
             * @memberof chat.v1.CallEvent
             * @static
             * @param {chat.v1.ICallEvent=} [properties] Properties to set
             * @returns {chat.v1.CallEvent} CallEvent instance
             */
            CallEvent.create = function create(properties) {
                return new CallEvent(properties);
            };

            /**
             * Encodes the specified CallEvent message. Does not implicitly {@link chat.v1.CallEvent.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.CallEvent
             * @static
             * @param {chat.v1.ICallEvent} message CallEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallEvent.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.channelId);
                if (message.fromSessionId != null && Object.hasOwnProperty.call(message, "fromSessionId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.fromSessionId);
                if (message.fromUserId != null && Object.hasOwnProperty.call(message, "fromUserId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.fromUserId);
                if (message.fromDisplayName != null && Object.hasOwnProperty.call(message, "fromDisplayName"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.fromDisplayName);
                if (message.fromAvatarUrl != null && Object.hasOwnProperty.call(message, "fromAvatarUrl"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.fromAvatarUrl);
                if (message.fromAvatarColor != null && Object.hasOwnProperty.call(message, "fromAvatarColor"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.fromAvatarColor);
                if (message.targetSessionId != null && Object.hasOwnProperty.call(message, "targetSessionId"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.targetSessionId);
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 8, wireType 0 =*/64).int32(message.type);
                if (message.sdp != null && Object.hasOwnProperty.call(message, "sdp"))
                    writer.uint32(/* id 9, wireType 2 =*/74).string(message.sdp);
                if (message.candidate != null && Object.hasOwnProperty.call(message, "candidate"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.candidate);
                if (message.video != null && Object.hasOwnProperty.call(message, "video"))
                    writer.uint32(/* id 11, wireType 0 =*/88).bool(message.video);
                if (message.muted != null && Object.hasOwnProperty.call(message, "muted"))
                    writer.uint32(/* id 12, wireType 0 =*/96).bool(message.muted);
                if (message.deafened != null && Object.hasOwnProperty.call(message, "deafened"))
                    writer.uint32(/* id 13, wireType 0 =*/104).bool(message.deafened);
                if (message.screenSharing != null && Object.hasOwnProperty.call(message, "screenSharing"))
                    writer.uint32(/* id 14, wireType 0 =*/112).bool(message.screenSharing);
                return writer;
            };

            /**
             * Encodes the specified CallEvent message, length delimited. Does not implicitly {@link chat.v1.CallEvent.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.CallEvent
             * @static
             * @param {chat.v1.ICallEvent} message CallEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallEvent.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CallEvent message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.CallEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.CallEvent} CallEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallEvent.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.CallEvent();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.channelId = reader.string();
                            break;
                        }
                    case 2: {
                            message.fromSessionId = reader.string();
                            break;
                        }
                    case 3: {
                            message.fromUserId = reader.string();
                            break;
                        }
                    case 4: {
                            message.fromDisplayName = reader.string();
                            break;
                        }
                    case 5: {
                            message.fromAvatarUrl = reader.string();
                            break;
                        }
                    case 6: {
                            message.fromAvatarColor = reader.string();
                            break;
                        }
                    case 7: {
                            message.targetSessionId = reader.string();
                            break;
                        }
                    case 8: {
                            message.type = reader.int32();
                            break;
                        }
                    case 9: {
                            message.sdp = reader.string();
                            break;
                        }
                    case 10: {
                            message.candidate = reader.string();
                            break;
                        }
                    case 11: {
                            message.video = reader.bool();
                            break;
                        }
                    case 12: {
                            message.muted = reader.bool();
                            break;
                        }
                    case 13: {
                            message.deafened = reader.bool();
                            break;
                        }
                    case 14: {
                            message.screenSharing = reader.bool();
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
             * Decodes a CallEvent message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.CallEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.CallEvent} CallEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallEvent.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CallEvent message.
             * @function verify
             * @memberof chat.v1.CallEvent
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CallEvent.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isString(message.channelId))
                        return "channelId: string expected";
                if (message.fromSessionId != null && message.hasOwnProperty("fromSessionId"))
                    if (!$util.isString(message.fromSessionId))
                        return "fromSessionId: string expected";
                if (message.fromUserId != null && message.hasOwnProperty("fromUserId"))
                    if (!$util.isString(message.fromUserId))
                        return "fromUserId: string expected";
                if (message.fromDisplayName != null && message.hasOwnProperty("fromDisplayName"))
                    if (!$util.isString(message.fromDisplayName))
                        return "fromDisplayName: string expected";
                if (message.fromAvatarUrl != null && message.hasOwnProperty("fromAvatarUrl"))
                    if (!$util.isString(message.fromAvatarUrl))
                        return "fromAvatarUrl: string expected";
                if (message.fromAvatarColor != null && message.hasOwnProperty("fromAvatarColor"))
                    if (!$util.isString(message.fromAvatarColor))
                        return "fromAvatarColor: string expected";
                if (message.targetSessionId != null && message.hasOwnProperty("targetSessionId"))
                    if (!$util.isString(message.targetSessionId))
                        return "targetSessionId: string expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        break;
                    }
                if (message.sdp != null && message.hasOwnProperty("sdp"))
                    if (!$util.isString(message.sdp))
                        return "sdp: string expected";
                if (message.candidate != null && message.hasOwnProperty("candidate"))
                    if (!$util.isString(message.candidate))
                        return "candidate: string expected";
                if (message.video != null && message.hasOwnProperty("video"))
                    if (typeof message.video !== "boolean")
                        return "video: boolean expected";
                if (message.muted != null && message.hasOwnProperty("muted"))
                    if (typeof message.muted !== "boolean")
                        return "muted: boolean expected";
                if (message.deafened != null && message.hasOwnProperty("deafened"))
                    if (typeof message.deafened !== "boolean")
                        return "deafened: boolean expected";
                if (message.screenSharing != null && message.hasOwnProperty("screenSharing"))
                    if (typeof message.screenSharing !== "boolean")
                        return "screenSharing: boolean expected";
                return null;
            };

            /**
             * Creates a CallEvent message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.CallEvent
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.CallEvent} CallEvent
             */
            CallEvent.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.CallEvent)
                    return object;
                let message = new $root.chat.v1.CallEvent();
                if (object.channelId != null)
                    message.channelId = String(object.channelId);
                if (object.fromSessionId != null)
                    message.fromSessionId = String(object.fromSessionId);
                if (object.fromUserId != null)
                    message.fromUserId = String(object.fromUserId);
                if (object.fromDisplayName != null)
                    message.fromDisplayName = String(object.fromDisplayName);
                if (object.fromAvatarUrl != null)
                    message.fromAvatarUrl = String(object.fromAvatarUrl);
                if (object.fromAvatarColor != null)
                    message.fromAvatarColor = String(object.fromAvatarColor);
                if (object.targetSessionId != null)
                    message.targetSessionId = String(object.targetSessionId);
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "CALL_EVENT_TYPE_UNSPECIFIED":
                case 0:
                    message.type = 0;
                    break;
                case "CALL_EVENT_TYPE_JOIN":
                case 1:
                    message.type = 1;
                    break;
                case "CALL_EVENT_TYPE_LEAVE":
                case 2:
                    message.type = 2;
                    break;
                case "CALL_EVENT_TYPE_OFFER":
                case 3:
                    message.type = 3;
                    break;
                case "CALL_EVENT_TYPE_ANSWER":
                case 4:
                    message.type = 4;
                    break;
                case "CALL_EVENT_TYPE_ICE":
                case 5:
                    message.type = 5;
                    break;
                case "CALL_EVENT_TYPE_MEDIA":
                case 6:
                    message.type = 6;
                    break;
                }
                if (object.sdp != null)
                    message.sdp = String(object.sdp);
                if (object.candidate != null)
                    message.candidate = String(object.candidate);
                if (object.video != null)
                    message.video = Boolean(object.video);
                if (object.muted != null)
                    message.muted = Boolean(object.muted);
                if (object.deafened != null)
                    message.deafened = Boolean(object.deafened);
                if (object.screenSharing != null)
                    message.screenSharing = Boolean(object.screenSharing);
                return message;
            };

            /**
             * Creates a plain object from a CallEvent message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.CallEvent
             * @static
             * @param {chat.v1.CallEvent} message CallEvent
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CallEvent.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.channelId = "";
                    object.fromSessionId = "";
                    object.fromUserId = "";
                    object.fromDisplayName = "";
                    object.fromAvatarUrl = "";
                    object.fromAvatarColor = "";
                    object.targetSessionId = "";
                    object.type = options.enums === String ? "CALL_EVENT_TYPE_UNSPECIFIED" : 0;
                    object.sdp = "";
                    object.candidate = "";
                    object.video = false;
                    object.muted = false;
                    object.deafened = false;
                    object.screenSharing = false;
                }
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    object.channelId = message.channelId;
                if (message.fromSessionId != null && message.hasOwnProperty("fromSessionId"))
                    object.fromSessionId = message.fromSessionId;
                if (message.fromUserId != null && message.hasOwnProperty("fromUserId"))
                    object.fromUserId = message.fromUserId;
                if (message.fromDisplayName != null && message.hasOwnProperty("fromDisplayName"))
                    object.fromDisplayName = message.fromDisplayName;
                if (message.fromAvatarUrl != null && message.hasOwnProperty("fromAvatarUrl"))
                    object.fromAvatarUrl = message.fromAvatarUrl;
                if (message.fromAvatarColor != null && message.hasOwnProperty("fromAvatarColor"))
                    object.fromAvatarColor = message.fromAvatarColor;
                if (message.targetSessionId != null && message.hasOwnProperty("targetSessionId"))
                    object.targetSessionId = message.targetSessionId;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.chat.v1.CallEventType[message.type] === undefined ? message.type : $root.chat.v1.CallEventType[message.type] : message.type;
                if (message.sdp != null && message.hasOwnProperty("sdp"))
                    object.sdp = message.sdp;
                if (message.candidate != null && message.hasOwnProperty("candidate"))
                    object.candidate = message.candidate;
                if (message.video != null && message.hasOwnProperty("video"))
                    object.video = message.video;
                if (message.muted != null && message.hasOwnProperty("muted"))
                    object.muted = message.muted;
                if (message.deafened != null && message.hasOwnProperty("deafened"))
                    object.deafened = message.deafened;
                if (message.screenSharing != null && message.hasOwnProperty("screenSharing"))
                    object.screenSharing = message.screenSharing;
                return object;
            };

            /**
             * Converts this CallEvent to JSON.
             * @function toJSON
             * @memberof chat.v1.CallEvent
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CallEvent.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CallEvent
             * @function getTypeUrl
             * @memberof chat.v1.CallEvent
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CallEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.CallEvent";
            };

            return CallEvent;
        })();

        v1.JoinCall = (function() {

            /**
             * Properties of a JoinCall.
             * @memberof chat.v1
             * @interface IJoinCall
             * @property {string|null} [channelId] JoinCall channelId
             * @property {boolean|null} [video] JoinCall video
             * @property {boolean|null} [muted] JoinCall muted
             * @property {boolean|null} [deafened] JoinCall deafened
             */

            /**
             * Constructs a new JoinCall.
             * @memberof chat.v1
             * @classdesc Represents a JoinCall.
             * @implements IJoinCall
             * @constructor
             * @param {chat.v1.IJoinCall=} [properties] Properties to set
             */
            function JoinCall(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * JoinCall channelId.
             * @member {string} channelId
             * @memberof chat.v1.JoinCall
             * @instance
             */
            JoinCall.prototype.channelId = "";

            /**
             * JoinCall video.
             * @member {boolean} video
             * @memberof chat.v1.JoinCall
             * @instance
             */
            JoinCall.prototype.video = false;

            /**
             * JoinCall muted.
             * @member {boolean} muted
             * @memberof chat.v1.JoinCall
             * @instance
             */
            JoinCall.prototype.muted = false;

            /**
             * JoinCall deafened.
             * @member {boolean} deafened
             * @memberof chat.v1.JoinCall
             * @instance
             */
            JoinCall.prototype.deafened = false;

            /**
             * Creates a new JoinCall instance using the specified properties.
             * @function create
             * @memberof chat.v1.JoinCall
             * @static
             * @param {chat.v1.IJoinCall=} [properties] Properties to set
             * @returns {chat.v1.JoinCall} JoinCall instance
             */
            JoinCall.create = function create(properties) {
                return new JoinCall(properties);
            };

            /**
             * Encodes the specified JoinCall message. Does not implicitly {@link chat.v1.JoinCall.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.JoinCall
             * @static
             * @param {chat.v1.IJoinCall} message JoinCall message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JoinCall.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.channelId);
                if (message.video != null && Object.hasOwnProperty.call(message, "video"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.video);
                if (message.muted != null && Object.hasOwnProperty.call(message, "muted"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.muted);
                if (message.deafened != null && Object.hasOwnProperty.call(message, "deafened"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.deafened);
                return writer;
            };

            /**
             * Encodes the specified JoinCall message, length delimited. Does not implicitly {@link chat.v1.JoinCall.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.JoinCall
             * @static
             * @param {chat.v1.IJoinCall} message JoinCall message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JoinCall.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a JoinCall message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.JoinCall
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.JoinCall} JoinCall
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JoinCall.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.JoinCall();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.channelId = reader.string();
                            break;
                        }
                    case 2: {
                            message.video = reader.bool();
                            break;
                        }
                    case 3: {
                            message.muted = reader.bool();
                            break;
                        }
                    case 4: {
                            message.deafened = reader.bool();
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
             * Decodes a JoinCall message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.JoinCall
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.JoinCall} JoinCall
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JoinCall.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a JoinCall message.
             * @function verify
             * @memberof chat.v1.JoinCall
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            JoinCall.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isString(message.channelId))
                        return "channelId: string expected";
                if (message.video != null && message.hasOwnProperty("video"))
                    if (typeof message.video !== "boolean")
                        return "video: boolean expected";
                if (message.muted != null && message.hasOwnProperty("muted"))
                    if (typeof message.muted !== "boolean")
                        return "muted: boolean expected";
                if (message.deafened != null && message.hasOwnProperty("deafened"))
                    if (typeof message.deafened !== "boolean")
                        return "deafened: boolean expected";
                return null;
            };

            /**
             * Creates a JoinCall message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.JoinCall
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.JoinCall} JoinCall
             */
            JoinCall.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.JoinCall)
                    return object;
                let message = new $root.chat.v1.JoinCall();
                if (object.channelId != null)
                    message.channelId = String(object.channelId);
                if (object.video != null)
                    message.video = Boolean(object.video);
                if (object.muted != null)
                    message.muted = Boolean(object.muted);
                if (object.deafened != null)
                    message.deafened = Boolean(object.deafened);
                return message;
            };

            /**
             * Creates a plain object from a JoinCall message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.JoinCall
             * @static
             * @param {chat.v1.JoinCall} message JoinCall
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            JoinCall.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.channelId = "";
                    object.video = false;
                    object.muted = false;
                    object.deafened = false;
                }
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    object.channelId = message.channelId;
                if (message.video != null && message.hasOwnProperty("video"))
                    object.video = message.video;
                if (message.muted != null && message.hasOwnProperty("muted"))
                    object.muted = message.muted;
                if (message.deafened != null && message.hasOwnProperty("deafened"))
                    object.deafened = message.deafened;
                return object;
            };

            /**
             * Converts this JoinCall to JSON.
             * @function toJSON
             * @memberof chat.v1.JoinCall
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            JoinCall.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for JoinCall
             * @function getTypeUrl
             * @memberof chat.v1.JoinCall
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            JoinCall.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.JoinCall";
            };

            return JoinCall;
        })();

        v1.LeaveCall = (function() {

            /**
             * Properties of a LeaveCall.
             * @memberof chat.v1
             * @interface ILeaveCall
             * @property {string|null} [channelId] LeaveCall channelId
             */

            /**
             * Constructs a new LeaveCall.
             * @memberof chat.v1
             * @classdesc Represents a LeaveCall.
             * @implements ILeaveCall
             * @constructor
             * @param {chat.v1.ILeaveCall=} [properties] Properties to set
             */
            function LeaveCall(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LeaveCall channelId.
             * @member {string} channelId
             * @memberof chat.v1.LeaveCall
             * @instance
             */
            LeaveCall.prototype.channelId = "";

            /**
             * Creates a new LeaveCall instance using the specified properties.
             * @function create
             * @memberof chat.v1.LeaveCall
             * @static
             * @param {chat.v1.ILeaveCall=} [properties] Properties to set
             * @returns {chat.v1.LeaveCall} LeaveCall instance
             */
            LeaveCall.create = function create(properties) {
                return new LeaveCall(properties);
            };

            /**
             * Encodes the specified LeaveCall message. Does not implicitly {@link chat.v1.LeaveCall.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.LeaveCall
             * @static
             * @param {chat.v1.ILeaveCall} message LeaveCall message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LeaveCall.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.channelId);
                return writer;
            };

            /**
             * Encodes the specified LeaveCall message, length delimited. Does not implicitly {@link chat.v1.LeaveCall.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.LeaveCall
             * @static
             * @param {chat.v1.ILeaveCall} message LeaveCall message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LeaveCall.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LeaveCall message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.LeaveCall
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.LeaveCall} LeaveCall
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LeaveCall.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.LeaveCall();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.channelId = reader.string();
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
             * Decodes a LeaveCall message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.LeaveCall
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.LeaveCall} LeaveCall
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LeaveCall.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LeaveCall message.
             * @function verify
             * @memberof chat.v1.LeaveCall
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LeaveCall.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isString(message.channelId))
                        return "channelId: string expected";
                return null;
            };

            /**
             * Creates a LeaveCall message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.LeaveCall
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.LeaveCall} LeaveCall
             */
            LeaveCall.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.LeaveCall)
                    return object;
                let message = new $root.chat.v1.LeaveCall();
                if (object.channelId != null)
                    message.channelId = String(object.channelId);
                return message;
            };

            /**
             * Creates a plain object from a LeaveCall message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.LeaveCall
             * @static
             * @param {chat.v1.LeaveCall} message LeaveCall
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LeaveCall.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.channelId = "";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    object.channelId = message.channelId;
                return object;
            };

            /**
             * Converts this LeaveCall to JSON.
             * @function toJSON
             * @memberof chat.v1.LeaveCall
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LeaveCall.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for LeaveCall
             * @function getTypeUrl
             * @memberof chat.v1.LeaveCall
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LeaveCall.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.LeaveCall";
            };

            return LeaveCall;
        })();

        v1.CallSignal = (function() {

            /**
             * Properties of a CallSignal.
             * @memberof chat.v1
             * @interface ICallSignal
             * @property {string|null} [channelId] CallSignal channelId
             * @property {string|null} [targetSessionId] CallSignal targetSessionId
             * @property {chat.v1.CallEventType|null} [type] CallSignal type
             * @property {string|null} [sdp] CallSignal sdp
             * @property {string|null} [candidate] CallSignal candidate
             */

            /**
             * Constructs a new CallSignal.
             * @memberof chat.v1
             * @classdesc Represents a CallSignal.
             * @implements ICallSignal
             * @constructor
             * @param {chat.v1.ICallSignal=} [properties] Properties to set
             */
            function CallSignal(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CallSignal channelId.
             * @member {string} channelId
             * @memberof chat.v1.CallSignal
             * @instance
             */
            CallSignal.prototype.channelId = "";

            /**
             * CallSignal targetSessionId.
             * @member {string} targetSessionId
             * @memberof chat.v1.CallSignal
             * @instance
             */
            CallSignal.prototype.targetSessionId = "";

            /**
             * CallSignal type.
             * @member {chat.v1.CallEventType} type
             * @memberof chat.v1.CallSignal
             * @instance
             */
            CallSignal.prototype.type = 0;

            /**
             * CallSignal sdp.
             * @member {string} sdp
             * @memberof chat.v1.CallSignal
             * @instance
             */
            CallSignal.prototype.sdp = "";

            /**
             * CallSignal candidate.
             * @member {string} candidate
             * @memberof chat.v1.CallSignal
             * @instance
             */
            CallSignal.prototype.candidate = "";

            /**
             * Creates a new CallSignal instance using the specified properties.
             * @function create
             * @memberof chat.v1.CallSignal
             * @static
             * @param {chat.v1.ICallSignal=} [properties] Properties to set
             * @returns {chat.v1.CallSignal} CallSignal instance
             */
            CallSignal.create = function create(properties) {
                return new CallSignal(properties);
            };

            /**
             * Encodes the specified CallSignal message. Does not implicitly {@link chat.v1.CallSignal.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.CallSignal
             * @static
             * @param {chat.v1.ICallSignal} message CallSignal message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallSignal.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.channelId);
                if (message.targetSessionId != null && Object.hasOwnProperty.call(message, "targetSessionId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.targetSessionId);
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.type);
                if (message.sdp != null && Object.hasOwnProperty.call(message, "sdp"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.sdp);
                if (message.candidate != null && Object.hasOwnProperty.call(message, "candidate"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.candidate);
                return writer;
            };

            /**
             * Encodes the specified CallSignal message, length delimited. Does not implicitly {@link chat.v1.CallSignal.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.CallSignal
             * @static
             * @param {chat.v1.ICallSignal} message CallSignal message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallSignal.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CallSignal message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.CallSignal
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.CallSignal} CallSignal
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallSignal.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.CallSignal();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.channelId = reader.string();
                            break;
                        }
                    case 2: {
                            message.targetSessionId = reader.string();
                            break;
                        }
                    case 3: {
                            message.type = reader.int32();
                            break;
                        }
                    case 4: {
                            message.sdp = reader.string();
                            break;
                        }
                    case 5: {
                            message.candidate = reader.string();
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
             * Decodes a CallSignal message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.CallSignal
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.CallSignal} CallSignal
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallSignal.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CallSignal message.
             * @function verify
             * @memberof chat.v1.CallSignal
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CallSignal.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isString(message.channelId))
                        return "channelId: string expected";
                if (message.targetSessionId != null && message.hasOwnProperty("targetSessionId"))
                    if (!$util.isString(message.targetSessionId))
                        return "targetSessionId: string expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        break;
                    }
                if (message.sdp != null && message.hasOwnProperty("sdp"))
                    if (!$util.isString(message.sdp))
                        return "sdp: string expected";
                if (message.candidate != null && message.hasOwnProperty("candidate"))
                    if (!$util.isString(message.candidate))
                        return "candidate: string expected";
                return null;
            };

            /**
             * Creates a CallSignal message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.CallSignal
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.CallSignal} CallSignal
             */
            CallSignal.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.CallSignal)
                    return object;
                let message = new $root.chat.v1.CallSignal();
                if (object.channelId != null)
                    message.channelId = String(object.channelId);
                if (object.targetSessionId != null)
                    message.targetSessionId = String(object.targetSessionId);
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "CALL_EVENT_TYPE_UNSPECIFIED":
                case 0:
                    message.type = 0;
                    break;
                case "CALL_EVENT_TYPE_JOIN":
                case 1:
                    message.type = 1;
                    break;
                case "CALL_EVENT_TYPE_LEAVE":
                case 2:
                    message.type = 2;
                    break;
                case "CALL_EVENT_TYPE_OFFER":
                case 3:
                    message.type = 3;
                    break;
                case "CALL_EVENT_TYPE_ANSWER":
                case 4:
                    message.type = 4;
                    break;
                case "CALL_EVENT_TYPE_ICE":
                case 5:
                    message.type = 5;
                    break;
                case "CALL_EVENT_TYPE_MEDIA":
                case 6:
                    message.type = 6;
                    break;
                }
                if (object.sdp != null)
                    message.sdp = String(object.sdp);
                if (object.candidate != null)
                    message.candidate = String(object.candidate);
                return message;
            };

            /**
             * Creates a plain object from a CallSignal message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.CallSignal
             * @static
             * @param {chat.v1.CallSignal} message CallSignal
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CallSignal.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.channelId = "";
                    object.targetSessionId = "";
                    object.type = options.enums === String ? "CALL_EVENT_TYPE_UNSPECIFIED" : 0;
                    object.sdp = "";
                    object.candidate = "";
                }
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    object.channelId = message.channelId;
                if (message.targetSessionId != null && message.hasOwnProperty("targetSessionId"))
                    object.targetSessionId = message.targetSessionId;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.chat.v1.CallEventType[message.type] === undefined ? message.type : $root.chat.v1.CallEventType[message.type] : message.type;
                if (message.sdp != null && message.hasOwnProperty("sdp"))
                    object.sdp = message.sdp;
                if (message.candidate != null && message.hasOwnProperty("candidate"))
                    object.candidate = message.candidate;
                return object;
            };

            /**
             * Converts this CallSignal to JSON.
             * @function toJSON
             * @memberof chat.v1.CallSignal
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CallSignal.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CallSignal
             * @function getTypeUrl
             * @memberof chat.v1.CallSignal
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CallSignal.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.CallSignal";
            };

            return CallSignal;
        })();

        v1.CallMedia = (function() {

            /**
             * Properties of a CallMedia.
             * @memberof chat.v1
             * @interface ICallMedia
             * @property {string|null} [channelId] CallMedia channelId
             * @property {boolean|null} [video] CallMedia video
             * @property {boolean|null} [muted] CallMedia muted
             * @property {boolean|null} [deafened] CallMedia deafened
             * @property {boolean|null} [screenSharing] CallMedia screenSharing
             */

            /**
             * Constructs a new CallMedia.
             * @memberof chat.v1
             * @classdesc Represents a CallMedia.
             * @implements ICallMedia
             * @constructor
             * @param {chat.v1.ICallMedia=} [properties] Properties to set
             */
            function CallMedia(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CallMedia channelId.
             * @member {string} channelId
             * @memberof chat.v1.CallMedia
             * @instance
             */
            CallMedia.prototype.channelId = "";

            /**
             * CallMedia video.
             * @member {boolean} video
             * @memberof chat.v1.CallMedia
             * @instance
             */
            CallMedia.prototype.video = false;

            /**
             * CallMedia muted.
             * @member {boolean} muted
             * @memberof chat.v1.CallMedia
             * @instance
             */
            CallMedia.prototype.muted = false;

            /**
             * CallMedia deafened.
             * @member {boolean} deafened
             * @memberof chat.v1.CallMedia
             * @instance
             */
            CallMedia.prototype.deafened = false;

            /**
             * CallMedia screenSharing.
             * @member {boolean} screenSharing
             * @memberof chat.v1.CallMedia
             * @instance
             */
            CallMedia.prototype.screenSharing = false;

            /**
             * Creates a new CallMedia instance using the specified properties.
             * @function create
             * @memberof chat.v1.CallMedia
             * @static
             * @param {chat.v1.ICallMedia=} [properties] Properties to set
             * @returns {chat.v1.CallMedia} CallMedia instance
             */
            CallMedia.create = function create(properties) {
                return new CallMedia(properties);
            };

            /**
             * Encodes the specified CallMedia message. Does not implicitly {@link chat.v1.CallMedia.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.CallMedia
             * @static
             * @param {chat.v1.ICallMedia} message CallMedia message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallMedia.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.channelId);
                if (message.video != null && Object.hasOwnProperty.call(message, "video"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.video);
                if (message.muted != null && Object.hasOwnProperty.call(message, "muted"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.muted);
                if (message.deafened != null && Object.hasOwnProperty.call(message, "deafened"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.deafened);
                if (message.screenSharing != null && Object.hasOwnProperty.call(message, "screenSharing"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.screenSharing);
                return writer;
            };

            /**
             * Encodes the specified CallMedia message, length delimited. Does not implicitly {@link chat.v1.CallMedia.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.CallMedia
             * @static
             * @param {chat.v1.ICallMedia} message CallMedia message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallMedia.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CallMedia message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.CallMedia
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.CallMedia} CallMedia
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallMedia.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.CallMedia();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.channelId = reader.string();
                            break;
                        }
                    case 2: {
                            message.video = reader.bool();
                            break;
                        }
                    case 3: {
                            message.muted = reader.bool();
                            break;
                        }
                    case 4: {
                            message.deafened = reader.bool();
                            break;
                        }
                    case 5: {
                            message.screenSharing = reader.bool();
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
             * Decodes a CallMedia message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.CallMedia
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.CallMedia} CallMedia
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallMedia.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CallMedia message.
             * @function verify
             * @memberof chat.v1.CallMedia
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CallMedia.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isString(message.channelId))
                        return "channelId: string expected";
                if (message.video != null && message.hasOwnProperty("video"))
                    if (typeof message.video !== "boolean")
                        return "video: boolean expected";
                if (message.muted != null && message.hasOwnProperty("muted"))
                    if (typeof message.muted !== "boolean")
                        return "muted: boolean expected";
                if (message.deafened != null && message.hasOwnProperty("deafened"))
                    if (typeof message.deafened !== "boolean")
                        return "deafened: boolean expected";
                if (message.screenSharing != null && message.hasOwnProperty("screenSharing"))
                    if (typeof message.screenSharing !== "boolean")
                        return "screenSharing: boolean expected";
                return null;
            };

            /**
             * Creates a CallMedia message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.CallMedia
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.CallMedia} CallMedia
             */
            CallMedia.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.CallMedia)
                    return object;
                let message = new $root.chat.v1.CallMedia();
                if (object.channelId != null)
                    message.channelId = String(object.channelId);
                if (object.video != null)
                    message.video = Boolean(object.video);
                if (object.muted != null)
                    message.muted = Boolean(object.muted);
                if (object.deafened != null)
                    message.deafened = Boolean(object.deafened);
                if (object.screenSharing != null)
                    message.screenSharing = Boolean(object.screenSharing);
                return message;
            };

            /**
             * Creates a plain object from a CallMedia message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.CallMedia
             * @static
             * @param {chat.v1.CallMedia} message CallMedia
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CallMedia.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.channelId = "";
                    object.video = false;
                    object.muted = false;
                    object.deafened = false;
                    object.screenSharing = false;
                }
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    object.channelId = message.channelId;
                if (message.video != null && message.hasOwnProperty("video"))
                    object.video = message.video;
                if (message.muted != null && message.hasOwnProperty("muted"))
                    object.muted = message.muted;
                if (message.deafened != null && message.hasOwnProperty("deafened"))
                    object.deafened = message.deafened;
                if (message.screenSharing != null && message.hasOwnProperty("screenSharing"))
                    object.screenSharing = message.screenSharing;
                return object;
            };

            /**
             * Converts this CallMedia to JSON.
             * @function toJSON
             * @memberof chat.v1.CallMedia
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CallMedia.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CallMedia
             * @function getTypeUrl
             * @memberof chat.v1.CallMedia
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CallMedia.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.CallMedia";
            };

            return CallMedia;
        })();

        v1.MessageAck = (function() {

            /**
             * Properties of a MessageAck.
             * @memberof chat.v1
             * @interface IMessageAck
             * @property {string|null} [channelId] MessageAck channelId
             * @property {string|null} [clientId] MessageAck clientId
             * @property {number|Long|null} [messageId] MessageAck messageId
             * @property {chat.v1.AckStatus|null} [status] MessageAck status
             * @property {number|Long|null} [timestampMs] MessageAck timestampMs
             * @property {string|null} [error] MessageAck error
             * @property {boolean|null} [retryable] MessageAck retryable
             */

            /**
             * Constructs a new MessageAck.
             * @memberof chat.v1
             * @classdesc Represents a MessageAck.
             * @implements IMessageAck
             * @constructor
             * @param {chat.v1.IMessageAck=} [properties] Properties to set
             */
            function MessageAck(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MessageAck channelId.
             * @member {string} channelId
             * @memberof chat.v1.MessageAck
             * @instance
             */
            MessageAck.prototype.channelId = "";

            /**
             * MessageAck clientId.
             * @member {string} clientId
             * @memberof chat.v1.MessageAck
             * @instance
             */
            MessageAck.prototype.clientId = "";

            /**
             * MessageAck messageId.
             * @member {number|Long} messageId
             * @memberof chat.v1.MessageAck
             * @instance
             */
            MessageAck.prototype.messageId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * MessageAck status.
             * @member {chat.v1.AckStatus} status
             * @memberof chat.v1.MessageAck
             * @instance
             */
            MessageAck.prototype.status = 0;

            /**
             * MessageAck timestampMs.
             * @member {number|Long} timestampMs
             * @memberof chat.v1.MessageAck
             * @instance
             */
            MessageAck.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * MessageAck error.
             * @member {string} error
             * @memberof chat.v1.MessageAck
             * @instance
             */
            MessageAck.prototype.error = "";

            /**
             * MessageAck retryable.
             * @member {boolean} retryable
             * @memberof chat.v1.MessageAck
             * @instance
             */
            MessageAck.prototype.retryable = false;

            /**
             * Creates a new MessageAck instance using the specified properties.
             * @function create
             * @memberof chat.v1.MessageAck
             * @static
             * @param {chat.v1.IMessageAck=} [properties] Properties to set
             * @returns {chat.v1.MessageAck} MessageAck instance
             */
            MessageAck.create = function create(properties) {
                return new MessageAck(properties);
            };

            /**
             * Encodes the specified MessageAck message. Does not implicitly {@link chat.v1.MessageAck.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.MessageAck
             * @static
             * @param {chat.v1.IMessageAck} message MessageAck message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MessageAck.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.channelId);
                if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.clientId);
                if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int64(message.messageId);
                if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.status);
                if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int64(message.timestampMs);
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.error);
                if (message.retryable != null && Object.hasOwnProperty.call(message, "retryable"))
                    writer.uint32(/* id 7, wireType 0 =*/56).bool(message.retryable);
                return writer;
            };

            /**
             * Encodes the specified MessageAck message, length delimited. Does not implicitly {@link chat.v1.MessageAck.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.MessageAck
             * @static
             * @param {chat.v1.IMessageAck} message MessageAck message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MessageAck.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MessageAck message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.MessageAck
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.MessageAck} MessageAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MessageAck.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.MessageAck();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.channelId = reader.string();
                            break;
                        }
                    case 2: {
                            message.clientId = reader.string();
                            break;
                        }
                    case 3: {
                            message.messageId = reader.int64();
                            break;
                        }
                    case 4: {
                            message.status = reader.int32();
                            break;
                        }
                    case 5: {
                            message.timestampMs = reader.int64();
                            break;
                        }
                    case 6: {
                            message.error = reader.string();
                            break;
                        }
                    case 7: {
                            message.retryable = reader.bool();
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
             * Decodes a MessageAck message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.MessageAck
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.MessageAck} MessageAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MessageAck.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MessageAck message.
             * @function verify
             * @memberof chat.v1.MessageAck
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MessageAck.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isString(message.channelId))
                        return "channelId: string expected";
                if (message.clientId != null && message.hasOwnProperty("clientId"))
                    if (!$util.isString(message.clientId))
                        return "clientId: string expected";
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (!$util.isInteger(message.messageId) && !(message.messageId && $util.isInteger(message.messageId.low) && $util.isInteger(message.messageId.high)))
                        return "messageId: integer|Long expected";
                if (message.status != null && message.hasOwnProperty("status"))
                    switch (message.status) {
                    default:
                        return "status: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                    if (!$util.isInteger(message.timestampMs) && !(message.timestampMs && $util.isInteger(message.timestampMs.low) && $util.isInteger(message.timestampMs.high)))
                        return "timestampMs: integer|Long expected";
                if (message.error != null && message.hasOwnProperty("error"))
                    if (!$util.isString(message.error))
                        return "error: string expected";
                if (message.retryable != null && message.hasOwnProperty("retryable"))
                    if (typeof message.retryable !== "boolean")
                        return "retryable: boolean expected";
                return null;
            };

            /**
             * Creates a MessageAck message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.MessageAck
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.MessageAck} MessageAck
             */
            MessageAck.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.MessageAck)
                    return object;
                let message = new $root.chat.v1.MessageAck();
                if (object.channelId != null)
                    message.channelId = String(object.channelId);
                if (object.clientId != null)
                    message.clientId = String(object.clientId);
                if (object.messageId != null)
                    if ($util.Long)
                        (message.messageId = $util.Long.fromValue(object.messageId)).unsigned = false;
                    else if (typeof object.messageId === "string")
                        message.messageId = parseInt(object.messageId, 10);
                    else if (typeof object.messageId === "number")
                        message.messageId = object.messageId;
                    else if (typeof object.messageId === "object")
                        message.messageId = new $util.LongBits(object.messageId.low >>> 0, object.messageId.high >>> 0).toNumber();
                switch (object.status) {
                default:
                    if (typeof object.status === "number") {
                        message.status = object.status;
                        break;
                    }
                    break;
                case "ACK_STATUS_UNSPECIFIED":
                case 0:
                    message.status = 0;
                    break;
                case "ACK_STATUS_COMMITTED":
                case 1:
                    message.status = 1;
                    break;
                case "ACK_STATUS_FAILED":
                case 2:
                    message.status = 2;
                    break;
                }
                if (object.timestampMs != null)
                    if ($util.Long)
                        (message.timestampMs = $util.Long.fromValue(object.timestampMs)).unsigned = false;
                    else if (typeof object.timestampMs === "string")
                        message.timestampMs = parseInt(object.timestampMs, 10);
                    else if (typeof object.timestampMs === "number")
                        message.timestampMs = object.timestampMs;
                    else if (typeof object.timestampMs === "object")
                        message.timestampMs = new $util.LongBits(object.timestampMs.low >>> 0, object.timestampMs.high >>> 0).toNumber();
                if (object.error != null)
                    message.error = String(object.error);
                if (object.retryable != null)
                    message.retryable = Boolean(object.retryable);
                return message;
            };

            /**
             * Creates a plain object from a MessageAck message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.MessageAck
             * @static
             * @param {chat.v1.MessageAck} message MessageAck
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MessageAck.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.channelId = "";
                    object.clientId = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.messageId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.messageId = options.longs === String ? "0" : 0;
                    object.status = options.enums === String ? "ACK_STATUS_UNSPECIFIED" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.timestampMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.timestampMs = options.longs === String ? "0" : 0;
                    object.error = "";
                    object.retryable = false;
                }
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    object.channelId = message.channelId;
                if (message.clientId != null && message.hasOwnProperty("clientId"))
                    object.clientId = message.clientId;
                if (message.messageId != null && message.hasOwnProperty("messageId"))
                    if (typeof message.messageId === "number")
                        object.messageId = options.longs === String ? String(message.messageId) : message.messageId;
                    else
                        object.messageId = options.longs === String ? $util.Long.prototype.toString.call(message.messageId) : options.longs === Number ? new $util.LongBits(message.messageId.low >>> 0, message.messageId.high >>> 0).toNumber() : message.messageId;
                if (message.status != null && message.hasOwnProperty("status"))
                    object.status = options.enums === String ? $root.chat.v1.AckStatus[message.status] === undefined ? message.status : $root.chat.v1.AckStatus[message.status] : message.status;
                if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                    if (typeof message.timestampMs === "number")
                        object.timestampMs = options.longs === String ? String(message.timestampMs) : message.timestampMs;
                    else
                        object.timestampMs = options.longs === String ? $util.Long.prototype.toString.call(message.timestampMs) : options.longs === Number ? new $util.LongBits(message.timestampMs.low >>> 0, message.timestampMs.high >>> 0).toNumber() : message.timestampMs;
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = message.error;
                if (message.retryable != null && message.hasOwnProperty("retryable"))
                    object.retryable = message.retryable;
                return object;
            };

            /**
             * Converts this MessageAck to JSON.
             * @function toJSON
             * @memberof chat.v1.MessageAck
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MessageAck.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MessageAck
             * @function getTypeUrl
             * @memberof chat.v1.MessageAck
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MessageAck.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.MessageAck";
            };

            return MessageAck;
        })();

        v1.PresenceEvent = (function() {

            /**
             * Properties of a PresenceEvent.
             * @memberof chat.v1
             * @interface IPresenceEvent
             * @property {string|null} [guildId] PresenceEvent guildId
             * @property {string|null} [userId] PresenceEvent userId
             * @property {chat.v1.PresenceStatus|null} [status] PresenceEvent status
             * @property {number|Long|null} [updatedAtMs] PresenceEvent updatedAtMs
             */

            /**
             * Constructs a new PresenceEvent.
             * @memberof chat.v1
             * @classdesc Represents a PresenceEvent.
             * @implements IPresenceEvent
             * @constructor
             * @param {chat.v1.IPresenceEvent=} [properties] Properties to set
             */
            function PresenceEvent(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PresenceEvent guildId.
             * @member {string} guildId
             * @memberof chat.v1.PresenceEvent
             * @instance
             */
            PresenceEvent.prototype.guildId = "";

            /**
             * PresenceEvent userId.
             * @member {string} userId
             * @memberof chat.v1.PresenceEvent
             * @instance
             */
            PresenceEvent.prototype.userId = "";

            /**
             * PresenceEvent status.
             * @member {chat.v1.PresenceStatus} status
             * @memberof chat.v1.PresenceEvent
             * @instance
             */
            PresenceEvent.prototype.status = 0;

            /**
             * PresenceEvent updatedAtMs.
             * @member {number|Long} updatedAtMs
             * @memberof chat.v1.PresenceEvent
             * @instance
             */
            PresenceEvent.prototype.updatedAtMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new PresenceEvent instance using the specified properties.
             * @function create
             * @memberof chat.v1.PresenceEvent
             * @static
             * @param {chat.v1.IPresenceEvent=} [properties] Properties to set
             * @returns {chat.v1.PresenceEvent} PresenceEvent instance
             */
            PresenceEvent.create = function create(properties) {
                return new PresenceEvent(properties);
            };

            /**
             * Encodes the specified PresenceEvent message. Does not implicitly {@link chat.v1.PresenceEvent.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.PresenceEvent
             * @static
             * @param {chat.v1.IPresenceEvent} message PresenceEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PresenceEvent.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.guildId);
                if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.userId);
                if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.status);
                if (message.updatedAtMs != null && Object.hasOwnProperty.call(message, "updatedAtMs"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int64(message.updatedAtMs);
                return writer;
            };

            /**
             * Encodes the specified PresenceEvent message, length delimited. Does not implicitly {@link chat.v1.PresenceEvent.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.PresenceEvent
             * @static
             * @param {chat.v1.IPresenceEvent} message PresenceEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PresenceEvent.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PresenceEvent message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.PresenceEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.PresenceEvent} PresenceEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PresenceEvent.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.PresenceEvent();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.guildId = reader.string();
                            break;
                        }
                    case 2: {
                            message.userId = reader.string();
                            break;
                        }
                    case 3: {
                            message.status = reader.int32();
                            break;
                        }
                    case 4: {
                            message.updatedAtMs = reader.int64();
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
             * Decodes a PresenceEvent message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.PresenceEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.PresenceEvent} PresenceEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PresenceEvent.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PresenceEvent message.
             * @function verify
             * @memberof chat.v1.PresenceEvent
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PresenceEvent.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    if (!$util.isString(message.guildId))
                        return "guildId: string expected";
                if (message.userId != null && message.hasOwnProperty("userId"))
                    if (!$util.isString(message.userId))
                        return "userId: string expected";
                if (message.status != null && message.hasOwnProperty("status"))
                    switch (message.status) {
                    default:
                        return "status: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                if (message.updatedAtMs != null && message.hasOwnProperty("updatedAtMs"))
                    if (!$util.isInteger(message.updatedAtMs) && !(message.updatedAtMs && $util.isInteger(message.updatedAtMs.low) && $util.isInteger(message.updatedAtMs.high)))
                        return "updatedAtMs: integer|Long expected";
                return null;
            };

            /**
             * Creates a PresenceEvent message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.PresenceEvent
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.PresenceEvent} PresenceEvent
             */
            PresenceEvent.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.PresenceEvent)
                    return object;
                let message = new $root.chat.v1.PresenceEvent();
                if (object.guildId != null)
                    message.guildId = String(object.guildId);
                if (object.userId != null)
                    message.userId = String(object.userId);
                switch (object.status) {
                default:
                    if (typeof object.status === "number") {
                        message.status = object.status;
                        break;
                    }
                    break;
                case "PRESENCE_STATUS_UNSPECIFIED":
                case 0:
                    message.status = 0;
                    break;
                case "PRESENCE_STATUS_ONLINE":
                case 1:
                    message.status = 1;
                    break;
                case "PRESENCE_STATUS_IDLE":
                case 2:
                    message.status = 2;
                    break;
                case "PRESENCE_STATUS_DO_NOT_DISTURB":
                case 3:
                    message.status = 3;
                    break;
                case "PRESENCE_STATUS_OFFLINE":
                case 4:
                    message.status = 4;
                    break;
                }
                if (object.updatedAtMs != null)
                    if ($util.Long)
                        (message.updatedAtMs = $util.Long.fromValue(object.updatedAtMs)).unsigned = false;
                    else if (typeof object.updatedAtMs === "string")
                        message.updatedAtMs = parseInt(object.updatedAtMs, 10);
                    else if (typeof object.updatedAtMs === "number")
                        message.updatedAtMs = object.updatedAtMs;
                    else if (typeof object.updatedAtMs === "object")
                        message.updatedAtMs = new $util.LongBits(object.updatedAtMs.low >>> 0, object.updatedAtMs.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from a PresenceEvent message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.PresenceEvent
             * @static
             * @param {chat.v1.PresenceEvent} message PresenceEvent
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PresenceEvent.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.guildId = "";
                    object.userId = "";
                    object.status = options.enums === String ? "PRESENCE_STATUS_UNSPECIFIED" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.updatedAtMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.updatedAtMs = options.longs === String ? "0" : 0;
                }
                if (message.guildId != null && message.hasOwnProperty("guildId"))
                    object.guildId = message.guildId;
                if (message.userId != null && message.hasOwnProperty("userId"))
                    object.userId = message.userId;
                if (message.status != null && message.hasOwnProperty("status"))
                    object.status = options.enums === String ? $root.chat.v1.PresenceStatus[message.status] === undefined ? message.status : $root.chat.v1.PresenceStatus[message.status] : message.status;
                if (message.updatedAtMs != null && message.hasOwnProperty("updatedAtMs"))
                    if (typeof message.updatedAtMs === "number")
                        object.updatedAtMs = options.longs === String ? String(message.updatedAtMs) : message.updatedAtMs;
                    else
                        object.updatedAtMs = options.longs === String ? $util.Long.prototype.toString.call(message.updatedAtMs) : options.longs === Number ? new $util.LongBits(message.updatedAtMs.low >>> 0, message.updatedAtMs.high >>> 0).toNumber() : message.updatedAtMs;
                return object;
            };

            /**
             * Converts this PresenceEvent to JSON.
             * @function toJSON
             * @memberof chat.v1.PresenceEvent
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PresenceEvent.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PresenceEvent
             * @function getTypeUrl
             * @memberof chat.v1.PresenceEvent
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PresenceEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.PresenceEvent";
            };

            return PresenceEvent;
        })();

        v1.PresenceSnapshot = (function() {

            /**
             * Properties of a PresenceSnapshot.
             * @memberof chat.v1
             * @interface IPresenceSnapshot
             * @property {Array.<chat.v1.IPresenceEvent>|null} [statuses] PresenceSnapshot statuses
             */

            /**
             * Constructs a new PresenceSnapshot.
             * @memberof chat.v1
             * @classdesc Represents a PresenceSnapshot.
             * @implements IPresenceSnapshot
             * @constructor
             * @param {chat.v1.IPresenceSnapshot=} [properties] Properties to set
             */
            function PresenceSnapshot(properties) {
                this.statuses = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PresenceSnapshot statuses.
             * @member {Array.<chat.v1.IPresenceEvent>} statuses
             * @memberof chat.v1.PresenceSnapshot
             * @instance
             */
            PresenceSnapshot.prototype.statuses = $util.emptyArray;

            /**
             * Creates a new PresenceSnapshot instance using the specified properties.
             * @function create
             * @memberof chat.v1.PresenceSnapshot
             * @static
             * @param {chat.v1.IPresenceSnapshot=} [properties] Properties to set
             * @returns {chat.v1.PresenceSnapshot} PresenceSnapshot instance
             */
            PresenceSnapshot.create = function create(properties) {
                return new PresenceSnapshot(properties);
            };

            /**
             * Encodes the specified PresenceSnapshot message. Does not implicitly {@link chat.v1.PresenceSnapshot.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.PresenceSnapshot
             * @static
             * @param {chat.v1.IPresenceSnapshot} message PresenceSnapshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PresenceSnapshot.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.statuses != null && message.statuses.length)
                    for (let i = 0; i < message.statuses.length; ++i)
                        $root.chat.v1.PresenceEvent.encode(message.statuses[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified PresenceSnapshot message, length delimited. Does not implicitly {@link chat.v1.PresenceSnapshot.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.PresenceSnapshot
             * @static
             * @param {chat.v1.IPresenceSnapshot} message PresenceSnapshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PresenceSnapshot.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PresenceSnapshot message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.PresenceSnapshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.PresenceSnapshot} PresenceSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PresenceSnapshot.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.PresenceSnapshot();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.statuses && message.statuses.length))
                                message.statuses = [];
                            message.statuses.push($root.chat.v1.PresenceEvent.decode(reader, reader.uint32()));
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
             * Decodes a PresenceSnapshot message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.PresenceSnapshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.PresenceSnapshot} PresenceSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PresenceSnapshot.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PresenceSnapshot message.
             * @function verify
             * @memberof chat.v1.PresenceSnapshot
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PresenceSnapshot.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.statuses != null && message.hasOwnProperty("statuses")) {
                    if (!Array.isArray(message.statuses))
                        return "statuses: array expected";
                    for (let i = 0; i < message.statuses.length; ++i) {
                        let error = $root.chat.v1.PresenceEvent.verify(message.statuses[i]);
                        if (error)
                            return "statuses." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a PresenceSnapshot message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.PresenceSnapshot
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.PresenceSnapshot} PresenceSnapshot
             */
            PresenceSnapshot.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.PresenceSnapshot)
                    return object;
                let message = new $root.chat.v1.PresenceSnapshot();
                if (object.statuses) {
                    if (!Array.isArray(object.statuses))
                        throw TypeError(".chat.v1.PresenceSnapshot.statuses: array expected");
                    message.statuses = [];
                    for (let i = 0; i < object.statuses.length; ++i) {
                        if (typeof object.statuses[i] !== "object")
                            throw TypeError(".chat.v1.PresenceSnapshot.statuses: object expected");
                        message.statuses[i] = $root.chat.v1.PresenceEvent.fromObject(object.statuses[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a PresenceSnapshot message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.PresenceSnapshot
             * @static
             * @param {chat.v1.PresenceSnapshot} message PresenceSnapshot
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PresenceSnapshot.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.statuses = [];
                if (message.statuses && message.statuses.length) {
                    object.statuses = [];
                    for (let j = 0; j < message.statuses.length; ++j)
                        object.statuses[j] = $root.chat.v1.PresenceEvent.toObject(message.statuses[j], options);
                }
                return object;
            };

            /**
             * Converts this PresenceSnapshot to JSON.
             * @function toJSON
             * @memberof chat.v1.PresenceSnapshot
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PresenceSnapshot.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PresenceSnapshot
             * @function getTypeUrl
             * @memberof chat.v1.PresenceSnapshot
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PresenceSnapshot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.PresenceSnapshot";
            };

            return PresenceSnapshot;
        })();

        v1.TypingEvent = (function() {

            /**
             * Properties of a TypingEvent.
             * @memberof chat.v1
             * @interface ITypingEvent
             * @property {string|null} [channelId] TypingEvent channelId
             * @property {string|null} [userId] TypingEvent userId
             * @property {string|null} [displayName] TypingEvent displayName
             * @property {boolean|null} [active] TypingEvent active
             */

            /**
             * Constructs a new TypingEvent.
             * @memberof chat.v1
             * @classdesc Represents a TypingEvent.
             * @implements ITypingEvent
             * @constructor
             * @param {chat.v1.ITypingEvent=} [properties] Properties to set
             */
            function TypingEvent(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * TypingEvent channelId.
             * @member {string} channelId
             * @memberof chat.v1.TypingEvent
             * @instance
             */
            TypingEvent.prototype.channelId = "";

            /**
             * TypingEvent userId.
             * @member {string} userId
             * @memberof chat.v1.TypingEvent
             * @instance
             */
            TypingEvent.prototype.userId = "";

            /**
             * TypingEvent displayName.
             * @member {string} displayName
             * @memberof chat.v1.TypingEvent
             * @instance
             */
            TypingEvent.prototype.displayName = "";

            /**
             * TypingEvent active.
             * @member {boolean} active
             * @memberof chat.v1.TypingEvent
             * @instance
             */
            TypingEvent.prototype.active = false;

            /**
             * Creates a new TypingEvent instance using the specified properties.
             * @function create
             * @memberof chat.v1.TypingEvent
             * @static
             * @param {chat.v1.ITypingEvent=} [properties] Properties to set
             * @returns {chat.v1.TypingEvent} TypingEvent instance
             */
            TypingEvent.create = function create(properties) {
                return new TypingEvent(properties);
            };

            /**
             * Encodes the specified TypingEvent message. Does not implicitly {@link chat.v1.TypingEvent.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.TypingEvent
             * @static
             * @param {chat.v1.ITypingEvent} message TypingEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TypingEvent.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.channelId != null && Object.hasOwnProperty.call(message, "channelId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.channelId);
                if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.userId);
                if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.displayName);
                if (message.active != null && Object.hasOwnProperty.call(message, "active"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.active);
                return writer;
            };

            /**
             * Encodes the specified TypingEvent message, length delimited. Does not implicitly {@link chat.v1.TypingEvent.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.TypingEvent
             * @static
             * @param {chat.v1.ITypingEvent} message TypingEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TypingEvent.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a TypingEvent message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.TypingEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.TypingEvent} TypingEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TypingEvent.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.TypingEvent();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.channelId = reader.string();
                            break;
                        }
                    case 2: {
                            message.userId = reader.string();
                            break;
                        }
                    case 3: {
                            message.displayName = reader.string();
                            break;
                        }
                    case 4: {
                            message.active = reader.bool();
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
             * Decodes a TypingEvent message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.TypingEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.TypingEvent} TypingEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TypingEvent.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a TypingEvent message.
             * @function verify
             * @memberof chat.v1.TypingEvent
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TypingEvent.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    if (!$util.isString(message.channelId))
                        return "channelId: string expected";
                if (message.userId != null && message.hasOwnProperty("userId"))
                    if (!$util.isString(message.userId))
                        return "userId: string expected";
                if (message.displayName != null && message.hasOwnProperty("displayName"))
                    if (!$util.isString(message.displayName))
                        return "displayName: string expected";
                if (message.active != null && message.hasOwnProperty("active"))
                    if (typeof message.active !== "boolean")
                        return "active: boolean expected";
                return null;
            };

            /**
             * Creates a TypingEvent message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.TypingEvent
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.TypingEvent} TypingEvent
             */
            TypingEvent.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.TypingEvent)
                    return object;
                let message = new $root.chat.v1.TypingEvent();
                if (object.channelId != null)
                    message.channelId = String(object.channelId);
                if (object.userId != null)
                    message.userId = String(object.userId);
                if (object.displayName != null)
                    message.displayName = String(object.displayName);
                if (object.active != null)
                    message.active = Boolean(object.active);
                return message;
            };

            /**
             * Creates a plain object from a TypingEvent message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.TypingEvent
             * @static
             * @param {chat.v1.TypingEvent} message TypingEvent
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TypingEvent.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.channelId = "";
                    object.userId = "";
                    object.displayName = "";
                    object.active = false;
                }
                if (message.channelId != null && message.hasOwnProperty("channelId"))
                    object.channelId = message.channelId;
                if (message.userId != null && message.hasOwnProperty("userId"))
                    object.userId = message.userId;
                if (message.displayName != null && message.hasOwnProperty("displayName"))
                    object.displayName = message.displayName;
                if (message.active != null && message.hasOwnProperty("active"))
                    object.active = message.active;
                return object;
            };

            /**
             * Converts this TypingEvent to JSON.
             * @function toJSON
             * @memberof chat.v1.TypingEvent
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TypingEvent.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for TypingEvent
             * @function getTypeUrl
             * @memberof chat.v1.TypingEvent
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            TypingEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.TypingEvent";
            };

            return TypingEvent;
        })();

        v1.ServerError = (function() {

            /**
             * Properties of a ServerError.
             * @memberof chat.v1
             * @interface IServerError
             * @property {string|null} [code] ServerError code
             * @property {string|null} [message] ServerError message
             * @property {boolean|null} [retryable] ServerError retryable
             */

            /**
             * Constructs a new ServerError.
             * @memberof chat.v1
             * @classdesc Represents a ServerError.
             * @implements IServerError
             * @constructor
             * @param {chat.v1.IServerError=} [properties] Properties to set
             */
            function ServerError(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ServerError code.
             * @member {string} code
             * @memberof chat.v1.ServerError
             * @instance
             */
            ServerError.prototype.code = "";

            /**
             * ServerError message.
             * @member {string} message
             * @memberof chat.v1.ServerError
             * @instance
             */
            ServerError.prototype.message = "";

            /**
             * ServerError retryable.
             * @member {boolean} retryable
             * @memberof chat.v1.ServerError
             * @instance
             */
            ServerError.prototype.retryable = false;

            /**
             * Creates a new ServerError instance using the specified properties.
             * @function create
             * @memberof chat.v1.ServerError
             * @static
             * @param {chat.v1.IServerError=} [properties] Properties to set
             * @returns {chat.v1.ServerError} ServerError instance
             */
            ServerError.create = function create(properties) {
                return new ServerError(properties);
            };

            /**
             * Encodes the specified ServerError message. Does not implicitly {@link chat.v1.ServerError.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.ServerError
             * @static
             * @param {chat.v1.IServerError} message ServerError message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerError.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.code);
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
                if (message.retryable != null && Object.hasOwnProperty.call(message, "retryable"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.retryable);
                return writer;
            };

            /**
             * Encodes the specified ServerError message, length delimited. Does not implicitly {@link chat.v1.ServerError.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.ServerError
             * @static
             * @param {chat.v1.IServerError} message ServerError message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerError.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ServerError message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.ServerError
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.ServerError} ServerError
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerError.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.ServerError();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.code = reader.string();
                            break;
                        }
                    case 2: {
                            message.message = reader.string();
                            break;
                        }
                    case 3: {
                            message.retryable = reader.bool();
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
             * Decodes a ServerError message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.ServerError
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.ServerError} ServerError
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerError.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ServerError message.
             * @function verify
             * @memberof chat.v1.ServerError
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ServerError.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.code != null && message.hasOwnProperty("code"))
                    if (!$util.isString(message.code))
                        return "code: string expected";
                if (message.message != null && message.hasOwnProperty("message"))
                    if (!$util.isString(message.message))
                        return "message: string expected";
                if (message.retryable != null && message.hasOwnProperty("retryable"))
                    if (typeof message.retryable !== "boolean")
                        return "retryable: boolean expected";
                return null;
            };

            /**
             * Creates a ServerError message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.ServerError
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.ServerError} ServerError
             */
            ServerError.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.ServerError)
                    return object;
                let message = new $root.chat.v1.ServerError();
                if (object.code != null)
                    message.code = String(object.code);
                if (object.message != null)
                    message.message = String(object.message);
                if (object.retryable != null)
                    message.retryable = Boolean(object.retryable);
                return message;
            };

            /**
             * Creates a plain object from a ServerError message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.ServerError
             * @static
             * @param {chat.v1.ServerError} message ServerError
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ServerError.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.code = "";
                    object.message = "";
                    object.retryable = false;
                }
                if (message.code != null && message.hasOwnProperty("code"))
                    object.code = message.code;
                if (message.message != null && message.hasOwnProperty("message"))
                    object.message = message.message;
                if (message.retryable != null && message.hasOwnProperty("retryable"))
                    object.retryable = message.retryable;
                return object;
            };

            /**
             * Converts this ServerError to JSON.
             * @function toJSON
             * @memberof chat.v1.ServerError
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ServerError.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ServerError
             * @function getTypeUrl
             * @memberof chat.v1.ServerError
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ServerError.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.ServerError";
            };

            return ServerError;
        })();

        v1.Pong = (function() {

            /**
             * Properties of a Pong.
             * @memberof chat.v1
             * @interface IPong
             * @property {number|Long|null} [serverTimeMs] Pong serverTimeMs
             * @property {chat.v1.PresenceStatus|null} [status] Pong status
             */

            /**
             * Constructs a new Pong.
             * @memberof chat.v1
             * @classdesc Represents a Pong.
             * @implements IPong
             * @constructor
             * @param {chat.v1.IPong=} [properties] Properties to set
             */
            function Pong(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Pong serverTimeMs.
             * @member {number|Long} serverTimeMs
             * @memberof chat.v1.Pong
             * @instance
             */
            Pong.prototype.serverTimeMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Pong status.
             * @member {chat.v1.PresenceStatus} status
             * @memberof chat.v1.Pong
             * @instance
             */
            Pong.prototype.status = 0;

            /**
             * Creates a new Pong instance using the specified properties.
             * @function create
             * @memberof chat.v1.Pong
             * @static
             * @param {chat.v1.IPong=} [properties] Properties to set
             * @returns {chat.v1.Pong} Pong instance
             */
            Pong.create = function create(properties) {
                return new Pong(properties);
            };

            /**
             * Encodes the specified Pong message. Does not implicitly {@link chat.v1.Pong.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.Pong
             * @static
             * @param {chat.v1.IPong} message Pong message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Pong.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.serverTimeMs != null && Object.hasOwnProperty.call(message, "serverTimeMs"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.serverTimeMs);
                if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.status);
                return writer;
            };

            /**
             * Encodes the specified Pong message, length delimited. Does not implicitly {@link chat.v1.Pong.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.Pong
             * @static
             * @param {chat.v1.IPong} message Pong message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Pong.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Pong message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.Pong
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.Pong} Pong
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Pong.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.Pong();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.serverTimeMs = reader.int64();
                            break;
                        }
                    case 2: {
                            message.status = reader.int32();
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
             * Decodes a Pong message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.Pong
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.Pong} Pong
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Pong.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Pong message.
             * @function verify
             * @memberof chat.v1.Pong
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Pong.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.serverTimeMs != null && message.hasOwnProperty("serverTimeMs"))
                    if (!$util.isInteger(message.serverTimeMs) && !(message.serverTimeMs && $util.isInteger(message.serverTimeMs.low) && $util.isInteger(message.serverTimeMs.high)))
                        return "serverTimeMs: integer|Long expected";
                if (message.status != null && message.hasOwnProperty("status"))
                    switch (message.status) {
                    default:
                        return "status: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                return null;
            };

            /**
             * Creates a Pong message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.Pong
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.Pong} Pong
             */
            Pong.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.Pong)
                    return object;
                let message = new $root.chat.v1.Pong();
                if (object.serverTimeMs != null)
                    if ($util.Long)
                        (message.serverTimeMs = $util.Long.fromValue(object.serverTimeMs)).unsigned = false;
                    else if (typeof object.serverTimeMs === "string")
                        message.serverTimeMs = parseInt(object.serverTimeMs, 10);
                    else if (typeof object.serverTimeMs === "number")
                        message.serverTimeMs = object.serverTimeMs;
                    else if (typeof object.serverTimeMs === "object")
                        message.serverTimeMs = new $util.LongBits(object.serverTimeMs.low >>> 0, object.serverTimeMs.high >>> 0).toNumber();
                switch (object.status) {
                default:
                    if (typeof object.status === "number") {
                        message.status = object.status;
                        break;
                    }
                    break;
                case "PRESENCE_STATUS_UNSPECIFIED":
                case 0:
                    message.status = 0;
                    break;
                case "PRESENCE_STATUS_ONLINE":
                case 1:
                    message.status = 1;
                    break;
                case "PRESENCE_STATUS_IDLE":
                case 2:
                    message.status = 2;
                    break;
                case "PRESENCE_STATUS_DO_NOT_DISTURB":
                case 3:
                    message.status = 3;
                    break;
                case "PRESENCE_STATUS_OFFLINE":
                case 4:
                    message.status = 4;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a Pong message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.Pong
             * @static
             * @param {chat.v1.Pong} message Pong
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Pong.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.serverTimeMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.serverTimeMs = options.longs === String ? "0" : 0;
                    object.status = options.enums === String ? "PRESENCE_STATUS_UNSPECIFIED" : 0;
                }
                if (message.serverTimeMs != null && message.hasOwnProperty("serverTimeMs"))
                    if (typeof message.serverTimeMs === "number")
                        object.serverTimeMs = options.longs === String ? String(message.serverTimeMs) : message.serverTimeMs;
                    else
                        object.serverTimeMs = options.longs === String ? $util.Long.prototype.toString.call(message.serverTimeMs) : options.longs === Number ? new $util.LongBits(message.serverTimeMs.low >>> 0, message.serverTimeMs.high >>> 0).toNumber() : message.serverTimeMs;
                if (message.status != null && message.hasOwnProperty("status"))
                    object.status = options.enums === String ? $root.chat.v1.PresenceStatus[message.status] === undefined ? message.status : $root.chat.v1.PresenceStatus[message.status] : message.status;
                return object;
            };

            /**
             * Converts this Pong to JSON.
             * @function toJSON
             * @memberof chat.v1.Pong
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Pong.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Pong
             * @function getTypeUrl
             * @memberof chat.v1.Pong
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Pong.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.Pong";
            };

            return Pong;
        })();

        v1.ClientFrame = (function() {

            /**
             * Properties of a ClientFrame.
             * @memberof chat.v1
             * @interface IClientFrame
             * @property {string|null} [requestId] ClientFrame requestId
             * @property {chat.v1.IAuthenticate|null} [authenticate] ClientFrame authenticate
             * @property {chat.v1.ISubscribe|null} [subscribe] ClientFrame subscribe
             * @property {chat.v1.IUnsubscribe|null} [unsubscribe] ClientFrame unsubscribe
             * @property {chat.v1.ISendMessage|null} [sendMessage] ClientFrame sendMessage
             * @property {chat.v1.IHeartbeat|null} [heartbeat] ClientFrame heartbeat
             * @property {chat.v1.ISetPresence|null} [setPresence] ClientFrame setPresence
             * @property {chat.v1.ITyping|null} [typing] ClientFrame typing
             * @property {chat.v1.IJoinCall|null} [joinCall] ClientFrame joinCall
             * @property {chat.v1.ILeaveCall|null} [leaveCall] ClientFrame leaveCall
             * @property {chat.v1.ICallSignal|null} [callSignal] ClientFrame callSignal
             * @property {chat.v1.ICallMedia|null} [callMedia] ClientFrame callMedia
             */

            /**
             * Constructs a new ClientFrame.
             * @memberof chat.v1
             * @classdesc Represents a ClientFrame.
             * @implements IClientFrame
             * @constructor
             * @param {chat.v1.IClientFrame=} [properties] Properties to set
             */
            function ClientFrame(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ClientFrame requestId.
             * @member {string} requestId
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            ClientFrame.prototype.requestId = "";

            /**
             * ClientFrame authenticate.
             * @member {chat.v1.IAuthenticate|null|undefined} authenticate
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            ClientFrame.prototype.authenticate = null;

            /**
             * ClientFrame subscribe.
             * @member {chat.v1.ISubscribe|null|undefined} subscribe
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            ClientFrame.prototype.subscribe = null;

            /**
             * ClientFrame unsubscribe.
             * @member {chat.v1.IUnsubscribe|null|undefined} unsubscribe
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            ClientFrame.prototype.unsubscribe = null;

            /**
             * ClientFrame sendMessage.
             * @member {chat.v1.ISendMessage|null|undefined} sendMessage
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            ClientFrame.prototype.sendMessage = null;

            /**
             * ClientFrame heartbeat.
             * @member {chat.v1.IHeartbeat|null|undefined} heartbeat
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            ClientFrame.prototype.heartbeat = null;

            /**
             * ClientFrame setPresence.
             * @member {chat.v1.ISetPresence|null|undefined} setPresence
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            ClientFrame.prototype.setPresence = null;

            /**
             * ClientFrame typing.
             * @member {chat.v1.ITyping|null|undefined} typing
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            ClientFrame.prototype.typing = null;

            /**
             * ClientFrame joinCall.
             * @member {chat.v1.IJoinCall|null|undefined} joinCall
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            ClientFrame.prototype.joinCall = null;

            /**
             * ClientFrame leaveCall.
             * @member {chat.v1.ILeaveCall|null|undefined} leaveCall
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            ClientFrame.prototype.leaveCall = null;

            /**
             * ClientFrame callSignal.
             * @member {chat.v1.ICallSignal|null|undefined} callSignal
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            ClientFrame.prototype.callSignal = null;

            /**
             * ClientFrame callMedia.
             * @member {chat.v1.ICallMedia|null|undefined} callMedia
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            ClientFrame.prototype.callMedia = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * ClientFrame payload.
             * @member {"authenticate"|"subscribe"|"unsubscribe"|"sendMessage"|"heartbeat"|"setPresence"|"typing"|"joinCall"|"leaveCall"|"callSignal"|"callMedia"|undefined} payload
             * @memberof chat.v1.ClientFrame
             * @instance
             */
            Object.defineProperty(ClientFrame.prototype, "payload", {
                get: $util.oneOfGetter($oneOfFields = ["authenticate", "subscribe", "unsubscribe", "sendMessage", "heartbeat", "setPresence", "typing", "joinCall", "leaveCall", "callSignal", "callMedia"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ClientFrame instance using the specified properties.
             * @function create
             * @memberof chat.v1.ClientFrame
             * @static
             * @param {chat.v1.IClientFrame=} [properties] Properties to set
             * @returns {chat.v1.ClientFrame} ClientFrame instance
             */
            ClientFrame.create = function create(properties) {
                return new ClientFrame(properties);
            };

            /**
             * Encodes the specified ClientFrame message. Does not implicitly {@link chat.v1.ClientFrame.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.ClientFrame
             * @static
             * @param {chat.v1.IClientFrame} message ClientFrame message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClientFrame.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.requestId);
                if (message.authenticate != null && Object.hasOwnProperty.call(message, "authenticate"))
                    $root.chat.v1.Authenticate.encode(message.authenticate, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.subscribe != null && Object.hasOwnProperty.call(message, "subscribe"))
                    $root.chat.v1.Subscribe.encode(message.subscribe, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.unsubscribe != null && Object.hasOwnProperty.call(message, "unsubscribe"))
                    $root.chat.v1.Unsubscribe.encode(message.unsubscribe, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.sendMessage != null && Object.hasOwnProperty.call(message, "sendMessage"))
                    $root.chat.v1.SendMessage.encode(message.sendMessage, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.heartbeat != null && Object.hasOwnProperty.call(message, "heartbeat"))
                    $root.chat.v1.Heartbeat.encode(message.heartbeat, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.setPresence != null && Object.hasOwnProperty.call(message, "setPresence"))
                    $root.chat.v1.SetPresence.encode(message.setPresence, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.typing != null && Object.hasOwnProperty.call(message, "typing"))
                    $root.chat.v1.Typing.encode(message.typing, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.joinCall != null && Object.hasOwnProperty.call(message, "joinCall"))
                    $root.chat.v1.JoinCall.encode(message.joinCall, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.leaveCall != null && Object.hasOwnProperty.call(message, "leaveCall"))
                    $root.chat.v1.LeaveCall.encode(message.leaveCall, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.callSignal != null && Object.hasOwnProperty.call(message, "callSignal"))
                    $root.chat.v1.CallSignal.encode(message.callSignal, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                if (message.callMedia != null && Object.hasOwnProperty.call(message, "callMedia"))
                    $root.chat.v1.CallMedia.encode(message.callMedia, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ClientFrame message, length delimited. Does not implicitly {@link chat.v1.ClientFrame.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.ClientFrame
             * @static
             * @param {chat.v1.IClientFrame} message ClientFrame message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClientFrame.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ClientFrame message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.ClientFrame
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.ClientFrame} ClientFrame
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClientFrame.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.ClientFrame();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.string();
                            break;
                        }
                    case 2: {
                            message.authenticate = $root.chat.v1.Authenticate.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.subscribe = $root.chat.v1.Subscribe.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.unsubscribe = $root.chat.v1.Unsubscribe.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.sendMessage = $root.chat.v1.SendMessage.decode(reader, reader.uint32());
                            break;
                        }
                    case 6: {
                            message.heartbeat = $root.chat.v1.Heartbeat.decode(reader, reader.uint32());
                            break;
                        }
                    case 7: {
                            message.setPresence = $root.chat.v1.SetPresence.decode(reader, reader.uint32());
                            break;
                        }
                    case 8: {
                            message.typing = $root.chat.v1.Typing.decode(reader, reader.uint32());
                            break;
                        }
                    case 9: {
                            message.joinCall = $root.chat.v1.JoinCall.decode(reader, reader.uint32());
                            break;
                        }
                    case 10: {
                            message.leaveCall = $root.chat.v1.LeaveCall.decode(reader, reader.uint32());
                            break;
                        }
                    case 11: {
                            message.callSignal = $root.chat.v1.CallSignal.decode(reader, reader.uint32());
                            break;
                        }
                    case 12: {
                            message.callMedia = $root.chat.v1.CallMedia.decode(reader, reader.uint32());
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
             * Decodes a ClientFrame message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.ClientFrame
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.ClientFrame} ClientFrame
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClientFrame.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ClientFrame message.
             * @function verify
             * @memberof chat.v1.ClientFrame
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ClientFrame.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!$util.isString(message.requestId))
                        return "requestId: string expected";
                if (message.authenticate != null && message.hasOwnProperty("authenticate")) {
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.Authenticate.verify(message.authenticate);
                        if (error)
                            return "authenticate." + error;
                    }
                }
                if (message.subscribe != null && message.hasOwnProperty("subscribe")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.Subscribe.verify(message.subscribe);
                        if (error)
                            return "subscribe." + error;
                    }
                }
                if (message.unsubscribe != null && message.hasOwnProperty("unsubscribe")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.Unsubscribe.verify(message.unsubscribe);
                        if (error)
                            return "unsubscribe." + error;
                    }
                }
                if (message.sendMessage != null && message.hasOwnProperty("sendMessage")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.SendMessage.verify(message.sendMessage);
                        if (error)
                            return "sendMessage." + error;
                    }
                }
                if (message.heartbeat != null && message.hasOwnProperty("heartbeat")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.Heartbeat.verify(message.heartbeat);
                        if (error)
                            return "heartbeat." + error;
                    }
                }
                if (message.setPresence != null && message.hasOwnProperty("setPresence")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.SetPresence.verify(message.setPresence);
                        if (error)
                            return "setPresence." + error;
                    }
                }
                if (message.typing != null && message.hasOwnProperty("typing")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.Typing.verify(message.typing);
                        if (error)
                            return "typing." + error;
                    }
                }
                if (message.joinCall != null && message.hasOwnProperty("joinCall")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.JoinCall.verify(message.joinCall);
                        if (error)
                            return "joinCall." + error;
                    }
                }
                if (message.leaveCall != null && message.hasOwnProperty("leaveCall")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.LeaveCall.verify(message.leaveCall);
                        if (error)
                            return "leaveCall." + error;
                    }
                }
                if (message.callSignal != null && message.hasOwnProperty("callSignal")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.CallSignal.verify(message.callSignal);
                        if (error)
                            return "callSignal." + error;
                    }
                }
                if (message.callMedia != null && message.hasOwnProperty("callMedia")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.CallMedia.verify(message.callMedia);
                        if (error)
                            return "callMedia." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ClientFrame message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.ClientFrame
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.ClientFrame} ClientFrame
             */
            ClientFrame.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.ClientFrame)
                    return object;
                let message = new $root.chat.v1.ClientFrame();
                if (object.requestId != null)
                    message.requestId = String(object.requestId);
                if (object.authenticate != null) {
                    if (typeof object.authenticate !== "object")
                        throw TypeError(".chat.v1.ClientFrame.authenticate: object expected");
                    message.authenticate = $root.chat.v1.Authenticate.fromObject(object.authenticate);
                }
                if (object.subscribe != null) {
                    if (typeof object.subscribe !== "object")
                        throw TypeError(".chat.v1.ClientFrame.subscribe: object expected");
                    message.subscribe = $root.chat.v1.Subscribe.fromObject(object.subscribe);
                }
                if (object.unsubscribe != null) {
                    if (typeof object.unsubscribe !== "object")
                        throw TypeError(".chat.v1.ClientFrame.unsubscribe: object expected");
                    message.unsubscribe = $root.chat.v1.Unsubscribe.fromObject(object.unsubscribe);
                }
                if (object.sendMessage != null) {
                    if (typeof object.sendMessage !== "object")
                        throw TypeError(".chat.v1.ClientFrame.sendMessage: object expected");
                    message.sendMessage = $root.chat.v1.SendMessage.fromObject(object.sendMessage);
                }
                if (object.heartbeat != null) {
                    if (typeof object.heartbeat !== "object")
                        throw TypeError(".chat.v1.ClientFrame.heartbeat: object expected");
                    message.heartbeat = $root.chat.v1.Heartbeat.fromObject(object.heartbeat);
                }
                if (object.setPresence != null) {
                    if (typeof object.setPresence !== "object")
                        throw TypeError(".chat.v1.ClientFrame.setPresence: object expected");
                    message.setPresence = $root.chat.v1.SetPresence.fromObject(object.setPresence);
                }
                if (object.typing != null) {
                    if (typeof object.typing !== "object")
                        throw TypeError(".chat.v1.ClientFrame.typing: object expected");
                    message.typing = $root.chat.v1.Typing.fromObject(object.typing);
                }
                if (object.joinCall != null) {
                    if (typeof object.joinCall !== "object")
                        throw TypeError(".chat.v1.ClientFrame.joinCall: object expected");
                    message.joinCall = $root.chat.v1.JoinCall.fromObject(object.joinCall);
                }
                if (object.leaveCall != null) {
                    if (typeof object.leaveCall !== "object")
                        throw TypeError(".chat.v1.ClientFrame.leaveCall: object expected");
                    message.leaveCall = $root.chat.v1.LeaveCall.fromObject(object.leaveCall);
                }
                if (object.callSignal != null) {
                    if (typeof object.callSignal !== "object")
                        throw TypeError(".chat.v1.ClientFrame.callSignal: object expected");
                    message.callSignal = $root.chat.v1.CallSignal.fromObject(object.callSignal);
                }
                if (object.callMedia != null) {
                    if (typeof object.callMedia !== "object")
                        throw TypeError(".chat.v1.ClientFrame.callMedia: object expected");
                    message.callMedia = $root.chat.v1.CallMedia.fromObject(object.callMedia);
                }
                return message;
            };

            /**
             * Creates a plain object from a ClientFrame message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.ClientFrame
             * @static
             * @param {chat.v1.ClientFrame} message ClientFrame
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ClientFrame.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.requestId = "";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = message.requestId;
                if (message.authenticate != null && message.hasOwnProperty("authenticate")) {
                    object.authenticate = $root.chat.v1.Authenticate.toObject(message.authenticate, options);
                    if (options.oneofs)
                        object.payload = "authenticate";
                }
                if (message.subscribe != null && message.hasOwnProperty("subscribe")) {
                    object.subscribe = $root.chat.v1.Subscribe.toObject(message.subscribe, options);
                    if (options.oneofs)
                        object.payload = "subscribe";
                }
                if (message.unsubscribe != null && message.hasOwnProperty("unsubscribe")) {
                    object.unsubscribe = $root.chat.v1.Unsubscribe.toObject(message.unsubscribe, options);
                    if (options.oneofs)
                        object.payload = "unsubscribe";
                }
                if (message.sendMessage != null && message.hasOwnProperty("sendMessage")) {
                    object.sendMessage = $root.chat.v1.SendMessage.toObject(message.sendMessage, options);
                    if (options.oneofs)
                        object.payload = "sendMessage";
                }
                if (message.heartbeat != null && message.hasOwnProperty("heartbeat")) {
                    object.heartbeat = $root.chat.v1.Heartbeat.toObject(message.heartbeat, options);
                    if (options.oneofs)
                        object.payload = "heartbeat";
                }
                if (message.setPresence != null && message.hasOwnProperty("setPresence")) {
                    object.setPresence = $root.chat.v1.SetPresence.toObject(message.setPresence, options);
                    if (options.oneofs)
                        object.payload = "setPresence";
                }
                if (message.typing != null && message.hasOwnProperty("typing")) {
                    object.typing = $root.chat.v1.Typing.toObject(message.typing, options);
                    if (options.oneofs)
                        object.payload = "typing";
                }
                if (message.joinCall != null && message.hasOwnProperty("joinCall")) {
                    object.joinCall = $root.chat.v1.JoinCall.toObject(message.joinCall, options);
                    if (options.oneofs)
                        object.payload = "joinCall";
                }
                if (message.leaveCall != null && message.hasOwnProperty("leaveCall")) {
                    object.leaveCall = $root.chat.v1.LeaveCall.toObject(message.leaveCall, options);
                    if (options.oneofs)
                        object.payload = "leaveCall";
                }
                if (message.callSignal != null && message.hasOwnProperty("callSignal")) {
                    object.callSignal = $root.chat.v1.CallSignal.toObject(message.callSignal, options);
                    if (options.oneofs)
                        object.payload = "callSignal";
                }
                if (message.callMedia != null && message.hasOwnProperty("callMedia")) {
                    object.callMedia = $root.chat.v1.CallMedia.toObject(message.callMedia, options);
                    if (options.oneofs)
                        object.payload = "callMedia";
                }
                return object;
            };

            /**
             * Converts this ClientFrame to JSON.
             * @function toJSON
             * @memberof chat.v1.ClientFrame
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ClientFrame.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ClientFrame
             * @function getTypeUrl
             * @memberof chat.v1.ClientFrame
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ClientFrame.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.ClientFrame";
            };

            return ClientFrame;
        })();

        v1.ServerFrame = (function() {

            /**
             * Properties of a ServerFrame.
             * @memberof chat.v1
             * @interface IServerFrame
             * @property {string|null} [requestId] ServerFrame requestId
             * @property {chat.v1.IAuthenticated|null} [authenticated] ServerFrame authenticated
             * @property {chat.v1.IChatMessage|null} [message] ServerFrame message
             * @property {chat.v1.IMessageAck|null} [ack] ServerFrame ack
             * @property {chat.v1.IPresenceEvent|null} [presence] ServerFrame presence
             * @property {chat.v1.IPresenceSnapshot|null} [presenceSnapshot] ServerFrame presenceSnapshot
             * @property {chat.v1.IServerError|null} [error] ServerFrame error
             * @property {chat.v1.IPong|null} [pong] ServerFrame pong
             * @property {chat.v1.ITypingEvent|null} [typing] ServerFrame typing
             * @property {chat.v1.ICallSnapshot|null} [callSnapshot] ServerFrame callSnapshot
             * @property {chat.v1.ICallEvent|null} [callEvent] ServerFrame callEvent
             */

            /**
             * Constructs a new ServerFrame.
             * @memberof chat.v1
             * @classdesc Represents a ServerFrame.
             * @implements IServerFrame
             * @constructor
             * @param {chat.v1.IServerFrame=} [properties] Properties to set
             */
            function ServerFrame(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ServerFrame requestId.
             * @member {string} requestId
             * @memberof chat.v1.ServerFrame
             * @instance
             */
            ServerFrame.prototype.requestId = "";

            /**
             * ServerFrame authenticated.
             * @member {chat.v1.IAuthenticated|null|undefined} authenticated
             * @memberof chat.v1.ServerFrame
             * @instance
             */
            ServerFrame.prototype.authenticated = null;

            /**
             * ServerFrame message.
             * @member {chat.v1.IChatMessage|null|undefined} message
             * @memberof chat.v1.ServerFrame
             * @instance
             */
            ServerFrame.prototype.message = null;

            /**
             * ServerFrame ack.
             * @member {chat.v1.IMessageAck|null|undefined} ack
             * @memberof chat.v1.ServerFrame
             * @instance
             */
            ServerFrame.prototype.ack = null;

            /**
             * ServerFrame presence.
             * @member {chat.v1.IPresenceEvent|null|undefined} presence
             * @memberof chat.v1.ServerFrame
             * @instance
             */
            ServerFrame.prototype.presence = null;

            /**
             * ServerFrame presenceSnapshot.
             * @member {chat.v1.IPresenceSnapshot|null|undefined} presenceSnapshot
             * @memberof chat.v1.ServerFrame
             * @instance
             */
            ServerFrame.prototype.presenceSnapshot = null;

            /**
             * ServerFrame error.
             * @member {chat.v1.IServerError|null|undefined} error
             * @memberof chat.v1.ServerFrame
             * @instance
             */
            ServerFrame.prototype.error = null;

            /**
             * ServerFrame pong.
             * @member {chat.v1.IPong|null|undefined} pong
             * @memberof chat.v1.ServerFrame
             * @instance
             */
            ServerFrame.prototype.pong = null;

            /**
             * ServerFrame typing.
             * @member {chat.v1.ITypingEvent|null|undefined} typing
             * @memberof chat.v1.ServerFrame
             * @instance
             */
            ServerFrame.prototype.typing = null;

            /**
             * ServerFrame callSnapshot.
             * @member {chat.v1.ICallSnapshot|null|undefined} callSnapshot
             * @memberof chat.v1.ServerFrame
             * @instance
             */
            ServerFrame.prototype.callSnapshot = null;

            /**
             * ServerFrame callEvent.
             * @member {chat.v1.ICallEvent|null|undefined} callEvent
             * @memberof chat.v1.ServerFrame
             * @instance
             */
            ServerFrame.prototype.callEvent = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * ServerFrame payload.
             * @member {"authenticated"|"message"|"ack"|"presence"|"presenceSnapshot"|"error"|"pong"|"typing"|"callSnapshot"|"callEvent"|undefined} payload
             * @memberof chat.v1.ServerFrame
             * @instance
             */
            Object.defineProperty(ServerFrame.prototype, "payload", {
                get: $util.oneOfGetter($oneOfFields = ["authenticated", "message", "ack", "presence", "presenceSnapshot", "error", "pong", "typing", "callSnapshot", "callEvent"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ServerFrame instance using the specified properties.
             * @function create
             * @memberof chat.v1.ServerFrame
             * @static
             * @param {chat.v1.IServerFrame=} [properties] Properties to set
             * @returns {chat.v1.ServerFrame} ServerFrame instance
             */
            ServerFrame.create = function create(properties) {
                return new ServerFrame(properties);
            };

            /**
             * Encodes the specified ServerFrame message. Does not implicitly {@link chat.v1.ServerFrame.verify|verify} messages.
             * @function encode
             * @memberof chat.v1.ServerFrame
             * @static
             * @param {chat.v1.IServerFrame} message ServerFrame message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerFrame.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.requestId);
                if (message.authenticated != null && Object.hasOwnProperty.call(message, "authenticated"))
                    $root.chat.v1.Authenticated.encode(message.authenticated, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    $root.chat.v1.ChatMessage.encode(message.message, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.ack != null && Object.hasOwnProperty.call(message, "ack"))
                    $root.chat.v1.MessageAck.encode(message.ack, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.presence != null && Object.hasOwnProperty.call(message, "presence"))
                    $root.chat.v1.PresenceEvent.encode(message.presence, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.presenceSnapshot != null && Object.hasOwnProperty.call(message, "presenceSnapshot"))
                    $root.chat.v1.PresenceSnapshot.encode(message.presenceSnapshot, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    $root.chat.v1.ServerError.encode(message.error, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.pong != null && Object.hasOwnProperty.call(message, "pong"))
                    $root.chat.v1.Pong.encode(message.pong, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.typing != null && Object.hasOwnProperty.call(message, "typing"))
                    $root.chat.v1.TypingEvent.encode(message.typing, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.callSnapshot != null && Object.hasOwnProperty.call(message, "callSnapshot"))
                    $root.chat.v1.CallSnapshot.encode(message.callSnapshot, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.callEvent != null && Object.hasOwnProperty.call(message, "callEvent"))
                    $root.chat.v1.CallEvent.encode(message.callEvent, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ServerFrame message, length delimited. Does not implicitly {@link chat.v1.ServerFrame.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.v1.ServerFrame
             * @static
             * @param {chat.v1.IServerFrame} message ServerFrame message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerFrame.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ServerFrame message from the specified reader or buffer.
             * @function decode
             * @memberof chat.v1.ServerFrame
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.v1.ServerFrame} ServerFrame
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerFrame.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.v1.ServerFrame();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.string();
                            break;
                        }
                    case 2: {
                            message.authenticated = $root.chat.v1.Authenticated.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.message = $root.chat.v1.ChatMessage.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.ack = $root.chat.v1.MessageAck.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.presence = $root.chat.v1.PresenceEvent.decode(reader, reader.uint32());
                            break;
                        }
                    case 6: {
                            message.presenceSnapshot = $root.chat.v1.PresenceSnapshot.decode(reader, reader.uint32());
                            break;
                        }
                    case 7: {
                            message.error = $root.chat.v1.ServerError.decode(reader, reader.uint32());
                            break;
                        }
                    case 8: {
                            message.pong = $root.chat.v1.Pong.decode(reader, reader.uint32());
                            break;
                        }
                    case 9: {
                            message.typing = $root.chat.v1.TypingEvent.decode(reader, reader.uint32());
                            break;
                        }
                    case 10: {
                            message.callSnapshot = $root.chat.v1.CallSnapshot.decode(reader, reader.uint32());
                            break;
                        }
                    case 11: {
                            message.callEvent = $root.chat.v1.CallEvent.decode(reader, reader.uint32());
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
             * Decodes a ServerFrame message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.v1.ServerFrame
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.v1.ServerFrame} ServerFrame
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerFrame.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ServerFrame message.
             * @function verify
             * @memberof chat.v1.ServerFrame
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ServerFrame.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!$util.isString(message.requestId))
                        return "requestId: string expected";
                if (message.authenticated != null && message.hasOwnProperty("authenticated")) {
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.Authenticated.verify(message.authenticated);
                        if (error)
                            return "authenticated." + error;
                    }
                }
                if (message.message != null && message.hasOwnProperty("message")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.ChatMessage.verify(message.message);
                        if (error)
                            return "message." + error;
                    }
                }
                if (message.ack != null && message.hasOwnProperty("ack")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.MessageAck.verify(message.ack);
                        if (error)
                            return "ack." + error;
                    }
                }
                if (message.presence != null && message.hasOwnProperty("presence")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.PresenceEvent.verify(message.presence);
                        if (error)
                            return "presence." + error;
                    }
                }
                if (message.presenceSnapshot != null && message.hasOwnProperty("presenceSnapshot")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.PresenceSnapshot.verify(message.presenceSnapshot);
                        if (error)
                            return "presenceSnapshot." + error;
                    }
                }
                if (message.error != null && message.hasOwnProperty("error")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.ServerError.verify(message.error);
                        if (error)
                            return "error." + error;
                    }
                }
                if (message.pong != null && message.hasOwnProperty("pong")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.Pong.verify(message.pong);
                        if (error)
                            return "pong." + error;
                    }
                }
                if (message.typing != null && message.hasOwnProperty("typing")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.TypingEvent.verify(message.typing);
                        if (error)
                            return "typing." + error;
                    }
                }
                if (message.callSnapshot != null && message.hasOwnProperty("callSnapshot")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.CallSnapshot.verify(message.callSnapshot);
                        if (error)
                            return "callSnapshot." + error;
                    }
                }
                if (message.callEvent != null && message.hasOwnProperty("callEvent")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.chat.v1.CallEvent.verify(message.callEvent);
                        if (error)
                            return "callEvent." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ServerFrame message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.v1.ServerFrame
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.v1.ServerFrame} ServerFrame
             */
            ServerFrame.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.v1.ServerFrame)
                    return object;
                let message = new $root.chat.v1.ServerFrame();
                if (object.requestId != null)
                    message.requestId = String(object.requestId);
                if (object.authenticated != null) {
                    if (typeof object.authenticated !== "object")
                        throw TypeError(".chat.v1.ServerFrame.authenticated: object expected");
                    message.authenticated = $root.chat.v1.Authenticated.fromObject(object.authenticated);
                }
                if (object.message != null) {
                    if (typeof object.message !== "object")
                        throw TypeError(".chat.v1.ServerFrame.message: object expected");
                    message.message = $root.chat.v1.ChatMessage.fromObject(object.message);
                }
                if (object.ack != null) {
                    if (typeof object.ack !== "object")
                        throw TypeError(".chat.v1.ServerFrame.ack: object expected");
                    message.ack = $root.chat.v1.MessageAck.fromObject(object.ack);
                }
                if (object.presence != null) {
                    if (typeof object.presence !== "object")
                        throw TypeError(".chat.v1.ServerFrame.presence: object expected");
                    message.presence = $root.chat.v1.PresenceEvent.fromObject(object.presence);
                }
                if (object.presenceSnapshot != null) {
                    if (typeof object.presenceSnapshot !== "object")
                        throw TypeError(".chat.v1.ServerFrame.presenceSnapshot: object expected");
                    message.presenceSnapshot = $root.chat.v1.PresenceSnapshot.fromObject(object.presenceSnapshot);
                }
                if (object.error != null) {
                    if (typeof object.error !== "object")
                        throw TypeError(".chat.v1.ServerFrame.error: object expected");
                    message.error = $root.chat.v1.ServerError.fromObject(object.error);
                }
                if (object.pong != null) {
                    if (typeof object.pong !== "object")
                        throw TypeError(".chat.v1.ServerFrame.pong: object expected");
                    message.pong = $root.chat.v1.Pong.fromObject(object.pong);
                }
                if (object.typing != null) {
                    if (typeof object.typing !== "object")
                        throw TypeError(".chat.v1.ServerFrame.typing: object expected");
                    message.typing = $root.chat.v1.TypingEvent.fromObject(object.typing);
                }
                if (object.callSnapshot != null) {
                    if (typeof object.callSnapshot !== "object")
                        throw TypeError(".chat.v1.ServerFrame.callSnapshot: object expected");
                    message.callSnapshot = $root.chat.v1.CallSnapshot.fromObject(object.callSnapshot);
                }
                if (object.callEvent != null) {
                    if (typeof object.callEvent !== "object")
                        throw TypeError(".chat.v1.ServerFrame.callEvent: object expected");
                    message.callEvent = $root.chat.v1.CallEvent.fromObject(object.callEvent);
                }
                return message;
            };

            /**
             * Creates a plain object from a ServerFrame message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.v1.ServerFrame
             * @static
             * @param {chat.v1.ServerFrame} message ServerFrame
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ServerFrame.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.requestId = "";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = message.requestId;
                if (message.authenticated != null && message.hasOwnProperty("authenticated")) {
                    object.authenticated = $root.chat.v1.Authenticated.toObject(message.authenticated, options);
                    if (options.oneofs)
                        object.payload = "authenticated";
                }
                if (message.message != null && message.hasOwnProperty("message")) {
                    object.message = $root.chat.v1.ChatMessage.toObject(message.message, options);
                    if (options.oneofs)
                        object.payload = "message";
                }
                if (message.ack != null && message.hasOwnProperty("ack")) {
                    object.ack = $root.chat.v1.MessageAck.toObject(message.ack, options);
                    if (options.oneofs)
                        object.payload = "ack";
                }
                if (message.presence != null && message.hasOwnProperty("presence")) {
                    object.presence = $root.chat.v1.PresenceEvent.toObject(message.presence, options);
                    if (options.oneofs)
                        object.payload = "presence";
                }
                if (message.presenceSnapshot != null && message.hasOwnProperty("presenceSnapshot")) {
                    object.presenceSnapshot = $root.chat.v1.PresenceSnapshot.toObject(message.presenceSnapshot, options);
                    if (options.oneofs)
                        object.payload = "presenceSnapshot";
                }
                if (message.error != null && message.hasOwnProperty("error")) {
                    object.error = $root.chat.v1.ServerError.toObject(message.error, options);
                    if (options.oneofs)
                        object.payload = "error";
                }
                if (message.pong != null && message.hasOwnProperty("pong")) {
                    object.pong = $root.chat.v1.Pong.toObject(message.pong, options);
                    if (options.oneofs)
                        object.payload = "pong";
                }
                if (message.typing != null && message.hasOwnProperty("typing")) {
                    object.typing = $root.chat.v1.TypingEvent.toObject(message.typing, options);
                    if (options.oneofs)
                        object.payload = "typing";
                }
                if (message.callSnapshot != null && message.hasOwnProperty("callSnapshot")) {
                    object.callSnapshot = $root.chat.v1.CallSnapshot.toObject(message.callSnapshot, options);
                    if (options.oneofs)
                        object.payload = "callSnapshot";
                }
                if (message.callEvent != null && message.hasOwnProperty("callEvent")) {
                    object.callEvent = $root.chat.v1.CallEvent.toObject(message.callEvent, options);
                    if (options.oneofs)
                        object.payload = "callEvent";
                }
                return object;
            };

            /**
             * Converts this ServerFrame to JSON.
             * @function toJSON
             * @memberof chat.v1.ServerFrame
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ServerFrame.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ServerFrame
             * @function getTypeUrl
             * @memberof chat.v1.ServerFrame
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ServerFrame.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/chat.v1.ServerFrame";
            };

            return ServerFrame;
        })();

        return v1;
    })();

    return chat;
})();

export { $root as default };
