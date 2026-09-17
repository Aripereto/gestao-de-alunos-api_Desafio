import request from 'supertest';
import 'dotenv/config';
import app from '../../src/app.js';

export function api() {
    return request(app);
}