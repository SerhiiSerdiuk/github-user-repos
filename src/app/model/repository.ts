export interface Repository {
  name: string;
  owner: {
    login: string;
  };
  description: string;
  updated_at: string;
}

export interface RepoReadMe {
  download_url: string;
}
