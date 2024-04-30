import { Response } from "express";
import { sendApiResponse } from "../../utils/apiResponse";
import { ChatMemberRepository, ChatRepository, MessageRepository } from "../../repositories";
import Chat from "../../models/Chat";
import Message from "../../models/Message";
import ChatMember from "../../models/ChatMember";
import { ChatTypeEnums } from "../../enums/chat.enum";

export const createChatService = async (res: Response, data: string) => {
  try {

    return sendApiResponse(res, false, 201, 'Chat created successfully', {});
  } catch (error) {
    throw error;
  }
};

export const createChatOrSaveMessage = async (senderId: number, msgData: any) => {
  try {
    const { message, chatMembers } = msgData;

    // Ensure the sender is always included and set as admin
    if (!chatMembers.includes(senderId)) {
      chatMembers.push(senderId);
    }

    const existingChat = await ChatRepository.createQueryBuilder("chat")
      .leftJoin("chat.members", "member")
      .where("chat.isGroupChat = :isGroupChat", { isGroupChat: chatMembers.length > 2 })
      .andWhere("member.userId IN (:...members)", { members: chatMembers })
      .groupBy("chat.id")
      .having("COUNT(DISTINCT member.userId) = :memberCount", { memberCount: chatMembers.length })
      .getOne();

    if (existingChat) {
      // Add new message to existing chat
      const newMessage = MessageRepository.create({
        content: message.content,
        fileUrl: message.fileUrl,
        messageType: message.messageType,
        senderId: senderId,
        chat: existingChat // Link message directly to chat
      });
      await MessageRepository.save(newMessage);

      existingChat.lastMessage = newMessage; // Update last message
      await ChatRepository.save(existingChat);
      return existingChat;
    }

    // Create a new chat
    const chat = ChatRepository.create({
      name: chatMembers.length > 2 ? ChatTypeEnums.Group : ChatTypeEnums.OneToOne,
      isGroupChat: chatMembers.length > 2,
      creatorId: senderId
    });

    await ChatRepository.save(chat); // Save chat to generate an ID

    // Create and assign the initial message
    const messageEntity = MessageRepository.create({
      content: message.content,
      fileUrl: message.fileUrl,
      messageType: message.messageType,
      senderId: senderId,
      chat: chat // Link message to chat
    });
    await MessageRepository.save(messageEntity);

    chat.lastMessage = messageEntity; // Set last message
    chat.messages = [messageEntity]; // Link messages array

    // Create chat members
    chat.members = chatMembers.map(userId => {
      const member = ChatMemberRepository.create({
        userId,
        chatId: chat.id,
        isAdmin: userId === senderId
      });
      return member;
    });

    await ChatMemberRepository.save(chat.members);
    await ChatRepository.save(chat); // Final save to update all relations

    return chat;
  } catch (error) {
    console.error('Failed to create or update chat:', error);
    throw error;
  }
}

export const saveNewMessage = async (senderId: number, msgData: any) => {
  try {
    const { message, chatId } = msgData;

    const chat = await ChatRepository.findOne({
      where: { id: chatId },
      relations: ['members'] // Load members and messages if needed
    });
    if (!chat) {
      throw new Error('Chat not found');
    }

    // check if the members are part of the chat
    const member = chat.members.find(member => member.userId === senderId);
    if (!member) {
      throw new Error('User not part of the chat');
    }

    const newMessage = MessageRepository.create({
      chatId: chatId,
      content: message.content,
      fileUrl: message.fileUrl,
      messageType: message.messageType,
      senderId: senderId,
      chat: chat
    });
    await MessageRepository.save(newMessage);

    chat.lastMessageId = newMessage.id;
    chat.lastMessage = newMessage;
    await ChatRepository.save(chat);

    return chat;
  } catch (error) {
    console.error('Failed to save new message:', error);
    throw error;
  }
}
