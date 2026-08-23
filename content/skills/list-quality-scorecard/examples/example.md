# Example

The fixture uses reserved example domains and fictional rows.

```bash
node scripts/audit-list.mjs --input=examples/leads.csv --output=/tmp/list-scorecard.json
```

Expected counts:

- rows: 3;
- duplicates: 1;
- missing titles: 1;
- invalid domains: 1;
- unverified: 1;
- missing ICP: 1;
- rejected ICP: 1.
