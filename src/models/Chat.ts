import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import Message from "./Message";
import ChatMember from "./ChatMember";
import User from "./User";

@Entity("chats")
export default class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  isGroupChat: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column({nullable: true})
  lastMessageId: number;

  @OneToOne(() => Message, message => message.chat, { cascade: true })
  @JoinColumn({ name: 'lastMessageId' })
  lastMessage: Message;

  @OneToMany(() => Message, message => message.chat, { cascade: ['insert'] })
  messages: Message[];

  @OneToMany(() => ChatMember, chatMember => chatMember.chat, { cascade: ['insert'] })
  members: ChatMember[];
}
