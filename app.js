const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { loadContact, detailContact } = require("./utils/contacts");
const app = express();
const port = 3000;

app.use(expressLayouts);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
    title: "Halaman Home",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
});
app.get("/contact", async (req, res) => {
  const contacts = await loadContact();
  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Halaman Contact",
    contacts,
  });
});
app.get("/contact/:nama", async (req, res) => {
  const contact = await detailContact(req.params.nama);
  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Halaman Detail",
    contact,
  });
});

app.get("/product/:id", (req, res) => {
  res.send(`Produk id ${req.params.id}<br>Category id ${req.query.category}`);
});
app.use("/", (req, res) => {
  res.status(404);
  res.send("404");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
