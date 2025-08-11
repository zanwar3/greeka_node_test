import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTable1733960000000 implements MigrationInterface {
  name = 'CreateTasksTable1733960000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('Pending', 'Done', 'In Progress', 'Paused')`);
    await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('Red', 'Yellow', 'Blue')`);
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(255) NOT NULL,
        "dueDate" TIMESTAMPTZ,
        "status" "public"."tasks_status_enum" NOT NULL,
        "priority" "public"."tasks_priority_enum" NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "isActive" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_tasks_name" ON "tasks" ("name")`);
    await queryRunner.query(`CREATE INDEX "IDX_tasks_status" ON "tasks" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_tasks_priority" ON "tasks" ("priority")`);
    await queryRunner.query(`CREATE INDEX "IDX_tasks_isActive" ON "tasks" ("isActive")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_isActive"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_priority"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_name"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."tasks_priority_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."tasks_status_enum"`);
  }
}


