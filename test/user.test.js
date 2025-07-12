import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import app from '../app.js';

use(chaiHttp);

describe('GET /api/users', () => {
  it('should return empty array initially', async () => {
    const res = await supertest(app).get('/api/users');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.is.empty;
  });
});