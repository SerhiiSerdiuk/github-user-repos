export interface User {
  login: string;
  avatar_url: string;
  name: string;
}

export interface UserList {
  total_count: number;
  incomplete_results: boolean;
  items: User[];
}
