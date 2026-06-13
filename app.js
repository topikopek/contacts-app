const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContact,
  findContact,
  cekDuplikat,
  addContact,
  deleteContact,
  updateContacts,
} = require("./utils/contacts");
const { query, validationResult, body } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

// middleware
app.use(expressLayouts);
app.use(express.urlencoded());

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(flash());

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
    msg: req.flash("msg"),
  });
});

// menambahkan contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layouts/main-layout",
    title: "Halaman Tambah Contact",
  });
});
app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplikat = await cekDuplikat(value);
      if (duplikat) {
        throw new Error("Nama sudah ada di contact");
      }
    }),
    body("nohp", "No.HP tidak valid").isMobilePhone("id-ID"),
    body("email", "Email tidak valid").isEmail(),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.render("add-contact", {
        layout: "layouts/main-layout",
        title: "Halaman Tambah Contact",
        errors: result.array(),
      });
    } else {
      await addContact(req.body);
      req.flash("msg", "Data contact berhasil ditambahkan");
      res.redirect("/contact");
    }
  },
);

// menghapus contact
app.get("/contact/delete/:nama", async (req, res) => {
  const contacts = await findContact(req.params.nama);
  if (!contacts) {
    res.status(404);
    res.send(`<h1>404</h1>`);
  } else {
    await deleteContact(req.params.nama);
    req.flash("msg", "Data contact berhasil dihapus");
    res.redirect("/contact");
  }
});

// mengedit contact
app.get("/contact/update/:nama", async (req, res) => {
  const contact = await findContact(req.params.nama);
  res.render("edit-contact", {
    layout: "layouts/main-layout",
    title: "Halaman ubah contact",
    contact,
  });
});
app.post(
  "/update",
  [
    body("nama").custom(async (value, { req }) => {
      const duplikat = await cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama sudah ada di contact");
      }
    }),
    body("nohp", "No.HP tidak valid").isMobilePhone("id-ID"),
    body("email", "Email tidak valid").isEmail(),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.render("edit-contact", {
        layout: "layouts/main-layout",
        title: "Halaman Edit Contact",
        errors: result.array(),
        contact: req.body,
      });
    } else {
      await updateContacts(req.body);
      req.flash("msg", "Data contact berhasil diubah");
      res.redirect("/contact");
    }
  },
);

// menampilkan detail contact
app.get("/contact/:nama", async (req, res) => {
  const contact = await findContact(req.params.nama);
  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Halaman Detail",
    contact,
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("404");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
