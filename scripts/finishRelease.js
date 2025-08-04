import { execSync } from 'child_process';
import semver from 'semver';

const version = process.argv[2];
if (!version || !semver.valid(version)) {
  console.error('Please provide a valid semver version (e.g., 1.0.0)!');
  process.exit(1);
}

const releaseBranch = `release-v${version}`;
const tagName = `v${version}`;

try {
  console.log(`\nPublishing release ${version}...\n`);

  execSync('git checkout main', { stdio: 'inherit' });
  execSync('git pull origin main', { stdio: 'inherit' });
  execSync(`git merge --ff-only ${releaseBranch}`, { stdio: 'inherit' });

  execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
  execSync('git push origin main');
  execSync(`git push origin ${tagName}`);

  execSync('git checkout develop', { stdio: 'inherit' });

  execSync(`git branch -d ${releaseBranch}`, { stdio: 'inherit' });
  execSync(`git push origin --delete ${releaseBranch}`, { stdio: 'inherit' });

  console.log(`\n✅ Release ${version} completed and cleaned up.\n`);
} catch (err) {
  console.error('❌ Failed to finish release:', err.message);
  process.exit(1);
}
