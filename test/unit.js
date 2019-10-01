/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
const path = require("path");
const { tests, utils } = require("@iobroker/testing");
const { setup } = require("../build/setup");

const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const { should, use } = require("chai");

should();
use(sinonChai);
use(chaiAsPromised);

// Run unit tests - See https://github.com/ioBroker/testing for a detailed explanation and further options
tests.unit(path.join(__dirname, ".."), {
	defineAdditionalTests() {
		// Create mocks and asserts
		const { adapter, database } = utils.unit.createMocks({});
		const { assertObjectExists } = utils.unit.createAsserts(database, adapter);

		describe("setup => setupGlobalAsync", () => {
			afterEach(() => {
				// The mocks keep track of all method invocations - reset them after each single test
				adapter.resetMockHistory();
				// We want to start each test with a fresh database
				database.clear();
			});

			for (const deviceName of ["products", "scenes", "groups"]) {
				it(`should generate ${deviceName} device`, async function() {
					await setup.setupGlobalAsync(adapter);
					assertObjectExists(`${deviceName}`);
				});

				it(`shouldn't throw if ${deviceName} device already exists`, async function() {
					await adapter.setObjectNotExistsAsync(`${deviceName}`, {
						type: "device",
						common: {
							name: `${deviceName}`,
						},
						native: {},
					});
					return setup.setupGlobalAsync(adapter).should.be.fulfilled;
				});

				it(`should generate ${deviceName}Found state`, async function() {
					// @ts-ignore
					await setup.setupGlobalAsync(adapter);
					assertObjectExists(`${deviceName}.${deviceName}Found`);
				});
			}

			it(`should generate gateway device`, async function() {
				await setup.setupGlobalAsync(adapter);
				assertObjectExists(`gateway`);
			});

			it(`shouldn't throw if gateway device already exists`, async function() {
				await adapter.setObjectNotExistsAsync(`gateway`, {
					type: "device",
					common: {
						name: `gateway`,
					},
					native: {},
				});
				return setup.setupGlobalAsync(adapter).should.be.fulfilled;
			});

			it(`should generate gateway ProtocolVersion state`, async function() {
				await setup.setupGlobalAsync(adapter);
				assertObjectExists(`gateway.ProtocolVersion`);
			});

			it(`should generate gateway Version state`, async function() {
				await setup.setupGlobalAsync(adapter);
				assertObjectExists(`gateway.Version`);
			});

			it(`should generate gateway GatewayState`, async function() {
				await setup.setupGlobalAsync(adapter);
				assertObjectExists(`gateway.GatewayState`);
			});

			it(`should generate gateway GatewaySubState`, async function() {
				await setup.setupGlobalAsync(adapter);
				assertObjectExists(`gateway.GatewaySubState`);
			});
		});
	},
});