const express = require("express");
const { getConnection } = require("./helper");
const PORT = process.env.PORT || 3000;
const app = express();

app.get("/customer", (req, res) => {
  getConnection()
    .then((conn) => {
      conn
        .query("SELECT * from customer")
        .then((rows) => {
	  conn.release();
          res.json(rows);
        })
        .catch((err) => {
          console.log(err);
          conn.end();
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/company", (req, res) => {
    getConnection()
      .then((conn) => {
        conn
          .query("SELECT * from company")
          .then((rows) => {
	  conn.release();
            res.json(rows);
          })
          .catch((err) => {
            console.log(err);
            conn.end();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get("/daysorder", (req, res) => {
    getConnection()
      .then((conn) => {
        conn
          .query("SELECT * from daysorder")
          .then((rows) => {
	  conn.release();
            res.json(rows);
          })
          .catch((err) => {
            console.log(err);
            conn.end();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get("/foods", (req, res) => {
    getConnection()
      .then((conn) => {
        conn
          .query("SELECT * from foods")
          .then((rows) => {
	   conn.release();
            res.json(rows);
          })
          .catch((err) => {
            console.log(err);
            conn.end();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get("/customer/:id", (req, res) => {
    var id = req.params.id;
    getConnection()
      .then((conn) => {
        conn
          .query(`SELECT * from customer where CUST_CODE = ?`, id)
          .then((rows) => {
	conn.release();
            res.json(rows);
          })
          .catch((err) => {
            console.log(err);
            conn.end();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get("/orders", (req, res) => {
    var amount = req.query.amount;
    getConnection()
      .then((conn) => {
        conn
          .query(`SELECT * from orders where ORD_AMOUNT = ?`,amount)
          .then((rows) => {
            console.log(rows);
		conn.release();
            res.json(rows);
          })
          .catch((err) => {
            console.log(err);
            conn.end();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
