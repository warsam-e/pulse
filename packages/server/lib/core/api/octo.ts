import { Octokit } from '@octokit/rest';

const octo = new Octokit();

// biome-ignore lint/style/useNamingConvention: This is a valid name
export const githubUserById = (id: number) => octo.users.getById({ account_id: id });

export const gitHubAuthUser = (token: string) => new Octokit({ auth: token }).users.getAuthenticated();
