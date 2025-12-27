export interface UserResponse {
	readonly id: string;
	readonly email: string;
	readonly username?: string | null;
	readonly image?: string | null;
}
