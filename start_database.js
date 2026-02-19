const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

async function startDatabase() {
    const dbPath = path.join(__dirname, 'backend', 'db_data');

    // Ensure data directory exists
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
    }

    console.log('🚀 Starting Portable MongoDB...');
    console.log(`📂 Data Directory: ${dbPath}`);

    try {
        // Determine if we should use a specific storage engine or just default
        // For persistence in MMS v9+, we can try to use a specific instance path if supported, 
        // but the standard MMS is in-memory. 
        // However, 'mongodb-memory-server-core' allows downloading the binary. A persistent run usually requires passing the dbPath to the binary.

        // Let's configure it to run on the standard port 27017
        const mongod = await MongoMemoryServer.create({
            instance: {
                port: 27017,
                dbPath: dbPath, // This attempts to persist data
                storageEngine: 'wiredTiger'
            }
        });

        const uri = mongod.getUri();
        console.log(`\n✅ MongoDB API is running!`);
        console.log(`🔗 Connection URI: ${uri}`);
        console.log(`🔌 Port: 27017`);
        console.log(`\n📝 You can now run the backend in a separate terminal:`);
        console.log(`   cd backend && npm run dev`);

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
