import { UserDto } from '../user-model';

export interface AccountResponse {
  user: UserDto;
  token: string;
}
