import { migrate } from 'drizzle-orm/node-postgres/migrator';

import drizzleConfig from '$/drizzle.config';

import { db, pool } from './config';

const main = async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await migrate(db, { migrationsFolder: drizzleConfig.out! });
  console.info('migration done');
};

main()
  .catch((e) => console.error(e))
  .finally(async () => await pool.end());
