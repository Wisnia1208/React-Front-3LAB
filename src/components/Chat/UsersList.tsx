import { useContext, useState } from "react";
import Input from "../layout/Input";

import { UserOfflineSvg } from "../../assets/userOffline";
import { UserOnlineSvg } from "../../assets/userOnline";
import { ChatContext } from "../../providers/ChatContextProvider";

export default function UsersList() {

  const { users, selectedUser, setSelectedUser } = useContext(ChatContext);
  const [searchText, setSearchText] = useState<string>("");

    return (
        <div className="flex flex-col gap-4 p-4 rounded bg-slate-300 border-2 border-slate-400">
            <div className="flex gap-2 items-center justify-between">
                <p className="text-xl font-semibold tracking-wider">Users</p>
                <div className="w-[200px]">
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search"
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {users
                    .filter(user =>
                        user.userName.toLowerCase().includes(searchText.toLowerCase())
                    )
                    .sort((a, b) => b.userIsOnline - a.userIsOnline)
                    .map((user) => (
                        <button
                            key={user.userId}
                            className={`flex flex-col items-center px-3 py-1 rounded ${selectedUser.userId === user.userId && "bg-slate-100"}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            {user.userIsOnline ? (
                                <UserOnlineSvg
                                    width={40}
                                    height={40}
                                    className="fill-emerald-800"
                                />
                            ) : (
                                <UserOfflineSvg
                                    width={40}
                                    height={40}
                                    className="fill-slate-500"
                                />
                            )}
                            <p>{user.userName}</p>
                        </button>
                    ))}
            </div>
        </div>
    );
}
