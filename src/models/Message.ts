import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import Chat from "./Chat";
import User from "./User";
import { MessageTypeEnums } from "../enums/chat.enum";

@Entity("messages")
export default class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: number;

  @ManyToOne(() => Chat, chat => chat.messages)
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @Column()
  senderId: number;

  @ManyToOne(() => User, user => user.messages)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({
    type: "enum",
    enum: MessageTypeEnums
  })
  messageType: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
