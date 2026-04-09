# Backend Setup

1. Create virtual environment

```

python -m venv .venv

```

2. Activate virtual environment

PowerShell:

```

..venv\Scripts\Activate.ps1

```

3. Install dependencies

```

pip install fastapi "uvicorn[standard]" sqlalchemy psycopg2-binary python-dotenv

```

4. Copy environment file

```

cp backend/.env.example backend/.env

```

5. Edit `.env` with your PostgreSQL credentials.

---

# Running Backend

From the `backend` folder:

```

uvicorn app.main:app --reload

```

Open API docs:

```

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

```

---

# Frontend Setup

Go to frontend folder:

```

cd frontend

```

Install dependencies:

```

npm install
pip install email-validator

```

Run dev server:

```

npm run dev

```

---

# Notes

- `.env` is not committed for security reasons
- `.venv` is ignored by git
- Each developer runs their own local PostgreSQL database

```
---