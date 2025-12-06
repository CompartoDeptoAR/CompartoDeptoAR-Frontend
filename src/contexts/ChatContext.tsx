import React, { createContext, useContext, useState } from "react";

interface ChatContextProps {
  noLeidos: number;
  setNoLeidos: React.Dispatch<React.SetStateAction<number>>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [noLeidos, setNoLeidos] = useState(0);

  return (
    <ChatContext.Provider value={{ noLeidos, setNoLeidos }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatContext debe usarse dentro de ChatProvider");
  return context;
};
