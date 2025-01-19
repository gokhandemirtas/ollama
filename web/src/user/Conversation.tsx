import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { FireIcon } from "@heroicons/react/20/solid";
import IConversation from "../core/models/conversation";
import Markdown from "react-markdown";
import { Panel } from "../core/components/Panel";
import { TrashIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import api from "../core/services/HttpClient";
import { formatTime } from "../core/utils/timestamper";

export default function Conversation({conversation, callback }: {
  conversation: IConversation;
  callback: () => void;
}) {

  function copyToClipboard() {
    navigator.clipboard.writeText(conversation.content);
  }

  function deleteChat() {
    api.delete(`${import.meta.env.VITE_BACKEND_URL}/conversation/${conversation.id}`)
      .json()
      .then(() => {
        conversation.isSoftDeleted = true;
        callback();
      });
  }

  function getClass() {
    const bubbleClass = `relative flex flex-col w-full max-w-[100%] leading-1.5 p-4 border-gray-200 bg-gray-100  mb-4 ${conversation.role === 'assistant' ? 'dark:bg-stone-600 rounded-tl-lg rounded-br-xl rounded-bl-xl' : 'dark:bg-stone-700 rounded-bl-xl rounded-tr-xl rounded-br-xl'}`;
    return bubbleClass;
  }

  return (
    <>
      {Boolean(conversation.isSoftDeleted) == false && (
        <Panel className="!bg-transparent !border-none !shadow-none !p-0">
        <div className="flex items-start gap-2.5 w-full">

          { conversation.role === 'user' && <UserCircleIcon className="size-8 text-teal-500" /> }
          <div className={getClass()}>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {conversation.role === 'assistant' ? 'Dungeon Master' : 'You'}
              </span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400" title={conversation.timestamp}>
                {formatTime(conversation.timestamp)}
              </span>
            </div>
            <aside className="overflow-hidden overflow-x-auto">
              <Markdown className="text-xs font-normal py-2.5 text-gray-900 dark:text-white">
                { conversation.content }
              </Markdown>
            </aside>
            <nav className="absolute right-2 top-2">
              <ClipboardDocumentIcon className="tool-button size-4 text-white hover:text-teal-500 cursor-pointer mb-2" onClick={copyToClipboard}/>
              <TrashIcon className="tool-button size-4 text-white hover:text-teal-500 cursor-pointer" onClick={deleteChat}/>
            </nav>
          </div>
          { conversation.role === 'assistant' && <FireIcon className="size-9 text-teal-500" /> }
        </div>
      </Panel>
      )}
    </>
  )
}
