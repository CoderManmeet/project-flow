import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { checkUpcomingDeadlines } from './services/deadlineChecker.js';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Check deadlines on startup, then every hour
  checkUpcomingDeadlines();
  setInterval(checkUpcomingDeadlines, 60 * 60 * 1000);
});