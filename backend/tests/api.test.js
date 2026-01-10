const request = require('supertest');
const app = require('../server');

describe('Todo API Unit Tests', () => {
    it('should fetch all todos', async () => {
        const res = await request(app).get('/api/todos');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should create a new todo', async () => {
        const res = await request(app)
            .post('/api/todos')
            .send({ task: 'QA Automation Test', priority: 'High' });
        expect(res.statusCode).toEqual(201);
        expect(res.body.task).toBe('QA Automation Test');
    });
});