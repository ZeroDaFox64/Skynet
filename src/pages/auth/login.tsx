import LoginForm from "./loginForm";

export default function App() {
  return (
    <div className="flex min-h-screen font-sans bg-[#f9fafb] dark:bg-zinc-950 transition-colors duration-300">
      {/* Left side: Image and Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden bg-[#da1f26] dark:bg-[#9c1319]">
        {/* Placeholder image from Unsplash (Fried Chicken) */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80')" }}
        ></div>

        {/* Red and Yellow Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#da1f26]/90 to-[#b3141b]/95 dark:from-[#9c1319]/90 dark:to-[#730d11]/95"></div>

        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#fff200] via-transparent to-transparent"></div>

        {/* Brand Content */}
        <div className="relative z-10 text-center flex flex-col items-center p-12">
          <div className="relative mb-8 transform hover:scale-105 transition-transform duration-500">
            <h1 className="text-7xl xl:text-8xl font-black text-[#fff200] drop-shadow-2xl tracking-tighter" style={{ WebkitTextStroke: '2px #8a1318' }}>
              DORE'S
            </h1>
            <div className="absolute -top-10 -right-10 text-6xl transform rotate-12 drop-shadow-xl animate-bounce">🍗</div>
          </div>
          <p className="text-3xl font-bold text-white max-w-md drop-shadow-lg leading-tight mb-4">
            Sabor irresistible.
          </p>
          <p className="text-xl font-medium text-white/90 max-w-sm drop-shadow-md leading-relaxed">
            Pide en línea y disfruta del pollo frito más crujiente de la ciudad, directo a tu puerta.
          </p>

          <div className="mt-12 flex gap-3">
            <div className="w-12 h-2 bg-[#fff200] rounded-full opacity-100 shadow-[0_0_10px_rgba(255,242,0,0.5)]"></div>
            <div className="w-4 h-2 bg-white rounded-full opacity-40"></div>
            <div className="w-4 h-2 bg-white rounded-full opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6 sm:p-12 relative overflow-y-auto">
        {/* Mobile background */}
        <div className="absolute top-0 left-0 w-full h-64 bg-[#da1f26] dark:bg-[#9c1319] lg:hidden rounded-b-[3rem] shadow-lg"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 pt-4">
            <h1 className="text-5xl font-black text-[#fff200] drop-shadow-md tracking-tighter" style={{ WebkitTextStroke: '1.5px #8a1318' }}>
              DORE'S <span className="text-3xl">🍗</span>
            </h1>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(218,31,38,0.08)] dark:shadow-black/20 border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}