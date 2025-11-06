'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Users, LogOut, CrownIcon, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const sidebarItems = [
  { title: 'Ustozlar', href: '/admin/teacher', icon: GraduationCap },
  { title: "O'quvchilar", href: '/admin/student', icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleRemoveLogin = () => {
    document.cookie = `token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    document.cookie = `role=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    router.push('/auth');
    toast.success('Tizimdan muvafaqqiyatli chiqdingiz');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden">
        <div className="w-[200px] flex-shrink-0 border-r bg-white">
          <Sidebar className="w-[200px]">
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
                            <item.icon size={20} />
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
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={handleRemoveLogin}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-muted w-full text-left"
                    >
                      <LogOut size={20} />
                      <span>Chiqish</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
        </div>

        <main className="flex-1 p-6 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
