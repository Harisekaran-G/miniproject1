const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

async function startDatabase() {
    const dbPath = path.join(__dirname, 'db_data'); // Adjusted path since we are running inside 'backend'

    // Ensure data directory exists
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
    }

    console.log('🚀 Starting Portable MongoDB...');
    console.log(`📂 Data Directory: ${dbPath}`);

    try {
        const mongod = await MongoMemoryServer.create({
            instance: {
                port: 27017,
                dbPath: dbPath,
                storageEngine: 'wiredTiger'
            }
        });

        const uri = mongod.getUri();
        console.log(`\n✅ MongoDB API is running!`);
        console.log(`🔗 Connection URI: ${uri}`);
        console.log(`🔌 Port: 27017`);
        console.log(`\n📝 You can now run the backend in a separate terminal:`);
        console.log(`   npm run dev`);

        // Keep the process alive
        process.on('SIGTERM', async () => {
            await mongod.stop();
            process.exit(0);
        });

        process.on('SIGINT', async () => {
            await mongod.stop();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Failed to start database:', error);
    }
}

startDatabase();
