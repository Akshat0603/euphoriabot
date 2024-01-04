type voteOptions = {
	title: string;
	description: string;
	emoji: string;
	winMessage?: string;
};
export type voteType = {
	number: number;
	messageID: string;
	options: voteOptions[];
	winMessage: string;
	concluded?: boolean;
};
