import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import Eye from "../../assets/svg/Eye";
import { useAppDispatch } from "../../app/hooks";
import { login } from "../../features/login/loginSlice";

type Data = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const labelUsernameRef = useRef<HTMLLabelElement>(null);
  const labelPasswordRef = useRef<HTMLLabelElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<Data>({
    username: "",
    password: "",
  });

  const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToPost = {
      username: data.username,
      password: data.password,
    };

    const response = await fetch("https://technical-task-api.icapgroupgmbh.com/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(dataToPost),
    });

    if (!response.ok) {
      labelUsernameRef.current!.textContent = "Wrong login or password";
      labelUsernameRef.current!.style.color = "Red";
      return;
    }

    dispatch(login());

    navigate("/");
  };

  const showPassword = (
    setIsPasswordShown: React.Dispatch<React.SetStateAction<boolean>>,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    if (ref.current) {
      if (ref.current.type === "password") {
        ref.current.type = "text";
      } else {
        ref.current.type = "password";
      }
    }
    setIsPasswordShown((prev) => !prev);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === usernameRef.current) {
      labelUsernameRef.current?.classList.add("active");
      data.password.length
        ? labelPasswordRef.current?.classList.add("active")
        : labelPasswordRef.current?.classList.remove("active");
    } else if (e.target === passRef.current) {
      labelPasswordRef.current?.classList.add("active");
      data.username.length
        ? labelUsernameRef.current?.classList.add("active")
        : labelUsernameRef.current?.classList.remove("active");
    } else {
      if (!data.password.length) {
        labelPasswordRef.current?.classList.remove("active");
      }
      if (!data.username.length) {
        labelUsernameRef.current?.classList.remove("active");
      }
    }
  };

  return (
    <div className="wrapper" onClick={(e) => handleClick(e)}>
      <form className="login-form" onSubmit={(e) => logIn(e)}>
        <div className="title">Login</div>
        <div className="input-wrapper">
          <label htmlFor="username" className="username-label" ref={labelUsernameRef}>
            Username
          </label>
          <div>
            <input
              type="text"
              className="username"
              id="username"
              onChange={(e) => setData((prev) => ({ ...prev, username: e.target.value }))}
              ref={usernameRef}
            />
          </div>
        </div>
        <div className="input-wrapper">
          <label htmlFor="password" className="password-label" ref={labelPasswordRef}>
            Password
          </label>
          <div>
            <input
              type="password"
              className="password"
              id="password"
              onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
              ref={passRef}
            />
            <Eye showPassword={showPassword} passRef={passRef} />
          </div>
        </div>

        <input type="submit" value="Log in" className="submit" />
        <div className="text">
          Don't have an account yet?{" "}
          <Link to="/register" className="redirect">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
