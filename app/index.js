const appInsights = require('applicationinsights');

// Inicializar o monitoramento antes de carregar Express e SQL.
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    appInsights
        .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .start();

    console.log('Application Insights configurado.');
}

const express = require('express');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 8080;

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// Página inicial.
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport"
                  content="width=device-width, initial-scale=1.0">
            <title>FIAP — Futebol e DevOps</title>
            <style>
                body {
                    background: #1a1a1a;
                    color: white;
                    font-family: Arial, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                }
                main {
                    background: #262626;
                    padding: 40px;
                    margin: 20px;
                    border-radius: 12px;
                    border-top: 5px solid #ed145b;
                    text-align: center;
                }
                h1 { color: #ed145b; }
                a {
                    display: inline-block;
                    background: #ed145b;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 6px;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <main>
                <h1>Atividade DevOps & Cloud</h1>
                <p>Tema 8 — Esportes/Futebol</p>
                <p>Aplicação Node.js em execução no Azure.</p>
                <a href="/tema">Consultar times no banco</a>
            </main>
        </body>
        </html>
    `);
});

// Consultar os cinco times cadastrados no Azure SQL.
app.get('/tema', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool.request().query(`
            SELECT Id, Nome, Cidade
            FROM dbo.Times
            ORDER BY Id;
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao consultar os times:', err);

        res.status(500).json({
            erro: 'Não foi possível consultar os times.'
        });
    }
});

// Iniciar o servidor HTTP.
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`);
});
