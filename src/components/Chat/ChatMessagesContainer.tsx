import { KeyboardEvent, useContext, useEffect, useRef, useState } from "react";

import { SendSvg } from "../../assets/send";
import { AuthContext } from "../../providers/AuthContextProvider";
import { ChatContext } from "../../providers/ChatContextProvider";
import Input from "../layout/Input";
import useApi from "../../hooks/useApi";
import { MessageApiResponse } from "../../types";

export default function ChatMessagesContainer() {
    const { user, checkUserIsLoggedInOnServer } = useContext(AuthContext);
    const { selectedUser, messagesWithSelectedUser } = useContext(ChatContext);
    const [message, setMessage] = useState<string>("");
    const { data: messageResponse, handleFetch: handleFetchMessage } = useApi<MessageApiResponse>();

    const sendMessage = () => {
        handleFetchMessage({
            url: "/api/messages",
            method: "POST",
            body: JSON.stringify({
                messageText: message,
                messageReceiverId: selectedUser.userId,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    useEffect(() => {
        checkUserIsLoggedInOnServer(messageResponse);
        setMessage("");
    }, [messageResponse]);


    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key == "Enter") {
            sendMessage();
        }
    }

    const scroll = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesWithSelectedUser]);


    return (
        <div className="flex flex-col justify-between p-5 h-[500px] rounded bg-slate-300 border-2 border-slate-400">
            {selectedUser.userId > -1 ? (
                <>
                    <div className="flex flex-col flex-grow gap-2 rounded p-4 bg-white overflow-auto">
                        {messagesWithSelectedUser.map((messageWithSelectedUser) => (
                            <div
                                ref={scroll}
                                className={`p-2 rounded max-w-xs ${messageWithSelectedUser.messageSenderId === user.userId
                                    ? "place-self-start bg-slate-200"
                                    : "place-self-end bg-slate-400"
                                    }`}
                            >
                                <p className="text-sm">{messageWithSelectedUser.messageText}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-end mt-3">
                        <Input
                            value={message}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="mx-4" onClick={sendMessage}>
                            <SendSvg width={30} height={30} />
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex justify-center p-10">
                    <p className="text-lg">Choose chat to see messages</p>
                </div>
            )}
        </div>
    );
}