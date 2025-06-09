import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const url = `https://bustime.mta.info/api/siri/stop-monitoring.json?key=${process.env.MTA_API_KEY}&OperatorRef=MTA&MonitoringRef=308208&LineRef=MTA%20NYCT_B63`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}