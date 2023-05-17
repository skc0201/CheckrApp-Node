import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs'
import { app } from '../../app'; 
import Address from '../../models/address';
import Candidate from '../../models/candidate';
import Recruiter from '../../models/recruiter';
import Report from '../../models/report';
import CourtSearch from '../../models/court-searches';
import Adverse from '../../models/adverse-action';
import mongoose, { Types } from 'mongoose';

chai.use(chaiHttp);

describe('Court Search  API', () => {
    let token: string;
    let id: string;
    let candidateId: Types.ObjectId;
    let addressId: Types.ObjectId;
    let adverseId: Types.ObjectId;
    let reportId: Types.ObjectId;
    let courtSerachId: Types.ObjectId;



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
        if(courtSerachId){
            await CourtSearch.findByIdAndRemove(courtSerachId);
        }
    });
    after(async () => {
        if(id){
            await Recruiter.findByIdAndRemove(id);
        }
    })
    describe('Get all Court search Report', () => {
        it('should return 401 unauthorized without a valid session token', async () => {
          const res = await chai
            .request(app)
            .get('/courtsearch/');
            expect(res.body).to.have.property('message', 'Not authenticated.')
        });
        it('should get all court search report', async () => {
          const res = await chai
            .request(app)
            .get('/courtsearch/')
            .set('Authorization', `Bearer ${token}`);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Court search report of all candidates fetched Successfully');
          expect(res.body).to.have.property('data').to.be.an('array');
        });
      });

describe("Get court search report by candidate id", () => {
it("should get a court search report by ID", async () => {
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
      const courtSearch = new CourtSearch({
        ssn_verification:{
            "status":"clear",
            "date":"2022-01-01"
        },
        sex_offender:{
            "status":"clear",
            "date":"2022-02-02"
        },
        global_watchlist:{
            "status":"consider",
            "date":"2022-03-03"
        },
        federal_criminal:{
            "status":"clear",
            "date":"2022-04-04"
        },
        country_criminal:{
            "status":"consider",
            "date":"2022-04-05"
        },
        candidate:candidateId
    });
    await courtSearch.save()
     courtSerachId = courtSearch._id;
      const res = await chai
                .request(app)
                .get(`/courtsearch/${candidateId}`)
                .set('Authorization', `Bearer ${token}`);
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body.message).to.equal("Candidate report fetched Successfully");
            });
        
 it("should return an error if candidate ID is not found", async () => {
              const invalidId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000123');
              const res = await chai
                .request(app)
                .get(`/courtsearch/${invalidId}`)
                .set('Authorization', `Bearer ${token}`);;
              expect(res).to.have.status(500);
              expect(res.body).to.be.an("object");
              expect(res.body.message).to.equal(
                'Could not find candidate report with id: ' + invalidId
              );
        });
});


describe("Add Court Search report API", () => {
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
                    .post(`/courtsearch/${candidateId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        ssn_verification: {
                            "status":"clear",
                            "date":"2022-01-01"
                        },
                        sex_offender:{
                            "status":"clear",
                            "date":"2022-02-02"
                        },
                        global_watchlist:{
                            "status":"consider",
                            "date":"2022-03-03"
                        },
                        federal_criminal:{
                            "status":"clear",
                            "date":"2022-04-04"
                        },
                        country_criminal:{
                            "status":"consider",
                            "date":"2022-04-05"
                        },
                    });
                courtSerachId = res.body.Report._id;
                  expect(res).to.have.status(201);
                  expect(res.body).to.be.an("object");
                  expect(res.body.message).to.equal("Candidate court search Report added successfully");
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
      const courtSearch = new CourtSearch({
        ssn_verification:{
            "status":"clear",
            "date":"2022-01-01"
        },
        sex_offender:{
            "status":"clear",
            "date":"2022-02-02"
        },
        global_watchlist:{
            "status":"consider",
            "date":"2022-03-03"
        },
        federal_criminal:{
            "status":"clear",
            "date":"2022-04-04"
        },
        country_criminal:{
            "status":"consider",
            "date":"2022-04-05"
        },
        candidate:candidateId
    });
    await courtSearch.save()
     courtSerachId = courtSearch._id;
   const res = await chai.request(app).post(`/courtsearch/${candidateId}`)
   .set('Authorization', `Bearer ${token}`)
   .send({
    ssn_verification:{
        "status":"clear",
        "date":"2022-01-01"
    },
    sex_offender:{
        "status":"clear",
        "date":"2022-02-02"
    },
    global_watchlist:{
        "status":"consider",
        "date":"2022-03-03"
    },
    federal_criminal:{
        "status":"clear",
        "date":"2022-04-04"
    },
    country_criminal:{
        "status":"consider",
        "date":"2022-04-05"
    },
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
      const res = await chai.request(app).post(`/courtsearch/${candidateId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Validation failed.");
});
});


describe("Update Court search report API", () => {
    it("should update a  court search report", async () => {
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
      const courtSearch = new CourtSearch({
        ssn_verification:{
            "status":"clear",
            "date":"2022-01-01"
        },
        sex_offender:{
            "status":"clear",
            "date":"2022-02-02"
        },
        global_watchlist:{
            "status":"consider",
            "date":"2022-03-03"
        },
        federal_criminal:{
            "status":"clear",
            "date":"2022-04-04"
        },
        country_criminal:{
            "status":"consider",
            "date":"2022-04-05"
        },
        candidate:candidateId
    });
    await courtSearch.save()
     courtSerachId = courtSearch._id;
          const res = await chai
                    .request(app)
                    .put(`/courtsearch/${candidateId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        ssn_verification:{
                            "status":"consider",
                            "date":"2022-01-01"
                        },
                        sex_offender:{
                            "status":"clear",
                            "date":"2022-02-02"
                        },
                        global_watchlist:{
                            "status":"clear",
                            "date":"2022-03-03"
                        },
                        federal_criminal:{
                            "status":"clear",
                            "date":"2022-04-04"
                        },
                        country_criminal:{
                            "status":"consider",
                            "date":"2022-04-05"
                        },
                    });
                  expect(res).to.have.status(200);
                  expect(res.body).to.be.an("object");
                  expect(res.body.message).to.equal("Candidate report updated Successfully");
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
   const res = await chai.request(app).put(`/courtsearch/${candidateId}`)
   .set('Authorization', `Bearer ${token}`)
   .send({
    ssn_verification:{
        "status":"consider",
        "date":"2022-01-01"
    },
    sex_offender:{
        "status":"clear",
        "date":"2022-02-02"
    },
    global_watchlist:{
        "status":"clear",
        "date":"2022-03-03"
    },
    federal_criminal:{
        "status":"clear",
        "date":"2022-04-04"
    },
    country_criminal:{
        "status":"consider",
        "date":"2022-04-05"
    },
   });
   expect(res.body).to.be.an("object");
   expect(res.body.message).to.equal('Could not find candidate report with id: ' + candidateId);
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
      const courtSearch = new CourtSearch({
        ssn_verification:{
            "status":"clear",
            "date":"2022-01-01"
        },
        sex_offender:{
            "status":"clear",
            "date":"2022-02-02"
        },
        global_watchlist:{
            "status":"consider",
            "date":"2022-03-03"
        },
        federal_criminal:{
            "status":"clear",
            "date":"2022-04-04"
        },
        country_criminal:{
            "status":"consider",
            "date":"2022-04-05"
        },
        candidate:candidateId
    });
    await courtSearch.save()
     courtSerachId = courtSearch._id;
     const res = await chai.request(app).put(`/courtsearch/${candidateId}`)
     .set('Authorization', `Bearer ${token}`)
     .send({});
     expect(res.body).to.be.an("object");
     expect(res.body.message).to.equal('Validation failed.');
});
});

describe('Delete court search API' , () => {
    it('should delete court search report', async () => {
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
      const courtSearch = new CourtSearch({
        ssn_verification:{
            "status":"clear",
            "date":"2022-01-01"
        },
        sex_offender:{
            "status":"clear",
            "date":"2022-02-02"
        },
        global_watchlist:{
            "status":"consider",
            "date":"2022-03-03"
        },
        federal_criminal:{
            "status":"clear",
            "date":"2022-04-04"
        },
        country_criminal:{
            "status":"consider",
            "date":"2022-04-05"
        },
        candidate:candidateId
    });
    await courtSearch.save()
     courtSerachId = courtSearch._id;
      const res = await chai
         .request(app)
         .delete(`/courtsearch/${candidateId}`)
         .set('Authorization', `Bearer ${token}`);
           expect(res).to.have.status(200);
           expect(res.body).to.have.property('message').equal('Candidate report deleted successfully!!');
     });
it('should return 404 if candidate not found', (done) => {
        const invalidCandidateId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
       chai
         .request(app)
         .delete(`/courtsearch/${invalidCandidateId}`)
         .set('Authorization', `Bearer ${token}`)
         .end((err, res) => {
           expect(res).to.have.status(500);
           expect(res.body).to.have.property('message').equal('Could not find candidate with id: ' + invalidCandidateId);
           done();
         });
     });
})

});
