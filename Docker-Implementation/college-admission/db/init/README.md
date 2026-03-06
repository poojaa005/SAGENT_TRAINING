Put your existing MySQL dump files in this folder to auto-import on first startup.

Rules:
- Use `.sql`, `.sql.gz`, or `.sh` files.
- Use ordered names like `01_schema.sql`, `02_data.sql`.
- Files run only when the MySQL data volume is empty.

If data already exists in volume `college_mysql_data`, remove that volume before re-import:
`docker compose down -v`

Windows PowerShell tip (avoid broken encoding with null bytes):
`docker exec college-mysql sh -c "mysqldump -uroot -pPass@3110 --databases college_admission --routines --triggers --events" | Out-File -FilePath "db/init/01_existing_data.sql" -Encoding utf8`
