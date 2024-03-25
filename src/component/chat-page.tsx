"use client"
import { FormEvent, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Box, Button, Center, Flex, Heading, Input, Text } from "@yamada-ui/react";

interface IMsgDataTypes {
    roomId: string | number;
    user: string;
    msg: string;
    time: string;
}

const ChatPage = ({ socket, username, roomId }: { socket: Socket, username: string, roomId: string | number }) => {
    const [currentMsg, setCurrentMsg] = useState("");
    const [chat, setChat] = useState<IMsgDataTypes[]>([]);

    const sendData = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentMsg !== "") {
            const msgData: IMsgDataTypes = {
                roomId,
                user: username,
                msg: currentMsg,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };
            console.log(msgData);

            socket.emit("send_msg", msgData);
            setChat((pre) => [...pre, msgData]);
            setCurrentMsg("");
        }
    };


    useEffect(() => {
        fetch('/api/socketio', { method: 'POST' })
            .then(() => {
                // 既に接続済だったら何もしない
                if (socket.connected) {
                    return;
                }
                // socket.ioサーバに接続
                socket.connect();
                socket.emit("join_room", roomId);
                socket.on("receive_msg", (data: IMsgDataTypes) => {
                    setChat((pre) => [...pre, data]);
                });
            });

        return () => {
            // 登録したイベントは全てクリーンアップ
            socket.off('connect');
            socket.off('send_msg');
        };
    }, [socket]);

    return (
        <Center flexDir="column" w="100vw" h="100vh">
            <Box borderWidth="1px" borderStyle="solid" borderColor="red">
                <Box mb="4">
                    <Text>
                        Name: <Text as="b">{username}</Text> and Room Id: <Text as="b">{roomId}</Text>
                    </Text>
                </Box>
                <Box>
                    {chat.map(({ roomId, user, msg, time }, key) => (
                        <Flex
                            key={key}
                            alignItems="center"
                            gap="1"
                            mb="1"
                            {...(user === username && {
                                flexDir: "row-reverse"
                            })}
                        >
                            <Center
                                as="span"
                                bgColor="rgb(213, 213, 182)"
                                h="7xs"
                                w="7xs"
                                rounded="50%"
                                borderWidth="1px"
                                borderStyle="solid"
                                borderColor="white"
                                color="black"
                                textAlign={user == username ? "right" : "left"}
                            >
                                {user.charAt(0)}
                            </Center>
                            <Heading as="h3" textAlign={user == username ? "right" : "left"}>
                                {msg}
                            </Heading>
                        </Flex>
                    ))}
                </Box>
                <Box>
                    <form onSubmit={(e) => sendData(e)}>
                        <Input
                            type="text"
                            value={currentMsg}
                            onChange={(e) => setCurrentMsg(e.target.value)}
                            placeholder="Type your message.."
                            w="xs"
                            h="7xs"
                            p="1"
                        />
                        <Button
                            type="submit"
                            h="7xs"
                        >Send</Button>
                    </form>
                </Box>
            </Box>
        </Center>
    );
};

export default ChatPage;