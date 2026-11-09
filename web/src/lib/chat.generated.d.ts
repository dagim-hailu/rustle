import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace chat. */
export namespace chat {

    /** Namespace v1. */
    namespace v1 {

        /** PresenceStatus enum. */
        enum PresenceStatus {
            PRESENCE_STATUS_UNSPECIFIED = 0,
            PRESENCE_STATUS_ONLINE = 1,
            PRESENCE_STATUS_IDLE = 2,
            PRESENCE_STATUS_DO_NOT_DISTURB = 3,
            PRESENCE_STATUS_OFFLINE = 4
        }

        /** ChannelKind enum. */
        enum ChannelKind {
            CHANNEL_KIND_UNSPECIFIED = 0,
            CHANNEL_KIND_TEXT = 1,
            CHANNEL_KIND_VOICE = 2
        }

        /** AckStatus enum. */
        enum AckStatus {
            ACK_STATUS_UNSPECIFIED = 0,
            ACK_STATUS_COMMITTED = 1,
            ACK_STATUS_FAILED = 2
        }

        /** CallEventType enum. */
        enum CallEventType {
            CALL_EVENT_TYPE_UNSPECIFIED = 0,
            CALL_EVENT_TYPE_JOIN = 1,
            CALL_EVENT_TYPE_LEAVE = 2,
            CALL_EVENT_TYPE_OFFER = 3,
            CALL_EVENT_TYPE_ANSWER = 4,
            CALL_EVENT_TYPE_ICE = 5,
            CALL_EVENT_TYPE_MEDIA = 6
        }

        /** Properties of a User. */
        interface IUser {

            /** User id */
            id?: (string|null);

            /** User displayName */
            displayName?: (string|null);

            /** User avatarColor */
            avatarColor?: (string|null);

            /** User locale */
            locale?: (string|null);

            /** User presence */
            presence?: (chat.v1.PresenceStatus|null);

            /** User avatarUrl */
            avatarUrl?: (string|null);

            /** User bio */
            bio?: (string|null);

            /** User pronouns */
            pronouns?: (string|null);

            /** User bannerUrl */
            bannerUrl?: (string|null);

            /** User bannerColor */
            bannerColor?: (string|null);

            /** User createdAt */
            createdAt?: (string|null);
        }

        /** Represents a User. */
        class User implements IUser {

            /**
             * Constructs a new User.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IUser);

            /** User id. */
            public id: string;

            /** User displayName. */
            public displayName: string;

            /** User avatarColor. */
            public avatarColor: string;

            /** User locale. */
            public locale: string;

            /** User presence. */
            public presence: chat.v1.PresenceStatus;

            /** User avatarUrl. */
            public avatarUrl: string;

            /** User bio. */
            public bio: string;

            /** User pronouns. */
            public pronouns: string;

            /** User bannerUrl. */
            public bannerUrl: string;

            /** User bannerColor. */
            public bannerColor: string;

            /** User createdAt. */
            public createdAt: string;

            /**
             * Creates a new User instance using the specified properties.
             * @param [properties] Properties to set
             * @returns User instance
             */
            public static create(properties?: chat.v1.IUser): chat.v1.User;

            /**
             * Encodes the specified User message. Does not implicitly {@link chat.v1.User.verify|verify} messages.
             * @param message User message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified User message, length delimited. Does not implicitly {@link chat.v1.User.verify|verify} messages.
             * @param message User message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a User message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns User
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.User;

            /**
             * Decodes a User message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns User
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.User;

            /**
             * Verifies a User message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a User message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns User
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.User;

            /**
             * Creates a plain object from a User message. Also converts values to other types if specified.
             * @param message User
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.User, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this User to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for User
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a GuildMember. */
        interface IGuildMember {

            /** GuildMember userId */
            userId?: (string|null);

            /** GuildMember displayName */
            displayName?: (string|null);

            /** GuildMember avatarColor */
            avatarColor?: (string|null);

            /** GuildMember presence */
            presence?: (chat.v1.PresenceStatus|null);

            /** GuildMember role */
            role?: (string|null);

            /** GuildMember avatarUrl */
            avatarUrl?: (string|null);

            /** GuildMember bio */
            bio?: (string|null);

            /** GuildMember pronouns */
            pronouns?: (string|null);

            /** GuildMember bannerUrl */
            bannerUrl?: (string|null);

            /** GuildMember bannerColor */
            bannerColor?: (string|null);

            /** GuildMember createdAt */
            createdAt?: (string|null);
        }

        /** Represents a GuildMember. */
        class GuildMember implements IGuildMember {

            /**
             * Constructs a new GuildMember.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IGuildMember);

            /** GuildMember userId. */
            public userId: string;

            /** GuildMember displayName. */
            public displayName: string;

            /** GuildMember avatarColor. */
            public avatarColor: string;

            /** GuildMember presence. */
            public presence: chat.v1.PresenceStatus;

            /** GuildMember role. */
            public role: string;

            /** GuildMember avatarUrl. */
            public avatarUrl: string;

            /** GuildMember bio. */
            public bio: string;

            /** GuildMember pronouns. */
            public pronouns: string;

            /** GuildMember bannerUrl. */
            public bannerUrl: string;

            /** GuildMember bannerColor. */
            public bannerColor: string;

            /** GuildMember createdAt. */
            public createdAt: string;

            /**
             * Creates a new GuildMember instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GuildMember instance
             */
            public static create(properties?: chat.v1.IGuildMember): chat.v1.GuildMember;

            /**
             * Encodes the specified GuildMember message. Does not implicitly {@link chat.v1.GuildMember.verify|verify} messages.
             * @param message GuildMember message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IGuildMember, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GuildMember message, length delimited. Does not implicitly {@link chat.v1.GuildMember.verify|verify} messages.
             * @param message GuildMember message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IGuildMember, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GuildMember message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GuildMember
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.GuildMember;

            /**
             * Decodes a GuildMember message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GuildMember
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.GuildMember;

            /**
             * Verifies a GuildMember message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GuildMember message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GuildMember
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.GuildMember;

            /**
             * Creates a plain object from a GuildMember message. Also converts values to other types if specified.
             * @param message GuildMember
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.GuildMember, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GuildMember to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for GuildMember
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Channel. */
        interface IChannel {

            /** Channel id */
            id?: (string|null);

            /** Channel guildId */
            guildId?: (string|null);

            /** Channel name */
            name?: (string|null);

            /** Channel topic */
            topic?: (string|null);

            /** Channel kind */
            kind?: (chat.v1.ChannelKind|null);

            /** Channel position */
            position?: (number|null);
        }

        /** Represents a Channel. */
        class Channel implements IChannel {

            /**
             * Constructs a new Channel.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IChannel);

            /** Channel id. */
            public id: string;

            /** Channel guildId. */
            public guildId: string;

            /** Channel name. */
            public name: string;

            /** Channel topic. */
            public topic: string;

            /** Channel kind. */
            public kind: chat.v1.ChannelKind;

            /** Channel position. */
            public position: number;

            /**
             * Creates a new Channel instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Channel instance
             */
            public static create(properties?: chat.v1.IChannel): chat.v1.Channel;

            /**
             * Encodes the specified Channel message. Does not implicitly {@link chat.v1.Channel.verify|verify} messages.
             * @param message Channel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IChannel, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Channel message, length delimited. Does not implicitly {@link chat.v1.Channel.verify|verify} messages.
             * @param message Channel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IChannel, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Channel message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Channel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.Channel;

            /**
             * Decodes a Channel message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Channel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.Channel;

            /**
             * Verifies a Channel message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Channel message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Channel
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.Channel;

            /**
             * Creates a plain object from a Channel message. Also converts values to other types if specified.
             * @param message Channel
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.Channel, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Channel to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Channel
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Guild. */
        interface IGuild {

            /** Guild id */
            id?: (string|null);

            /** Guild name */
            name?: (string|null);

            /** Guild iconColor */
            iconColor?: (string|null);

            /** Guild channels */
            channels?: (chat.v1.IChannel[]|null);

            /** Guild members */
            members?: (chat.v1.IGuildMember[]|null);

            /** Guild currentUserRole */
            currentUserRole?: (string|null);
        }

        /** Represents a Guild. */
        class Guild implements IGuild {

            /**
             * Constructs a new Guild.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IGuild);

            /** Guild id. */
            public id: string;

            /** Guild name. */
            public name: string;

            /** Guild iconColor. */
            public iconColor: string;

            /** Guild channels. */
            public channels: chat.v1.IChannel[];

            /** Guild members. */
            public members: chat.v1.IGuildMember[];

            /** Guild currentUserRole. */
            public currentUserRole: string;

            /**
             * Creates a new Guild instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Guild instance
             */
            public static create(properties?: chat.v1.IGuild): chat.v1.Guild;

            /**
             * Encodes the specified Guild message. Does not implicitly {@link chat.v1.Guild.verify|verify} messages.
             * @param message Guild message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IGuild, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Guild message, length delimited. Does not implicitly {@link chat.v1.Guild.verify|verify} messages.
             * @param message Guild message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IGuild, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Guild message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Guild
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.Guild;

            /**
             * Decodes a Guild message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Guild
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.Guild;

            /**
             * Verifies a Guild message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Guild message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Guild
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.Guild;

            /**
             * Creates a plain object from a Guild message. Also converts values to other types if specified.
             * @param message Guild
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.Guild, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Guild to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Guild
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an Authenticate. */
        interface IAuthenticate {

            /** Authenticate token */
            token?: (string|null);

            /** Authenticate clientVersion */
            clientVersion?: (string|null);
        }

        /** Represents an Authenticate. */
        class Authenticate implements IAuthenticate {

            /**
             * Constructs a new Authenticate.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IAuthenticate);

            /** Authenticate token. */
            public token: string;

            /** Authenticate clientVersion. */
            public clientVersion: string;

            /**
             * Creates a new Authenticate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Authenticate instance
             */
            public static create(properties?: chat.v1.IAuthenticate): chat.v1.Authenticate;

            /**
             * Encodes the specified Authenticate message. Does not implicitly {@link chat.v1.Authenticate.verify|verify} messages.
             * @param message Authenticate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IAuthenticate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Authenticate message, length delimited. Does not implicitly {@link chat.v1.Authenticate.verify|verify} messages.
             * @param message Authenticate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IAuthenticate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Authenticate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Authenticate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.Authenticate;

            /**
             * Decodes an Authenticate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Authenticate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.Authenticate;

            /**
             * Verifies an Authenticate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Authenticate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Authenticate
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.Authenticate;

            /**
             * Creates a plain object from an Authenticate message. Also converts values to other types if specified.
             * @param message Authenticate
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.Authenticate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Authenticate to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Authenticate
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an Authenticated. */
        interface IAuthenticated {

            /** Authenticated user */
            user?: (chat.v1.IUser|null);

            /** Authenticated guilds */
            guilds?: (chat.v1.IGuild[]|null);

            /** Authenticated sessionId */
            sessionId?: (string|null);
        }

        /** Represents an Authenticated. */
        class Authenticated implements IAuthenticated {

            /**
             * Constructs a new Authenticated.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IAuthenticated);

            /** Authenticated user. */
            public user?: (chat.v1.IUser|null);

            /** Authenticated guilds. */
            public guilds: chat.v1.IGuild[];

            /** Authenticated sessionId. */
            public sessionId: string;

            /**
             * Creates a new Authenticated instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Authenticated instance
             */
            public static create(properties?: chat.v1.IAuthenticated): chat.v1.Authenticated;

            /**
             * Encodes the specified Authenticated message. Does not implicitly {@link chat.v1.Authenticated.verify|verify} messages.
             * @param message Authenticated message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IAuthenticated, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Authenticated message, length delimited. Does not implicitly {@link chat.v1.Authenticated.verify|verify} messages.
             * @param message Authenticated message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IAuthenticated, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Authenticated message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Authenticated
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.Authenticated;

            /**
             * Decodes an Authenticated message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Authenticated
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.Authenticated;

            /**
             * Verifies an Authenticated message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Authenticated message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Authenticated
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.Authenticated;

            /**
             * Creates a plain object from an Authenticated message. Also converts values to other types if specified.
             * @param message Authenticated
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.Authenticated, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Authenticated to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Authenticated
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Subscribe. */
        interface ISubscribe {

            /** Subscribe channelIds */
            channelIds?: (string[]|null);
        }

        /** Represents a Subscribe. */
        class Subscribe implements ISubscribe {

            /**
             * Constructs a new Subscribe.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.ISubscribe);

            /** Subscribe channelIds. */
            public channelIds: string[];

            /**
             * Creates a new Subscribe instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Subscribe instance
             */
            public static create(properties?: chat.v1.ISubscribe): chat.v1.Subscribe;

            /**
             * Encodes the specified Subscribe message. Does not implicitly {@link chat.v1.Subscribe.verify|verify} messages.
             * @param message Subscribe message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.ISubscribe, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Subscribe message, length delimited. Does not implicitly {@link chat.v1.Subscribe.verify|verify} messages.
             * @param message Subscribe message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.ISubscribe, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Subscribe message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Subscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.Subscribe;

            /**
             * Decodes a Subscribe message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Subscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.Subscribe;

            /**
             * Verifies a Subscribe message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Subscribe message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Subscribe
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.Subscribe;

            /**
             * Creates a plain object from a Subscribe message. Also converts values to other types if specified.
             * @param message Subscribe
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.Subscribe, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Subscribe to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Subscribe
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an Unsubscribe. */
        interface IUnsubscribe {

            /** Unsubscribe channelIds */
            channelIds?: (string[]|null);
        }

        /** Represents an Unsubscribe. */
        class Unsubscribe implements IUnsubscribe {

            /**
             * Constructs a new Unsubscribe.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IUnsubscribe);

            /** Unsubscribe channelIds. */
            public channelIds: string[];

            /**
             * Creates a new Unsubscribe instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Unsubscribe instance
             */
            public static create(properties?: chat.v1.IUnsubscribe): chat.v1.Unsubscribe;

            /**
             * Encodes the specified Unsubscribe message. Does not implicitly {@link chat.v1.Unsubscribe.verify|verify} messages.
             * @param message Unsubscribe message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IUnsubscribe, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Unsubscribe message, length delimited. Does not implicitly {@link chat.v1.Unsubscribe.verify|verify} messages.
             * @param message Unsubscribe message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IUnsubscribe, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Unsubscribe message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Unsubscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.Unsubscribe;

            /**
             * Decodes an Unsubscribe message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Unsubscribe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.Unsubscribe;

            /**
             * Verifies an Unsubscribe message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Unsubscribe message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Unsubscribe
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.Unsubscribe;

            /**
             * Creates a plain object from an Unsubscribe message. Also converts values to other types if specified.
             * @param message Unsubscribe
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.Unsubscribe, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Unsubscribe to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Unsubscribe
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SendMessage. */
        interface ISendMessage {

            /** SendMessage channelId */
            channelId?: (string|null);

            /** SendMessage content */
            content?: (string|null);

            /** SendMessage attachments */
            attachments?: (string[]|null);

            /** SendMessage clientId */
            clientId?: (string|null);
        }

        /** Represents a SendMessage. */
        class SendMessage implements ISendMessage {

            /**
             * Constructs a new SendMessage.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.ISendMessage);

            /** SendMessage channelId. */
            public channelId: string;

            /** SendMessage content. */
            public content: string;

            /** SendMessage attachments. */
            public attachments: string[];

            /** SendMessage clientId. */
            public clientId: string;

            /**
             * Creates a new SendMessage instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SendMessage instance
             */
            public static create(properties?: chat.v1.ISendMessage): chat.v1.SendMessage;

            /**
             * Encodes the specified SendMessage message. Does not implicitly {@link chat.v1.SendMessage.verify|verify} messages.
             * @param message SendMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.ISendMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SendMessage message, length delimited. Does not implicitly {@link chat.v1.SendMessage.verify|verify} messages.
             * @param message SendMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.ISendMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SendMessage message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SendMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.SendMessage;

            /**
             * Decodes a SendMessage message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SendMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.SendMessage;

            /**
             * Verifies a SendMessage message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SendMessage message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SendMessage
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.SendMessage;

            /**
             * Creates a plain object from a SendMessage message. Also converts values to other types if specified.
             * @param message SendMessage
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.SendMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SendMessage to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SendMessage
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Heartbeat. */
        interface IHeartbeat {

            /** Heartbeat status */
            status?: (chat.v1.PresenceStatus|null);
        }

        /** Represents a Heartbeat. */
        class Heartbeat implements IHeartbeat {

            /**
             * Constructs a new Heartbeat.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IHeartbeat);

            /** Heartbeat status. */
            public status: chat.v1.PresenceStatus;

            /**
             * Creates a new Heartbeat instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Heartbeat instance
             */
            public static create(properties?: chat.v1.IHeartbeat): chat.v1.Heartbeat;

            /**
             * Encodes the specified Heartbeat message. Does not implicitly {@link chat.v1.Heartbeat.verify|verify} messages.
             * @param message Heartbeat message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IHeartbeat, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Heartbeat message, length delimited. Does not implicitly {@link chat.v1.Heartbeat.verify|verify} messages.
             * @param message Heartbeat message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IHeartbeat, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Heartbeat message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Heartbeat
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.Heartbeat;

            /**
             * Decodes a Heartbeat message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Heartbeat
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.Heartbeat;

            /**
             * Verifies a Heartbeat message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Heartbeat message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Heartbeat
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.Heartbeat;

            /**
             * Creates a plain object from a Heartbeat message. Also converts values to other types if specified.
             * @param message Heartbeat
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.Heartbeat, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Heartbeat to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Heartbeat
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SetPresence. */
        interface ISetPresence {

            /** SetPresence status */
            status?: (chat.v1.PresenceStatus|null);
        }

        /** Represents a SetPresence. */
        class SetPresence implements ISetPresence {

            /**
             * Constructs a new SetPresence.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.ISetPresence);

            /** SetPresence status. */
            public status: chat.v1.PresenceStatus;

            /**
             * Creates a new SetPresence instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SetPresence instance
             */
            public static create(properties?: chat.v1.ISetPresence): chat.v1.SetPresence;

            /**
             * Encodes the specified SetPresence message. Does not implicitly {@link chat.v1.SetPresence.verify|verify} messages.
             * @param message SetPresence message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.ISetPresence, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SetPresence message, length delimited. Does not implicitly {@link chat.v1.SetPresence.verify|verify} messages.
             * @param message SetPresence message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.ISetPresence, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SetPresence message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SetPresence
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.SetPresence;

            /**
             * Decodes a SetPresence message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SetPresence
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.SetPresence;

            /**
             * Verifies a SetPresence message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SetPresence message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SetPresence
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.SetPresence;

            /**
             * Creates a plain object from a SetPresence message. Also converts values to other types if specified.
             * @param message SetPresence
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.SetPresence, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SetPresence to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SetPresence
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Typing. */
        interface ITyping {

            /** Typing channelId */
            channelId?: (string|null);

            /** Typing active */
            active?: (boolean|null);
        }

        /** Represents a Typing. */
        class Typing implements ITyping {

            /**
             * Constructs a new Typing.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.ITyping);

            /** Typing channelId. */
            public channelId: string;

            /** Typing active. */
            public active: boolean;

            /**
             * Creates a new Typing instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Typing instance
             */
            public static create(properties?: chat.v1.ITyping): chat.v1.Typing;

            /**
             * Encodes the specified Typing message. Does not implicitly {@link chat.v1.Typing.verify|verify} messages.
             * @param message Typing message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.ITyping, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Typing message, length delimited. Does not implicitly {@link chat.v1.Typing.verify|verify} messages.
             * @param message Typing message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.ITyping, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Typing message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Typing
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.Typing;

            /**
             * Decodes a Typing message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Typing
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.Typing;

            /**
             * Verifies a Typing message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Typing message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Typing
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.Typing;

            /**
             * Creates a plain object from a Typing message. Also converts values to other types if specified.
             * @param message Typing
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.Typing, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Typing to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Typing
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ChatMessage. */
        interface IChatMessage {

            /** ChatMessage id */
            id?: (number|Long|null);

            /** ChatMessage channelId */
            channelId?: (string|null);

            /** ChatMessage guildId */
            guildId?: (string|null);

            /** ChatMessage authorId */
            authorId?: (string|null);

            /** ChatMessage authorName */
            authorName?: (string|null);

            /** ChatMessage authorColor */
            authorColor?: (string|null);

            /** ChatMessage content */
            content?: (string|null);

            /** ChatMessage attachments */
            attachments?: (string[]|null);

            /** ChatMessage timestampMs */
            timestampMs?: (number|Long|null);

            /** ChatMessage clientId */
            clientId?: (string|null);

            /** ChatMessage authorAvatarUrl */
            authorAvatarUrl?: (string|null);
        }

        /** Represents a ChatMessage. */
        class ChatMessage implements IChatMessage {

            /**
             * Constructs a new ChatMessage.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IChatMessage);

            /** ChatMessage id. */
            public id: (number|Long);

            /** ChatMessage channelId. */
            public channelId: string;

            /** ChatMessage guildId. */
            public guildId: string;

            /** ChatMessage authorId. */
            public authorId: string;

            /** ChatMessage authorName. */
            public authorName: string;

            /** ChatMessage authorColor. */
            public authorColor: string;

            /** ChatMessage content. */
            public content: string;

            /** ChatMessage attachments. */
            public attachments: string[];

            /** ChatMessage timestampMs. */
            public timestampMs: (number|Long);

            /** ChatMessage clientId. */
            public clientId: string;

            /** ChatMessage authorAvatarUrl. */
            public authorAvatarUrl: string;

            /**
             * Creates a new ChatMessage instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ChatMessage instance
             */
            public static create(properties?: chat.v1.IChatMessage): chat.v1.ChatMessage;

            /**
             * Encodes the specified ChatMessage message. Does not implicitly {@link chat.v1.ChatMessage.verify|verify} messages.
             * @param message ChatMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IChatMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ChatMessage message, length delimited. Does not implicitly {@link chat.v1.ChatMessage.verify|verify} messages.
             * @param message ChatMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IChatMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ChatMessage message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ChatMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.ChatMessage;

            /**
             * Decodes a ChatMessage message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ChatMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.ChatMessage;

            /**
             * Verifies a ChatMessage message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ChatMessage
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.ChatMessage;

            /**
             * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
             * @param message ChatMessage
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.ChatMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ChatMessage to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ChatMessage
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CallParticipant. */
        interface ICallParticipant {

            /** CallParticipant sessionId */
            sessionId?: (string|null);

            /** CallParticipant userId */
            userId?: (string|null);

            /** CallParticipant displayName */
            displayName?: (string|null);

            /** CallParticipant avatarUrl */
            avatarUrl?: (string|null);

            /** CallParticipant avatarColor */
            avatarColor?: (string|null);

            /** CallParticipant video */
            video?: (boolean|null);

            /** CallParticipant muted */
            muted?: (boolean|null);

            /** CallParticipant deafened */
            deafened?: (boolean|null);

            /** CallParticipant screenSharing */
            screenSharing?: (boolean|null);
        }

        /** Represents a CallParticipant. */
        class CallParticipant implements ICallParticipant {

            /**
             * Constructs a new CallParticipant.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.ICallParticipant);

            /** CallParticipant sessionId. */
            public sessionId: string;

            /** CallParticipant userId. */
            public userId: string;

            /** CallParticipant displayName. */
            public displayName: string;

            /** CallParticipant avatarUrl. */
            public avatarUrl: string;

            /** CallParticipant avatarColor. */
            public avatarColor: string;

            /** CallParticipant video. */
            public video: boolean;

            /** CallParticipant muted. */
            public muted: boolean;

            /** CallParticipant deafened. */
            public deafened: boolean;

            /** CallParticipant screenSharing. */
            public screenSharing: boolean;

            /**
             * Creates a new CallParticipant instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CallParticipant instance
             */
            public static create(properties?: chat.v1.ICallParticipant): chat.v1.CallParticipant;

            /**
             * Encodes the specified CallParticipant message. Does not implicitly {@link chat.v1.CallParticipant.verify|verify} messages.
             * @param message CallParticipant message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.ICallParticipant, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CallParticipant message, length delimited. Does not implicitly {@link chat.v1.CallParticipant.verify|verify} messages.
             * @param message CallParticipant message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.ICallParticipant, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CallParticipant message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CallParticipant
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.CallParticipant;

            /**
             * Decodes a CallParticipant message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CallParticipant
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.CallParticipant;

            /**
             * Verifies a CallParticipant message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CallParticipant message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CallParticipant
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.CallParticipant;

            /**
             * Creates a plain object from a CallParticipant message. Also converts values to other types if specified.
             * @param message CallParticipant
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.CallParticipant, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CallParticipant to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CallParticipant
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CallSnapshot. */
        interface ICallSnapshot {

            /** CallSnapshot channelId */
            channelId?: (string|null);

            /** CallSnapshot selfSessionId */
            selfSessionId?: (string|null);

            /** CallSnapshot participants */
            participants?: (chat.v1.ICallParticipant[]|null);
        }

        /** Represents a CallSnapshot. */
        class CallSnapshot implements ICallSnapshot {

            /**
             * Constructs a new CallSnapshot.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.ICallSnapshot);

            /** CallSnapshot channelId. */
            public channelId: string;

            /** CallSnapshot selfSessionId. */
            public selfSessionId: string;

            /** CallSnapshot participants. */
            public participants: chat.v1.ICallParticipant[];

            /**
             * Creates a new CallSnapshot instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CallSnapshot instance
             */
            public static create(properties?: chat.v1.ICallSnapshot): chat.v1.CallSnapshot;

            /**
             * Encodes the specified CallSnapshot message. Does not implicitly {@link chat.v1.CallSnapshot.verify|verify} messages.
             * @param message CallSnapshot message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.ICallSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CallSnapshot message, length delimited. Does not implicitly {@link chat.v1.CallSnapshot.verify|verify} messages.
             * @param message CallSnapshot message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.ICallSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CallSnapshot message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CallSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.CallSnapshot;

            /**
             * Decodes a CallSnapshot message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CallSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.CallSnapshot;

            /**
             * Verifies a CallSnapshot message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CallSnapshot message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CallSnapshot
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.CallSnapshot;

            /**
             * Creates a plain object from a CallSnapshot message. Also converts values to other types if specified.
             * @param message CallSnapshot
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.CallSnapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CallSnapshot to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CallSnapshot
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CallEvent. */
        interface ICallEvent {

            /** CallEvent channelId */
            channelId?: (string|null);

            /** CallEvent fromSessionId */
            fromSessionId?: (string|null);

            /** CallEvent fromUserId */
            fromUserId?: (string|null);

            /** CallEvent fromDisplayName */
            fromDisplayName?: (string|null);

            /** CallEvent fromAvatarUrl */
            fromAvatarUrl?: (string|null);

            /** CallEvent fromAvatarColor */
            fromAvatarColor?: (string|null);

            /** CallEvent targetSessionId */
            targetSessionId?: (string|null);

            /** CallEvent type */
            type?: (chat.v1.CallEventType|null);

            /** CallEvent sdp */
            sdp?: (string|null);

            /** CallEvent candidate */
            candidate?: (string|null);

            /** CallEvent video */
            video?: (boolean|null);

            /** CallEvent muted */
            muted?: (boolean|null);

            /** CallEvent deafened */
            deafened?: (boolean|null);

            /** CallEvent screenSharing */
            screenSharing?: (boolean|null);
        }

        /** Represents a CallEvent. */
        class CallEvent implements ICallEvent {

            /**
             * Constructs a new CallEvent.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.ICallEvent);

            /** CallEvent channelId. */
            public channelId: string;

            /** CallEvent fromSessionId. */
            public fromSessionId: string;

            /** CallEvent fromUserId. */
            public fromUserId: string;

            /** CallEvent fromDisplayName. */
            public fromDisplayName: string;

            /** CallEvent fromAvatarUrl. */
            public fromAvatarUrl: string;

            /** CallEvent fromAvatarColor. */
            public fromAvatarColor: string;

            /** CallEvent targetSessionId. */
            public targetSessionId: string;

            /** CallEvent type. */
            public type: chat.v1.CallEventType;

            /** CallEvent sdp. */
            public sdp: string;

            /** CallEvent candidate. */
            public candidate: string;

            /** CallEvent video. */
            public video: boolean;

            /** CallEvent muted. */
            public muted: boolean;

            /** CallEvent deafened. */
            public deafened: boolean;

            /** CallEvent screenSharing. */
            public screenSharing: boolean;

            /**
             * Creates a new CallEvent instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CallEvent instance
             */
            public static create(properties?: chat.v1.ICallEvent): chat.v1.CallEvent;

            /**
             * Encodes the specified CallEvent message. Does not implicitly {@link chat.v1.CallEvent.verify|verify} messages.
             * @param message CallEvent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.ICallEvent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CallEvent message, length delimited. Does not implicitly {@link chat.v1.CallEvent.verify|verify} messages.
             * @param message CallEvent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.ICallEvent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CallEvent message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CallEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.CallEvent;

            /**
             * Decodes a CallEvent message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CallEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.CallEvent;

            /**
             * Verifies a CallEvent message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CallEvent message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CallEvent
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.CallEvent;

            /**
             * Creates a plain object from a CallEvent message. Also converts values to other types if specified.
             * @param message CallEvent
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.CallEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CallEvent to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CallEvent
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a JoinCall. */
        interface IJoinCall {

            /** JoinCall channelId */
            channelId?: (string|null);

            /** JoinCall video */
            video?: (boolean|null);

            /** JoinCall muted */
            muted?: (boolean|null);

            /** JoinCall deafened */
            deafened?: (boolean|null);
        }

        /** Represents a JoinCall. */
        class JoinCall implements IJoinCall {

            /**
             * Constructs a new JoinCall.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IJoinCall);

            /** JoinCall channelId. */
            public channelId: string;

            /** JoinCall video. */
            public video: boolean;

            /** JoinCall muted. */
            public muted: boolean;

            /** JoinCall deafened. */
            public deafened: boolean;

            /**
             * Creates a new JoinCall instance using the specified properties.
             * @param [properties] Properties to set
             * @returns JoinCall instance
             */
            public static create(properties?: chat.v1.IJoinCall): chat.v1.JoinCall;

            /**
             * Encodes the specified JoinCall message. Does not implicitly {@link chat.v1.JoinCall.verify|verify} messages.
             * @param message JoinCall message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IJoinCall, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified JoinCall message, length delimited. Does not implicitly {@link chat.v1.JoinCall.verify|verify} messages.
             * @param message JoinCall message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IJoinCall, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a JoinCall message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns JoinCall
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.JoinCall;

            /**
             * Decodes a JoinCall message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns JoinCall
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.JoinCall;

            /**
             * Verifies a JoinCall message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a JoinCall message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns JoinCall
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.JoinCall;

            /**
             * Creates a plain object from a JoinCall message. Also converts values to other types if specified.
             * @param message JoinCall
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.JoinCall, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this JoinCall to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for JoinCall
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a LeaveCall. */
        interface ILeaveCall {

            /** LeaveCall channelId */
            channelId?: (string|null);
        }

        /** Represents a LeaveCall. */
        class LeaveCall implements ILeaveCall {

            /**
             * Constructs a new LeaveCall.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.ILeaveCall);

            /** LeaveCall channelId. */
            public channelId: string;

            /**
             * Creates a new LeaveCall instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LeaveCall instance
             */
            public static create(properties?: chat.v1.ILeaveCall): chat.v1.LeaveCall;

            /**
             * Encodes the specified LeaveCall message. Does not implicitly {@link chat.v1.LeaveCall.verify|verify} messages.
             * @param message LeaveCall message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.ILeaveCall, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LeaveCall message, length delimited. Does not implicitly {@link chat.v1.LeaveCall.verify|verify} messages.
             * @param message LeaveCall message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.ILeaveCall, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LeaveCall message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LeaveCall
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.LeaveCall;

            /**
             * Decodes a LeaveCall message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LeaveCall
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.LeaveCall;

            /**
             * Verifies a LeaveCall message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LeaveCall message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LeaveCall
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.LeaveCall;

            /**
             * Creates a plain object from a LeaveCall message. Also converts values to other types if specified.
             * @param message LeaveCall
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.LeaveCall, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LeaveCall to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LeaveCall
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CallSignal. */
        interface ICallSignal {

            /** CallSignal channelId */
            channelId?: (string|null);

            /** CallSignal targetSessionId */
            targetSessionId?: (string|null);

            /** CallSignal type */
            type?: (chat.v1.CallEventType|null);

            /** CallSignal sdp */
            sdp?: (string|null);

            /** CallSignal candidate */
            candidate?: (string|null);
        }

        /** Represents a CallSignal. */
        class CallSignal implements ICallSignal {

            /**
             * Constructs a new CallSignal.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.ICallSignal);

            /** CallSignal channelId. */
            public channelId: string;

            /** CallSignal targetSessionId. */
            public targetSessionId: string;

            /** CallSignal type. */
            public type: chat.v1.CallEventType;

            /** CallSignal sdp. */
            public sdp: string;

            /** CallSignal candidate. */
            public candidate: string;

            /**
             * Creates a new CallSignal instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CallSignal instance
             */
            public static create(properties?: chat.v1.ICallSignal): chat.v1.CallSignal;

            /**
             * Encodes the specified CallSignal message. Does not implicitly {@link chat.v1.CallSignal.verify|verify} messages.
             * @param message CallSignal message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.ICallSignal, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CallSignal message, length delimited. Does not implicitly {@link chat.v1.CallSignal.verify|verify} messages.
             * @param message CallSignal message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.ICallSignal, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CallSignal message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CallSignal
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.CallSignal;

            /**
             * Decodes a CallSignal message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CallSignal
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.CallSignal;

            /**
             * Verifies a CallSignal message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CallSignal message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CallSignal
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.CallSignal;

            /**
             * Creates a plain object from a CallSignal message. Also converts values to other types if specified.
             * @param message CallSignal
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.CallSignal, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CallSignal to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CallSignal
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CallMedia. */
        interface ICallMedia {

            /** CallMedia channelId */
            channelId?: (string|null);

            /** CallMedia video */
            video?: (boolean|null);

            /** CallMedia muted */
            muted?: (boolean|null);

            /** CallMedia deafened */
            deafened?: (boolean|null);

            /** CallMedia screenSharing */
            screenSharing?: (boolean|null);
        }

        /** Represents a CallMedia. */
        class CallMedia implements ICallMedia {

            /**
             * Constructs a new CallMedia.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.ICallMedia);

            /** CallMedia channelId. */
            public channelId: string;

            /** CallMedia video. */
            public video: boolean;

            /** CallMedia muted. */
            public muted: boolean;

            /** CallMedia deafened. */
            public deafened: boolean;

            /** CallMedia screenSharing. */
            public screenSharing: boolean;

            /**
             * Creates a new CallMedia instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CallMedia instance
             */
            public static create(properties?: chat.v1.ICallMedia): chat.v1.CallMedia;

            /**
             * Encodes the specified CallMedia message. Does not implicitly {@link chat.v1.CallMedia.verify|verify} messages.
             * @param message CallMedia message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.ICallMedia, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CallMedia message, length delimited. Does not implicitly {@link chat.v1.CallMedia.verify|verify} messages.
             * @param message CallMedia message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.ICallMedia, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CallMedia message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CallMedia
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.CallMedia;

            /**
             * Decodes a CallMedia message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CallMedia
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.CallMedia;

            /**
             * Verifies a CallMedia message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CallMedia message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CallMedia
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.CallMedia;

            /**
             * Creates a plain object from a CallMedia message. Also converts values to other types if specified.
             * @param message CallMedia
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.CallMedia, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CallMedia to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CallMedia
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a MessageAck. */
        interface IMessageAck {

            /** MessageAck channelId */
            channelId?: (string|null);

            /** MessageAck clientId */
            clientId?: (string|null);

            /** MessageAck messageId */
            messageId?: (number|Long|null);

            /** MessageAck status */
            status?: (chat.v1.AckStatus|null);

            /** MessageAck timestampMs */
            timestampMs?: (number|Long|null);

            /** MessageAck error */
            error?: (string|null);

            /** MessageAck retryable */
            retryable?: (boolean|null);
        }

        /** Represents a MessageAck. */
        class MessageAck implements IMessageAck {

            /**
             * Constructs a new MessageAck.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IMessageAck);

            /** MessageAck channelId. */
            public channelId: string;

            /** MessageAck clientId. */
            public clientId: string;

            /** MessageAck messageId. */
            public messageId: (number|Long);

            /** MessageAck status. */
            public status: chat.v1.AckStatus;

            /** MessageAck timestampMs. */
            public timestampMs: (number|Long);

            /** MessageAck error. */
            public error: string;

            /** MessageAck retryable. */
            public retryable: boolean;

            /**
             * Creates a new MessageAck instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MessageAck instance
             */
            public static create(properties?: chat.v1.IMessageAck): chat.v1.MessageAck;

            /**
             * Encodes the specified MessageAck message. Does not implicitly {@link chat.v1.MessageAck.verify|verify} messages.
             * @param message MessageAck message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IMessageAck, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MessageAck message, length delimited. Does not implicitly {@link chat.v1.MessageAck.verify|verify} messages.
             * @param message MessageAck message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IMessageAck, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MessageAck message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MessageAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.MessageAck;

            /**
             * Decodes a MessageAck message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MessageAck
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.MessageAck;

            /**
             * Verifies a MessageAck message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MessageAck message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MessageAck
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.MessageAck;

            /**
             * Creates a plain object from a MessageAck message. Also converts values to other types if specified.
             * @param message MessageAck
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.MessageAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MessageAck to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for MessageAck
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a PresenceEvent. */
        interface IPresenceEvent {

            /** PresenceEvent guildId */
            guildId?: (string|null);

            /** PresenceEvent userId */
            userId?: (string|null);

            /** PresenceEvent status */
            status?: (chat.v1.PresenceStatus|null);

            /** PresenceEvent updatedAtMs */
            updatedAtMs?: (number|Long|null);
        }

        /** Represents a PresenceEvent. */
        class PresenceEvent implements IPresenceEvent {

            /**
             * Constructs a new PresenceEvent.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IPresenceEvent);

            /** PresenceEvent guildId. */
            public guildId: string;

            /** PresenceEvent userId. */
            public userId: string;

            /** PresenceEvent status. */
            public status: chat.v1.PresenceStatus;

            /** PresenceEvent updatedAtMs. */
            public updatedAtMs: (number|Long);

            /**
             * Creates a new PresenceEvent instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PresenceEvent instance
             */
            public static create(properties?: chat.v1.IPresenceEvent): chat.v1.PresenceEvent;

            /**
             * Encodes the specified PresenceEvent message. Does not implicitly {@link chat.v1.PresenceEvent.verify|verify} messages.
             * @param message PresenceEvent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IPresenceEvent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PresenceEvent message, length delimited. Does not implicitly {@link chat.v1.PresenceEvent.verify|verify} messages.
             * @param message PresenceEvent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IPresenceEvent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PresenceEvent message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PresenceEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.PresenceEvent;

            /**
             * Decodes a PresenceEvent message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PresenceEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.PresenceEvent;

            /**
             * Verifies a PresenceEvent message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PresenceEvent message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PresenceEvent
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.PresenceEvent;

            /**
             * Creates a plain object from a PresenceEvent message. Also converts values to other types if specified.
             * @param message PresenceEvent
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.PresenceEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PresenceEvent to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PresenceEvent
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a PresenceSnapshot. */
        interface IPresenceSnapshot {

            /** PresenceSnapshot statuses */
            statuses?: (chat.v1.IPresenceEvent[]|null);
        }

        /** Represents a PresenceSnapshot. */
        class PresenceSnapshot implements IPresenceSnapshot {

            /**
             * Constructs a new PresenceSnapshot.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IPresenceSnapshot);

            /** PresenceSnapshot statuses. */
            public statuses: chat.v1.IPresenceEvent[];

            /**
             * Creates a new PresenceSnapshot instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PresenceSnapshot instance
             */
            public static create(properties?: chat.v1.IPresenceSnapshot): chat.v1.PresenceSnapshot;

            /**
             * Encodes the specified PresenceSnapshot message. Does not implicitly {@link chat.v1.PresenceSnapshot.verify|verify} messages.
             * @param message PresenceSnapshot message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IPresenceSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PresenceSnapshot message, length delimited. Does not implicitly {@link chat.v1.PresenceSnapshot.verify|verify} messages.
             * @param message PresenceSnapshot message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IPresenceSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PresenceSnapshot message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PresenceSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.PresenceSnapshot;

            /**
             * Decodes a PresenceSnapshot message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PresenceSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.PresenceSnapshot;

            /**
             * Verifies a PresenceSnapshot message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PresenceSnapshot message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PresenceSnapshot
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.PresenceSnapshot;

            /**
             * Creates a plain object from a PresenceSnapshot message. Also converts values to other types if specified.
             * @param message PresenceSnapshot
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.PresenceSnapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PresenceSnapshot to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PresenceSnapshot
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a TypingEvent. */
        interface ITypingEvent {

            /** TypingEvent channelId */
            channelId?: (string|null);

            /** TypingEvent userId */
            userId?: (string|null);

            /** TypingEvent displayName */
            displayName?: (string|null);

            /** TypingEvent active */
            active?: (boolean|null);
        }

        /** Represents a TypingEvent. */
        class TypingEvent implements ITypingEvent {

            /**
             * Constructs a new TypingEvent.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.ITypingEvent);

            /** TypingEvent channelId. */
            public channelId: string;

            /** TypingEvent userId. */
            public userId: string;

            /** TypingEvent displayName. */
            public displayName: string;

            /** TypingEvent active. */
            public active: boolean;

            /**
             * Creates a new TypingEvent instance using the specified properties.
             * @param [properties] Properties to set
             * @returns TypingEvent instance
             */
            public static create(properties?: chat.v1.ITypingEvent): chat.v1.TypingEvent;

            /**
             * Encodes the specified TypingEvent message. Does not implicitly {@link chat.v1.TypingEvent.verify|verify} messages.
             * @param message TypingEvent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.ITypingEvent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified TypingEvent message, length delimited. Does not implicitly {@link chat.v1.TypingEvent.verify|verify} messages.
             * @param message TypingEvent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.ITypingEvent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a TypingEvent message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns TypingEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.TypingEvent;

            /**
             * Decodes a TypingEvent message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TypingEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.TypingEvent;

            /**
             * Verifies a TypingEvent message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a TypingEvent message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns TypingEvent
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.TypingEvent;

            /**
             * Creates a plain object from a TypingEvent message. Also converts values to other types if specified.
             * @param message TypingEvent
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.TypingEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this TypingEvent to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for TypingEvent
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ServerError. */
        interface IServerError {

            /** ServerError code */
            code?: (string|null);

            /** ServerError message */
            message?: (string|null);

            /** ServerError retryable */
            retryable?: (boolean|null);
        }

        /** Represents a ServerError. */
        class ServerError implements IServerError {

            /**
             * Constructs a new ServerError.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IServerError);

            /** ServerError code. */
            public code: string;

            /** ServerError message. */
            public message: string;

            /** ServerError retryable. */
            public retryable: boolean;

            /**
             * Creates a new ServerError instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServerError instance
             */
            public static create(properties?: chat.v1.IServerError): chat.v1.ServerError;

            /**
             * Encodes the specified ServerError message. Does not implicitly {@link chat.v1.ServerError.verify|verify} messages.
             * @param message ServerError message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IServerError, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServerError message, length delimited. Does not implicitly {@link chat.v1.ServerError.verify|verify} messages.
             * @param message ServerError message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IServerError, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServerError message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServerError
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.ServerError;

            /**
             * Decodes a ServerError message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServerError
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.ServerError;

            /**
             * Verifies a ServerError message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServerError message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServerError
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.ServerError;

            /**
             * Creates a plain object from a ServerError message. Also converts values to other types if specified.
             * @param message ServerError
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.ServerError, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServerError to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ServerError
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Pong. */
        interface IPong {

            /** Pong serverTimeMs */
            serverTimeMs?: (number|Long|null);

            /** Pong status */
            status?: (chat.v1.PresenceStatus|null);
        }

        /** Represents a Pong. */
        class Pong implements IPong {

            /**
             * Constructs a new Pong.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IPong);

            /** Pong serverTimeMs. */
            public serverTimeMs: (number|Long);

            /** Pong status. */
            public status: chat.v1.PresenceStatus;

            /**
             * Creates a new Pong instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Pong instance
             */
            public static create(properties?: chat.v1.IPong): chat.v1.Pong;

            /**
             * Encodes the specified Pong message. Does not implicitly {@link chat.v1.Pong.verify|verify} messages.
             * @param message Pong message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IPong, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Pong message, length delimited. Does not implicitly {@link chat.v1.Pong.verify|verify} messages.
             * @param message Pong message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IPong, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Pong message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Pong
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.Pong;

            /**
             * Decodes a Pong message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Pong
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.Pong;

            /**
             * Verifies a Pong message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Pong message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Pong
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.Pong;

            /**
             * Creates a plain object from a Pong message. Also converts values to other types if specified.
             * @param message Pong
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.Pong, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Pong to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Pong
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ClientFrame. */
        interface IClientFrame {

            /** ClientFrame requestId */
            requestId?: (string|null);

            /** ClientFrame authenticate */
            authenticate?: (chat.v1.IAuthenticate|null);

            /** ClientFrame subscribe */
            subscribe?: (chat.v1.ISubscribe|null);

            /** ClientFrame unsubscribe */
            unsubscribe?: (chat.v1.IUnsubscribe|null);

            /** ClientFrame sendMessage */
            sendMessage?: (chat.v1.ISendMessage|null);

            /** ClientFrame heartbeat */
            heartbeat?: (chat.v1.IHeartbeat|null);

            /** ClientFrame setPresence */
            setPresence?: (chat.v1.ISetPresence|null);

            /** ClientFrame typing */
            typing?: (chat.v1.ITyping|null);

            /** ClientFrame joinCall */
            joinCall?: (chat.v1.IJoinCall|null);

            /** ClientFrame leaveCall */
            leaveCall?: (chat.v1.ILeaveCall|null);

            /** ClientFrame callSignal */
            callSignal?: (chat.v1.ICallSignal|null);

            /** ClientFrame callMedia */
            callMedia?: (chat.v1.ICallMedia|null);
        }

        /** Represents a ClientFrame. */
        class ClientFrame implements IClientFrame {

            /**
             * Constructs a new ClientFrame.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IClientFrame);

            /** ClientFrame requestId. */
            public requestId: string;

            /** ClientFrame authenticate. */
            public authenticate?: (chat.v1.IAuthenticate|null);

            /** ClientFrame subscribe. */
            public subscribe?: (chat.v1.ISubscribe|null);

            /** ClientFrame unsubscribe. */
            public unsubscribe?: (chat.v1.IUnsubscribe|null);

            /** ClientFrame sendMessage. */
            public sendMessage?: (chat.v1.ISendMessage|null);

            /** ClientFrame heartbeat. */
            public heartbeat?: (chat.v1.IHeartbeat|null);

            /** ClientFrame setPresence. */
            public setPresence?: (chat.v1.ISetPresence|null);

            /** ClientFrame typing. */
            public typing?: (chat.v1.ITyping|null);

            /** ClientFrame joinCall. */
            public joinCall?: (chat.v1.IJoinCall|null);

            /** ClientFrame leaveCall. */
            public leaveCall?: (chat.v1.ILeaveCall|null);

            /** ClientFrame callSignal. */
            public callSignal?: (chat.v1.ICallSignal|null);

            /** ClientFrame callMedia. */
            public callMedia?: (chat.v1.ICallMedia|null);

            /** ClientFrame payload. */
            public payload?: ("authenticate"|"subscribe"|"unsubscribe"|"sendMessage"|"heartbeat"|"setPresence"|"typing"|"joinCall"|"leaveCall"|"callSignal"|"callMedia");

            /**
             * Creates a new ClientFrame instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ClientFrame instance
             */
            public static create(properties?: chat.v1.IClientFrame): chat.v1.ClientFrame;

            /**
             * Encodes the specified ClientFrame message. Does not implicitly {@link chat.v1.ClientFrame.verify|verify} messages.
             * @param message ClientFrame message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IClientFrame, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ClientFrame message, length delimited. Does not implicitly {@link chat.v1.ClientFrame.verify|verify} messages.
             * @param message ClientFrame message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IClientFrame, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ClientFrame message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ClientFrame
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.ClientFrame;

            /**
             * Decodes a ClientFrame message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ClientFrame
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.ClientFrame;

            /**
             * Verifies a ClientFrame message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ClientFrame message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ClientFrame
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.ClientFrame;

            /**
             * Creates a plain object from a ClientFrame message. Also converts values to other types if specified.
             * @param message ClientFrame
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.ClientFrame, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ClientFrame to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ClientFrame
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ServerFrame. */
        interface IServerFrame {

            /** ServerFrame requestId */
            requestId?: (string|null);

            /** ServerFrame authenticated */
            authenticated?: (chat.v1.IAuthenticated|null);

            /** ServerFrame message */
            message?: (chat.v1.IChatMessage|null);

            /** ServerFrame ack */
            ack?: (chat.v1.IMessageAck|null);

            /** ServerFrame presence */
            presence?: (chat.v1.IPresenceEvent|null);

            /** ServerFrame presenceSnapshot */
            presenceSnapshot?: (chat.v1.IPresenceSnapshot|null);

            /** ServerFrame error */
            error?: (chat.v1.IServerError|null);

            /** ServerFrame pong */
            pong?: (chat.v1.IPong|null);

            /** ServerFrame typing */
            typing?: (chat.v1.ITypingEvent|null);

            /** ServerFrame callSnapshot */
            callSnapshot?: (chat.v1.ICallSnapshot|null);

            /** ServerFrame callEvent */
            callEvent?: (chat.v1.ICallEvent|null);
        }

        /** Represents a ServerFrame. */
        class ServerFrame implements IServerFrame {

            /**
             * Constructs a new ServerFrame.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.v1.IServerFrame);

            /** ServerFrame requestId. */
            public requestId: string;

            /** ServerFrame authenticated. */
            public authenticated?: (chat.v1.IAuthenticated|null);

            /** ServerFrame message. */
            public message?: (chat.v1.IChatMessage|null);

            /** ServerFrame ack. */
            public ack?: (chat.v1.IMessageAck|null);

            /** ServerFrame presence. */
            public presence?: (chat.v1.IPresenceEvent|null);

            /** ServerFrame presenceSnapshot. */
            public presenceSnapshot?: (chat.v1.IPresenceSnapshot|null);

            /** ServerFrame error. */
            public error?: (chat.v1.IServerError|null);

            /** ServerFrame pong. */
            public pong?: (chat.v1.IPong|null);

            /** ServerFrame typing. */
            public typing?: (chat.v1.ITypingEvent|null);

            /** ServerFrame callSnapshot. */
            public callSnapshot?: (chat.v1.ICallSnapshot|null);

            /** ServerFrame callEvent. */
            public callEvent?: (chat.v1.ICallEvent|null);

            /** ServerFrame payload. */
            public payload?: ("authenticated"|"message"|"ack"|"presence"|"presenceSnapshot"|"error"|"pong"|"typing"|"callSnapshot"|"callEvent");

            /**
             * Creates a new ServerFrame instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServerFrame instance
             */
            public static create(properties?: chat.v1.IServerFrame): chat.v1.ServerFrame;

            /**
             * Encodes the specified ServerFrame message. Does not implicitly {@link chat.v1.ServerFrame.verify|verify} messages.
             * @param message ServerFrame message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.v1.IServerFrame, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServerFrame message, length delimited. Does not implicitly {@link chat.v1.ServerFrame.verify|verify} messages.
             * @param message ServerFrame message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.v1.IServerFrame, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServerFrame message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServerFrame
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.v1.ServerFrame;

            /**
             * Decodes a ServerFrame message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServerFrame
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.v1.ServerFrame;

            /**
             * Verifies a ServerFrame message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServerFrame message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServerFrame
             */
            public static fromObject(object: { [k: string]: any }): chat.v1.ServerFrame;

            /**
             * Creates a plain object from a ServerFrame message. Also converts values to other types if specified.
             * @param message ServerFrame
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.v1.ServerFrame, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServerFrame to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ServerFrame
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
