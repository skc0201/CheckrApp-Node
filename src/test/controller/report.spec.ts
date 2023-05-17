import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs'
import { app } from '../../app'; 
import Address from '../../models/address';
import Candidate from '../../models/candidate';
import Recruiter from '../../models/recruiter';
import Report from '../../models/report';
import Adverse from '../../models/adverse-action';
import mongoose, { Types } from 'mongoose';

chai.use(chaiHttp);

describe('Report API', () => {
    let token: string;
    let id: string;
    let candidateId: Types.ObjectId;
    let addressId: Types.ObjectId;
    let adverseId: Types.ObjectId;
    let reportId: Types.ObjectId;


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
        if(candidateId){
            await Candidate.findByIdAndRemove(candidateId);
        }
        if(addressId){
            await Address.findByIdAndRemove(addressId);
        }
        if(adverseId){
            await Adverse.findByIdAndRemove(adverseId);
        }
        if(reportId){
            await Report.findByIdAndRemove(reportId);
        }
    });
    after(async () => {
        if(id){
            await Recruiter.findByIdAndRemove(id);
        }
    })
    describe('Get all Report', () => {
        it('should return 401 unauthorized without a valid session token', async () => {
          const res = await chai
            .request(app)
            .get('/report/');
            expect(res.body).to.have.property('message', 'Not authenticated.')
        });
        it('should get all report', async () => {
          const res = await chai
            .request(app)
            .get('/report/')
            .set('Authorization', `Bearer ${token}`);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Report of all candidates fetched Successfully');
          expect(res.body).to.have.property('candidates').to.be.an('array');
        });
      });

describe("Get report by id", () => {
it("should get a candidate report by ID", async () => {
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
      const report = new Report({
        status:'status',
        adjudication:'adjudication',
        completedAt:'1990.01.01',
        tat:'2h',
        candidate:candidateId
    });
    await report.save()
     reportId = report._id;
      const res = await chai
                .request(app)
                .get(`/report/${candidateId}`)
                .set('Authorization', `Bearer ${token}`);
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body.message).to.equal("Candidate report fetched Successfully");
              expect(res.body.candidates).to.be.an("array");
            });
        
            it("should return an error if recruiter ID is not found", async () => {
              const invalidId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000123');
              const res = await chai
                .request(app)
                .get(`/report/${invalidId}`)
                .set('Authorization', `Bearer ${token}`);;
              expect(res).to.have.status(500);
              expect(res.body).to.be.an("object");
              expect(res.body.message).to.equal(
                'Could not find candidate report with id: ' + invalidId
              );
        });
});


describe("Add report API", () => {
    it("should create a new report", async () => {
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
                    .post(`/report/${candidateId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        status:"clear",
                        adjudication:"Engage",
                        completedAt:'1990-01-01',
                        tat:'2h',
                        candidate:candidateId
                    });
                    reportId = res.body.Report._id;
                  expect(res).to.have.status(201);
                  expect(res.body).to.be.an("object");
                  expect(res.body.message).to.equal("Candidate Report added successfully");
                  expect(res.body.Report).to.be.an("object");
});

it("should throw error if report already found", async () => {
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
    const report = new Report({
      status:'status',
      adjudication:'adjudication',
      completedAt:'1990.01.01',
      tat:'2h',
      candidate:candidateId
  });
  await report.save()
   reportId = report._id;
   const res = await chai.request(app).post(`/report/${candidateId}`)
   .set('Authorization', `Bearer ${token}`)
   .send({
    status:"clear",
    adjudication:"Engage",
    completedAt:'1990-01-01',
    tat:'2h',
    candidate:candidateId
   });
   expect(res.body).to.be.an("object");
   expect(res.body.message).to.equal('Report already exists for candidate id ' + candidateId);
});
            
it("should return an error if validation fails", async () => {
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

      const res = await chai.request(app).post(`/report/${candidateId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Validation failed.");
});
});


describe("Update report API", () => {
    it("should update a  report", async () => {
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
          candidateId = candidate?._id as Types.ObjectId;
          const report = new Report({
            status:'status',
            adjudication:'adjudication',
            completedAt:'1990.01.01',
            tat:'2h',
            candidate:candidateId
        });
        await report.save()
         reportId = report._id;
          const res = await chai
                    .request(app)
                    .put(`/report/${candidateId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        status:"clear",
                        adjudication:"pre-adverse",
                        completedAt:'1990-01-01',
                        tat:'3h',
                    });
                  expect(res).to.have.status(200);
                  expect(res.body).to.be.an("object");
                  expect(res.body.message).to.equal("Candidate report updated Successfully");
});

it("should throw error if candidate not found", async () => {
    const invalidCanId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
   const res = await chai.request(app).put(`/report/${invalidCanId}`)
   .set('Authorization', `Bearer ${token}`)
   .send({
    status:"clear",
    adjudication:"Engage",
    completedAt:'1990-01-01',
    tat:'2h',
   });
   expect(res.body).to.be.an("object");
   expect(res.body.message).to.equal('Could not find candidate report with id: ' + invalidCanId);
});
            
it("should return an error if validation fails", async () => {
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
      const report = new Report({
        status:'status',
        adjudication:'adjudication',
        completedAt:'1990.01.01',
        tat:'2h',
        candidate:candidateId
    });
    await report.save()
     reportId = report._id;
     const res = await chai.request(app).put(`/report/${candidateId}`)
     .set('Authorization', `Bearer ${token}`)
     .send({});
     expect(res.body).to.be.an("object");
     expect(res.body.message).to.equal('Validation failed.');
});
});

});
