import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseTables1714463962141 implements MigrationInterface {
    name = 'BaseTables1714463962141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT 'https://buffdudes.s3.us-west-2.amazonaws.com/avatar.png', "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."messages_messagetype_enum" AS ENUM('text', 'file', 'audio')`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "chatId" integer NOT NULL, "senderId" integer NOT NULL, "content" text NOT NULL, "fileUrl" character varying, "messageType" "public"."messages_messagetype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chats" ("id" SERIAL NOT NULL, "name" character varying, "isGroupChat" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer NOT NULL, "lastMessageId" integer, CONSTRAINT "REL_5768a56bdd855c5b78ce66c9a3" UNIQUE ("lastMessageId"), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chatMembers" ("chatId" integer NOT NULL, "userId" integer NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5e2e22e325c56054e78e3ddf874" PRIMARY KEY ("chatId", "userId"))`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_9ff8fc297ba6317c88421aecaed" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_5768a56bdd855c5b78ce66c9a37" FOREIGN KEY ("lastMessageId") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatMembers" ADD CONSTRAINT "FK_d306e61c3808b89f5f6767a9585" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatMembers" ADD CONSTRAINT "FK_875551cd286599f994d44abf54a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chatMembers" DROP CONSTRAINT "FK_875551cd286599f994d44abf54a"`);
        await queryRunner.query(`ALTER TABLE "chatMembers" DROP CONSTRAINT "FK_d306e61c3808b89f5f6767a9585"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_5768a56bdd855c5b78ce66c9a37"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_9ff8fc297ba6317c88421aecaed"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115"`);
        await queryRunner.query(`DROP TABLE "chatMembers"`);
        await queryRunner.query(`DROP TABLE "chats"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TYPE "public"."messages_messagetype_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
