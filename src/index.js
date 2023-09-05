import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix, { Loading, Notify } from 'notiflix';

import axios from 'axios';
const API_KEY = '39210182-6a28ff40429aa6ef86c4432d6';
const limitPage = 40;
axios.defaults.baseURL = 'https://pixabay.com/api/';

const serchImg = async (querySerch, pageSerch) => {
  try {
    const response = await axios({
      params: {
        key: API_KEY,
        q: querySerch,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: limitPage,
        page: pageSerch,
      },
    });
    if (response.data) {
      return response.data;
    } else {
      throw new Error('Отримано порожню відповідь від сервера');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

function renderImg(data) {
  const markup = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="photo-link" href="${largeImageURL}">
          <div class="photo-card">
            <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>${likes}</b>
              </p>
              <p class="info-item">
                <b>${views}</b>
              </p>
              <p class="info-item">
                <b>${comments}</b>
              </p>
              <p class="info-item">
                <b>${downloads}</b>
              </p>
            </div>
          </div>
        </a>`;
      }
    )
    .join('');
  galleryDiv.insertAdjacentHTML('beforeend', markup);
}

const elements = {
  serchForm: document.querySelector('.js-search-form'),
  divGallery: document.querySelector('.gallery'),
  buttonLoad: document.querySelector('.load-more'),
  container: document.querySelector('.js-list'),
};

const galleryDiv = elements.divGallery;

let querySerch = '';
let pageSerch = 1;
const simpleBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function onSubmitForm(e) {
  e.preventDefault();
  const query = e.currentTarget.elements.searchQuery.value;
  if (!query.trim() || query === querySerch) {
    return;
  }
  querySerch = query;
  galleryDiv.innerHTML = '';
  pageSerch = 1;
  firstNumberImg(querySerch, pageSerch);
  elements.serchForm.reset();
}

elements.serchForm.addEventListener('submit', onSubmitForm);
const firstNumberImg = async (query, pageSerch) => {
  try {
    Loading.circle('Loading', {
      svgColor: '#D9A09F',
    });
    const data = await serchImg(query, pageSerch);
    Loading.remove();
    if (!data.hits.length) {
      Notify.failure(
        'Failure is simply the opportunity to begin again, this time more intelligently.'
      );
      return;
    }
    renderImg(data);
    simpleBox.refresh();
    if (pageSerch === 1) {
      Notify.success(`We found ${data.totalHits} images.`);
    }
  } catch (error) {
    console.error(error);
    Notify.failure('Oops! Try again!');
  }
};

function onLoadMore() {
  pageSerch += 1;
  simpleBox.refresh();
  firstNumberImg(querySerch, pageSerch)
    .then(data => {
      renderImg(data.hits);
      simpleBox.refresh();
      const totalPages = Math.ceil(data.totalHits / limitPage);
      if (pageSerch > totalPages) {
        Notify.failure(
          "We're sorry, but you've reached the end of the possible results"
        );
      }
    })
    .catch(error => console.error(error));
}

function checkEndPage() {
  return (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
  );
}

window.addEventListener('scroll', loadMorePage);
function loadMorePage() {
  if (checkEndPage()) {
    onLoadMore();
  }
}
