import React, { useContext, useState } from "react";
import ResponsiveAppBar from "./ResponsiveAppBar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function Login(): JSX.Element {
  const { setPage } = useContext(LoginContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = (): void => {
    void axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}auth`, {
        username,
        password,
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        void axios
          .get(`${process.env.REACT_APP_API_ENDPOINT}user/`, {
            headers: {
              Authorization: `Token ${response.data.token}`,
            },
          })
          .then((res) => {
            localStorage.setItem("user", JSON.stringify(res.data));
            navigate("/home");
          });
      });
  };
  return (
    <div id="login_page" className="mt-32">
      <div className="bg-white rounded shadow-lg w-1/2 mx-auto p-8">
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-red text-xs italic">Please choose a password.</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-clifford hover:bg-red-dark text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={() => handleLogin()}
          >
            Login
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-clifford hover:text-red-darker"
            href="#"
            onClick={() => setPage("register")}
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

function Register(): JSX.Element {
  const { page, setPage } = useContext(LoginContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = (): void => {
    void axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}register/`, {
        username,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
      })
      .then((response) => {
        setPage("login");
      });
  };

  return (
    <div id="registration_page" className="mt-32">
      <div className="bg-white rounded shadow-lg w-1/2 mx-auto p-8">
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="first_name"
          >
            First Name
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="first_name"
            type="tel"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <p className="text-red text-xs italic">Please enter first name.</p>
        </div>
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="last_name"
          >
            Last Name
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="address"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <p className="text-red text-xs italic">Please enter last name.</p>
        </div>
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-red text-xs italic">Please choose a password.</p>
        </div>
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="email"
            type="email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-red text-xs italic">Please enter a valid email.</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-clifford hover:bg-red-dark text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={() => handleRegister()}
          >
            Sign Up
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-clifford hover:text-red-darker"
            href="#"
            onClick={() => setPage("login")}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

interface ILoginContext {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

const LoginContext = React.createContext<ILoginContext>({
  page: "login",
  setPage: () => () => {},
});

function LoginRegistration(): JSX.Element {
  const [page, setPage] = React.useState("login");
  const navigate = useNavigate();
  console.log(localStorage.getItem("token"));

  const [token, setToken] = React.useState(localStorage.getItem("token"));

  React.useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  return (
    <LoginContext.Provider value={{ page, setPage }}>
      <ResponsiveAppBar />
      {page === "login" ? <Login /> : <Register />}
    </LoginContext.Provider>
  );
}

export default LoginRegistration;
