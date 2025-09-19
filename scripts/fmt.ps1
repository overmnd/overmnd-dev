# scripts\fmt.ps1
ruff fix .
isort .
black .
