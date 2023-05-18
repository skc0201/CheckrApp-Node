import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs'
import { app } from '../../app'; 
import Address from '../../models/address';
import Candidate from '../../models/candidate';
import Recruiter from '../../models/recruiter';
import mongoose, { Types } from 'mongoose';
import { RECRUITER_DATA, LOGIN_CRED, CANDIDATE_ADDED, CANDIDATE_ADDRESS, CANDIDATE_DATA, CANDIDATE_LIST, NOT_AUTHENTICATED, CANDIDATE_NOT_FOUND, VALIDATION_FAILED, CANDIDATE_ADDRESS_NOT_FOUND, CANDIDATE_DELETED, CANDIDATE_UPDATED } from '../../utils/constant';

chai.use(chaiHttp);

describe('Candidate API', () => {
    let token: string;
    let id: string;
    let candidateId: Types.ObjectId;
    let addressId: Types.ObjectId;

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
    });
  describe('Get all candidates', () => {
    it('should return 401 unauthorized without a valid session token', async () => {
      const res = await chai
        .request(app)
        .get('/candidate/');
        expect(res.body).to.have.property('message', NOT_AUTHENTICATED)
    });
    it('should get all candidates', async () => {
      const res = await chai
        .request(app)
        .get('/candidate/')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', CANDIDATE_LIST);
      expect(res.body).to.have.property('candidates').to.be.an('array');
    });
  });

  describe(" Add candidate", () => {
    it("should create a new candidate", async () => {
        const candidateData = {
            ...CANDIDATE_DATA , ... CANDIDATE_ADDRESS
        }

      const res = await chai
        .request(app)
        .post("/candidate")
        .set('Authorization', `Bearer ${token}`)
        .send(candidateData);
      expect(res).to.have.status(201);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(CANDIDATE_ADDED);

      // Check if the candidate and address were saved in the database
      const candidate = await Candidate.findOne({ email: candidateData.email });
      candidateId = candidate?._id as Types.ObjectId;
      addressId = candidate?.address as Types.ObjectId;
      expect(candidate).to.exist;
      expect(candidate?.firstName).to.equal(candidateData.firstName);
      expect(candidate?.lastName).to.equal(candidateData.lastName);
      expect(candidate?.email).to.equal(candidateData.email);
      expect(candidate?.contact).to.equal(candidateData.contact);
      expect(candidate?.license).to.equal(candidateData.license);
      const address = await Address.findById(candidate?.address);
      expect(address).to.exist;
      expect(address?.houseNo).to.equal(candidateData.houseNo);
      expect(address?.streetNo).to.equal(candidateData.streetNo);
      expect(address?.city).to.equal(candidateData.city);
      expect(address?.state).to.equal(candidateData.state);
      expect(address?.pincode).to.equal(candidateData.pincode);
    });

    it("should return an error if validation fails", async () => {
      const res = await chai.request(app).post("/candidate")
      .set('Authorization', `Bearer ${token}`)
      .send({});
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(VALIDATION_FAILED);
    });
  });
describe("Get by id", () => {
    it("should get a candidate by ID", async () => {
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
        .get(`/candidate/${candidate._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(CANDIDATE_LIST);
      expect(res.body.candidates).to.be.an("object");
      expect(res.body.candidates.firstName).to.equal(candidate.firstName);
      expect(res.body.candidates.lastName).to.equal(candidate.lastName);
      expect(res.body.candidates.address.city).to.equal(address.city);
      expect(res.body.candidates.address.state).to.equal(address.state);
      expect(res.body.candidates.address.pincode).to.equal(address.pincode);
    });

    it("should return an error if candidate ID is not found", async () => {
      const invalidCandidateId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000003');

      const res = await chai
        .request(app)
        .get(`/candidate/${invalidCandidateId}`)
        .set('Authorization', `Bearer ${token}`);;

      expect(res).to.have.status(500);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(
        CANDIDATE_NOT_FOUND + invalidCandidateId
      );
    });
  });

describe('update and delete Candidate', () => {

it('should update candidate details and address', async () => {
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
      const updatedData = {
        ...CANDIDATE_DATA,
        ...CANDIDATE_ADDRESS
      };
      updatedData.lastName='doe'
      updatedData.email = 'sam1@example.com';
      updatedData.houseNo = "10";
   const res = await  chai
      .request(app)
      .put(`/candidate/${candidate?._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').equal(CANDIDATE_UPDATED);
  });
  it('should throw address not found', async () => { 
    const invalidaddId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
      const candidate = new Candidate({
...CANDIDATE_DATA,
        address: invalidaddId,
        recruiter: id,
      });
      await candidate.save();
      candidateId = candidate?._id as Types.ObjectId;
      const updatedData = {
        ...CANDIDATE_DATA,
        ...CANDIDATE_ADDRESS
      };
      updatedData.lastName='doe'
      updatedData.email = 'sam1@example.com';
      updatedData.houseNo = "10";
   const res = await  chai
      .request(app)
      .put(`/candidate/${candidate?._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);
      expect(res).to.have.status(500);
      expect(res.body.message).to.equal(
        CANDIDATE_ADDRESS_NOT_FOUND + invalidaddId
      );  });
  it('should throw validation error', async () => {
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
      const updatedData = {
        ...CANDIDATE_DATA,
        ...CANDIDATE_ADDRESS
      };
      updatedData.lastName=''
      updatedData.email = '';
   const res = await  chai
      .request(app)
      .put(`/candidate/${candidate?._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);
      expect(res).to.have.status(500);
  });

  it('should return 404 if candidate not found', (done) => {
    const invalidCandidateId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
    chai
      .request(app)
      .put(`/candidate/${invalidCandidateId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({...CANDIDATE_DATA , ...CANDIDATE_ADDRESS  })
      .end((err, res) => {
        expect(res).to.have.status(500);
              expect(res.body.message).to.equal(
                CANDIDATE_NOT_FOUND + invalidCandidateId
      );
        done();
      });
  });

it('should delete candidate and address', async () => {
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
         .delete(`/candidate/${candidateId}`)
         .set('Authorization', `Bearer ${token}`);

           expect(res).to.have.status(200);
           expect(res.body).to.have.property('message').equal(CANDIDATE_DELETED);
     });
it('should return 404 if candidate not found in delete request', (done) => {
        const invalidCandidateId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
       chai
         .request(app)
         .delete(`/candidate/${invalidCandidateId}`)
         .set('Authorization', `Bearer ${token}`)
         .end((err, res) => {
           expect(res).to.have.status(500);
           expect(res.body).to.have.property('message').equal(CANDIDATE_NOT_FOUND + invalidCandidateId);
           done();
         });
     });

});


});
