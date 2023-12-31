type voteOptions = {
	title: string;
	description: string;
	emoji: string;
	winMessage?: string;
};
type voteType = {
	number: number;
	messageID: string;
	options: voteOptions[];
	winMessage: string;
	concluded?: boolean;
};

export type { voteType };
