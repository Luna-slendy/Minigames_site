1. name surname (github nickname)
    Nikita Sevcenko(Luna-Slendy), Dmitrij Goncarov(Diterimum).

2. idea - 
    minigames site
    !1 fast quiz (2 options with procentage what people choose more often
    example: what do you choose hot chocolate or tea)
    !2 pinball
    !3 puyo puyo
    !4 tetris
    !5 DOOM
    he games open in floating window so you can play 2 at same time
    Timer on site
    login
    small wiki


3. 
    3.1. 
	Frontend
    Stacks-
    core: React, Vite
    other: JSX, CSS
    Backend
    Stacks -
    Node.js, PostgreSQL, SQLAlchemy + some additions(Idk...)

    3.2. 
	frontend + backend interaction:
    React handles all rendering and game logic.
    Backend stores: Auth, Scores, Quiz votes, Wiki, Timer history
    Games run entirely client-side (important for performance)

    3.3. approximately:

	    3.3.1. Authentication:
		    POST   /auth/register
		    POST   /auth/login
		    POST   /auth/logout
		    POST   /auth/refresh
		    GET    /auth/me

	    3.3.2. User:
		    GET    /users/:id
		    PATCH  /users/:id
		    GET    /users/:id/stats

	    3.3.3. Games (basic functions):
		    POST   /games/start
		    POST   /games/end
		    GET    /games/list

	    3.3.4. scores:
		    POST   /scores
		    GET    /scores/:game
		    GET    /scores/:game/top
		    GET    /scores/user/:id

	    3.3.5. Timer: 
		    POST   /timer/pause
		    GET    /timer/current
		    GET    /timer/history

	    3.3.6. Fast Quiz:
		    GET    /quiz/random
		    POST   /quiz/vote
		    GET    /quiz/:id/results

	    3.3.7. Wiki:
		    GET    /wiki
		    GET    /wiki/:slug
		    POST   /wiki
		    PATCH  /wiki/:slug
		    DELETE /wiki/:slug





 


9. Work separation
    D - Diterimum. L - Luna-Slendy.
        main page (menu) D
	    Login page D
	    Fast quiz page D
	    pinball page L
	    puyo puyo page L
	    tetris page L
	    DOOM page D
	    small wiki page L


# Project Structure

```

Minigames_site
│
├── .gitignore
├── .venv
│
├── backend
│ ├── app
│ │ ├── db.py
│ │ ├── models.py
│ │ └── main.py
│ ├── .env
│ ├── .env.example
│ └── requirements.txt
│
├── frontend
│ ├── src
│ └── package.json
│
└── README.md

```

---

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