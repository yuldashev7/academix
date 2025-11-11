const UseGetCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';')[0];
  }
  return null;
};

export default UseGetCookie;
