## Prisma

### Reset the development database

`npx prisma migrate reset`

This command:

1. Drops the database/schema¹ if possible, or performs a soft reset if the
   environment does not allow deleting databases/schemas¹
2. Creates a new database/schema¹ with the same name if the database/schema¹ was
   dropped
3. Applies all migrations
4. Runs seed scripts
