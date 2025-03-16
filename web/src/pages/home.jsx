import { Link } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function HomePage() {
  return (
    <section className="bg-white h-screen overflow-hidden">
      <div className="grid max-w-screen-xl px-4 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
        {/* Contenedor del texto y botones (izquierda) */}
        <div className="mr-auto place-self-center lg:col-span-7">
          {/* Eslogan */}
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl text-purple-800">
            With Mykan, <br />Your Tasks <br />
            <span className="underline decoration-[#8079db]">Your Way.</span>
          </h1>

          {/* Descripción */}
          <p className="max-w-2xl mb-6 font-light text-gray-600 lg:mb-8 md:text-lg lg:text-xl">
            Manage your tasks efficiently and effortlessly with our intuitive task manager. Stay organized and
            productive every day.
          </p>

          {/* Botones */}
          <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-white bg-[#8079db] rounded-lg sm:w-auto hover:bg-purple-800 focus:ring-4 focus:ring-[#4c408d]"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-[#0f3785] bg-white border border-[#0f3785] rounded-lg sm:w-auto hover:bg-[#0f3785] hover:text-white focus:ring-4 focus:ring-[#0f3785]"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Contenedor de la animación (derecha) */}
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex lg:items-center lg:justify-center">
          <div className="w-128 h-128"> 
            <DotLottieReact
              src="https://lottie.host/839c7706-2db5-43a4-bbb2-45183673b3c0/7Hl84BSCJr.lottie"
              loop
              autoplay
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;