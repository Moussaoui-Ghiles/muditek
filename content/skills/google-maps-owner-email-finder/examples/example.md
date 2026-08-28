# Example review

Input:

```csv
company_name,website
Example Roofing,https://example.com
```

The collector visits the supplied website and saves role snippets, published emails, page URLs, and any collection errors.

If the evidence does not name an owner, the correct result is:

```csv
company_name,website,owner_name,owner_role,owner_status,evidence_url,evidence_text,public_email,email_status,email_source_url,notes
Example Roofing,https://example.com,,,unknown,,,,,,No defensible owner evidence found.
```

`unknown` is a completed research result. It is safer than converting a founder, executive, domain registrant, or guessed email pattern into an owner claim.
