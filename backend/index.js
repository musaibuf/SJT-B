const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

// --- LOAD CREDENTIALS (LOCAL vs PRODUCTION) ---
let CREDENTIALS;
try {
  if (process.env.GOOGLE_CREDENTIALS) {
    CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    console.log("Loaded credentials from Environment Variable.");
  } else {
    CREDENTIALS = require('./secret.json');
    console.log("Loaded credentials from secret.json file.");
  }
} catch (error) {
  console.error("CRITICAL ERROR: Could not load Google Credentials.");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
const SPREADSHEET_ID = '1z9yu-vDbevKKs29Y_t5NyfAN42DeZ_b_CMcViYIZuXo';

// --- ANSWER KEY FOR VARIANT B (Rank 1 = Best, Rank 4 = Worst) ---
// Logic: Score = 5 - Rank.
const ANSWER_KEY = {
  1:  { D: 1, C: 2, B: 3, A: 4 }, 
  2:  { A: 1, B: 2, D: 3, C: 4 }, 
  3:  { C: 1, B: 2, A: 3, D: 4 }, 
  4:  { A: 1, D: 2, C: 3, B: 4 }, 
  5:  { B: 1, A: 2, D: 3, C: 4 }, 
  6:  { B: 1, A: 2, D: 3, C: 4 }, 
  7:  { A: 1, C: 2, D: 3, B: 4 }, 
  8:  { C: 1, A: 2, B: 3, D: 4 }, 
  9:  { C: 1, A: 2, B: 3, D: 4 }, 
  10: { B: 1, D: 2, A: 3, C: 4 }, 
  11: { B: 1, A: 2, C: 3, D: 4 }, 
  12: { C: 1, D: 2, A: 3, B: 4 }  
};

// --- GOOGLE SHEETS AUTHENTICATION ---
const auth = new google.auth.GoogleAuth({
  credentials: CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// --- SCORING LOGIC ---
const calculateQuestionScore = (qId, userChoice) => {
  const ranks = ANSWER_KEY[qId];
  if (!ranks || !userChoice) return 0;

  const rank = ranks[userChoice];
  if (!rank) return 0; // Invalid choice

  // Rank 1 -> 4 points
  // Rank 2 -> 3 points
  // Rank 3 -> 2 points
  // Rank 4 -> 1 point
  return 5 - rank;
};

// --- API ROUTE ---
app.post('/api/submit', async (req, res) => {
  try {
    const { userInfo, responses } = req.body;
    
    console.log(`Received submission for: ${userInfo.name} (Variant B)`);

    // 1. Calculate Scores for Q1-Q12
    const questionScores = [];
    for (let i = 1; i <= 12; i++) {
      const userChoice = responses[i]; // e.g., 'A'
      const score = calculateQuestionScore(i, userChoice);
      questionScores.push(score);
    }

    // 2. Get Text Answers for Q13-Q15
    const answerQ13 = responses[13] || "";
    const answerQ14 = responses[14] || "";
    const answerQ15 = responses[15] || "";

    // 3. Prepare Row Data based on YOUR specific columns:
    // Name, CNIC, Dealership, City, Score Q1...Score Q12, Q13 Ans, Q14 Ans, Q15 Ans
    const rowData = [
      userInfo.name,
      userInfo.cnic,
      userInfo.dealership,
      userInfo.city,
      ...questionScores, // Spreads Score Q1 to Score Q12
      answerQ13,
      answerQ14,
      answerQ15
    ];

    // 4. Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1', 
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData],
      },
    });

    res.status(200).json({ message: 'Success' });

  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});