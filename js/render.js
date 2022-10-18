import {
  users,
  newUser,
  selectContent,
  cancelBtnModal,
  deleteClientModal,
  userHeader,
  newUserHeader,
  idClient,
  curentClient,
  openModalRemoveWindow
}
from './index.js';
import {
  getFullName,
  formatedData,
  createContactsIcons,
  contactTypeMatch
} from './helpers.js';
import {
  setContactType,
  deleteContact,
  changeClient
} from './user.js';

let currentAutoCompletePosition = null;
const serchAutoComplite = document.querySelector('.js-auto-complite');

export function renderClientsTable() {
  tbody.innerHTML = '';
  const tableRows = users.map(createTableRow);
  tableRows.forEach((element, userIndex) => {
    tbody.appendChild(element);

    users[userIndex].contacts.forEach((c, index) => {
      tippy(`.img-${users[userIndex].id}-${index}`, {
        content: `${contactTypeMatch[c.type]}: ${c.value}`,
      });
    })

  });

  const deleteClientButtons = document.querySelectorAll('.user__delete');
  deleteClientButtons.forEach((button) => {
    button.addEventListener('click', () => {
      curentClient.currentDeleteClient = button.dataset.id;

      openModalRemoveWindow();
    })
  })

  const changeClientsButtons = document.querySelectorAll('.user__change');
  changeClientsButtons.forEach((button) => {
    button.addEventListener('click', () => {
      cancelBtnModal.classList.add('hidden');
      deleteClientModal.classList.remove('hidden');

      userHeader.classList.remove('hidden');
      newUserHeader.classList.add('hidden');

      idClient.classList.remove('hidden');
      idClient.innerHTML = `ID: ${button.dataset.id}`;

      changeClient(button.dataset.id);
    })
  })
}

function createTableRow(user) {
  const tr = `
    <td data-id="${user.id}" class="user__id">${user.id}</td>

    <td data-id="${user.id}" class="user__fullname"><a href="./client.html?id=${user.id}">${getFullName(user)}</a></td>

    <td data-id="${user.id}" class="user__created">${formatedData(user.createdAt)}</td>

    <td data-id="${user.id}" class="user__updated">${formatedData(user.updatedAt)} </td>

    <td data-id="${user.id}" class="user__contacts">${createContactsIcons(user.contacts, user.id)} </td>

    <td data-id="${user.id}" class="table__buttons">
      <button data-id="${user.id}" class="change user__change"> Изменить</button>
      <button data-id="${user.id}" class="delete user__delete">Удалить</button>
    </td>
  `

  const trElement = document.createElement('tr');

  trElement.innerHTML = tr;

  return trElement;
}

export function createContactInput() {
  if (newUser.contacts.length >= 10) return

  newUser.contacts.push({
    type: 'phone',
    value: ''
  });

  renderContacts();
}

export function renderContacts() {
  const existingContacts = newUser.contacts.map((contact, index) => {
    return `
      <div class="select__inner">
        <div class="select__wrapper">
          <select id="select${index}" size="1" name="select-${index}">
            <option value="phone" ${contact.type === 'phone' ? 'selected' : ''}>Телефон</option>
            <option value="additional" ${contact.type === 'additional' ? 'selected' : ''}>Доп. телефон</option>
            <option value="email" ${contact.type === 'email' ? 'selected' : ''}>Email</option>
            <option value="vk" ${contact.type === 'vk' ? 'selected' : ''}>Vk</option>
            <option value="facebook" ${contact.type === 'facebook' ? 'selected' : ''}>Facebook</option>
            <option value="other" ${contact.type === 'other' ? 'selected' : ''}>Другое</option>
          </select>

          <input class="model__window-input" type="text" placeholder="Введите данные контакта" name="contact-${index}" value="${contact.value}">
          <button id="input__button--delete" class="input__button" data-index="${index}">
            <svg class="no-pointer" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#F06A4D"/>
            </svg>
          </button>
        </div>
      </div>
    `
  }).join('');

  selectContent.innerHTML = existingContacts;

  newUser.contacts.forEach((i, index) => {
    const select = document.getElementById(`select${index}`);
    NiceSelect.bind(select);

    select.addEventListener('change', setContactType);

    const contactInput = document.querySelector(`.model__window-input[name="contact-${index}"]`);
    contactInput.addEventListener('input', (e) => {
      i.value = e.target.value;
    })
  })

  const deleteContactButtons = document.querySelectorAll('.input__button');

  deleteContactButtons.forEach(btn => {
    btn.addEventListener('click', deleteContact);
  });

  tippy('.input__button', {
    content: "Удалить контакт",
  });

  if (newUser.contacts.length >= 10) {
    addContact.classList.add('disabled');
  }

}

export function renderAutoComplite(users) {
  if (!users.length) {
    document.onkeydown = null;
    currentAutoCompletePosition = null;
  }

  const listItems = users.reduce((acc, user) => {
    acc += `
      <div class="search__autocomplete-item js-autocomplete-item" data-id="${user.id}">${getFullName(user)} </div>
    `
    return acc;
  }, '')

  serchAutoComplite.innerHTML = listItems;

  const autoCompleteItems = document.querySelectorAll('.js-autocomplete-item');
  autoCompleteItems.forEach((i, index) => {
    i.addEventListener('click', (e) => {
      currentAutoCompletePosition = index;
      highlightClient(e.target.dataset.id);
    })
  })

  document.onkeydown = (e) => checkKey(e, autoCompleteItems);
}

function highlightClient(clientId) {

  const clientIds = document.querySelectorAll('td[data-id]').forEach(td => {
    if (td.dataset.id === clientId) {
      td.classList.add('active');
    } else {
      td.classList.remove('active');
    }
  })
}

function checkKey(e, items) {
  const itemsCount = items.length;
  e = e || window.event;

  if (e.keyCode === 38) {
    // up arrow
    if (!currentAutoCompletePosition) {
      currentAutoCompletePosition = itemsCount - 1;
    } else {
      --currentAutoCompletePosition
    }
  } else if (e.keyCode === 40) {
    // down arrow
    if (!currentAutoCompletePosition || currentAutoCompletePosition === itemsCount - 1) {
      currentAutoCompletePosition = 0;
    } else {
      ++currentAutoCompletePosition
    }
  } else if (e.keyCode === 13) {
    const client = items.forEach((i, index) => {

      if (index === currentAutoCompletePosition) {
        highlightClient(i.dataset.id)
        renderAutoComplite([]);
      }
    })
  } else if (e.keyCode === 27) {
    renderAutoComplite([]);
  }


  items.forEach((i, index) => {
    if (index === currentAutoCompletePosition) {
      i.classList.add('active');
    } else {
      i.classList.remove('active');
    }
  })

}