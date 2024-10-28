import { useContext } from "react";
import { AuthContext } from "../../providers/AuthContextProvider";
import { ChatSvg } from "../../assets/chat";
import Button from "../layout/Button";

export default function Navbar() {
    const { authenticated, user, logout } = useContext(AuthContext);


  return (
    <div className="flex justify-between items-center p-5 w-full">
      <div className="flex items-center gap-2">
        <ChatSvg />
        <p className="text-lg font-semibold uppercase tracking-wider text-slate-600">
          Chat
        </p>
      </div>
      {authenticated && user && (
        <div className="flex items-center gap-4">
          <p className="text-lg font-bold">Hi, {user.userName}!</p>
          <Button text="Sign out" type="submit" onClick={logout} />
        </div>
      )}
    </div>
  );
}
