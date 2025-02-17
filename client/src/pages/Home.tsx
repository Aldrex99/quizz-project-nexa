export default function Home() {
  return (
    <div className="">
      <div className="mx-4 flex w-full flex-col space-y-6 rounded-lg border-transparent bg-themedFg px-6 py-12 shadow-theme sm:m-0 sm:w-1/2 sm:px-12 lg:w-1/3">
        <h1 className="mb-4 flex justify-center text-2xl font-semibold text-primary">
          Quizz universe
        </h1>
        <p className="text-center text-lg text-gray-500">
          Bienvenue sur Quizz universe, le meilleur endroit pour tester vos
          connaissances.
        </p>
        <div className="flex justify-center">
          Et ici un petit bouton pour commencer à jouer
        </div>
      </div>
    </div>
  );
}
