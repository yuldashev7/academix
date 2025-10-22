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

export interface inputT extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  hidden?: boolean;
}

export interface postAdminT {
  name: string;
  password: string;
  email: string;
  phoneNumber: string;
  role: string;
}
