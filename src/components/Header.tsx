const Header = () => (
  <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
    <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6 text-white"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-white">
          COP Bill Detector
        </h1>
        <p className="text-xs text-slate-400">
          Detección de billetes colombianos falsos con IA
        </p>
      </div>
    </div>
  </header>
)

export default Header
