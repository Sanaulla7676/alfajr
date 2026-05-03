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
    { name: "Categories", icon: "category", href: "/admin/categories", id: "categories" },
    { name: "Add Product", icon: "add_circle", href: "/admin/add-product", id: "add-product" },
    { name: "Settings", icon: "settings", href: "/admin/settings", id: "settings" }
  ];

  return (
    <div className="min-h-screen bg-surface-container-low font-inter">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 bg-white border-b border-gray-50 p-4 flex items-center justify-between z-[60] shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard">
            <h2 className="text-lg font-black tracking-tight text-violet-600">Alfajr Admin</h2>
          </Link>
        </div>
        
        <h1 className="absolute left-1/2 -translate-x-1/2 text-body-lg font-bold text-on-surface capitalize">
          {activePage === 'dashboard' ? 'Dashboard' : activePage?.replace('-', ' ')}
        </h1>

        <div className="flex items-center gap-3">
          <button className="text-outline">
            <span className="material-symbols-outlined text-[24px]">search</span>
          </button>
          <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-[10px] font-black text-violet-600">
            AD
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] lg:min-h-screen">
        {/* Admin Sidebar - Desktop Only */}
        <aside className="hidden lg:flex w-[280px] bg-white border-r border-gray-100 flex-col z-50 sticky top-0 h-screen">
          <div className="p-6">
            <Link href="/admin/dashboard">
              <h2 className="text-2xl font-black tracking-tighter text-violet-600 mb-1 cursor-pointer">Alfajr Admin</h2>
            </Link>
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Management Console</p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {[
              { name: "Dashboard", icon: "dashboard", href: "/admin/dashboard", id: "dashboard" },
              { name: "Products", icon: "inventory_2", href: "/admin/products", id: "products" },
              { name: "Categories", icon: "category", href: "/admin/categories", id: "categories" },
              { name: "Add Product", icon: "add_circle", href: "/admin/add-product", id: "add-product" },
              { name: "Settings", icon: "settings", href: "/admin/settings", id: "settings" }
            ].map((item) => (
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
        <main className="flex-1 relative pb-20 lg:pb-0 bg-surface-container-low">
          <header className="hidden lg:flex sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 items-center justify-between z-40">
            <h1 className="font-h2 text-on-surface capitalize">{activePage?.replace('-', ' ')}</h1>
          </header>

          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Admin Bottom Navigation - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-[60] bg-white border-t border-gray-100 flex justify-around items-center py-2 pb-safe px-2 h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        {[
          { name: "Dashboard", icon: "home", href: "/admin/dashboard", id: "dashboard" },
          { name: "Products", icon: "inventory_2", href: "/admin/products", id: "products" },
          { name: "Categories", icon: "layers", href: "/admin/categories", id: "categories" },
          { name: "Settings", icon: "settings", href: "/admin/settings", id: "settings" }
        ].map((item) => (
          <Link key={item.id} href={item.href} className="flex-1">
            <div className={`flex flex-col items-center gap-0.5 transition-all ${
              activePage === item.id ? 'text-primary' : 'text-gray-400'
            }`}>
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: activePage === item.id ? "'FILL' 1" : "" }}>
                {item.icon}
              </span>
              <span className="text-[10px] font-bold">{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
