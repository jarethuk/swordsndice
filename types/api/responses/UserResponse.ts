export interface UserResponse {
	id: string;
	email: string;
	username?: string | null;
	image?: string | null;
	description?: string | null;
}
