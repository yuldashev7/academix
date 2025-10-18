export interface usersT {
  id: string;
  role: 'super-admin' | 'admin' | 'teacher' | 'student';
  name: string;
  email: string;
  img: string;
  createdAt: string;
  totalCollected: string;
  phoneNumber: string;
}
