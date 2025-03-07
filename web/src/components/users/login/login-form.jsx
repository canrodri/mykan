import { useForm } from "react-hook-form";
import * as MykanAPI from "../../../services/api-service";
import { useAuthContext } from "../../../contexts/auth-context.jsx";
import { Link, useNavigate } from "react-router-dom";
import RegisterPage from "../../../pages/register.jsx";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (user) => {
    try {
      user = await MykanAPI.login(user);
      login(user);
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 401) {
        const { data } = error.response;
        Object.keys(data.errors).forEach((inputName) =>
          setError(inputName, { message: data.errors[inputName] })
        );
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full flex flex-col justify-center items-center p-6">
        <div className="max-w-md w-full p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="email"
                  placeholder="user@example.org"
                  className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("email", { required: "Mandatory field" })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className="fa fa-lock"></i>
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("password", { required: "Mandatory field" })}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-semibold py-2 mt-3 rounded-md hover:bg-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              
              >
                Login
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center mt-4">
              <a href="#" className="text-purple-600 hover:text-purple-700">
                Forgot my password
              </a>
            </div>

            {/* "OR" Section */}
            <div className="flex items-center justify-center space-x-2 my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="text-gray-600">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center bg-gray-100 text-gray-800 font-semibold py-2 rounded-md hover:bg-gray-200 transition duration-300"
            >
              <i className="fab fa-google mr-2"></i>
              Log in with Google
            </button>

            {/* Create Account Link */}
            <div className="text-center mt-4">
              <p className="text-gray-600">
                Not registered?{" "}
                <Link
                  to={RegisterPage}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
