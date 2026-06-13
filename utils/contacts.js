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

const findContact = async (nama) => {
  const contacts = await loadContact();
  return contacts.find((contact) => contact.nama === nama);
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

const deleteContact = async (nama) => {
  const contacts = await loadContact();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContact(filteredContacts);
};

const updateContacts = async (newContacts) => {
  const contacts = await loadContact();
  const filteredContacts = contacts.filter(
    (contact) => contact.nama !== newContacts.oldNama,
  );
  delete newContacts.oldNama;
  filteredContacts.push(newContacts);
  saveContact(filteredContacts);
};

module.exports = {
  loadContact,
  findContact,
  cekDuplikat,
  addContact,
  deleteContact,
  updateContacts,
};
