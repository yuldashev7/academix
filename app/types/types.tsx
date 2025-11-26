export interface usersT {
  id: string;
  lastName: string;
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
  lastName: string;
}

export interface teachersT {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  createdAt: string;
  courseId: string;
  role: 'teacher';
}

export interface postTeacherT {
  name: string;
  lastName: string;
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
  fullPrice: number;
}

export interface studentT {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  createdAt: string;
  courseId: number;
  groupId: number;
  teacherId: number;
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
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  courseId: string;
  paidAmount: number;
  role: string;
}

export interface groupT {
  id: number;
  name: string;
  courseId: number;
  teacherId: number;
}

export interface postGroupT {
  name: string;
  courseId: number;
  teacherId: number;
}

export interface topicT {
  id: number;
  teacherId: string;
  groupId: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface homeworkT {
  id: number;
  topicId: string;
  teacherId: string;
  groupId: string;
  title: string;
  description: string;
  file?: string;
  deadline: string;
  createdAt: string;
}

export interface paginationT {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export interface notificationT {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  groupId: number;
  _id: string;
  type: 'attendance' | 'homework';
}

export interface postHomeNotfT {
  groupId: number;
  title: string;
  message: string;
  deadline: string;
}

export interface mobilePaymentT {
  student: studentT[];
  course: coureseT[];
}

export interface contractsT {
  id: number;
  text: string;
}
