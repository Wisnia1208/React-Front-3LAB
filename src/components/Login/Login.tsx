import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthContextProvider";
import Input from "../layout/Input";
import Button from "../layout/Button";

export default function Login() {
  const navigate = useNavigate();

  const [userPassword, setUserPassword] = useState("");
  const [userName, setUserName] = useState("");

  const { authenticated, login } = useContext(AuthContext);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login(userName, userPassword);
  };

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  return (
    <>
      <div className="flex flex-col items-center h-full w-full px-80 py-20">
        <div className="flex flex-col items-center gap-7 w-[400px] h-[400px] rounded-xl bg-slate-300 border-2 border-slate-400">
          <p className="mt-10 text-2xl font-semibold tracking-wider uppercase">
            Log in
          </p>
          <form
            className="flex flex-col justify-between items-center w-full h-full px-10 pb-10"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-4">
              <Input
                label="User login"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Input
                label="User password"
                value={userPassword}
                type="password"
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>
            <Button text="Sign in" type="submit" onClick={handleSubmit} />
            <Link to="/register" className="underline">
              Register here
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
