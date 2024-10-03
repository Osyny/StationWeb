export class UserDisplayedDto {
  id?: number;
  email?: string;
  userName?: string | undefined = '';
  password?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  roleName?: string;
}
