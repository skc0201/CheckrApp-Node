import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs'
import { app } from '../../app'; 
import Address from '../../models/address';
import Candidate from '../../models/candidate';
import Recruiter from '../../models/recruiter';
import Adverse from '../../models/adverse-action';
import  { Types } from 'mongoose';
import { ADVERSE_ADD, ADVERSE_LIST_SUCCESS, CANDIDATE_ADDRESS, CANDIDATE_ADVERSE, CANDIDATE_DATA, LOGIN_CRED, NOT_AUTHENTICATED, RECRUITER_DATA, VALIDATION_FAILED } from '../../utils/constant';

chai.use(chaiHttp);

describe('Adverse API', () => {
    let token: string;
    let id: string;
    let candidateId: Types.ObjectId;
    let addressId: Types.ObjectId;
    let adverseId: Types.ObjectId;

before(async () => {
        // Create a recruiter for testing purposes
        const hashedPassword = await bcrypt.hash('password', 12);
        const recruiter = await new Recruiter({
            ...RECRUITER_DATA , password: hashedPassword
        });
        await recruiter.save();
        const loginResponse = await chai.request(app)
            .post('/auth/login')
            .send({...LOGIN_CRED, password:'password'})
        token = loginResponse.body.token;
        id=loginResponse.body.recruiterId;

    });
    afterEach(async () => {
        if(id){
            await Recruiter.findByIdAndRemove(id);
        }
        if(candidateId){
            await Candidate.findByIdAndRemove(candidateId);
        }
        if(addressId){
            await Address.findByIdAndRemove(addressId);
        }
        if(adverseId){
            await Adverse.findByIdAndRemove(adverseId);
        }
    });
    describe('Get all Adverse list', () => {
        it('should return 401 unauthorized without a valid session token', async () => {
          const res = await chai
            .request(app)
            .get('/adverse/');
            expect(res.body).to.have.property('message', NOT_AUTHENTICATED)
        });
        it('should get all adverse', async () => {
          const res = await chai
            .request(app)
            .get('/adverse/')
            .set('Authorization', `Bearer ${token}`);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', ADVERSE_LIST_SUCCESS);
          expect(res.body).to.have.property('data').to.be.an('array');
        });
      });


  describe(" Add Adverse list", () => {
    it("should create a new candidate", async () => {
    const address = new Address(CANDIDATE_ADDRESS);
      await address.save();      
      addressId = address._id;
      const candidate = new Candidate({
         ...CANDIDATE_DATA,
        address: address._id,
        recruiter: id,
      });
      await candidate.save();
      candidateId = candidate?._id as Types.ObjectId
      const res = await chai
        .request(app)
        .post(`/adverse/${candidateId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(CANDIDATE_ADVERSE);
        adverseId = res.body.Report._id;
      expect(res).to.have.status(201);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(ADVERSE_ADD);

    });
    it("should throw error if adverse found", async () => {
        const address = new Address(CANDIDATE_ADDRESS);
          await address.save();      
          addressId = address._id;
          const candidate = new Candidate({
            ...CANDIDATE_DATA,
           address: address._id,
           recruiter: id,
         });
          await candidate.save();
          candidateId = candidate?._id as Types.ObjectId

          const adverse = new Adverse({
            ...CANDIDATE_ADVERSE,
            candidate:candidateId
        });
       await adverse.save()
       adverseId = adverse._id;
    
          const res = await chai
            .request(app)
            .post(`/adverse/${candidateId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(CANDIDATE_ADVERSE);
      expect(res.body.message).to.equal(
        'Adverse action already exists for candidate id ' + candidateId
      ); 
        });
    it("should return an error if validation fails", async () => {
      const res = await chai.request(app).post(`/adverse/${candidateId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(VALIDATION_FAILED);
    });
  });

});
