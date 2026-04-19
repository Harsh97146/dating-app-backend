import serverless from 'serverless-http';
import app from '../app.ts';
import connectDB from '../config/db.ts';

// Connect to DB (cached connection)
let cachedDB: any = null;

const handler = async (event: any, context: any) => {
  try {
    if (!cachedDB) {
      await connectDB();
      cachedDB = true;
    }
    return await serverless(app)(event, context);
  } catch (error: any) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', message: error.message }),
    };
  }
};

export { handler };
