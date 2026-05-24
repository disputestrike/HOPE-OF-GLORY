# Bible source data

The canonical Bible source for Hope of Glory Ministry is the **World English Bible (WEB)** — a modern English translation in the public domain.

## Download

Run once before `pnpm ingest:bible`:

1. Visit https://ebible.org/engwebp/
2. Download the JSON edition (or scrape from the USFM files)
3. Place the resulting file at `content/bible/web.json`

Expected shape (array of verses):

```json
[
  { "book": "Genesis", "chapter": 1, "verse": 1, "text": "In the beginning, God created the heavens and the earth." },
  { "book": "Genesis", "chapter": 1, "verse": 2, "text": "Now the earth was formless and empty..." }
]
```

## Why public domain

ESV, NIV, NASB, and most modern translations are copyrighted. Their licensing terms restrict bulk database storage and commercial use (and PayPal donations make a website "commercial" under the ESV API terms). The WEB has none of these restrictions — it can be copied, broadcast, posted online, preached from, and redistributed freely.

KJV is also public domain in the United States and is acceptable as a secondary source.

**Do not** ingest ESV, NIV, NASB, CSB, or other copyrighted translations into this database.

## License

The World English Bible is in the public domain. From its official statement:

> The World English Bible is in the Public Domain. That means that it is not copyrighted. However, "World English Bible" is a Trademark of eBible.org.
>
> You may copy, publish, proclaim, distribute, redistribute, sell, give away, quote, memorize, read publicly, broadcast, transmit, share, back up, post on the Internet, print, reproduce, preach, teach from, and use the World English Bible as much as you want, and others can also do so. All we ask is that if you CHANGE the actual text of the World English Bible in any way, you not call the result the World English Bible any more.

## After ingestion

The script populates two tables:

1. **`scripture_passages`** — verse-by-verse storage (one row per verse). Used for direct lookup by reference.
2. **`source_chunks` + `embeddings`** — pericope windows (12 verses each, 2-verse overlap) with vector embeddings. Used for semantic retrieval.
