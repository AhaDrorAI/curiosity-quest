// Tailwind builds only the classes the geography activity actually uses (instead of the 300 KB "Play CDN" script).
module.exports = {
  content: [__dirname + '/../site/activities/western-europe/index.html'],
  theme: { extend: {} },
  plugins: [],
};
