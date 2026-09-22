import https from "node:https";

export default function handler(req, res) {
  const url =
    "https://statystyki.orlen-superliga.pl/pl/handball/lotto-superliga,2042/70558/query?Goalkeepers%3ATablesStatistics%5Btype%5D=overallGoalkeepers&Goalkeepers%3ATablesStatistics%5B__attach%5D=true&FieldPlayers%3ATablesStatistics%5Btype%5D=overallFieldPlayers&FieldPlayers%3ATablesStatistics%5B__attach%5D=true&Players%3ATablesStatistics%5Btype%5D=overallPlayers&Players%3ATablesStatistics%5B__attach%5D=true";

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  https
    .get(
      url,
      {
        agent,
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0",
          Referer: "https://orlen-superliga.pl/statystyki/",
        },
      },
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          res.setHeader("Content-Type", "application/json");
          res.status(response.statusCode ?? 200).send(data);
        });
      },
    )
    .on("error", (error) => {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    });
}
