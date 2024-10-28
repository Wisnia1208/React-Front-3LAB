import { ChatContextProvider } from "../../providers/ChatContextProvider";
import UsersList from "./UsersList";
import ChatMessagesContainer from "./ChatMessagesContainer";

export default function Chat() {
  return (
    <ChatContextProvider>
      <div className="flex h-full w-full px-80 py-20 gap-4">
        {/* TODO: 6*/}
        <div className="w-1/3">
          <UsersList />
        </div>
        <div className="w-2/3">
          <ChatMessagesContainer />
        </div>
      </div>
    </ChatContextProvider>
  );
}
