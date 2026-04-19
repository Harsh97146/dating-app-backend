import serverless from 'serverless-http';
import app from '../app.ts';
import connectDB from '../config/db.ts';

// Connect to DB (cached connection)
let cachedDB: any = null;

const handler = async (event: any, context: any) => {
  if (!cachedDB) {
    await connectDB();
    cachedDB = true;
  }
  return serverless(app)(event, context);
};

export { handler };
