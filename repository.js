document.addEventListener('DOMContentLoaded', () => {
    const repoDetails = getRepositoryDetailsFromLocalStorage();
    displayRepositoryDetails(repoDetails);
});

function getRepositoryDetailsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('repositoryDetails'));
}

function displayRepositoryDetails(repository) {
    document.getElementById('repoName').innerText = repository.name;
    document.getElementById('repoCreated').innerText = new Date(repository.created_at).toLocaleDateString();
    document.getElementById('repoLanguage').innerText = repository.language;
    document.getElementById('repoDescription').innerText = repository.description;
}

function openRepoURL() {
    const repoDetails = getRepositoryDetailsFromLocalStorage();
    window.open(repoDetails.html_url, '_blank');
}

function goBack() {
    window.history.back();
}