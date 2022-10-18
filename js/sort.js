import {
  users
} from './index.js';
import {
  renderClientsTable
} from './render.js';
import {
  getFullName
} from './helpers.js';

const idArrow = document.querySelector('.js-id-arrow');
const nameArrow = document.querySelector('.js-name-arrow');
const dataArrow = document.querySelector('.js-data-arrow');
const lastChangeArrow = document.querySelector('.js-change-arrow');


const sort = {
  isIdSortUp: false,
  isNameUp: false,
  isDateCreateUp: false,
  isDateUpdatedUp: false
}

export function sortById() {
  sort.isIdSortUp = !sort.isIdSortUp;
  sort.isNameUp = false;
  sort.isDateUpdatedUp = false;
  sort.isDateCreateUp = false;
  if (sort.isIdSortUp) {
    idArrow.classList.add('rotated');
  } else {
    idArrow.classList.remove('rotated');
  }

  nameArrow.classList.remove('rotated');
  dataArrow.classList.remove('rotated');
  lastChangeArrow.classList.remove('rotated');


  users.sort((user1, user2) => {
    if (Number(user1.id) < Number(user2.id)) {
      return sort.isIdSortUp ? 1 : -1;
    }
    if (Number(user1.id) > Number(user2.id)) {
      return sort.isIdSortUp ? -1 : 1;
    }
    return 0;
  });

  renderClientsTable();
}

export function sortByName() {
  sort.isNameUp = !sort.isNameUp;
  sort.isIdSortUp = false;
  sort.isDateUpdatedUp = false;
  sort.isDateCreateUp = false;

  if (sort.isNameUp) {
    nameArrow.classList.add('rotated');
  } else {
    nameArrow.classList.remove('rotated');
  }

  idArrow.classList.remove('rotated');
  lastChangeArrow.classList.remove('rotated');
  dataArrow.classList.remove('rotated');


  users.sort((user1, user2) => {
    const name1 = getFullName(user1);
    const name2 = getFullName(user2);

    if (name1 < name2) {
      return sort.isIdSortUp ? 1 : -1;
    }
    if (name1 > name2) {
      return sort.isNameUp ? -1 : 1;
    }
    return 0;
  });

  renderClientsTable();
}

export function sortByDate(field) {
  let condition = false;
  const item = field !== 'createdAt' ? dataArrow : lastChangeArrow;

  if (field === 'createdAt') {
    sort.isDateCreateUp = !sort.isDateCreateUp;
    sort.isDateUpdatedUp = false;
    condition = sort.isDateCreateUp;

    if (condition) {
      dataArrow.classList.add('rotated');
    } else {
      dataArrow.classList.remove('rotated');
    }
    lastChangeArrow.classList.remove('rotated');

  } else if (field === 'updatedAt') {
    sort.isDateUpdatedUp = !sort.isDateUpdatedUp;
    sort.isDateCreateUp = false;
    condition = sort.isDateUpdatedUp;

    if (condition) {
      lastChangeArrow.classList.add('rotated');
    } else {
      lastChangeArrow.classList.remove('rotated');
    }

    dataArrow.classList.remove('rotated');

  }

  nameArrow.classList.remove('rotated');
  idArrow.classList.remove('rotated');

  sort.isNameUp = false;
  sort.isIdSortUp = false;

  users.sort((user1, user2) => {
    const name1 = new Date(user1[field]);
    const name2 = new Date(user2[field]);

    if (name1 < name2) {
      return condition ? 1 : -1;
    }
    if (name1 > name2) {
      return condition ? -1 : 1;
    }
    return 0;
  });

  renderClientsTable();
}