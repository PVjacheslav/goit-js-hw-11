import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix, { Loading, Notify } from 'notiflix';
import { limitPage, serchImg, renderImg } from './additional';

const elements = {
  serchForm: document.querySelector('.js-search-form'),
  divGallery: document.querySelector('.gallery'),
  buttonLoad: document.querySelector('.load-more'),
  container: document.querySelector('.js-list'),
};

const galleryDiv = elements.divGallery;
let searchQuery = null;
let querySerch = '';
let pageSerch = '';

elements.serchForm.addEventListener('submit', onSubmitForm);
const simpleBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt', // отримати заголовок
  captionDelay: 250, //затримка
});

function onSubmitForm(e) {
  e.preventDefault();
  const query = e.currentTarget.elements.searchQuery.value;
  if (!query.trim() || query === querySerch) {
    return;
  }
  querySerch = query;
  elements.divGallery.innerHTML = '';
  firstNumberImg(querySerch, pageSerch);
  elements.serchForm.reset();
}

const firstNumberImg = async (query, pageSerch) => {
  try {
    Loading.circle('Loading', {
      svgColor: '#D9A09F',
    });
    const data = await serchImg(query, pageSerch);
    Loading.remove();
    if (!data.hits.lenght) {
      Notify.failure(
        'Failure is simply the opportunity to begin again, this time more intelligently.'
      );
      return;
    }
    renderImg(data);
    simpleBox.refresh();
    if (pageSerch === 1) {
      Notify.success(
        'Do not try to become a person of success but try to become a person of value.'`We found ${data.totalHits} images.`
      );
    }
  } catch (error) {
    // console.log(error);
    Notify.failure('Oops! Try again!');
  }
};

function onLoadMore() {
  page += 1;
  simpleBox.refresh();
  firstNumberImg(query, page, limitPage)
    .then(data => {
      renderImg(data.hits);
      simpleBox.refresh();
      const totalPages = Math.ceil(data.totalHits / limitPage);
      if (page > totalPages) {
        Notify.failure(
          "We're sorry, but you've reached the end of the possible results"
        );
      }
    })
    .catch(error => console.log(error));
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

export { galleryDiv };
