import {
  renderAutoComplite,
  createContactInput,
  renderClientsTable,
  renderContacts
} from './render.js';
import {
  sortById,
  sortByName,
  sortByDate
} from './sort.js';
import {
  fetchUsers,
  postUser,
  patchUser
} from './requests.js';
import {
  deleteClient
} from './user.js';



// Table
const tbody = document.getElementById('tbody');
const id = document.getElementById('id');
const name = document.getElementById('name');
const data = document.getElementById('data');
const lastChange = document.getElementById('last__change');
const btn = document.querySelector('.btn-client--add');
const searchInput = document.querySelector('.search__input');
const tableLoader = document.querySelector('.table__loader');


// Modals
const modelWindow = document.querySelector('.model__window--create');
const modelWindowRemove = document.querySelector('.model__window--remove');
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.model__overlay');
const modelCross = document.querySelector('.model__window-cross--create');
const removeBtnModalWindow = document.querySelector('.remove__btn');
const crossRemoveModalWindow = document.querySelector('.model__window-cross--delete');
export const newUserHeader = document.querySelector('.model__window-header--new');
export const userHeader = document.querySelector('.model__window-header--change');
export const cancelBtnModal = document.querySelector('.cancel__btn-new-user');
const cancelBtn = document.querySelector('.cancel__btn');
export const deleteClientModal = document.querySelector('.delete__btn--client');
export const idClient = document.querySelector('.model__id');
const loaderOverlay = document.querySelector('.loader__overlay');
const loaderOverlayDelete = document.querySelector('.loader__overlay-delete');

// Form
const addContact = document.querySelector('.create__contact');
export const selectContent = document.querySelector('.select__content');
const form = document.querySelector('.form');
const contactError = document.querySelector('.js-error-contacts');
const nameError = document.querySelector('.input_error--name');
const lastNameError = document.querySelector('.input_error--lastname');
const surNameError = document.querySelector('.input_error--surname');
let instance;

export const curentClient = {
  currentChangeClient: null,
  currentDeleteClient: null
}

export let users = [];
export function setUsers(updatedUsers) {
  users = updatedUsers;
}



export const modals = {
  isChangeModal: false
}

const emptyUser = {
  lastName: '',
  surname: '',
  name: '',
  contacts: []
};

export let newUser = {
  ...emptyUser,
  contacts: []
}

cancelBtnModal.addEventListener('click', closeModalWindow);
const processChange = debounce((e) => onSearchInput(e));

searchInput.addEventListener('input', processChange);

async function onSearchInput(e) {
  if (!e.target.value.trim()) {
    renderAutoComplite([]);
    return
  }
  const users = await fetchUsers(e.target.value);
  renderAutoComplite(users);
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

btn.addEventListener('click', () => {
  modals.isChangeModal = false;
  cancelBtnModal.classList.remove('hidden');
  deleteClientModal.classList.add('hidden');
  userHeader.classList.add('hidden');
  newUserHeader.classList.remove('hidden');
  idClient.classList.add('hidden');
  openModalWindow();
})
modelCross.addEventListener('click', closeModalWindow);
modalOverlay.addEventListener('click', closeModalWindow);
crossRemoveModalWindow.addEventListener('click', closeModalWindow);
cancelBtn.addEventListener('click', closeModalWindow);

deleteClientModal.addEventListener('click', (e) => {
  e.preventDefault();

  deleteClient(curentClient.currentChangeClient);
})

function showTableLoader() {
  tableLoader.classList.remove('hidden');
  tbody.classList.add('hidden');
}

function removeTableLoader() {
  tableLoader.classList.add('hidden');
  tbody.classList.remove('hidden');
}

export function showModalLoader() {
  loaderOverlay.classList.remove('hidden');
}

export function removeModalLoader() {
  loaderOverlay.classList.add('hidden');
}

export function showModalLoaderDelete() {
  loaderOverlayDelete.classList.remove('hidden');
}

export function removeModalLoaderDelete() {
  loaderOverlayDelete.classList.add('hidden');
}

export function closeModalWindow() {
  modal.classList.add('modal--hidden');
  modelWindow.classList.add('hidden');
  modelWindowRemove.classList.add('hidden');

  newUser = {
    ...emptyUser,
    contacts: []
  };
  form.reset();
  if (instance) {
    instance.destroy();
    instance = null;
  }
  contactError.innerHTML = '';
  nameError.innerHTML = '';
  lastNameError.innerHTML = '';

  curentClient.currentDeleteClient = null;
  curentClient.currentChangeClient = null;

  renderContacts();
}

export function openModalWindow() {
  modelWindow.classList.remove('hidden');
  modal.classList.remove('modal--hidden');
  modelWindowRemove.classList.add('hidden');
  if (!instance) initValidatition();
}

export function openModalRemoveWindow() {
  modelWindowRemove.classList.remove('hidden');
  modal.classList.remove('modal--hidden');
  modelWindow.classList.add('hidden');
}

removeBtnModalWindow.addEventListener('click', () => deleteClient());

id.addEventListener('click', sortById);
name.addEventListener('click', sortByName);

data.addEventListener('click', () => sortByDate('createdAt'));
lastChange.addEventListener('click', () => sortByDate('updatedAt'));

addContact.addEventListener('click', createContactInput);

async function onSubmitCreateUser(form) {
  showModalLoader();
  const formData = new FormData(form);

  formData.forEach((val, key) => {
    const splitKey = key.split('-');

    if (!splitKey.length || splitKey.length < 2) {
      newUser[key] = val;
      return;
    }

    if (splitKey[0] === 'contact') {
      const index = splitKey[1];

      const contact = newUser.contacts[index];
      contact.value = val;

      return;
    }

    if (splitKey[0] === 'select') {
      const contact = newUser.contacts[splitKey[1]];
      contact.type = val;

      return;
    }
  });

  const response = await postUser(newUser);
  removeModalLoader();

  if (response.errors) {
    matchErrrors(response.errors);
  } else {
    users.push(response);
    renderClientsTable();
    closeModalWindow();
  }

}

function matchErrrors(errors) {
  errors.forEach(error => {
    if (error.field === 'surname') {
      surNameError.innerHTML = error.message
    }
    if (error.field === 'lastName') {
      lastNameError.innerHTML = error.message
    }
    if (error.field === 'name') {
      nameError.innerHTML = error.message
    }

    if (error.field === 'contacts') {
      contactError.innerHTML = error.message
    }
  })
}


async function onSubmitPatchUser(form) {
  const formData = new FormData(form);

  formData.forEach((val, key) => {
    const splitKey = key.split('-');

    if (!splitKey.length || splitKey.length < 2) {
      newUser[key] = val;
      return;
    }

    if (splitKey[0] === 'contact') {
      const index = splitKey[1];

      const contact = newUser.contacts[index];
      contact.value = val;

      return;
    }

    if (splitKey[0] === 'select') {
      const contact = newUser.contacts[splitKey[1]];
      contact.type = val;

      return;
    }
  });

  const client = await patchUser(newUser, curentClient.currentChangeClient);

  const userToPatch = users.find(user => user.id === client.id);
  Object.keys(userToPatch).forEach(key => {
    userToPatch[key] = client[key];
  })

  renderClientsTable();
  closeModalWindow();
}

export async function initApp(search) {
  showTableLoader();
  users = await fetchUsers(search);
  renderClientsTable();
  removeTableLoader();
}

initApp();

initValidatition();

function initValidatition() {

  instance = new JustValidate('.form');
  instance
    .addField('#lastName', [{
        rule: 'minLength',
        value: 2,
      },
      {
        rule: 'maxLength',
        value: 20,
      },
    ])
    .addField('#username', [{
        rule: 'minLength',
        value: 2,
      },
      {
        rule: 'required',
        errorMessage: 'Поле должно быть заполнено',
      },
      {
        rule: 'maxLength',
        value: 20,
      },
    ], {
      errorFieldCssClass: 'js-validate-error-field',
      errorLabelCssClass: 'js-validate-error-label',
      errorsContainer: '.input_error--name'
    })
    .addField('#surname', [{
        rule: 'minLength',
        value: 2,
      },
      {
        rule: 'required',
        errorMessage: 'Поле должно быть заполнено',
      },
      {
        rule: 'maxLength',
        value: 20,
      },
    ], {
      errorFieldCssClass: 'js-validate-error-field',
      errorLabelCssClass: 'js-validate-error-label',
      errorsContainer: '.input_error--surname'
    })
    .onSuccess(event => {
      let hasError = false;
      if (newUser.contacts.length > 0) {
        newUser.contacts.forEach((contact, index) => {
          const input = document.querySelector(`.model__window-input[name="contact-${index}"]`);
          if (!contact.value) {
            hasError = true;
            input.classList.add('error__highlight');
            contactError.innerHTML = 'Все контакты должены быть заполнены'
          } else {
            input.classList.remove('error__highlight');
          }

          input.onfocus = (e) => {
            e.target.classList.remove('error__highlight');
          }
        })
      }
      if (!hasError) {
        contactError.innerHTML = '';
        return modals.isChangeModal ? onSubmitPatchUser(form) : onSubmitCreateUser(form);
      }
    })


}