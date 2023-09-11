import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix, { Loading, Notify } from 'notiflix';

import axios from 'axios';
const API_KEY = '39210182-6a28ff40429aa6ef86c4432d6';
axios.defaults.baseURL = 'https://pixabay.com/api/';

import { limitPage, serchImg, renderImg } from './additional';

const elements = {
  serchForm: document.querySelector('.js-search-form'),
  divGallery: document.querySelector('.gallery'),
  buttonLoad: document.querySelector('.load-more'),
  container: document.querySelector('.js-list'),
};

let querySerch = '';
let pageSerch = 1;
elements.serchForm.addEventListener('submit', onSubmitForm);

const simpleBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const obsScroll = new IntersectionObserver(onObsScroll, {
  rootMargin: '300px',
});

function onSubmitForm(e) {
  e.preventDefault();
  const query = e.currentTarget.elements.searchQuery.value;
  if (!query.trim() || query === querySerch) {
    return;
  }
  querySerch = query;
  elements.divGallery.innerHTML = '';
  pageSerch = 1;
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
      obsScroll.observe(elements.target);
    }
    if (data.totalHits <= pageSerch * limitPage) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    // console.error(error);
    Notify.failure('Oops! Try again!');
  }
};

function onObsScroll(entries) {
  entries.forEach(entry => {
    console.log(entry);
    if (entry.isIntersecting) {
      pageSerch += 1;

      fetchImg(querySerch, pageSerch)
        .then(data => {
          renderImg(data);
          simpleBox.refresh();
          if (pageSerch > data.totalHits / limitPage) {
            obsScroll.unobserve(elements.target);
          }
        })
        .catch(err => Notify.failure(err.message))
        .finally(() => Loading.remove());
    }
  });
}

// function onLoadMore() {
//   pageSerch += 1;
//   simpleBox.refresh();
//   firstNumberImg(querySerch, pageSerch)
//     .then(data => {
//       renderImg(data.hits);
//       simpleBox.refresh();
//       const totalPages = Math.ceil(data.totalHits / limitPage);
//       console.log(limitPage);
//       if (pageSerch > totalPages) {
//         Notify.failure(
//           "We're sorry, but you've reached the end of the possible results"
//         );
//       }
//     })
//     .catch(error => console.error(error));
// }

// function checkEndPage() {
//   return (
//     window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
//   );
// }

// window.addEventListener('scroll', loadMorePage);
// function loadMorePage() {
//   if (checkEndPage()) {
//     onLoadMore();
//   }
// }
