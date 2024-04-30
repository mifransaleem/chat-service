import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { Exclude } from "class-transformer";
import ChatMember from "./ChatMember";
import Message from "./Message";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    default: "https://buffdudes.s3.us-west-2.amazonaws.com/avatar.png",
  })
  avatar: string;

  @Exclude()
  @Column()
  password: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date;

  @OneToMany(() => Message, message => message.sender)
  messages: Message[];

  @OneToMany(() => ChatMember, chatMember => chatMember.user)
  chatMemberships: ChatMember[];
}
