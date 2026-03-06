Place your original MySQL dump in this folder to auto-import it into the Docker MySQL container.

Use a `.sql` file name such as:

- `001-grocery-app.sql`

How it works:

- MySQL runs files in `/docker-entrypoint-initdb.d` only when the database volume is empty.
- That means the import happens on first container initialization, not on every startup.

Recommended steps:

1. Export your original database:
   `mysqldump -u root -p grocery_app > mysql/init/001-grocery-app.sql`
2. Remove the old Docker MySQL volume so initialization runs again:
   `docker compose down -v`
3. Start the stack:
   `docker compose up -d`

Notes:

- The database name in the dump should match `DB_NAME` in `.env` or `.env.example`.
- If you already started MySQL once without the dump, you must remove the volume with `docker compose down -v` before the auto-import will run.
