// Vercel Serverless Function: /api/lookup?code=XXXXX
// Liest die Code-Name-Zuordnung aus einer Environment Variable (REFERRALS_JSON),
// die NUR im Vercel-Dashboard hinterlegt wird – landet nie im Git-Repo/GitHub.

export default function handler(req, res) {
  const { code } = req.query;

  let referrals = {};
  try {
    referrals = JSON.parse(process.env.REFERRALS_JSON || '{}');
  } catch (e) {
    return res.status(500).json({ name: null, error: 'REFERRALS_JSON ungültig konfiguriert' });
  }

  const name = code ? referrals[code] || null : null;
  res.status(200).json({ name });
}
