# ExpressJS with TypeORM (Active Record)

1. express
2. typeorm
3. class-validator

migrations:

```
npm run build
typeorm migration:generate src/db/migrations/NewMigration -d dist/db/data-source.js

npm run build
typeorm migration:run -d dist/db/data-source.js
```
