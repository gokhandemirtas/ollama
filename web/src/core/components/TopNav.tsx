export default function TopNav() {
  return (
    <>
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto">
          <nav className="flex items-center justify-between py-4">
            <div>
              <a href="/" className="text-xl font-bold">Logo</a>
            </div>
            <div>
              <a href="/prompt" className="text-sm font-semibold mx-5 bg-slate-800">Prompt</a>
              <a href="/admin" className="text-sm font-semibold mx-5">Admin</a>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
