# Example

This fixture is fictional. It tests normalization only.

```bash
node scripts/normalize-export.mjs --input=examples/raw.csv --output=/tmp/maps-companies.csv
```

Expected reconciliation:

- raw rows: 3;
- normalized rows: 2;
- duplicates removed: 1;
- no fit decision is invented.
