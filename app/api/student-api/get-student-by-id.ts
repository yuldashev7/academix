const GetStudentById = () => {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(/userId=([^;]+)/);
  return match ? match[1] : null;
};

export default GetStudentById;
