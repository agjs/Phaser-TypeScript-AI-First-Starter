/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Subject <= 72 chars keeps `git log --oneline` readable.
    'header-max-length': [2, 'always', 72],
    // Reject trailing period in subject.
    'subject-full-stop': [2, 'never', '.'],
    // Release-please's known types; anything else is rejected.
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'perf', 'refactor', 'revert', 'chore', 'docs', 'test', 'build', 'ci'],
    ],
  },
};
