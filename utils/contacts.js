const fs = require("node:fs/promises");
function write(path, message) {
  return fs.writeFile(path, message, "utf-8");
}

async function loadContact() {
  const data = await fs.readFile("data/contacts.json", "utf-8");
  return JSON.parse(data);
}

(async function init() {
  const dirPath = "./data";
  await fs.mkdir(dirPath, { recursive: true });

  const filePath = "./data/contacts.json";
  try {
    await fs.access(filePath);
    const data = await fs.readFile(filePath, "utf-8");
    if (!data.trim()) {
      await write(filePath, "[]");
    }
  } catch {
    await write(filePath, "[]");
  }
})();

const detailContact = async (nama) => {
  const contacts = await loadContact();
  const contact = contacts.find((contact) => contact.nama === nama);
  return contact;
};

const cekDuplikat = async (nama) => {
  const contacts = await loadContact();
  return contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase(),
  );
};

const saveContact = async (contacts) => {
  await write("./data/contacts.json", JSON.stringify(contacts, null, 2));
};

const addContact = async (contact) => {
  const contacts = await loadContact();
  contacts.push(contact);
  saveContact(contacts);
};

module.exports = { loadContact, detailContact, cekDuplikat, addContact };
