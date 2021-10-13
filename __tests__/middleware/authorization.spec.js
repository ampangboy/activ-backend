const mockJwt = require('../../utils/jwt');
const authorization = require('../../middleware/authorization');

jest.mock('../../utils/jwt', () => ({ checkJwtValidity: jest.fn(), decodeJwt: jest.fn() }));

let mockRequest;
let mockResponse;
const mockNext = jest.fn();

beforeEach(() => {
  mockRequest = {};
  mockResponse = {
    status: jest.fn(() => ({
      end: jest.fn(),
    })),
  };
});

test('it allow authorization if the correct capabilities is called', async () => {
  // @ts-ignore
  mockJwt.checkJwtValidity.mockResolvedValue(true);
  // @ts-ignore
  mockJwt.decodeJwt.mockResolvedValue({
    capabilities: ['fakeCapability'],
  });

  mockRequest = {
    header: jest.fn().mockImplementation(() => 'Bearer fakeToken'),
  };

  const authorizationMiddleware = authorization('fakeCapability');
  await authorizationMiddleware(mockRequest, mockResponse, mockNext);

  expect(mockJwt.decodeJwt).toHaveBeenCalledWith('fakeToken');
  expect(mockRequest.header).toHaveBeenCalledWith('Authorization');
  expect(mockNext).toHaveBeenCalledTimes(1);
});
