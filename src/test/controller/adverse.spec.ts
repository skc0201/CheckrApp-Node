import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs'
import { app } from '../../app'; 
import Address from '../../models/address';
import Candidate from '../../models/candidate';
import Recruiter from '../../models/recruiter';
import Adverse from '../../models/adverse-action';

import  { Types } from 'mongoose';

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
        if(adverseId){
            await Adverse.findByIdAndRemove(adverseId);
        }
    });
    describe('Get all Adverse list', () => {
        it('should return 401 unauthorized without a valid session token', async () => {
          const res = await chai
            .request(app)
            .get('/adverse/');
            expect(res.body).to.have.property('message', 'Not authenticated.')
        });
        it('should get all adverse', async () => {
          const res = await chai
            .request(app)
            .get('/adverse/')
            .set('Authorization', `Bearer ${token}`);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Adverse action list fetched Successfully');
          expect(res.body).to.have.property('data').to.be.an('array');
        });
      });


  describe(" Add Adverse list", () => {
    it("should create a new candidate", async () => {
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
      const candidateDetails = await Candidate.find({candidate: candidateId});

      const res = await chai
        .request(app)
        .post(`/adverse/${candidateId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            name:'sam',
            status:'clear',
            pre_notice_date:'1990-01-01',
            post_notice_date:'1990-02-02',
            candidate:candidateId
        });
        adverseId = res.body.Report._id;
      expect(res).to.have.status(201);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Candidate adverse Report added successfully");

    });
    it("should throw error if adverse found", async () => {
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

          const adverse = new Adverse({
            name:'sam',
            status:'clear',
            pre_notice_date:'1990-01-01',
            post_notice_date:'1990-02-02',
            candidate:candidateId
        });
       await adverse.save()
       adverseId = adverse._id;
    
          const res = await chai
            .request(app)
            .post(`/adverse/${candidateId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name:'sam',
                status:'clear',
                pre_notice_date:'1990-01-01',
                post_notice_date:'1990-02-02',
                candidate:candidateId
            });
      expect(res.body.message).to.equal(
        'Adverse action already exists for candidate id ' + candidateId
      ); 
        });
    it("should return an error if validation fails", async () => {
      const res = await chai.request(app).post(`/adverse/${candidateId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Validation failed.");
    });
  });

});
