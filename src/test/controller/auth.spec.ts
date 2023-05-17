import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../../app';
import Recruiter from '../../models/recruiter';
import { LOGIN_CRED, RECRUITER_ADDED, RECRUITER_DATA, RECRUITER_NOT_FOUND, VALIDATION_FAILED, WRONG_PASSWORD } from '../../utils/constant';

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
            ...RECRUITER_DATA , password:'password'
        });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message', RECRUITER_ADDED);
      expect(res.body).to.have.property('recruiterId');
    });

    it('should return validation error for invalid input', async () => {
      const res = await chai
        .request(app)
        .post('/auth/signup')
        .send({
            ...RECRUITER_DATA , password:''

        });
      expect(res.body).to.have.property('message', VALIDATION_FAILED);
      expect(res.body).to.have.property('data').to.be.an('array');
    });

    it('should return error for existing email', async () => {

      const res = await chai
        .request(app)
        .post('/auth/signup')
        .send({
            ...RECRUITER_DATA , password:'password123'

        });
        expect(res.body).to.have.property('message', VALIDATION_FAILED);
        expect(res.body).to.have.property('data').to.be.an('array');
      });
  });
  describe('POST /login', () => {
    it('should login a recruiter and return a token', async () => {
      const res = await chai
        .request(app)
        .post('/auth/login')
        .send(LOGIN_CRED);

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
      expect(res.body).to.have.property('message', VALIDATION_FAILED);
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
      expect(res.body).to.have.property('message', RECRUITER_NOT_FOUND+'nonexistent@example.com');
    });

    it('should return error for wrong password', async () => {
      const res = await chai
        .request(app)
        .post('/auth/login')
        .send({
          email: 'test@checkr.com',
          password: 'wrongpassword',
        });

      expect(res).to.have.status(500); // Assuming the error handler returns 500 for this error
      expect(res.body).to.have.property('message', WRONG_PASSWORD);
    });
  });

});
