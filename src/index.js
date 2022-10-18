import { Notify } from 'notiflix';
import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API = '30669255-3cabbcd8662d973d281d546e8';
let currentPage = 1;
let currentKeyword = '';

const refForm = document.querySelector('#search-form');
const refGallery = document.querySelector('.gallery');
const refLoadMore = document.querySelector('.load-more');

refForm.addEventListener('submit', sumbitHandler);
refLoadMore.addEventListener('click', loadMoreHandler);

function sumbitHandler(event) {
  event.preventDefault();
  const search = event.currentTarget.searchQuery.value;
  currentPage = 1;
  renderList(search);
}

async function getPics(search, page) {
  try {
    const response = await axios.get('', {
      params: {
        key: API,
        q: search,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

function renderListMarkup(arrayPics) {
  return arrayPics
    .map(
      pic => `<div class="photo-card">
  <img src="${pic.webformatURL}" alt="${pic.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${pic.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${pic.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${pic.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${pic.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}

async function renderList(search) {
  try {
    refLoadMore.classList.add('hidden');
    const data = await getPics(search, currentPage);
    if (data.totalHits === 0) {
      refGallery.innerHTML = '';
      currentPage = 1;
      currentKeyword = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (search !== currentKeyword) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      currentPage = 1;
      currentKeyword = search;
      refGallery.innerHTML = '';
    }

    refGallery.insertAdjacentHTML('beforeend', renderListMarkup(data.hits));
    refLoadMore.classList.remove('hidden');

    if (Math.ceil(data.totalHits / 40) === currentPage) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refLoadMore.classList.add('hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

function loadMoreHandler(event) {
  currentPage += 1;
  renderList(currentKeyword);
}
