export const FeedItemTypes = {
	GameStarted: 'Game Started',
	GameCompleted: 'Game Completed',
	GroupJoined: 'Group Joined',
	GroupCreated: 'Group Created',
	FriendAdded: 'Friend Added',
};

export type FeedItemType = (typeof FeedItemTypes)[keyof typeof FeedItemTypes];

export interface FeedItem {
	id: string;
	type: FeedItemType;
	date: Date;
	title: string;
	subTitle?: string;
	image?: string;
}
