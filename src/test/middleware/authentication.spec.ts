import { assert, expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';

import  {authenticate} from '../../middleware/auth';

describe('Authentication middleware', () => {
	const sandbox = sinon.createSandbox();
	it('Check if the middleware throws an error if no authorization header is present', () => {
		const request: any = {
			get: function (headerName: any) {
				return null;
			},
		};
		const status = sinon.stub();
		const json = sinon.spy();
		const response: any = {
			status,
			json,
		};
		status.returns(response);
		const next: NextFunction = sinon.mock();
		assert.throws(function() { authenticate(request , response , next) }, Error, 'Not authenticated.');
	});

	it('Check if the middleware throws an error is authorization header is only one string', () => {
		const request: any = {
			get: function (headerName: any) {
				return 'dummy';
			},
		};
		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);
		const next: NextFunction = sinon.mock();
		assert.throws(function() { authenticate(request , response , next) }, Error, 'Not authenticated!!');


	});

	it('Check if a userId is returned after decoding the token', () => {
		const obj: any = { userId: 'abc' };
		const request: any = {
			get: function (headerName: any) {
				return `Bearer jhsdfjkjkdsvmabjkwb`;
			},
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);
		const next: NextFunction = sinon.mock();
		const mockJWT = sandbox.stub(jwt, 'verify').returns(obj);
		authenticate(request, response, next);
		expect(request).to.have.property('userId');
		expect(request).to.have.property('userId', 'abc');
		expect(mockJWT.calledOnce).to.be.true;
	});
    it('Check if a object is returned', async () => {
		const obj: any = undefined;
		const request: any = {
			get: function (headerName: any) {
				return `Bearer jhsdfjkjkdsvmabjkwb`;
			},
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);
		const next: NextFunction = sinon.mock();
		sandbox.stub(jwt, 'verify').returns(obj);
        assert.throws(function() { authenticate(request , response , next) }, Error, 'Not authenticated!!.');
        expect(request).not.have.property('userId');
		expect(request).not.have.property('userId', 'abc');

	});
	afterEach(() => {
		sandbox.restore();
	})
});
