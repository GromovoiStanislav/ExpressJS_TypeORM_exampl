import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'node_postgres',
  synchronize: false,
  logging: false,

  entities: ['dist/entity/*.js', 'src/entity/*.ts'],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

/* 
migrations:
npm run build
typeorm migration:generate src/db/migrations/NewMigration -d dist/db/data-source.js
npm run build
typeorm migration:run -d dist/db/data-source.js

typeorm migration:revert -d dist/db/data-source.js
typeorm schema:drop -d dist/db/data-source.js
*/
