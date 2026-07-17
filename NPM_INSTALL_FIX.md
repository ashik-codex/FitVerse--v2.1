# npm install network fix

This project includes a local `.npmrc` that points npm to the public registry.

Normal commands:

```bash
npm install
npm run dev
```

If an old proxy setting still causes an ETIMEDOUT error, run:

```bash
npm config delete proxy
npm config delete https-proxy
npm config set registry https://registry.npmjs.org/
npm install
```
