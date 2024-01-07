import { ChannelType, GuildMember } from "discord.js";
import myClient from "../client";
import { eventType } from "../types/events";

export const event: eventType = {
	name: "guildMemberRemove",
	execute: async (client: myClient, member: GuildMember) => {
		const channel = client.channels.cache.get(client.channelMemberListID);

		// Impossible error check: Code #1
		if (!channel || channel.type !== ChannelType.GuildText) {
			console.error(
				`[EVENTS] An error occured while executing event 'guildMemberRemove'! Code #1`
			);
		} else {
			// Get message
			const message = (await channel.messages.fetch()).get(client.messageMemberListID);

			// Impossible error check: Code #2
			if (!message) {
				console.error(
					`[EVENTS] An error occured while executing event 'guildMemberRemove'! Code #2`
				);
			} else {
				// Remove from message
				await message.edit({ content: message.content.replace(`\n- <@${member.id}>`, "") });
				console.log(
					`[EVENTS] Removed member ${member.user.username} from member-list message.`
				);

				// Remove from whitelist
				const username = member.nickname ? member.nickname : member.displayName;

				await client.SMP.send("send command", [`whitelist remove ${username}`]);
				await client.CMP.send("send command", [`whitelist remove ${username}`]);

				// send message to #post-application
				const pChannel = client.channels.cache.get(client.channelPostApplicationID);

				// Impossible error check: Code #3
				if (!pChannel || pChannel.type !== ChannelType.GuildText) {
					console.error(
						`[EVENTS] An error occured while executing event 'guildMemberRemove'! Code #3`
					);
				} else {
					await pChannel.send({
						content: `<@${member.id} was removed from the server. \n- Left the discord server.`,
					});
				}
			}
		}
	},
};
