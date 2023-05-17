import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs'
import { app } from '../../app'; 
import Address from '../../models/address';
import Candidate from '../../models/candidate';
import Recruiter from '../../models/recruiter';
import Adverse from '../../models/adverse-action';
import mongoose, { Types } from 'mongoose';

chai.use(chaiHttp);

describe('Recruiter API', () => {
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
    after(async () => {
        if(id){
            await Recruiter.findByIdAndRemove(id);
        }
    })
    describe('Get all Recruiter list', () => {
        it('should return 401 unauthorized without a valid session token', async () => {
          const res = await chai
            .request(app)
            .get('/user/');
            expect(res.body).to.have.property('message', 'Not authenticated.')
        });
        it('should get all recruiters', async () => {
          const res = await chai
            .request(app)
            .get('/user/')
            .set('Authorization', `Bearer ${token}`);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'All recruiters fetched Successfully');
          expect(res.body).to.have.property('recruiters').to.be.an('array');
        });
      });

      describe("Get recruiter by id", () => {
            it("should get a recruiter by ID", async () => {
                const res = await chai
                .request(app)
                .get(`/user/${id}`)
                .set('Authorization', `Bearer ${token}`);
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body.message).to.equal("Recruiter fetched Successfully");
              expect(res.body.candidates).to.be.an("object");
            
            });
        
            it("should return an error if recruiter ID is not found", async () => {
              const invalidRecId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
        
              const res = await chai
                .request(app)
                .get(`/user/${invalidRecId}`)
                .set('Authorization', `Bearer ${token}`);;
        
              expect(res).to.have.status(500);
              expect(res.body).to.be.an("object");
              expect(res.body.message).to.equal(
                'Could not find recruiter  with id: ' + invalidRecId
              );
            });
});

describe("Delete Recruiter API" , () => {

it('should delete recruiter', async () => {

      const res = await chai
         .request(app)
         .delete(`/user/${id}`)
         .set('Authorization', `Bearer ${token}`);
           expect(res).to.have.status(200);
           expect(res.body).to.have.property('message').equal('Recruiter deleted Successfully');
     });
it('should return 404 if recruiter not found', (done) => {
        const invalidRecId: Types.ObjectId = new mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
       chai
         .request(app)
         .delete(`/user/${invalidRecId}`)
         .set('Authorization', `Bearer ${token}`)
         .end((err, res) => {
           expect(res).to.have.status(500);
           expect(res.body.message).to.equal(
            'Could not find recruiter with id: ' + invalidRecId
          );
           done();
         });
     });

})
        


});