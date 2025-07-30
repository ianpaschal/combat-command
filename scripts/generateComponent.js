/* eslint-env node */
/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the target folder path from the CLI argument
const [targetPath] = process.argv.slice(2);

if (!targetPath) {
  console.error('❌ Please provide a target path. Example: npm run generate src/components/generic/Button');
  process.exit(1);
}

// Resolve full path relative to project root (__dirname)
const targetDir = path.resolve(__dirname, targetPath);

// The component name is the last folder name in the path
const pascalName = path.basename(targetDir);
const componentName = pascalName.charAt(0).toUpperCase() + pascalName.slice(1);

// Create folder if it doesn't exist
if (fs.existsSync(targetDir)) {
  console.error(`❌ Folder "${targetDir}" already exists. Aborting.`);
  process.exit(1);
}
fs.mkdirSync(targetDir, { recursive: true });

// Templates for files
const files = {
  'index.ts': `export type { ${componentName}Props } from './${componentName}';
export { ${componentName} } from './${componentName}';
`,
  [`${componentName}.module.scss`]: `@use "/src/style/flex";

.${componentName} {
  @include flex.column;
}
`,
  [`${componentName}.tsx`]: `import clsx from 'clsx';

import styles from './${componentName}.module.scss';

export interface ${componentName}Props {
  className?: string;
}

export const ${componentName} = ({
  className,
}: ${componentName}Props): JSX.Element => (
  <div className={clsx(styles.${componentName}, className)}>

  </div>
);
`,
};

// Write files
for (const [filename, content] of Object.entries(files)) {
  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created ${filePath}`);
}
