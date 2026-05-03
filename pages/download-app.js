import Layout from "@/components/Layout";
import Link from "next/link";

export default function DownloadApp() {
  return (
    <Layout>
      <div className="max-w-md mx-auto py-12 px-6 text-center space-y-8">
        <div className="w-24 h-24 bg-[#2D004C] rounded-[32px] mx-auto flex items-center justify-center shadow-2xl border-2 border-[#E5B80B]">
           <span className="material-symbols-outlined text-[#E5B80B] text-5xl">install_mobile</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-black text-[#2D004C]">Get the Alfajr App</h1>
          <p className="text-gray-400 font-bold text-sm">Experience the premium grocery store on your home screen.</p>
        </div>

        {/* Android Instructions */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600">android</span>
            </div>
            <h2 className="font-black text-[#2D004C] uppercase tracking-widest text-sm">For Android</h2>
          </div>
          <ol className="text-xs font-bold text-gray-500 space-y-3 ml-4 list-decimal">
            <li>Open this site in <span className="text-[#2D004C]">Google Chrome</span>.</li>
            <li>Tap the <span className="text-[#2D004C]">three dots (⋮)</span> in the top right.</li>
            <li>Select <span className="text-[#E5B80B]">"Install App"</span> or "Add to Home screen".</li>
          </ol>
        </div>

        {/* iOS Instructions */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600">apple</span>
            </div>
            <h2 className="font-black text-[#2D004C] uppercase tracking-widest text-sm">For iPhone (iOS)</h2>
          </div>
          <ol className="text-xs font-bold text-gray-500 space-y-3 ml-4 list-decimal">
            <li>Open this site in <span className="text-[#2D004C]">Safari</span>.</li>
            <li>Tap the <span className="text-[#2D004C]">Share button</span> (square with up arrow).</li>
            <li>Scroll down and tap <span className="text-[#E5B80B]">"Add to Home Screen"</span>.</li>
          </ol>
        </div>

        <Link href="/">
          <button className="bg-[#2D004C] text-[#E5B80B] w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
            Back to Store
          </button>
        </Link>
      </div>
    </Layout>
  );
}
