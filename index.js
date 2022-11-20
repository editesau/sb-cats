const $cardsContainer = document.querySelector('[data-cards_container]');
const $modalContainer = document.querySelector('[data-modal_form_container]');
const $infoWr = document.querySelector('[data-info_wr]');
const $loader = document.querySelector('[data-loader_wr]');
const $loaderText = document.querySelector('#loader-text');
const $addForm = document.forms.add;
const $editForm = document.forms.edit;

const NO_PHOTO_IMG = './images/no_photo.png';

const generateCatCard = (cat) => {
  const rate = (cat.rate === undefined || cat.rate === '') ? 0 : cat.rate;
  return `
<div data-action="show" data-cat_id=${cat.id} class="card">
  <div class="card__image">
    <img data-action="show"
      src="${cat.img_link || NO_PHOTO_IMG}"
      alt="Cat image">
    </img>
  </div>
  <i data-action="show" class="card__icon-left icon fa-solid fa-up-right-and-down-left-from-center"></i>
  <div class="card__icons-right">
    <i data-action="toggleFavourite" class="icon icon_heart ${cat.favourite ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
    <i data-action="edit" class="icon icon_pencil fa-solid fa-pen-to-square"></i>
    <i data-action="delete" class="icon icon_delete fa-solid fa-trash-can"></i>
  </div>
  <div class="card__footer">
    <div class="card__title">
      <h1>${cat.name}</h1>
    </div>
    <div class="card__rating">
      ${'<i class="fa-solid fa-star"></i>'.repeat(rate)}
      ${'<i class="fa-regular fa-star"></i>'.repeat(10 - rate)}
    </div>
  </div>
</div>
  `;
};

const openForm = (name) => {
  $modalContainer.classList.remove('hidden');
  document.forms[name].classList.remove('hidden');
};

const setEditForm = (cat) => {
  const catForEdit = JSON.parse(JSON.stringify(cat));
  catForEdit.cat_name = catForEdit.name;
  catForEdit.cat_id = catForEdit.id;
  delete catForEdit.__v;
  delete catForEdit._id;

  delete catForEdit.id;
  delete catForEdit.name;
  $editForm.favourite.checked = catForEdit.favourite;
  $editForm.dataset.cat_id = catForEdit.cat_id;
  delete catForEdit.favourite;
  for (const key in catForEdit) {
    $editForm[key].value = catForEdit[key];
  }
};

const setInfoModal = (cat) => {
  const keys = Object.keys(cat).filter((key) => key !== '_id' && key !== '__v');

  for (const key of keys) {
    if (cat[key] === '') continue;
    if (key === 'img_link') {
      document.querySelector(`[data-info_cat_${key}`).src = cat.img_link;
    }
    if (key !== 'favourite') {
      document.querySelector(`[data-info_cat_${key}`).innerHTML = cat[key];
    } else {
      document.querySelector(`[data-info_cat_${key}`).innerHTML = cat[key] ? 'Yes' : 'No';
    }
  }
};

const restoreAddForm = () => {
  let data = window.localStorage.getItem($addForm.name) ? window.localStorage.getItem($addForm.name) : undefined;

  if (data) {
    data = JSON.parse(data);
    for (const key in data) {
      if (key !== 'favourite') {
        $addForm[key].value = data[key];
      } else {
        $addForm[key].checked = data[key] === 'on';
      }
    }
  }
};

const resetInfoModal = () => {
  document.querySelector('[data-info_cat_id]').innerHTML = '-';
  document.querySelector('[data-info_cat_name]').innerHTML = '-';
  document.querySelector('[data-info_cat_age]').innerHTML = 'Unknown';
  document.querySelector('[data-info_cat_rate]').innerHTML = 'Not set';
  document.querySelector('[data-info_cat_favourite]').innerHTML = '-';
  document.querySelector('[data-info_cat_description]').innerHTML = 'No description';
  document.querySelector('[data-info_cat_img_link]').src = NO_PHOTO_IMG;
};

const closeModal = () => {
  if (!$editForm.classList.contains('hidden')) {
    $editForm.classList.add('hidden');
    $editForm.reset();
    $modalContainer.classList.add('hidden');
  } else if (!$addForm.classList.contains('hidden')) {
    $addForm.classList.add('hidden');
    $addForm.reset();
    $modalContainer.classList.add('hidden');
  } else if (!$infoWr.classList.contains('hidden')) {
    $infoWr.classList.add('hidden');
    resetInfoModal();
  }
};

const toggleIcon = (targetIcon) => {
  targetIcon.classList.toggle('fa-solid');
  targetIcon.classList.toggle('fa-regular');
};

const showLoader = (text) => {
  $loaderText.innerHTML = text;
  $loader.classList.remove('hidden');
};

const hideLoader = () => {
  $loaderText.innerHTML = '';
  $loader.classList.add('hidden');
};

class API {
  constructor(baseURL, user) {
    this.baseURL = `${baseURL}/${user}`;
  }

  async getAllCats() {
    try {
      const response = await fetch(`${this.baseURL}/show`);
      try {
        const json = await response.json();
        if (json.message !== 'ok') {
          throw Error(json.message);
        } else {
          return json.data;
        }
      } catch (error) {
        throw Error(error);
      }
    } catch (error) {
      throw Error(error);
    }
  }

  async getCatById(id) {
    try {
      const response = await fetch(`${this.baseURL}/show/${id}`);
      try {
        const json = await response.json();
        if (json.message !== 'ok') {
          throw Error(json.message);
        } else {
          return json.data;
        }
      } catch (error) {
        throw Error(error);
      }
    } catch (error) {
      throw Error(error);
    }
  }

  async addCat(cat) {
    try {
      const response = await fetch(`${this.baseURL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cat),
      });
      try {
        const json = await response.json();
        if (json.message !== 'ok') {
          throw Error(json.message);
        } else {
          return json.data;
        }
      } catch (error) {
        throw Error(error);
      }
    } catch (error) {
      throw Error(error);
    }
  }

  async editCat(cat) {
    try {
      const response = await fetch(`${this.baseURL}/update/${cat.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cat),
      });
      try {
        const json = await response.json();
        if (json.message !== 'ok') {
          throw Error(json.message);
        } else {
          return json.data;
        }
      } catch (error) {
        throw Error(error);
      }
    } catch (error) {
      throw Error(error);
    }
  }

  async deleteCat(id) {
    try {
      const response = await fetch(`${this.baseURL}/delete/${id}`, {
        method: 'DELETE',
      });
      const json = await response.json();
      if (json.message !== 'ok') {
        throw Error(json.message);
      }
    } catch (error) {
      throw Error(error);
    }
  }

  async toggleFavourite(id) {
    try {
      let { favourite } = await this.getCatById(id);
      favourite = !favourite;
      const response = await fetch(`${this.baseURL}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, favourite }),
      });
      const json = await response.json();
      if (json.message !== 'ok') {
        throw Error(json.message);
      }
    } catch (error) {
      throw Error(error);
    }
  }
}

const api = new API('http://sb-cats.herokuapp.com/api/2', 'editesau');
showLoader('Loading cats...');
api.getAllCats()
  .then((cats) => cats.map((cat) => generateCatCard(cat)))
  .then((cardsHTML) => $cardsContainer.insertAdjacentHTML('beforeend', cardsHTML.join('')))
  .then(() => setTimeout(() => hideLoader()))
  .catch((error) => {
    hideLoader();
    alert(error);
  });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

document.body.addEventListener('click', (event) => {
  switch (event.target.dataset.action) {
    case 'addBtn': {
      restoreAddForm();
      openForm('add');
      break;
    }
    case 'show': {
      event.stopPropagation();
      $infoWr.classList.remove('hidden');
      showLoader('Processing');
      const id = event.target.closest('[data-cat_id]').dataset.cat_id;
      api.getCatById(id).then((cat) => {
        setInfoModal(cat);
        hideLoader();
      });
      break;
    }
    case 'edit': {
      event.stopPropagation();
      showLoader('Processing');
      openForm('edit');
      const id = event.target.closest('[data-cat_id]').dataset.cat_id;
      api.getCatById(id).then((cat) => {
        setEditForm(cat);
        hideLoader();
      });

      break;
    }
    case 'delete': {
      event.stopPropagation();
      showLoader('Deleting...');
      const id = event.target.closest('[data-cat_id]').dataset.cat_id;
      api.deleteCat(id)
        .then(() => {
          document.querySelector(`[data-cat_id="${id}"]`).remove();
          hideLoader();
        })
        .catch((error) => {
          hideLoader();
          alert(error);
        });
      break;
    }
    case 'closeModal': {
      closeModal();
      break;
    }
    case 'toggleFavourite': {
      event.stopPropagation();
      showLoader('Processing...');
      const id = event.target.closest('[data-cat_id]').dataset.cat_id;
      api.toggleFavourite(Number(id))
        .then(() => {
          hideLoader();
          toggleIcon(event.target);
        })
        .catch((error) => {
          alert(error);
          hideLoader();
        });
      break;
    }
    default:
      break;
  }
});

document.forms.add.addEventListener('input', () => {
  window.localStorage.setItem($addForm.name, JSON.stringify(Object.fromEntries(new FormData($addForm).entries())));
});

document.forms.add.addEventListener('submit', (event) => {
  event.preventDefault();
  showLoader('Adding...');
  const data = Object.fromEntries(new FormData(event.target).entries());
  data.id = Number(data.id);
  if (data.rate) {
    data.rate = Number(data.rate);
  } else {
    delete data.rate;
  }
  data.favourite = data.favourite === 'on';
  data.name = data.cat_name;
  delete data.cat_name;
  api.addCat(data)
    .then(() => {
      $addForm.reset();
      window.localStorage.removeItem($addForm.name);
      $cardsContainer.insertAdjacentHTML('beforeend', generateCatCard(data));
      hideLoader();
      closeModal();
    })
    .catch((error) => {
      hideLoader();
      alert(error);
    });
});

document.forms.edit.addEventListener('submit', (event) => {
  event.preventDefault();
  showLoader('Saving...');
  const data = Object.fromEntries(new FormData(event.target).entries());
  if (data.rate) {
    data.rate = Number(data.rate);
  } else {
    delete data.rate;
  }
  data.favourite = data.favourite === 'on';
  data.id = Number($editForm.dataset.cat_id);
  api.editCat(data)
    .then(() => {
      api.getCatById(data.id)
        .then((cat) => {
          document.querySelector(`[data-cat_id="${data.id}"]`).innerHTML = new DOMParser().parseFromString(generateCatCard(cat), 'text/html').body.querySelector('.card').innerHTML;
          hideLoader();
        })
        .catch(alert);
      closeModal();
    })
    .catch((error) => {
      hideLoader();
      alert(error);
    });
});
