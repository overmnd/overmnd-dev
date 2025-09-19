module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  rules: {
    // Keep naming readable and avoid single-letter noise.
    "id-length": ["warn", { "min": 2, "exceptions": ["i", "j", "k", "x", "y"] }]
  }
};
