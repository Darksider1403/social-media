export const normalizeUsername = (firstName, lastName) => {
  // Function to remove diacritics (accents)
  const removeDiacritics = (str) => {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Get normalized first and last names
  const normalizedFirstName = firstName
    ? removeDiacritics(firstName.toLowerCase())
    : "";
  const normalizedLastName = lastName
    ? removeDiacritics(lastName.toLowerCase())
    : "";

  // Create username
  let username = normalizedFirstName;
  if (normalizedLastName) {
    username += "_" + normalizedLastName;
  }

  return username;
};

// Helper to generate profile URL
export const getProfileUrl = (firstName, lastName) => {
  return `/profile/@${normalizeUsername(firstName, lastName)}`;
};
