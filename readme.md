# Token Manager

## How to run
1. open the project in vscode,
2. open a new terminal,
3. run `npm install`
4. install postgres for Mac, Run:

    `brew install postgresql`

    `brew services start postgresql`

    `psql postgres`

    `CREATE DATABASE tokens;`

    `\q`

4. install postgres for Windows;

    Download PostgreSQL from https://www.postgresql.org/download/windows/

    Run the installer and follow the setup steps.

    Open pgAdmin or psql command line.

    Create the database: `CREATE DATABASE tokens;`
    
    Ensure PostgreSQL service is running.

5. run `npm run dev`
6. View the site on `http://localhost:3000`

## Stack used
`Node.js` and `PostgreSQL`

## Assumptions or simplifications you made
The entire app was designed to be `simple`