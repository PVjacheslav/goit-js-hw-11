import axios from 'axios';
const API_KEY = '39210182-6a28ff40429aa6ef86c4432d6';
const limitPage = 40;
axios.defaults.baseURL = 'https://pixabay.com/api/';

const elements = {
  serchForm: document.querySelector('.js-search-form'),
  divGallery: document.querySelector('.gallery'),
  buttonLoad: document.querySelector('.load-more'),
  container: document.querySelector('.js-list'),
};

const serchImg = async (querySerch, pageSerch) => {
  try {
    const { data } = await axios({
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
    return data;
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
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
  elements.divGallery.insertAdjacentHTML('beforeend', markup);
}

export { limitPage, serchImg, renderImg };
