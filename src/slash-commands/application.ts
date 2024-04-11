import {
	ApplicationCommandOptionType,
	ChannelType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
} from "discord.js";
import myClient from "../client";
import { slashCommandType } from "../types/slash-commands";
import { appSettingsObject } from "../types/application-settings";
import { readFileSync, writeFileSync } from "fs";
import { doingAppObject } from "../types/doing-app";

async function statusSubcommand(client: myClient, interaction: ChatInputCommandInteraction) {
	const reply = await interaction.deferReply({ ephemeral: true });
	const newStatus = interaction.options.data[0].options![0].value === "open" ? true : false;
	var appSettings: appSettingsObject = JSON.parse(
		readFileSync("./storage/app-settings.json").toString()
	);

	// Checking if status is same
	if (appSettings.open === newStatus) {
		await reply.edit({
			content: `## Applications are already ${newStatus === true ? "open" : "closed"}!`,
		});
		return;
	} else appSettings.open = newStatus;

	// Getting previous message
	const channel = client.channels.cache.get(client.channelApplyID);
	if (channel!.type !== ChannelType.GuildText) {
		await reply.edit({ content: "An Error Occured! Code #1" });
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #1`
		);
		return;
	}
	const messages = await channel.messages.fetch();
	const msg = messages.get(appSettings.messageID);
	await msg?.delete();

	// Changing the status
	const message = await channel.send({
		content:
			appSettings.open === true
				? "# <:yes:1181140152333115442> Applications Open! <:yes:1181140152333115442>"
				: "# <:no:1181140154623213569> Applications Closed! <:no:1181140154623213569>",
	});
	appSettings.messageID = message.id;

	writeFileSync("./storage/app-settings.json", JSON.stringify(appSettings));
	await reply.edit({ content: "Done" });
}

async function acceptSubcommand(client: myClient, interaction: ChatInputCommandInteraction) {
	// getting current applications
	var doingApp: doingAppObject[] = JSON.parse(
		readFileSync("./storage/doing-app.json").toString()
	);

	const appChannel = interaction.channel;
	// impossible error check: code #1
	if (!appChannel) {
		interaction.reply({
			content: "An Error Occured! Code #1",
		});
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #1`
		);
		return;
	}

	// checking for currect channel
	if (!doingApp.some((app) => app.ticketID === appChannel.id)) {
		await interaction.reply({
			content: "## You cannot use this command in this channel!",
			ephemeral: true,
		});
		return;
	}

	// impossible error check: code #1
	if (appChannel.type !== ChannelType.PrivateThread) {
		interaction.reply({
			content: "An Error Occured! Code #1",
		});
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #1`
		);
		return;
	}

	// buying more time
	const reply = await interaction.deferReply();

	// data assigning
	const doingAppData = doingApp.find((app) => app.ticketID === interaction.channel!.id);

	// Impossible error check: code #2
	if (!doingAppData) {
		reply.edit({
			content: "An Error Occured! Code #2",
		});
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #2`
		);
		return;
	}

	const username = interaction.options.data[0].options![0].value;
	const member = interaction.guild?.members.cache.get(doingAppData.userID);

	// Impossible error check: code #3
	if (!member || typeof username !== "string") {
		reply.edit({
			content: "An Error Occured! Code #3",
		});
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #3`
		);
		return;
	}

	// Adding member to the server
	await member.roles.add(client.memberRoleID);
	await member.roles.remove(client.waitingRoleID);
	await member.setNickname(username);

	client.SMP.send("send command", [`whitelist add ${username}`]);
	client.CMP.send("send command", [`whitelist add ${username}`]);

	doingApp.splice(doingApp.indexOf(doingAppData), 1);
	writeFileSync("./storage/doing-app.json", JSON.stringify(doingApp));
	var memberList: string[] = JSON.parse(readFileSync("./storage/member-list.json").toString());
	memberList.push(member.id);
	writeFileSync("./storage/member-list.json", JSON.stringify(memberList));

	const channel = client.channels.cache.get(client.channelApplicationResultID);

	// Impossible error check
	if (channel!.type !== ChannelType.GuildText) {
		reply.edit({
			content: "An Error Occured! Code #4",
		});
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #4`
		);
		return;
	}

	// finalizing with channels and messages
	const mainEmbed = new EmbedBuilder()
		.setColor("#00FF00")
		.setTitle("Application Accepted!")
		.setDescription(
			`Application No. \`${appChannel.name.replace(
				"🎫╏app-",
				""
			)}\` of user \`${username}\` has been accepted! \nPlease go through <#${
				client.channelEuphoriaID
			}> before joining. Your <#${
				client.forumSuggestionID
			}> is valuable to us, just check if your suggestion has been posted before or not.`
		)
		.setFooter({ text: "Have fun!" });

	await appChannel.members.remove(member.id);
	await appChannel.edit({
		name: appChannel.name.replace("🎫", "✅"),
		locked: true,
		archived: true,
	});

	reply.edit({ embeds: [mainEmbed] });
	const msg = await channel.send({ content: `<@${member.id}>`, embeds: [mainEmbed] });
	msg.react("❤");

	// adding them to member list channel
	const mChannel = client.channels.cache.get(client.channelMemberListID);
	// impossible error check
	if (!mChannel || mChannel.type !== ChannelType.GuildText) {
		reply.edit({
			content: "An Error Occured! Code #4",
		});
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #4`
		);
		return;
	}

	var content = "";
	var members = interaction.guild!.roles.cache.get(client.memberRoleID)!.members;
	members = members.sort((a, b) =>
		(a.nickname || a.displayName).localeCompare(b.nickname || b.displayName)
	);
	for (const member of members) {
		memberList.push(member[1].id);
		content =
			content +
			`\n- ${(member[1].nickname ? member[1].nickname : member[1].displayName).replace(
				"_",
				"\\_"
			)}`;
	}

	const messages = await mChannel.messages.fetch();
	const message = messages.get(client.messageMemberListID);
	await message?.edit({ content });
	await mChannel.setTopic(`${members.size} members!`);
}

async function rejectSubcommand(client: myClient, interaction: ChatInputCommandInteraction) {
	// getting current applications
	var doingApp: doingAppObject[] = JSON.parse(
		readFileSync("./storage/doing-app.json").toString()
	);

	const appChannel = interaction.channel;
	// impossible error check: code #1
	if (!appChannel) {
		interaction.reply({
			content: "An Error Occured! Code #1",
		});
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #1`
		);
		return;
	}

	// checking for currect channel
	if (!doingApp.some((app) => app.ticketID === appChannel.id)) {
		await interaction.reply({
			content: "## You cannot use this command in this channel!",
			ephemeral: true,
		});
		return;
	}

	// impossible error check: code #1
	if (appChannel.type !== ChannelType.PrivateThread) {
		interaction.reply({
			content: "An Error Occured! Code #1",
		});
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #1`
		);
		return;
	}

	// buying more time
	const reply = await interaction.deferReply();

	// data assigning
	const doingAppData = doingApp.find((app) => app.ticketID === interaction.channel!.id);

	// Impossible error check: code #2
	if (!doingAppData) {
		reply.edit({
			content: "An Error Occured! Code #2",
		});
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #2`
		);
		return;
	}

	const member = interaction.guild?.members.cache.get(doingAppData.userID);

	if (member) {
		await member.roles.remove(client.waitingRoleID);
	}

	doingApp.splice(doingApp.indexOf(doingAppData), 1);
	writeFileSync("./storage/doing-app.json", JSON.stringify(doingApp));
	var rMemberList: string[] = JSON.parse(
		readFileSync("./storage/removed-members.json").toString()
	);
	rMemberList.push(doingAppData.userID);
	writeFileSync("./storage/removed-members.json", JSON.stringify(rMemberList));

	const channel = client.channels.cache.get(client.channelApplicationResultID);

	// Impossible error check: code #4
	if (channel!.type !== ChannelType.GuildText) {
		reply.edit({
			content: "An Error Occured! Code #4",
		});
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #4`
		);
		return;
	}

	// finalizing with channels and messages
	const mainEmbed = new EmbedBuilder()
		.setColor("#FF0000")
		.setTitle("Application Rejected!")
		.setDescription(
			`Application No. \`${appChannel.name.replace(
				"🎫╏app-",
				""
			)}\` has been rejected! \nIf you wish to try again, please make a special request with the owner.`
		);

	if (member) await appChannel.members.remove(member.id);
	await appChannel.edit({
		name: appChannel.name.replace("🎫", "❌"),
		locked: true,
		archived: true,
	});

	await channel.send({ content: `<@${doingAppData.userID}>`, embeds: [mainEmbed] });
	await reply.edit({ embeds: [mainEmbed] });
}

async function allowSubcommand(interaction: ChatInputCommandInteraction) {
	const reply = await interaction.deferReply();

	// Impossible Error check: code #5
	if (interaction.options.data[0].options![0].type !== ApplicationCommandOptionType.User) {
		reply.edit({
			content: "An Error Occured! Code #5",
		});
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #5`
		);
		return;
	}

	const user = interaction.options.data[0].options![0].value;

	// Impossible Error check: code #6
	if (typeof user !== "string") {
		reply.edit({
			content: "An Error Occured! Code #6",
		});
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #6`
		);
		return;
	}

	// Getting removed member list
	var rMemberList: string[] = JSON.parse(
		readFileSync("./storage/removed-members.json").toString()
	);

	if (!rMemberList.includes(user)) {
		reply.edit({
			content: "That user is not removed/denied!",
		});
		console.log(`[SLASH COMMANDS] User ${user} is not removed!`);
		return;
	}

	rMemberList.splice(rMemberList.indexOf(user));
	writeFileSync("./storage/removed-members.json", JSON.stringify(rMemberList));

	reply.edit({ content: `<@${user}> is now allowed to redo their application!` });
}

async function removeSubcommand(client: myClient, interaction: ChatInputCommandInteraction) {
	// buy more time
	const reply = await interaction.deferReply({ ephemeral: true });

	// member
	const memberid = interaction.options.data[0].options![0].value;

	// impossible error check: code #4
	if (typeof memberid !== "string") {
		reply.edit({
			content: "An error occured! Code #4",
		});
		console.error(`[EVENTS] An error occured while executing command 'application'! Code #4`);
		return;
	}

	const member = interaction.guild?.members.cache.get(memberid);

	// impossible error check: code #5
	if (!member) {
		reply.edit({
			content: "An error occured! Code #5",
		});
		console.error(`[EVENTS] An error occured while executing command 'application'! Code #5`);
		return;
	}

	// checking if person was member
	if (!member.roles.cache.has(client.memberRoleID)) {
		reply.edit({
			content: "That user is not a member!",
		});
		return;
	} else if (member.id === interaction.guild!.ownerId) {
		reply.edit({
			content: "# YOU CANNOT REMOVE THE LORD!",
		});
	}

	// get member channel
	const channel = client.channels.cache.get(client.channelMemberListID);

	// Impossible error check: Code #1
	if (!channel || channel.type !== ChannelType.GuildText) {
		console.error(`[EVENTS] An error occured while executing command 'application'! Code #1`);
		return;
	}
	// Get message
	const message = (await channel.messages.fetch()).get(client.messageMemberListID);

	// Impossible error check: Code #2
	if (!message) {
		console.error(`[EVENTS] An error occured while executing command 'application'! Code #2`);
		return;
	}
	// Remove from message and remove role
	await member.roles.remove(client.memberRoleID);
	await message.edit({ content: message.content.replace(`\n- <@${member.id}>`, "") });
	console.log(`[EVENTS] Removed member ${member.user.username} from member-list message.`);
	const rmembers = interaction.guild!.roles.cache.get(client.memberRoleID)!.members;
	await channel.setTopic(`${rmembers.size} members!`);

	// Remove from whitelist
	const username = member.nickname ? member.nickname : member.displayName;

	//await client.SMP.send("send command", [`whitelist remove ${username}`]);
	//await client.CMP.send("send command", [`whitelist remove ${username}`]);

	// send message to #post-application
	const pChannel = client.channels.cache.get(client.channelPostApplicationID);

	// Impossible error check: Code #3
	if (!pChannel || pChannel.type !== ChannelType.GuildText) {
		console.error(`[EVENTS] An error occured while executing command 'application'! Code #3`);
		return;
	}

	// message
	var content: string = `<@${member.id}> was removed from the server.`;

	const reason1 = interaction.options.getString("reason-1");
	if (typeof reason1 === "string") {
		content = content + `\n- ${reason1}`;
	}
	const reason2 = interaction.options.getString("reason-2");
	if (typeof reason2 === "string") {
		content = content + `\n- ${reason2}`;
	}
	const reason3 = interaction.options.getString("reason-3");
	if (typeof reason3 === "string") {
		content = content + `\n- ${reason3}`;
	}

	const msg = await pChannel.send({ content });

	// Update member-lists
	var removedMembers: string[] = JSON.parse(
		readFileSync("./storage/removed-members.json").toString()
	);
	removedMembers.push(member.id);
	writeFileSync("./storage/removed-members.json", JSON.stringify(removedMembers));

	var members: string[] = JSON.parse(readFileSync("./storage/member-list.json").toString());
	members.splice(members.indexOf(member.id), 1);
	writeFileSync("./storage/member-list.json", JSON.stringify(members));

	reply.edit({ content: msg.url });
}

export const slashCommand: slashCommandType = {
	// COMMAND DATA
	data: {
		name: "application",
		description: "Control the application system of the server",
		defaultMemberPermissions: PermissionFlagsBits.Administrator,
		options: [
			{
				name: "status",
				description: "Open or Close the applications of the server",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "input",
						description: "Input field to open/close.",
						type: ApplicationCommandOptionType.String,
						required: true,
						choices: [
							{ name: "open", value: "open" },
							{ name: "close", value: "close" },
						],
					},
				],
			},
			{
				name: "accept",
				description: "Accept someone's application",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "username",
						description: "Minecraft username of the person being accepted.",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
				],
			},
			{
				name: "reject",
				description: "Reject someone's application",
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: "allow",
				description: "Allow a rejected person to redo their application",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "user",
						description: "Who is being allowed to redo their application?",
						type: ApplicationCommandOptionType.User,
						required: true,
					},
				],
			},
			{
				name: "remove",
				description: "Remove a member from the server",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "user",
						description: "Who is being removed from the server?",
						type: ApplicationCommandOptionType.User,
						required: true,
					},
					{
						name: "reason-1",
						description: "Why is this person being removed?",
						type: ApplicationCommandOptionType.String,
					},
					{
						name: "reason-2",
						description: "Why is this person being removed?",
						type: ApplicationCommandOptionType.String,
					},
					{
						name: "reason-3",
						description: "Why is this person being removed?",
						type: ApplicationCommandOptionType.String,
					},
				],
			},
		],
	},
	execute: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		// redirect to correct subcommand
		if (interaction.options.data[0].name === "status") statusSubcommand(client, interaction);
		else if (interaction.options.data[0].name === "accept")
			acceptSubcommand(client, interaction);
		else if (interaction.options.data[0].name === "reject")
			rejectSubcommand(client, interaction);
		else if (interaction.options.data[0].name === "allow") allowSubcommand(interaction);
		else if (interaction.options.data[0].name === "remove")
			removeSubcommand(client, interaction);
	},
};
