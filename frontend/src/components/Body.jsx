import { useState } from "react";
import { IoSend } from "react-icons/io5";
import SyncLoader from 'react-spinners/SyncLoader';
import DotLoader from 'react-spinners/DotLoader';
import { useMessage } from "../context/Messages";
import MessagesContainer from "./MessagesContainer";
import Modes from "./Modes";

const Body = () => {
      const [inputText, setInputText] = useState("");
      const { messages, setMessages, mode } = useMessage(); 
      const [loading, setLoading] = useState(false);
      const [selectedLanguage, setSelectedLanguage] = useState("en");
      // console.log(messages)
      console.log(messages);
      const mode_messages = messages[mode];
      console.log(mode_messages)
      const sendMessage = async () => {
      if (inputText.trim() === "") return;
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            history: mode_messages,
            content: inputText,
            role: "user"
          }),
        });

        if (!response.ok) throw new Error("API error");

        const data = await response.json();

      setMessages((prev) => ({
        ...prev,
        [mode]: [
          ...(prev[mode] || []),
          { role: "user", content: inputText },
          { role: "assistant", content: data.reply },
        ],
      }));
        setInputText("");
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setLoading(false);
      }

    };

    return (
        <div className="flex-1 bg-gray-900 p-4 flex justify-end items-center flex-col pb-36">
        <Modes />
        <MessagesContainer/>
        {loading && 
        <SyncLoader className="p-8" color="#4a90e2" size={15} loading={loading} />
        }
         <div className="w-full max-w-2xl mt-4 flex flex-col sm:flex-row items-center gap-2 transition-transform duration-200 hover:scale-105">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full sm:w-auto px-5 py-4 text-lg bg-gray-700 text-gray-200 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md cursor-pointer"
          >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="kn">Kannada</option>
                  <option value="ml">Malayalam</option>
          </select>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 w-full sm:w-auto px-5 py-4 text-lg min-h-12 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-neutral-700
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-neutral-500"
          />

          {loading ? (
            <button
              disabled
              className="px-5 py-4 text-lg bg-gray-700 text-gray-200 rounded-xl hover:bg-gray-600 active:scale-95 transition-all duration-200 shadow-md flex items-center justify-center"
            >
              <DotLoader color="#4a90e2" size={30} loading={loading} />
            </button>
          ) : (
            <button
              onClick={sendMessage}
              className="px-5 py-4 text-lg bg-gray-700 text-gray-200 rounded-xl hover:bg-gray-600 active:scale-95 transition-all duration-200 shadow-md flex items-center justify-center"
            >
              <IoSend size={30} />
            </button>
          )}
        </div>
        </div>
    );
};

export default Body;
