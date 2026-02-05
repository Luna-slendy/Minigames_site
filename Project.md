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
    Node.js, PostgreSQL + ORM(Idk...) + some additions(Idk...)

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