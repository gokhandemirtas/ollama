import { Field, Label, Textarea } from "@headlessui/react";
import { useEffect, useState } from "react";

import Conversation from "./Conversation";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "../core/components/ErrorBoundaryFallback";
import type IConversation from "../core/models/conversation";
import { Panel } from "../core/components/Panel";
import { SnarkBar } from "../core/components/SnarkBar";
import api from "../core/services/HttpClient";

export default function Conversations() {
	const [query, setQuery] = useState("");
	const [conversations, setConversations] = useState<Array<IConversation>>([]);
	const [inProgress, setInProgress] = useState(false);

	function clearChatHistory() {
		api
			.delete(`${import.meta.env.VITE_BACKEND_URL}/conversations`)
			.json()
			.then(() => {
				setQuery("");
        setConversations([]);
			});
	}

	function updateConversation() {
		api
			.get(`${import.meta.env.VITE_BACKEND_URL}/conversations`)
			.json()
			.then((res: any) => {
				setConversations(res);
			});
	}

	function getConversations() {
		api
			.get(`${import.meta.env.VITE_BACKEND_URL}/conversations`)
			.json()
			.then((res: any) => {
				setConversations(res);
			});
	}

  function scrollToBottom() {
    setTimeout(() => {
      const scrollTarget = document.getElementById("scroll-target");
      if (scrollTarget) {
        scrollTarget.scrollIntoView({ behavior: "smooth" });
      }
    }, 300)
  }

  function onDeleteHandler(conversationId: number) {
    setConversations(conversations.filter((conversation) => conversation.id !== conversationId));
  }

  function onMarkdownEvent(content: string) {
    const query = `Tell me more about ${content}`;
    setQuery(query);
    // submitQuery(null as any);
  }

  function onEnterHandler(e: React.KeyboardEvent) {
    console.log(`Key pressed: ${e.key}`);
    if (e.key === "Enter") {
      submitQuery(e);
    }
  }

	useEffect(() => {
		getConversations();
    scrollToBottom();
	}, [setConversations]);

	const submitQuery = (e: React.FormEvent) => {
		e && e.preventDefault();
		setInProgress(true);

		api
			.post(`${import.meta.env.VITE_BACKEND_URL}/query`, {
				json: { query },
				timeout: import.meta.env.VITE_TIMEOUT,
			})
			.json()
			.then((res: any) => {
				updateConversation();
			})
			.finally(() => {
				setInProgress(false);
				setQuery("");
        scrollToBottom();
			});
	};
	return (
		<>
			<ErrorBoundary fallback={<ErrorBoundaryFallback errorText="" />}>
				{ conversations &&
          conversations.map((conversation, index) =>
            <Conversation conversation={conversation}
              onMarkdownEvent={onMarkdownEvent}
              onDeleteHandler={onDeleteHandler} key={index} />
          )
        }
        <Panel>
					<form className={inProgress ? "opacity-90 pointer-events-none" : ""} id="scroll-target">
						<Field>
							<Label className="text-xs/6 text-black">
								{!inProgress && "Ask a question"}
								{inProgress && <SnarkBar className="text-emerald-600 font-bold" />}
							</Label>
							<Textarea id="prompt" name="prompt" rows={3} onChange={(e) => setQuery(e.target.value)} className="input-override w-full" spellCheck="false" value={query}></Textarea>
						</Field>

						<div>
							<button type="submit" className="primary-button mt-4 float-right" disabled={query.length === 0 || inProgress} onClick={(e) => submitQuery(e)} onKeyDown={(e) => onEnterHandler(e)}>

								Query
							</button>
							{conversations.length > 0 && (
								<button onClick={clearChatHistory} disabled={inProgress} className="outline-button mt-4 mr-4 float-right">
									Clear history
								</button>
							)}
						</div>
					</form>
				</Panel>
			</ErrorBoundary>
		</>
	);
}
