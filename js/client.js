import {
  fetchUser
} from './requests.js';
import {
  getFullName,
  formatedData,
  createContactsIcons,
  contactTypeMatch
} from './helpers.js';

const clientName = document.querySelector('.js-title');
const clientId = document.querySelector('.js-id');
const clientCreatedAt = document.querySelector('.js-created-at');
const clientLastChange = document.querySelector('.js-last-change');
const clientContacts = document.querySelector('.js-contacts');



async function initCard() {
  const query = window.location.search;
  const userId = query ? query.split('=')[1] : '';

  const user = await fetchUser(userId);
  renderCard(user);
}

initCard()

function renderCard(user) {
  if (!user) return

  clientName.innerHTML = `<strong>ФИО: </strong>${getFullName(user)}`;
  clientId.innerHTML = `<strong>ID: </strong>${user.id}`;
  clientCreatedAt.innerHTML = `<strong>Дата создания: </strong>${formatedData(user.createdAt)}`;
  clientLastChange.innerHTML = `<strong>Последние изменение: </strong>${formatedData(user.updatedAt)}`;
  clientContacts.innerHTML = `<strong>Контакты: </strong>${createContactsIcons(user.contacts, user.id)}`;

  user.contacts.forEach((c, index) => {
    tippy(`.img-${user.id}-${index}`, {
      content: `${contactTypeMatch[c.type]}: ${c.value}`,
    });
  })
}