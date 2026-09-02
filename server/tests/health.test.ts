import request from 'supertest';
import { createApp } from '../src/app';

describe('Health Check & Documentation Endpoints', () => {
  const app = createApp();

  it('GET /api/v1/health should return 200 and system health status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.service).toBe('INVICTUS Platform Backend API');
    expect(res.body.data.team).toBe('INVICTUS');
    expect(res.body.data.status).toBe('ONLINE');
  });

  it('GET /undefined-route should return 404 with standard error format', async () => {
    const res = await request(app).get('/api/v1/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
