const { sequelize } = require('../models');
const migration = require('../migrations/001-initial-schema.js');
const seeder = require('../seeders/001-initial-seed.js');

async function resetAndSeed() {
  try {
    console.log('1. Disabling foreign key checks & dropping legacy tables...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    const [tables] = await sequelize.query('SHOW TABLES;');
    for (const t of tables) {
      const tableName = Object.values(t)[0];
      await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
      console.log(`Dropped table: ${tableName}`);
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('2. Running MySQL 8.4 schema migration...');
    await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    console.log('3. Running seed script for 4 core users...');
    await seeder.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    console.log('SUCCESS: All 4 users freshly seeded into MySQL 8.4 database!');
    process.exit(0);
  } catch (err) {
    console.error('Reset and seed failure:', err);
    process.exit(1);
  }
}

resetAndSeed();
