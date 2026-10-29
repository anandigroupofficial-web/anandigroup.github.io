export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const event = req.body;

    // Trigger alert when Razorpay confirms payment completion
    if (event.event === 'payment.captured') {
        const payment = event.payload.payment.entity;

        const paymentId = payment.id;
        const amount = payment.amount / 100; // Convert paise to INR
        const name = payment.notes.name || payment.email || 'Guest';
        const phone = payment.contact || 'N/A';
        const description = payment.description || 'Cab Booking';

        const messageText = `🚨 *NEW CONFIRMED BOOKING!*\n\n` +
            `💳 *Payment ID:* ${paymentId}\n` +
            `👤 *Guest:* ${name}\n` +
            `📞 *Phone:* ${phone}\n` +
            `🚘 *Trip:* ${description}\n` +
            `💰 *Paid:* ₹${amount}\n\n` +
            `Please assign driver and vehicle immediately.`;

        // Your configured UltraMsg API credentials
        const instanceId = 'instance195653';
        const token = '7xb48pfchp4isgls';
        const hostPhone = '919561805990';

        try {
            await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'token': token,
                    'to': hostPhone,
                    'body': messageText
                })
            });
        } catch (err) {
            console.error('Failed to send WhatsApp alert:', err);
        }
    }

    return res.status(200).json({ status: 'ok' });
}
