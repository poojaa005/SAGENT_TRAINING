Put your existing MySQL dump files in this folder to auto-import on first startup.

Rules:
- Use `.sql`, `.sql.gz`, or `.sh` files.
- Use ordered names like `01_schema.sql`, `02_data.sql`.
- Files run only when the MySQL data volume is empty.

If data already exists in volume `college_mysql_data`, remove that volume before re-import:
`docker compose down -v`
