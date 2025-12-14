import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-gray-100 font-sans">
      <main className="flex flex-col items-center justify-center text-center w-full max-w-4xl p-6 md:p-12 gap-8 md:gap-12">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
            「食品」を立体で
          </h1>
        </div>
        <div className="animate-fade-in-up animation-delay-300">
          <p className="max-w-2xl text-lg md:text-xl text-gray-400">
            飲食店のメニューを立体で表示し、よりクリアな世界を目指します。
            <br />
            気になるお店をクリックしてください。
          </p>
        </div>
        <div className="w-full max-w-sm animate-fade-in-up animation-delay-600">
          <div className="grid grid-cols-1 gap-4">
            <Link href="/denden" passHref>
              <div className="flex items-center justify-center w-full h-16 px-6 rounded-lg bg-gray-900 border border-gray-800 text-lg font-medium text-gray-100 transition-all duration-200 ease-in-out hover:bg-gray-800 hover:border-gray-700 hover:-translate-y-0.5 cursor-pointer">
                denden
              </div>
            </Link>
            {/* Add more store buttons here as needed */}
          </div>
        </div>
      </main>
    </div>
  );
}

