export default {
    trailingComma: "es5",
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    bracketSameLine: true,
    plugins: ["@trivago/prettier-plugin-sort-imports"],
    importOrder: ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};
