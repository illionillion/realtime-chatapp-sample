"use client";
import { io } from "socket.io-client";
import { useState } from "react";
import ChatPage from "@/component/chat-page";
import { Box, Button, Center, Input } from "@yamada-ui/react";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setroomId] = useState("");

  const socket = io({ autoConnect: false });

  const handleJoin = async () => {
    if (userName !== "" && roomId !== "") {
      console.log(userName, "userName", roomId, "roomId");
      setShowSpinner(true);
      setShowChat(true);
      setShowSpinner(false);
    } else {
      alert("Please fill in Username and Room Id");
    }
  };

  return (
    <Box>
      {
        !showChat ? (
          <Center
            w="100vw"
            h="100vh"
            flexDir="column"
            gap="md"
          >
            <Input
              w="xs"
              h="7xs"
              p="1"
              type="text"
              placeholder="Username"
              onChange={(e) => setUserName(e.target.value)}
              isDisabled={showSpinner}
            />
            <Input
              w="xs"
              h="7xs"
              p="1"
              type="text"
              placeholder="room id"
              onChange={(e) => setroomId(e.target.value)}
              isDisabled={showSpinner}
            />
            <Button
              isLoading={showSpinner}
              w="xs"
              h="7xs"
              onClick={() => handleJoin()}
            >
              Join
            </Button>
          </Center>
        ) : (
          <ChatPage socket={socket} roomId={roomId} username={userName} />
        )
      }
    </Box>
  );
}