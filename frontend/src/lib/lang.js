export const getLanguageId = (language) => {
  const languageMap = {
    PYHTON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[language];
};

export const getLanguageName = (languageId) => {
  const LANGUAGE_NAMES = {
    74: 'TypeScript',
    63: 'JavaScript',
    71: 'Python',
    62: 'Java',
  };

  return LANGUAGE_NAMES[languageId] || 'Unknown';
};
