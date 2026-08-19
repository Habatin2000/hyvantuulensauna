import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="fi">
      <body className="flex min-h-screen items-center justify-center bg-stone-50 p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Sivua ei löytynyt / Page not found
          </h1>
          <p className="text-stone-600 mb-4">
            Hakemaasi sivua ei valitettavasti löytynyt.
            <br />
            Unfortunately, the page you were looking for could not be found.
          </p>
          <Link href="/" className="text-[#3b82f6] hover:underline font-medium">
            Palaa etusivulle / Return to homepage
          </Link>
        </div>
      </body>
    </html>
  );
}
