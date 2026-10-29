export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const event = req.body;

    if (event.event === 'payment.captured') {
        const payment = event.payload.payment.entity;

        const paymentId = payment.id;
        const amount = payment.amount / 100;
        
        // Extract guest info passed via prefill or notes
        const name = payment.notes?.passenger_name || payment.entity?.prefill?.name || 'Guest';
        const phone = payment.notes?.passenger_phone || payment.contact || 'N/A';
        const description = payment.description || 'Cab Booking';

        const messageText = `🚨 *NEW CONFIRMED BOOKING!*\n\n` +
            `💳 *Payment ID:* ${paymentId}\n` +
            `👤 *Guest:* ${name}\n` +
            `📞 *Phone:* ${phone}\n` +
            `🚘 *Trip Details:* ${description}\n` +
            `💰 *Amount Paid:* ₹${amount}\n\n` +
            `Please assign driver and vehicle immediately!`;

        const instanceId = 'instance195653';
        const token = '7xb48pfchp4isgls';
        const hostPhone = '919561805990';

        try {
            const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'token': token,
                    'to': hostPhone,
                    'body': messageText
                })
            });
            const data = await response.json();
            console.log('UltraMsg Response:', data);
        } catch (err) {
            console.error('UltraMsg Dispatch Error:', err);
        }
    }

    return res.status(200).json({ status: 'ok' });
}
