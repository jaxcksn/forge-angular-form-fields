export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'node scripts/sync-version.mjs ${nextRelease.version}',
      },
    ],
    ['@semantic-release/npm', { pkgRoot: 'dist/forge-angular-form-fields' }],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'projects/forge-angular-form-fields/package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
    '@semantic-release/github',
  ],
};
