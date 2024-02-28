## Prisma

### Create and apply migrations

`npx prisma migrate dev`

This command:

1. Reruns the existing migration history in the shadow database in order to detect schema drift (edited or deleted migration file, or a manual changes to the database schema)
2. Applies pending migrations to the shadow database (for example, new migrations created by colleagues)
3. If it detects changes to the Prisma schema, it generates a new migration from these changes
4. Applies all unapplied migrations to the development database and updates the \_prisma_migrations table
5. Triggers the generation of artifacts (for example, Prisma Client)

The migrate dev command will prompt you to reset the database in the following scenarios:

- Migration history conflicts caused by modified or missing migrations
- The database schema has drifted away from the end-state of the migration history

### Reset the development database

`npx prisma migrate reset`

This command:

1. Drops the database/schema¹ if possible, or performs a soft reset if the
   environment does not allow deleting databases/schemas¹
2. Creates a new database/schema¹ with the same name if the database/schema¹ was
   dropped
3. Applies all migrations
4. Runs seed scripts
