import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  input: document.querySelector('[type="text"]'),
  searchBtn: document.querySelector('[type="submit"]'),
  gallery: document.querySelector('.gallery'),
};

const params = {
  API_KEY: '41227446-81114c3a771220f4777577230',
  BASE_URL: 'https://pixabay.com/api/',
};

function getGaleryItems() {
  return fetch(
    `${params.BASE_URL}?key=${params.API_KEY}&q=${refs.input.value}&image_type=photo&orientation=horizontal&safesearch=true`
  ).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }

    return resp.json();
  });
}

refs.searchBtn.addEventListener('click', onSearch);

function onSearch(e) {
  e.preventDefault();

  getGaleryItems()
    .then(data => (refs.gallery.innerHTML = createMarkup(data.hits)))
    .catch(err => console.error(err));
}

function createMarkup(arr) {
  if (arr.length === 0) {
    iziToast.error({
      title: 'Error',
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      position: 'topRight',
    });
  }
  return arr
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
        return `
    <li>
        <a href='${largeImageURL}'>
            <img src="${webformatURL}" alt="${tags}" data-source=${largeImageURL}/>
        </a>
        <span>Likes: ${likes}</span>
        <span>Views: ${views}</span>
        <span>Comments: ${comments}</span>
        <span>Downloads: ${downloads}</span>
    </li>`;
      }
    )
    .join('');
}

let lightbox = new SimpleLightbox('.gallery a');
