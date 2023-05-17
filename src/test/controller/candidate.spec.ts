import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs'
import { app } from '../../app'; 
import Address from '../../models/address';
import Candidate from '../../models/candidate';
import Recruiter from '../../models/recruiter';
import mongoose, { Types } from 'mongoose';

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
            email: 'test@checkr.com',
            password: hashedPassword,
            name: 'Test Recruiter',
            phone: 9675648978,
            company:"Test company"
        });
        await recruiter.save();
        const loginResponse = await chai.request(app)
            .post('/auth/login')
            .send({
                email: 'test@checkr.com',
                password: 'password'
            })
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
        expect(res.body).to.have.property('message', 'Not authenticated.')
    });
    it('should get all candidates', async () => {
      const res = await chai
        .request(app)
        .get('/candidate/')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'Candidates fetched Successfully');
      expect(res.body).to.have.property('candidates').to.be.an('array');
    });
  });

  describe(" Add candidate", () => {
    it("should create a new candidate", async () => {
      const firstName = "Sushil";
      const lastName = "Doe";
      const email = "sushil@example.com";
      const contact = "9867564768";
      const license = "ABC123";
      const DOB = "1990-01-01";
      const houseNo = "123";
      const streetNo = "456";
      const city = "City";
      const state = "State";
      const pincode = "123456";

      const res = await chai
        .request(app)
        .post("/candidate")
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName,
          lastName,
          email,
          contact,
          license,
          DOB,
          houseNo,
          streetNo,
          city,
          state,
          pincode,
        });
      expect(res).to.have.status(201);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Candidate added successfully");

      // Check if the candidate and address were saved in the database
      const candidate = await Candidate.findOne({ email });
      candidateId = candidate?._id as Types.ObjectId;
      addressId = candidate?.address as Types.ObjectId;
      expect(candidate).to.exist;
      expect(candidate?.firstName).to.equal(firstName);
      expect(candidate?.lastName).to.equal(lastName);
      expect(candidate?.email).to.equal(email);
      expect(candidate?.contact).to.equal(contact);
      expect(candidate?.license).to.equal(license);
      const address = await Address.findById(candidate?.address);
      expect(address).to.exist;
      expect(address?.houseNo).to.equal(houseNo);
      expect(address?.streetNo).to.equal(streetNo);
      expect(address?.city).to.equal(city);
      expect(address?.state).to.equal(state);
      expect(address?.pincode).to.equal(pincode);
    });

    it("should return an error if validation fails", async () => {
      const res = await chai.request(app).post("/candidate")
      .set('Authorization', `Bearer ${token}`)
      .send({});
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Validation failed.");
    });
  });
describe("Get by id", () => {
    it("should get a candidate by ID", async () => {
      const address = new Address({
        houseNo: "1",
        streetNo: "456",
        city: "City",
        state: "State",
        pincode: "123456",
      });
      await address.save();

      addressId = address._id;
      const candidate = new Candidate({
        firstName: "sam",
        lastName: "last",
        email: "sam@example.com",
        contact: "9867546324",
        license: "ABC123",
        DOB: "1990-01-01",
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
      expect(res.body.message).to.equal("Candidate fetched Successfully");
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
        "Could not find candidate with id: " + invalidCandidateId
      );
    });
  });

describe('update and delete Candidate', () => {

it('should update candidate details and address', async () => {
    const address = new Address({
        houseNo: "1",
        streetNo: "456",
        city: "City",
        state: "State",
        pincode: "123456",
      });
      await address.save();      
      addressId = address._id;
      const candidate = new Candidate({
        firstName: "sam",
        lastName: "last",
        email: "sam@example.com",
        contact: "9867546324",
        license: "ABC123",
        DOB: "1990-01-01",
        address: address._id,
        recruiter: id,
      });
      await candidate.save();
      candidateId = candidate?._id as Types.ObjectId
   const res = await  chai
      .request(app)
      .put(`/candidate/${candidate?._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'sam',
        lastName: 'Doe',
        email: 'sam1@example.com',
        contact: '9867546324',
        license: 'ABC123',
        DOB: '1990-01-01',
        houseNo: '2',
        streetNo: '456',
        city: 'City',
        state: 'State',
        pincode: '123456',
      });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').equal('Candidate details updated Successfully');
  });
  it('should throw address not found', async () => { 
    const invalidaddId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
      const candidate = new Candidate({
        firstName: "sam",
        lastName: "last",
        email: "sam@example.com",
        contact: "9867546324",
        license: "ABC123",
        DOB: "1990-01-01",
        address: invalidaddId,
        recruiter: id,
      });
      await candidate.save();
      candidateId = candidate?._id as Types.ObjectId
   const res = await  chai
      .request(app)
      .put(`/candidate/${candidate?._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'sam',
        lastName: 'Doe',
        email: 'sam1@example.com',
        contact: '9867546324',
        license: 'ABC123',
        DOB: '1990-01-01',
        houseNo: '2',
        streetNo: '456',
        city: 'City',
        state: 'State',
        pincode: '123456',
      });
      expect(res).to.have.status(500);
      expect(res.body.message).to.equal(
        "Could not find address of candidate with id: " + invalidaddId
      );  });
  it('should throw validation error', async () => {
    const address = new Address({
        houseNo: "1",
        streetNo: "456",
        city: "City",
        state: "State",
        pincode: "123456",
      });
      await address.save();      
      addressId = address._id;
      const candidate = new Candidate({
        firstName: "sam",
        lastName: "last",
        email: "sam@example.com",
        contact: "9867546324",
        license: "ABC123",
        DOB: "1990-01-01",
        address: address._id,
        recruiter: id,
      });
      await candidate.save();
      candidateId = candidate?._id as Types.ObjectId
   const res = await  chai
      .request(app)
      .put(`/candidate/${candidate?._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'sam',
        lastName: '',
        email: '',
        contact: '9867546324',
        license: 'ABC123',
        DOB: '1990-01-01',
        houseNo: '2',
        streetNo: '456',
        city: 'City',
        state: 'State',
        pincode: '123456',
      });
      expect(res).to.have.status(500);
  });

  it('should return 404 if candidate not found', (done) => {
    const invalidCandidateId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
    chai
      .request(app)
      .put(`/candidate/${invalidCandidateId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'sam',
        lastName: 'Doe',
        email: 'sam1@example.com',
        contact: '9867546324',
        license: 'ABC123',
        DOB: '1990-01-01',
        houseNo: '2',
        streetNo: '456',
        city: 'City',
        state: 'State',
        pincode: '123456',      })
      .end((err, res) => {
        expect(res).to.have.status(500);
              expect(res.body.message).to.equal(
        "Could not find candidate with id: " + invalidCandidateId
      );
        done();
      });
  });

it('should delete candidate and address', async () => {
        const address = new Address({
            houseNo: "1",
            streetNo: "456",
            city: "City",
            state: "State",
            pincode: "123456",
          });
          await address.save();      
          addressId = address._id;
          const candidate = new Candidate({
            firstName: "sam",
            lastName: "last",
            email: "sam@example.com",
            contact: "9867546324",
            license: "ABC123",
            DOB: "1990-01-01",
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
           expect(res.body).to.have.property('message').equal('Candidate deleted');
     });
it('should return 404 if candidate not found in delete request', (done) => {
        const invalidCandidateId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
       chai
         .request(app)
         .delete(`/candidate/${invalidCandidateId}`)
         .set('Authorization', `Bearer ${token}`)
         .end((err, res) => {
           expect(res).to.have.status(500);
           expect(res.body).to.have.property('message').equal('Could not find candidate with id: ' + invalidCandidateId);
           done();
         });
     });

});


});
