import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../../app';
import Recruiter from '../../models/recruiter';

chai.use(chaiHttp);

describe('Auth API', () => {
  after(() => {
    Recruiter.collection.drop();
  })

  describe('POST /recruiters', () => {
    it('should add a new recruiter', async () => {
      const res = await chai
        .request(app)
        .post('/auth/signup')
        .send({
          name: 'Sam',
          email: 'sam@example.com',
          password: 'password',
          company: 'Acme Inc',
          phone: '9876453623',
        });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message', 'Recruiter added successfully');
      expect(res.body).to.have.property('recruiterId');
    });

    it('should return validation error for invalid input', async () => {
      const res = await chai
        .request(app)
        .post('/auth/signup')
        .send({
          name: 'Sam',
          email: 'sam@example.com',
          password: '',
          company: 'Acme Inc',
          phone: '9876453623',
        });
      expect(res.body).to.have.property('message', 'Validation failed.');
      expect(res.body).to.have.property('data').to.be.an('array');
    });

    it('should return error for existing email', async () => {

      const res = await chai
        .request(app)
        .post('/auth/signup')
        .send({
          name: 'Sam Doe',
          email: 'sam@example.com', // Use the existing email here
          password: 'password123',
          company: 'Acme Inc',
          phone: '9876543210',
        });
        expect(res.body).to.have.property('message', 'Validation failed.');
        expect(res.body).to.have.property('data').to.be.an('array');
      });
  });
  describe('POST /login', () => {
    it('should login a recruiter and return a token', async () => {
      const res = await chai
        .request(app)
        .post('/auth/login')
        .send({
          email: 'sam@example.com',
          password: 'password',
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('recruiterId');
    });

    it('should return validation error for invalid input', async () => {
      const res = await chai
        .request(app)
        .post('/auth/login')
        .send({
          email: 'sam@example.com',
          password: '',
        });
      expect(res).to.have.status(500);
      expect(res.body).to.have.property('message', 'Validation failed.');
      expect(res.body).to.have.property('data').to.be.an('array');
    });

    it('should return error for non-existent email', async () => {
      const res = await chai
        .request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password',
        });
      expect(res).to.have.status(500); // Assuming the error handler returns 500 for this error
      expect(res.body).to.have.property('message', 'A recruiter with this nonexistent@example.com could not be found.');
    });

    it('should return error for wrong password', async () => {
      const res = await chai
        .request(app)
        .post('/auth/login')
        .send({
          email: 'sam@example.com',
          password: 'wrongpassword',
        });

      expect(res).to.have.status(500); // Assuming the error handler returns 500 for this error
      expect(res.body).to.have.property('message', 'Wrong password!! Please try again.');
    });
  });

});
