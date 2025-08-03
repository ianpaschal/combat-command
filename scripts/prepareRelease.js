import { execSync } from 'child_process';
import semver from 'semver';

const version = process.argv[2];
if (!version || !semver.valid(version)) {
  console.error('Please provide a valid semver version (e.g., 1.0.0)!');
  process.exit(1);
}

const releaseBranch = `release-v${version}`;

try {
  console.log(`\n🚀 Preparing release ${version}...\n`);

  execSync('git checkout develop', { stdio: 'inherit' });
  execSync('git pull origin develop', { stdio: 'inherit' });

  execSync(`git checkout -b ${releaseBranch}`, { stdio: 'inherit' });

  execSync(`npm version ${version} --no-git-tag-version`, { stdio: 'inherit' });
  execSync(`git commit -am "Prepare release v${version}"`, { stdio: 'inherit' });

  execSync(`git push --set-upstream origin ${releaseBranch}`, { stdio: 'inherit' });

  console.log(`\n📦 Creating pull request from '${releaseBranch}' to 'main'...\n`);

  execSync(`gh pr create --base main --head ${releaseBranch} --title "Release v${version}" --body "This PR prepares release v${version}."`, { stdio: 'inherit' });

  console.log(`\n✅ Release branch '${releaseBranch}' created and PR opened.\n`);
} catch (err) {
  console.error('❌ Failed to prepare release:', err.message);
  process.exit(1);
}
