'use client';
import { Bell, CreditCard, LogOut, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { notificationT } from '@/app/types/types';
import HomeworkIcon from '@/public/icons/home-work-icon';
import PatchHomeNotf from '@/app/api/home-work-notf/patch-home-notf';
import GetStudentById from '@/app/api/student-api/get-student-by-id';
import PatchNotification from '@/app/api/notification-api/patch-notification';

const sidebarItems = [
  {
    title: 'Uy ishi',
    href: '/pages/student-page/home-works',
    icon: HomeworkIcon,
  },
  {
    title: "To'lovlarim",
    href: '/pages/student-page/payments',
    icon: CreditCard,
  },
  {
    title: 'Sozlamalar',
    href: '/pages/student-page/student-profile',
    icon: Settings,
  },
];

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleRemoveLogin = () => {
    document.cookie = `token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    document.cookie = `role=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    router.push('/auth');
    toast.success('Tizimdan muvafaqqiyatli chiqdingiz');
  };

  const [mounted, setMounted] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notifications, setNotification] = useState<notificationT[]>([]);
  const [studentGroupId, setStudentGroupId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const id = GetStudentById();
      if (id) setStudentId(id);
      if (user.groupId) setStudentGroupId(String(user.groupId));
    }
  }, []);

  useEffect(() => {
    if (!studentId || !studentGroupId) return;
    setMounted(true);

    const fetchNotifications = async () => {
      try {
        const davomatRes = await fetch(
          `http://localhost:3600/notifications?studentId=${studentId}`,
          { cache: 'no-store' }
        );
        const uyIshiRes = await fetch(
          `http://localhost:3600/homeWorkNotifications?groupId=${Number(
            studentGroupId
          )}`,
          { cache: 'no-store' }
        );

        const davomat = await davomatRes.json();
        const uyIshi = await uyIshiRes.json();

        const clearedId = JSON.parse(
          localStorage.getItem('clearedNotificationIds') || '[]'
        );

        setNotification(() => {
          const formatted = [
            ...davomat.map((n: any) => ({
              ...n,
              _id: `A-${n.id}`,
              type: 'attendance',
            })),
            ...uyIshi.map((n: any) => ({
              ...n,
              _id: `H-${n.id}`,
              type: 'homework',
            })),
          ].filter((n) => !clearedId.includes(n._id));

          setNotification(formatted);

          return formatted.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      } catch (err) {
        console.error('Notification fetch error', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [studentId, studentGroupId]);

  if (!mounted) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRead = async (id: number, type: 'attendance' | 'homework') => {
    try {
      if (type === 'attendance') {
        await PatchNotification(id);
      } else {
        await PatchHomeNotf(id);
      }
      setNotification((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const readAll = async () => {
    try {
      await Promise.all(
        notifications.map((n) =>
          n.groupId
            ? PatchHomeNotf(Number(n.id))
            : PatchNotification(Number(n.id))
        )
      );
      setNotification((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const clearAll = async () => {
    try {
      const clearedId = notifications.map((n) => n._id);
      const prevCleared = JSON.parse(
        localStorage.getItem('clearedNotificationIds') || '[]'
      );

      localStorage.setItem(
        'clearedNotificationIds',
        JSON.stringify([...prevCleared, ...clearedId])
      );
      setNotification([]);
      toast.success("Xabarlar o'chirildi");
    } catch (error) {
      toast.error('Xatoli yuz berdi');
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden">
        <div className="w-[200px] border-r bg-white hidden md:block">
          <Sidebar className="w-[200px]" collapsible="none">
            <SidebarHeader>
              <div className="text-lg text-gray-800 font-bold px-3 py-2 flex items-center gap-[20px] mt-[-15px]">
                ACADEMIX
                <div className="mt-[5px]">
                  <Image
                    src={'/imgs/no-bg-logo.png'}
                    alt="img"
                    width={50}
                    height={50}
                  />
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="mt-[-20px]">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.href}
                            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted"
                          >
                            {item.icon && <item.icon size={20} />}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem></SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
        </div>

        <div className="flex-1 flex flex-col">
          <header className="bg-[#F9FAFB] md:py-[34px] px-[10px]">
            <div className="flex sm:justify-between justify-end mr-[50px] relative">
              <Image
                src={'/imgs/academix-logo-removebg.png'}
                alt="img"
                width={140}
                height={100}
                className="md:hidden"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center sm:mr-[-45px] md:mr-0">
                    <div className="absolute right-12">
                      <Button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="relative p-1 w-8 h-8 flex items-center justify-center bg-inherit hover:bg-gray-200"
                      >
                        <Bell color="#4B5563" className="scale-130" />
                        {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                        )}
                      </Button>
                    </div>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-80">
                  <div className="flex justify-between px-[5px]">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>

                    {notifications.length === 0 ? (
                      ''
                    ) : (
                      <DropdownMenuLabel
                        className="cursor-pointer"
                        onClick={clearAll}
                      >
                        Tozalash
                      </DropdownMenuLabel>
                    )}
                  </div>
                  <div className="max-h-60 overflow-auto">
                    {notifications.map((notf, index) => (
                      <DropdownMenuItem
                        key={notf._id}
                        onClick={() => handleRead(Number(notf.id), notf.type)}
                        className={!notf.isRead ? 'bg-gray-100' : ''}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {notf.title}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {notf.message}
                          </p>
                          <p className="text-gray-400 text-[12px] mt-1">
                            {new Date(notf.createdAt).toLocaleDateString(
                              'uz-UZ',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  {unreadCount > 0 && (
                    <div className="p-2 border-t text-center">
                      <Button variant="outline" size="sm" onClick={readAll}>
                        All read
                      </Button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="absolute right-0 top-[-18px]">
                <button
                  onClick={handleRemoveLogin}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-muted w-full text-left"
                >
                  <LogOut size={20} color="#4B5563" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudentLayout;
