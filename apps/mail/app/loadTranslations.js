 export default async function loadTranslations(locale) {
    const t = await import(`../public/locales/${locale}.json`);
    return t.default;
}