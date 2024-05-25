export function clearDiscordMarkdown(message: string): string {
	let newMessage: string = message;
	newMessage = newMessage.replaceAll("\\", "");
	newMessage = newMessage.replaceAll("*", '\*');
	newMessage = newMessage.replaceAll("_", '\_');
	newMessage = newMessage.replaceAll("`", '\`');
	newMessage = newMessage.replaceAll("*", '\*');
	newMessage = newMessage.replaceAll("[", '\[');
	newMessage = newMessage.replaceAll("(", '\(');
	newMessage = newMessage.replaceAll("#", '\#');
	newMessage = newMessage.replaceAll(">", '\>');
	newMessage = newMessage.replaceAll("-", '\-');
	return newMessage;
}
