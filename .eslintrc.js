module.exports = {
    env: {
        es6: true,
        node: true,
    },
    extends: 'eslint:recommended',
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        'quote-props': ['error', 'consistent-as-needed'],
        semi: ['error', 'always'],
        'no-console': 'off',
    },
};
