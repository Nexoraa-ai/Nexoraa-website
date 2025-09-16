export default function NotFound() {
  return (
    <main className="min-h-[60vh] grid place-items-center px-6">
      <div className="text-center">
        <p className="text-sm text-zinc-400">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Page not found</h1>
        <p className="mt-2 text-zinc-400">The page you are looking for doesn’t exist.</p>
        <a href="/" className="mt-6 inline-block rounded-md bg-primary-600 px-4 py-2">Back to home</a>
      </div>
    </main>
  )
}
