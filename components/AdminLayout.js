import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AdminLayout({ children, activePage }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email.toLowerCase() === "sanaullaa19@gmail.com") {
          setUser(user);
          setLoading(false);
        } else {
          signOut(auth);
          router.push("/admin/login");
        }
      } else {
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-body-md font-bold text-outline">Verifying Admin Access...</p>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", icon: "dashboard", href: "/admin/dashboard", id: "dashboard" },
    { name: "Products", icon: "inventory_2", href: "/admin/products", id: "products" },
    { name: "Add Product", icon: "add_circle", href: "/admin/add-product", id: "add-product" },
    { name: "Settings", icon: "settings", href: "/admin/settings", id: "settings" }
  ];

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col lg:flex-row font-inter">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-[280px] bg-white border-r border-gray-100 flex flex-col z-50">
        <div className="p-6">
          <Link href="/admin/dashboard">
            <h2 className="text-2xl font-black tracking-tighter text-violet-600 mb-1 cursor-pointer">Alfajr Admin</h2>
          </Link>
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Management Console</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all ${
                activePage === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container font-medium'
              }`}>
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-body-md font-bold">{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div className="bg-surface-container-low rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center text-primary font-bold">
                AD
              </div>
              <div className="flex flex-col">
                <span className="text-body-sm font-bold text-on-surface truncate max-w-[120px]">Admin User</span>
                <span className="text-[10px] font-medium text-outline truncate max-w-[120px]">{user?.email}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-white rounded-full text-error transition-colors">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between z-40">
          <h1 className="font-h2 text-on-surface capitalize">{activePage?.replace('-', ' ')}</h1>
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-primary font-bold text-body-sm bg-primary-fixed hover:bg-primary-fixed-dim transition-all">
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                VIEW STORE
              </button>
            </Link>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
