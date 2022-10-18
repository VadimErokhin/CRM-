import {
  openModalWindow,
  showModalLoader,
  newUser,
  modals,
  curentClient,
  users,
  removeModalLoader,
  showModalLoaderDelete,
  closeModalWindow,
  removeModalLoaderDelete,
  setUsers
}
from './index.js';
import {
  fetchUser,
  deleteUser
} from './requests.js';
import {
  renderClientsTable,
  renderContacts
} from './render.js';

const userName = document.getElementById('username');
const lastName = document.getElementById('lastName');
const surName = document.getElementById('surname');

export async function changeClient(userId) {
  openModalWindow();
  showModalLoader();
  const currentUser = await fetchUser(userId);

  newUser.contacts = currentUser.contacts;
  newUser.lastName = currentUser.lastName;
  newUser.name = currentUser.name;
  newUser.surname = currentUser.surname;
  modals.isChangeModal = true;

  curentClient.currentChangeClient = userId;

  const user = users.find((i) => i.id === userId);

  Object.keys(newUser).forEach(key => {
    user[key] = newUser[key];
  })
  userName.value = newUser.name;
  lastName.value = newUser.lastName;
  surName.value = newUser.surname;

  renderContacts();
  removeModalLoader();
}

export async function deleteClient(userId) {
  showModalLoaderDelete();
  await deleteUser(userId || curentClient.currentDeleteClient);
  removeModalLoaderDelete();
  const filtredUsers = users.filter(user => (user.id !== userId) && curentClient.currentDeleteClient !== user.id);
  setUsers(filtredUsers);
  renderClientsTable();
  closeModalWindow();
}

export function deleteContact(e) {
  const index = Number(e.target.dataset.index);
  newUser.contacts = newUser.contacts.filter((c, i) => index !== i);
  renderContacts();
}

export function setContactType(e) {
  const selectedIndex = e.target.options.selectedIndex;
  const selectedType = e.target.options[selectedIndex].value;

  const contactIndex = e.target.name.split('-')[1];

  newUser.contacts[contactIndex].type = selectedType;
}