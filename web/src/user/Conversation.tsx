import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { FireIcon } from "@heroicons/react/20/solid";
import IConversation from "../core/models/conversation";
import Markdown from "react-markdown";
import { Panel } from "../core/components/Panel";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { formatTime } from "../core/utils/timestamper";

export default function Conversation({conversation }: {
  conversation: IConversation
}) {

  function copyToClipboard() {
    navigator.clipboard.writeText(conversation.content);
  };

  function getClass() {
    const bubbleClass = `relative flex flex-col w-full max-w-[100%] leading-1.5 p-4 border-gray-200 bg-gray-100  mb-4 ${conversation.role === 'assistant' ? 'dark:bg-stone-600 rounded-tl-lg rounded-br-xl rounded-bl-xl' : 'dark:bg-stone-700 rounded-bl-xl rounded-tr-xl rounded-br-xl'}`;
    return bubbleClass;
  }

  return (
    <>
      <Panel className="!bg-transparent !border-none !shadow-none !p-0">
      <div className="flex items-start gap-2.5 w-full">

        { conversation.role === 'user' && <UserCircleIcon className="size-7 text-teal-500" /> }
        <div className={getClass()}>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {conversation.role === 'assistant' ? 'Dungeon Master' : 'You'}
            </span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400" title={conversation.timestamp}>
              {formatTime(conversation.timestamp)}
            </span>
          </div>
          <Markdown className="text-xs font-normal py-2.5 text-gray-900 dark:text-white">
            { conversation.content }
          </Markdown>
          <ClipboardDocumentIcon className="tool-button size-5 text-white hover:text-teal-500 cursor-pointer absolute right-2 top-2" onClick={copyToClipboard}/>
        </div>
        { conversation.role === 'assistant' && <FireIcon className="size-7 text-teal-500" /> }
      </div>
      </Panel>
    </>
  )
}
