import { useForm } from "react-hook-form";
import * as IronBriteAPI from "../../../services/api-service";
import { useAuthContext } from "../../../contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/dark-context"; // Importa el hook useTheme

function RegisterPage() {
  const { register, handleSubmit, formState, setError } = useForm();
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const errors = formState.errors;
  const { theme } = useTheme(); // Obtén el tema actual

  const handleRegister = async (user) => {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("avatar", user.avatar[0]);

    try {
      await IronBriteAPI.register(formData);
      const data = await IronBriteAPI.login(user);
      login(data);
      navigate("/");
    } catch (error) {
      const { data } = error.response;
      Object.keys(data.errors).forEach((inputName) =>
        setError(inputName, { message: data.errors[inputName] })
      );
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${
      theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
    }`}>
      <div className={`max-w-md w-full p-6 shadow-lg rounded-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}>
        <h2 className="text-2xl font-semibold text-center mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block font-medium">Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className="fa fa-user"></i>
              </span>
              <input
                type="text"
                className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:ring-purple-500"
                    : "bg-white border-gray-300 focus:ring-purple-500"
                } ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="John Doe"
                {...register("name", { required: "Mandatory field" })}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block font-medium">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className="fa fa-envelope"></i>
              </span>
              <input
                type="email"
                className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:ring-purple-500"
                    : "bg-white border-gray-300 focus:ring-purple-500"
                } ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="user@example.org"
                {...register("email", { required: "Mandatory field" })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block font-medium">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className="fa fa-lock"></i>
              </span>
              <input
                type="password"
                className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:ring-purple-500"
                    : "bg-white border-gray-300 focus:ring-purple-500"
                } ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="••••••••"
                {...register("password", { required: "Mandatory field" })}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full font-semibold py-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
            } text-white`}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;