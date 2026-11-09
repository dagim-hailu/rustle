defmodule Gateway.Session do
  @moduledoc "Parsed authorization snapshot for one authenticated WebSocket."

  defstruct [
    :user,
    :guilds,
    :guild_index,
    :channel_index,
    :session_id
  ]

  @type t :: %__MODULE__{}

  @spec from_api(map(), String.t()) :: {:ok, t()} | {:error, term()}
  def from_api(%{"user" => user, "guilds" => guilds}, session_id)
      when is_map(user) and is_list(guilds) do
    parsed_user = %{
      id: user["id"],
      email: user["email"],
      display_name: user["displayName"],
      avatar_color: user["avatarColor"] || "#B7410E",
      avatar_url: user["avatarUrl"] || "",
      bio: user["bio"] || "",
      pronouns: user["pronouns"] || "",
      banner_url: user["bannerUrl"] || "",
      banner_color: user["bannerColor"] || "#0F4C5C",
      created_at: user["createdAt"] || "",
      locale: user["locale"] || "en"
    }

    with true <- Gateway.IDs.valid_uuid?(parsed_user.id),
         {:ok, parsed_guilds} <- parse_guilds(guilds, parsed_user.id) do
      guild_index = Map.new(parsed_guilds, &{&1.id, &1})

      channel_index =
        parsed_guilds
        |> Enum.flat_map(fn guild ->
          Enum.map(guild.channels, fn channel ->
            {channel.id, %{guild_id: guild.id, guild_name: guild.name, channel: channel}}
          end)
        end)
        |> Map.new()

      {:ok,
       %__MODULE__{
         user: parsed_user,
         guilds: parsed_guilds,
         guild_index: guild_index,
         channel_index: channel_index,
         session_id: session_id
       }}
    end
  end

  def from_api(_, _), do: {:error, :invalid_session_payload}

  @spec user_proto(t()) :: Chat.V1.User.t()
  def user_proto(%__MODULE__{user: user}) do
    %Chat.V1.User{
      id: user.id,
      display_name: user.display_name,
      avatar_color: user.avatar_color,
      locale: user.locale,
      presence: Chat.V1.PresenceStatus.value(:PRESENCE_STATUS_ONLINE),
      avatar_url: user.avatar_url,
      bio: user.bio,
      pronouns: user.pronouns,
      banner_url: user.banner_url,
      banner_color: user.banner_color,
      created_at: user.created_at
    }
  end

  @spec authenticated_proto(t()) :: Chat.V1.Authenticated.t()
  def authenticated_proto(%__MODULE__{} = session) do
    %Chat.V1.Authenticated{
      user: user_proto(session),
      guilds: Enum.map(session.guilds, &guild_proto/1),
      session_id: session.session_id
    }
  end

  defp guild_proto(guild) do
    %Chat.V1.Guild{
      id: guild.id,
      name: guild.name,
      icon_color: guild.icon_color,
      channels: Enum.map(guild.channels, &channel_proto/1),
      members: Enum.map(guild.members, &member_proto/1),
      current_user_role: guild.role
    }
  end

  defp channel_proto(channel) do
    %Chat.V1.Channel{
      id: channel.id,
      guild_id: channel.guild_id,
      name: channel.name,
      topic: channel.topic,
      kind: channel_kind(channel.kind),
      position: channel.position
    }
  end

  defp member_proto(member) do
    %Chat.V1.GuildMember{
      user_id: member.user_id,
      display_name: member.display_name,
      avatar_color: member.avatar_color,
      presence: Chat.V1.PresenceStatus.value(:PRESENCE_STATUS_OFFLINE),
      role: member.role,
      avatar_url: member.avatar_url,
      bio: member.bio,
      pronouns: member.pronouns,
      banner_url: member.banner_url,
      banner_color: member.banner_color,
      created_at: member.created_at
    }
  end

  defp channel_kind("text"), do: Chat.V1.ChannelKind.value(:CHANNEL_KIND_TEXT)
  defp channel_kind("voice"), do: Chat.V1.ChannelKind.value(:CHANNEL_KIND_VOICE)
  defp channel_kind(_), do: Chat.V1.ChannelKind.value(:CHANNEL_KIND_UNSPECIFIED)

  @spec channel(t(), String.t()) :: {:ok, map()} | {:error, :not_a_member}
  def channel(%__MODULE__{channel_index: index}, channel_id) do
    case Map.fetch(index, channel_id) do
      {:ok, channel} -> {:ok, channel}
      :error -> {:error, :not_a_member}
    end
  end

  @spec member_ids_by_guild(t()) :: %{String.t() => [String.t()]}
  def member_ids_by_guild(%__MODULE__{guilds: guilds}) do
    Map.new(guilds, fn guild -> {guild.id, Enum.map(guild.members, & &1.user_id)} end)
  end

  @spec guild_ids(t()) :: [String.t()]
  def guild_ids(%__MODULE__{guilds: guilds}), do: Enum.map(guilds, & &1.id)

  @spec all_channel_ids(t()) :: [String.t()]
  def all_channel_ids(%__MODULE__{channel_index: index}), do: Map.keys(index)

  @spec display_name(t()) :: String.t()
  def display_name(%__MODULE__{user: user}), do: user.display_name

  defp parse_guilds(guilds, current_user_id) do
    parsed =
      Enum.map(guilds, fn guild ->
        channels =
          Enum.map(guild["channels"] || [], fn channel ->
            %{
              id: channel["id"],
              guild_id: guild["id"],
              name: channel["name"],
              topic: channel["topic"] || "",
              kind: channel["kind"] || "text",
              position: channel["position"] || 0
            }
          end)

        members =
          Enum.map(guild["members"] || [], fn member ->
            %{
              user_id: member["userId"],
              display_name: member["displayName"],
              avatar_color: member["avatarColor"] || "#B7410E",
              avatar_url: member["avatarUrl"] || "",
              bio: member["bio"] || "",
              pronouns: member["pronouns"] || "",
              banner_url: member["bannerUrl"] || "",
              banner_color: member["bannerColor"] || "#0F4C5C",
              created_at: member["createdAt"] || "",
              role: member["role"] || "member"
            }
          end)

        %{
          id: guild["id"],
          name: guild["name"],
          icon_color: guild["iconColor"] || "#B7410E",
          role: guild["role"] || "member",
          channels: channels,
          members: members
        }
      end)

    if Enum.all?(parsed, &Gateway.IDs.valid_uuid?(&1.id)) and
         Enum.all?(parsed, fn g -> Enum.any?(g.members, &(&1.user_id == current_user_id)) end) do
      {:ok, parsed}
    else
      {:error, :malformed_guild_snapshot}
    end
  end
end
