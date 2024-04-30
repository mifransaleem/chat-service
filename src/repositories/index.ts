import AppDataSource from "../data-source";
import Chat from "../models/Chat";
import ChatMember from "../models/ChatMember";
import Message from "../models/Message";
import User from "../models/User";

// Define repositories for each model

export const UserRepository = AppDataSource.getRepository(User);
export const ChatRepository = AppDataSource.getRepository(Chat);
export const MessageRepository = AppDataSource.getRepository(Message);
export const ChatMemberRepository = AppDataSource.getRepository(ChatMember);
