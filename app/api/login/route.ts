import { NextResponse } from 'next/server';

const Protect = async (req: Request) => {
  const { email, password } = await req.json();
  const roles = ['superAdmins', 'admins', 'teachers', 'students'];
  let user = null;
  let role = '';

  for (const r of roles) {
    const res = await fetch(
      `https://academix-server-1.onrender.com/${r}?email=${email}$password=${password}`
    );
    const data = await res.json();

    if (data.length > 0) {
      user = data[0];
      role = r;
      break;
    }
  }
  if (!user) {
    return NextResponse.json(
      { message: 'Email yoki parol noto‘g‘ri' },
      { status: 401 }
    );
  }
  const fakeToken = `${user.role}-${Date.now()}`;
  const response = NextResponse.json({
    message: 'Login successful',
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  response.cookies.set('token', fakeToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });
  response.cookies.set('role', user.role, {
    httpOnly: false,
    path: '/',
  });
  return response;
};

export default Protect;
