# Evidence review rules

## Explicit owner

Accept `explicit` only when the cited text names the person and uses owner or proprietor language for the same business.

Good evidence:

```text
Jane Smith is the owner of Example Roofing.
```

Insufficient by itself:

```text
Jane Smith founded Example Roofing in 2004.
Jane Smith is the president of Example Roofing.
Jane Smith leads the Example Roofing team.
```

Those statements do not prove current ownership. Return `unknown` unless another cited page explicitly names the person as owner or proprietor.

## Unknown

Use `unknown` when:

- no person is named;
- only one weak page exists;
- the business name contains a person's name but no page connects that person to the business;
- the page is stale;
- two pages conflict;
- the page names a founder but not a current owner;
- the evidence belongs to another company with a similar name.

## Public email

Copy only an email address visible in the collected page evidence. Mark it `published_unverified` and cite its page. A public address may still bounce or reach a shared inbox.
