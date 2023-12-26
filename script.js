const resultsContainer = document.getElementById('resultsContainer');
const paginationContainer = document.getElementById('paginationContainer');
const searchInput = document.getElementById('searchInput');
let currentPage = 1;
const GITHUB_API = 'https://api.github.com';
const PER_PAGE = 30;

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchRepositories();
    }
});

async function searchRepositories() {
    const username = searchInput.value.trim();
    if (username === '') {
        showPopup('Please enter a username');
        return;
    }

    try {
        const { repositories, totalPages } = await fetchRepositories(username, currentPage);

        if (repositories.length === 0) {
            showPopup('No results for that user.');
            return;
        }

        displayRepositories(repositories);
        displayPagination(totalPages);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        showPopup('Seems like there is no such username. Please try again.');
    }
}

async function fetchRepositories(username, page) {
    const apiUrl = `${GITHUB_API}/users/${username}/repos?` + new URLSearchParams({
        page,
        per_page: PER_PAGE
    });
    const response = await fetch(apiUrl);
    const data = await response.json();
    const repositories = data || [];

    const apiUrlTotal = `${GITHUB_API}/users/${username}`;
    const responseUser = await fetch(apiUrlTotal);
    const dataUser = await responseUser.json();

    const totalPages = Math.ceil(dataUser.public_repos / PER_PAGE);

    return { repositories, totalPages };
}

function displayPagination(totalPages) {
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', () => handlePaginationClick(i));
        paginationContainer.appendChild(button);
    }
}

function displayRepositories(repositories) {
    resultsContainer.innerHTML = '';

    repositories.forEach(repository => {
        const row = document.createElement('div');
        row.className = 'repository-row';
        row.innerHTML = `
            <img src="${repository.owner.avatar_url}" alt="Avatar" width="30" height="30">
            <span>Author: ${repository.owner.login}</span>
            <span>Repository name: ${repository.name}</span>
            <span>Watchers: ${formatNumber(repository.watchers_count)}</span>
        `;
        row.addEventListener('click', () => {
            showRepositoryDetails(repository)
        });
        resultsContainer.appendChild(row);
    });
}

function handlePaginationClick(page) {
    currentPage = page;
    searchRepositories();
}

async function showRepositoryDetails(repository) {
    const apiUrl = `${GITHUB_API}/repos/${repository.owner.login}/${repository.name}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    localStorage.setItem('repositoryDetails', JSON.stringify(data));

    window.location.href = 'repository.html';
}

function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
}

function showPopup(message) {
    const popupContainer = document.getElementById('popupContainer');

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <p>${message}</p>
        <button onclick="closePopup()">OK</button>
    `;

    popupContainer.appendChild(popup);

    popup.style.display = 'block';
}

function closePopup() {
    const popupContainer = document.getElementById('popupContainer');
    const popup = popupContainer.querySelector('.popup');

    popup.style.display = 'none';

    popupContainer.removeChild(popup);
}