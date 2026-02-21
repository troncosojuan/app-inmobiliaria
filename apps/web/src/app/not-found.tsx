import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-muted">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
      <p className="mt-2 text-muted-foreground">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
