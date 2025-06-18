/* eslint-env node */
/* eslint-disable no-console */

const [prBody, baseBranch, action] = process.argv.slice(2);
const token = process.env.GITHUB_TOKEN;
const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

if (!token) {
  console.error('GITHUB_TOKEN not set.');
  process.exit(1);
}

const issueNumbers = [...prBody.matchAll(/#(\d+)/g)].map((m) => parseInt(m[1]));
if (issueNumbers.length === 0) {
  console.log('No issues referenced.');
  process.exit(0);
}

let statusToSet;

if (baseBranch === 'master') {
  statusToSet = 'Done';
} else if (action === 'opened') {
  statusToSet = 'In Review';
} else {
  statusToSet = 'Ready to Deploy';
}

const PROJECT_TITLE = 'Combat Command';
const STATUS_FIELD_NAME = 'Status';

console.log(`Setting status to: ${statusToSet} for issues: ${issueNumbers.join(', ')}`);

const graphql = async (query, variables = {}) => {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error('GraphQL query failed');
  }
  return json.data;
};

// Step 1: Get project ID and status field ID
const repoData = await graphql(`
  query($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      projectsV2(first: 10) {
        nodes {
          id
          title
          fields(first: 20) {
            nodes {
              id
              name
              ... on ProjectV2SingleSelectField {
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`, { owner, repo });

const project = repoData.repository.projectsV2.nodes.find((p) => p.title === PROJECT_TITLE);
if (!project) {
  console.error(`Project "${PROJECT_TITLE}" not found.`);
  process.exit(1);
}

const statusField = project.fields.nodes.find((f) => f.name === STATUS_FIELD_NAME);
const statusOption = statusField?.options?.find((o) => o.name === statusToSet);

if (!statusField || !statusOption) {
  console.error('Could not find status field or matching option.');
  process.exit(1);
}

// Step 2: Iterate through issues
for (const number of issueNumbers) {
  const issueRes = await graphql(`
    query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $number) {
          id
          projectItems(first: 10) {
            nodes {
              id
              project {
                id
              }
            }
          }
        }
      }
    }
  `, { owner, repo, number });

  const issue = issueRes.repository.issue;

  const item = issue.projectItems.nodes.find((n) => n.project.id === project.id);

  if (!item) {
    console.warn(`Issue #${number} is not in the project.`);
    continue;
  }

  await graphql(`
    mutation {
      updateProjectV2ItemFieldValue(
        input: {
          projectId: "${project.id}",
          itemId: "${item.id}",
          fieldId: "${statusField.id}",
          value: {
            singleSelectOptionId: "${statusOption.id}"
          }
        }
      ) {
        projectV2Item {
          id
        }
      }
    }
  `);

  console.log(`Issue #${number} updated to "${statusToSet}"`);
}
