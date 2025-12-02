import { google } from 'googleapis';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return Response.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    try {
        // Setup Google Sheets API
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = '1L1i06xn0u-pq9mrYIVqMMm6kU5yGFwKpZyZcAUxUXOM';

        // Check FinalVideo sheet (singular, as user created)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'FinalVideo!A:E',
        });

        const rows = response.data.values || [];

        // Find row with matching sessionId (assuming first row is header)
        const videoRow = rows.slice(1).find(row => row[0] === sessionId);

        if (videoRow) {
            return Response.json({
                status: 'ready',
                videoUrl: videoRow[2], // Column C (finalVideoUrl)
                userId: videoRow[1], // Column B (userId)
                completedAt: videoRow[3], // Column D (completedAt)
            });
        }

        // Not found yet = still processing
        return Response.json({
            status: 'processing',
            message: 'Your video is being generated...',
        });

    } catch (error) {
        console.error('Error checking video status:', error);
        return Response.json({
            status: 'error',
            error: 'Failed to check video status'
        }, { status: 500 });
    }
}
