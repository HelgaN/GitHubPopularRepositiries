class GitHubService {
  constructor() {
    this._apiBase = `https://api.github.com/search/repositories?q=`;
    this.stars = 50000;
  }

  async getResourse(url) {
    const resp = await fetch(`${this._apiBase}${url}&per_page=100`);

    if(!resp.ok) {
      throw new Error(`Could not fetch ${url}`, `received ${url.status}`);
    }

    return await resp.json();
  }

  async getPopularRepositories() {
    const query = await this.getResourse(`stars:>=${this.stars}`);
    return query;
  }
}

export default GitHubService;
