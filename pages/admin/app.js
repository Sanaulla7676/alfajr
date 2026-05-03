import Layout from "@/components/Layout";
import Head from "next/head";

export default function AdminAppInstall() {
  return (
    <Layout>
      <Head>
        <title>Download Admin App | Alfajr</title>
        <link rel="manifest" href="/manifest-admin.json" />
      </Head>
      <div className="max-w-xl mx-auto py-12 px-6 text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-primary text-5xl">admin_panel_settings</span>
        </div>
        
        <h1 className="text-3xl font-h1 text-on-surface mb-4">Alfajr Admin App</h1>
        <p className="text-on-surface-variant font-bold mb-10">Follow these steps to install the admin management app on your iPhone.</p>
        
        <div className="space-y-6 text-left">
          <div className="flex gap-4 items-start bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">1</div>
            <div>
              <p className="font-h2 text-on-surface text-lg">Open in Safari</p>
              <p className="text-on-surface-variant text-sm mt-1">Make sure you are viewing this page in the <b>Safari</b> browser on your iPhone.</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">2</div>
            <div>
              <p className="font-h2 text-on-surface text-lg">Tap the Share Button</p>
              <p className="text-on-surface-variant text-sm mt-1">Tap the square icon with an upward arrow <span className="material-symbols-outlined text-sm align-middle">ios_share</span> at the bottom of your screen.</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">3</div>
            <div>
              <p className="font-h2 text-on-surface text-lg">Add to Home Screen</p>
              <p className="text-on-surface-variant text-sm mt-1">Scroll down and tap <b>"Add to Home Screen"</b>. The app will appear on your iPhone with its own icon.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-primary/5 p-6 rounded-[32px] border border-primary/10">
          <p className="text-primary font-bold text-sm">Once installed, you can open the Alfajr Admin app from your home screen and you will stay logged in forever!</p>
        </div>
      </div>
    </Layout>
  );
}
