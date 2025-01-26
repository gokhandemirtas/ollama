export interface IUser {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  avatar: string;
}
