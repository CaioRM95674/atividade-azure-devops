// Tema 8 — Esportes/Futebol
app.get('/tema', async (req, res) => {
    try {
        await sql.connect(dbConfig);

        const result = await sql.query`
            SELECT Id, Nome, Cidade
            FROM dbo.Times
            ORDER BY Id
        `;

        res.json(result.recordset);
    } catch (err) {
        console.error("Erro ao consultar os times:", err);
        res.status(500).json({
            erro: "Não foi possível consultar os times."
        });
    }
});
