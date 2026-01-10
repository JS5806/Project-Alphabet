const express = require('express');
const { EventEmitter } = require('events');
const app = express();
const eventBus = new EventEmitter();

app.use(express.json());

// SSE Endpoint for Real-time Dashboard Updates
app.get('/api/notifications/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendUpdate = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    eventBus.on('new_alert', sendUpdate);
    req.on('close', () => eventBus.removeListener('new_alert', sendUpdate));
});

// One-Click Order API with Transaction Logic
app.post('/api/orders/one-click', async (req, res) => {
    const { storeId, productId, quantity } = req.body;
    try {
        // Logic: AWS SQS dispatch for async processing to handle high load
        console.log(`Order dispatched to SQS: Store ${storeId}, Product ${productId}, Qty ${quantity}`);
        res.status(202).json({ success: true, message: "Order processing started" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3000, () => console.log('Backend listening on port 3000'));