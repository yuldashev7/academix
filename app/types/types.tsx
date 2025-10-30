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

export interface teachersT {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  createdAt: string;
  courseId: string;
  role: 'teacher';
}

export interface postTeacherT {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  courseId: string;
}

export interface coureseT {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  totalFee: string;
}

export interface studentT {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  createdAt: string;
  courseId: string;
  paidAmount: number;
  totalFee: number;
  role: 'student';
}

export interface progressT {
  lesson: string;
  progress: number;
}

export interface StudentModalT {
  open: boolean;
  onClose: () => void;
  student?: any;
}

export interface postStudentT {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  courseId: string;
  paidAmount: number;
  role: string;
}
