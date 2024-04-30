import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import Chat from "./Chat";
import User from "./User";

@Entity("chatMembers")
export default class ChatMember {
  @PrimaryColumn()
  chatId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Chat, chat => chat.id)
  @JoinColumn({ name: "chatId" })
  chat: Chat;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  joinedAt: Date;
}
