import express = require("express");
import { MetricsHandler } from "./metrics";
import bodyParser = require('body-parser')

const app = express(),

path = require("path"),
metrics = require("./metrics");
const port: string = process.env.PORT || "8080";

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.post('/metrics/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send()
  })
})

app.get("/metrics", (req: any, res: any) => {
  dbMet.get((err: Error | null, result?: any) => {
    if (err) {
      res.status(500).send(err);
    }
    else res.status(200).send(result);
  });
});

app.get("/metrics/:id", (req: any, res: any) => {
  
  dbMet.getOne(req.params.id,(err: Error | null, result?: any) => {
    if (err) {
      res.status(500).send(err);
    }
    else res.status(200).send(result);
  });
});

app.delete("/metrics/:id", (req: any, res: any) => {
  
  dbMet.delete(req.params.id,(err: Error | null, result?: any) => {
    if (err) {
      res.status(500).send(err);
    }
    else res.status(200).send(result);
  });
});

app.get('/', (req: any, res: any) => {
  res.write('Welcomee to the Home page \n\n 1- http://localhost:8080/ : Home Page   \n 2- http://localhost:8080/hello/[Your Name] : Hello + Your name will be display with a Button which display data \n 3- http://localhost:8080/metrics.json : Somme data will be display ' )
  res.end()
})

app.get('/hello/:name/', function(req: any, res: any) {
  res.render('hello.ejs', {name: req.params.name});
});




app.listen(port, (err: Error) => {
  if (err) {
    throw err;
  }
  console.log(`server's listening on http://localhost:${port}`);
});
