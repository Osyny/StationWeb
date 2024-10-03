export interface UsersResponse {
  users: UserDto[];
  total: number;
  skip: number;
  limit: number;
}

export interface UserDto {
  id?: number;
  email?: string;
  userName?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  roleName: string;
}
