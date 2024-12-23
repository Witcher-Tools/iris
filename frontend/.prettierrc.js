export default {
    trailingComma: "es5",
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    bracketSameLine: true,
    printWidth: 90,

    plugins: ["@trivago/prettier-plugin-sort-imports"],

    importOrder: [
        "^(react/(.*)$)|^(react$)",
        "<THIRD_PARTY_MODULES>",
        "^@bindings/(.*)$",
        "^@shared/(.*)$",
        "^[./]",
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};
