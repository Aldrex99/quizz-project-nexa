import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    document.title = "Quizz universe | Page introuvable";
  }, []);

  return (
    <>
      <main className="grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-xl font-semibold text-primary">404</p>
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-themedText sm:text-6xl">
            La page introuvable
          </h1>
          <p className="text-themedPlaceholder mt-6 text-pretty text-lg font-medium sm:text-xl/8">
            Désolé, nous n'avons pas pu trouver la page que vous cherchez.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-primary px-3.5 py-2.5 font-semibold text-primary-text shadow-sm hover:bg-primary-gradient focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
