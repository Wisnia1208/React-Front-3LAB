import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    DataApiResponse,
    Message,
    User,
    WebSocketApiMessage,
} from "../types";
import useApi from "../hooks/useApi";
import { AuthContext } from "./AuthContextProvider";

const WEBSOCKET_STATUS_USER_LOGIN = 1;
const WEBSOCKET_STATUS_USER_LOGOUT = 2;
const WEBSOCKET_STATUS_MESSAGE_SENT = 3;
const WEBSOCKET_STATUS_MESSAGE_NEW = 4;

interface ChatContextProviderProps {
    children?: ReactNode;
}

interface ChatContextProps {
    users: User[];
    selectedUser: User;
    messagesWithSelectedUser: Message[];
    setSelectedUser: (selectedUser: User) => void;
}

const INITIAL_VALUES = {
    users: [],
    selectedUser: { userId: -1, userName: "" },
    messagesWithSelectedUser: [],
    setSelectedUser: () => { },
};

export const ChatContext = createContext<ChatContextProps>(INITIAL_VALUES);

export function ChatContextProvider({ children }: ChatContextProviderProps) {
    const { authenticated } = useContext(AuthContext);

    const [users, setUsers] = useState<User[]>(INITIAL_VALUES.users);
    const [selectedUser, setSelectedUser] = useState(INITIAL_VALUES.selectedUser);
    const [, setWebsocket] = useState<WebSocket>();
    const [lastWebsocketMessage, setLastWebsocketMessage] = useState<WebSocketApiMessage>();
    const [messagesWithSelectedUser, setMessagesWithSelectedUser] = useState<Message[]>(INITIAL_VALUES.messagesWithSelectedUser);

    const { data: usersData, handleFetch: handleFetchUsers } = useApi<DataApiResponse<User>>();
    const { data: messagesData, handleFetch: handleFetchMessages } = useApi<DataApiResponse<Message>>();

    const websocketOpen = () => {
        const socket = new WebSocket(`ws://${location.host}/websocket`);

        socket.addEventListener("message", (event) => {
            try {
                setLastWebsocketMessage(JSON.parse(event.data));
            } catch (error) { }
        });
        setWebsocket(socket);
    };

    useEffect(() => {
        if (messagesData) {
            setMessagesWithSelectedUser(messagesData?.data);
        }
    }, [messagesData]);

    const getUsers = () => {
        handleFetchUsers({
            url: "/api/users/",
        });
    };

    const getMessagesWithSelectedUser = () => {
        handleFetchMessages({
            url: `/api/messages/${selectedUser.userId}/`,
        });
    };

    useEffect(() => {
        if (authenticated) {
            getUsers();
            websocketOpen();
        }
    }, [authenticated]);

    useEffect(() => {
        if (selectedUser.userId !== -1) {
            getMessagesWithSelectedUser();
        }
    }, [selectedUser]);

    useEffect(() => {
        if (usersData) {
            setUsers(usersData?.data);
        }
    }, [usersData]);

    useEffect(() => {
        // TODO 10
        if (lastWebsocketMessage) {
            if (
                lastWebsocketMessage.status === WEBSOCKET_STATUS_USER_LOGIN ||
                lastWebsocketMessage.status === WEBSOCKET_STATUS_USER_LOGOUT
            ) {
                getUsers();
            }
            if (
                lastWebsocketMessage.status === WEBSOCKET_STATUS_MESSAGE_NEW ||
                lastWebsocketMessage.status === WEBSOCKET_STATUS_MESSAGE_SENT
            ) {
                getMessagesWithSelectedUser();
            }
        }
    }, [lastWebsocketMessage]);

    return (
        <ChatContext.Provider
            value={{
                users,
                selectedUser,
                messagesWithSelectedUser,
                setSelectedUser,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}
