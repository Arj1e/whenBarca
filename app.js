const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/barca', async (req, res) => {
    try {
        const response = await axios.get('https://www.fcbarca.com/sezon/terminarz');
        const html = response.data;
        const $ = cheerio.load(html);
        const nextMatch = $("#next-match");

        const matchRoot = cheerio.load(nextMatch.html());

        const hostTeamName = matchRoot(".host__name__short").text();
        const guest = matchRoot(".guest__name__short").text();
        const matchDate = matchRoot(".date").text();
        const hour = matchRoot(".hour").text();
        const chanelInput = matchRoot("li.channel span.meta a strong").text();
        var chanel = "";

        if(chanelInput.includes("Canal")) {
            chanel = "C+";
        } else {
            chanel = "PL";
        }

        const output = hostTeamName+" : "+guest + " " + matchDate+"/"+hour+" "+chanel;

        res.send(output);
    } catch (error) {
        console.error(error);
        res.status(500).send('Wystąpił błąd podczas pobierania danych.');
    }
});




app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});