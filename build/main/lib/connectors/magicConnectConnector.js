"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicConnectConnector = void 0;
const connect_1 = require("@magic-ext/connect");
const core_1 = require("@wagmi/core");
const magic_sdk_1 = require("magic-sdk");
const magicConnector_1 = require("./magicConnector");
const CONNECT_TIME_KEY = 'wagmi-magic-connector.connect.time';
const CONNECT_DURATION = 604800000; // 7 days in milliseconds
class MagicConnectConnector extends magicConnector_1.MagicConnector {
    constructor(config) {
        super(config);
        this.magicSdkConfiguration = config.options.magicSdkConfiguration;
    }
    async connect() {
        if (!this.magicOptions.apiKey)
            throw new Error('Magic API Key is not provided.');
        try {
            const provider = await this.getProvider();
            if (provider.on) {
                provider.on('accountsChanged', this.onAccountsChanged);
                provider.on('chainChanged', this.onChainChanged);
                provider.on('disconnect', this.onDisconnect);
            }
            // Check if there is a user logged in
            const isAuthenticated = await this.isAuthorized();
            // Check if we have a chainId, in case of error just assign 0 for legacy
            let chainId;
            try {
                chainId = await this.getChainId();
            }
            catch (e) {
                chainId = 0;
            }
            // if there is a user logged in, return the user
            if (isAuthenticated) {
                return {
                    provider,
                    chain: {
                        id: chainId,
                        unsupported: false,
                    },
                    account: await this.getAccount(),
                };
            }
            // open the modal and process the magic login steps
            if (!this.isModalOpen) {
                const output = await this.getUserDetailsByForm(false, true, []);
                const magic = this.getMagicSDK();
                // LOGIN WITH MAGIC LINK WITH EMAIL
                if (output.email) {
                    await magic.wallet.connectWithUI();
                    const signer = await this.getSigner();
                    let account = (await signer.getAddress());
                    if (!account.startsWith('0x'))
                        account = `0x${account}`;
                    // As we have no way to know if a user is connected to Magic Connect we store a connect timestamp
                    // in local storage
                    window.localStorage.setItem(CONNECT_TIME_KEY, String(new Date().getTime()));
                    return {
                        account,
                        chain: {
                            id: chainId,
                            unsupported: false,
                        },
                        provider,
                    };
                }
            }
            throw new core_1.UserRejectedRequestError('User rejected request');
        }
        catch (error) {
            throw new core_1.UserRejectedRequestError('Something went wrong');
        }
    }
    async getChainId() {
        var _a;
        const networkOptions = (_a = this.magicSdkConfiguration) === null || _a === void 0 ? void 0 : _a.network;
        if (typeof networkOptions === 'object') {
            const chainID = networkOptions.chainId;
            if (chainID) {
                return (0, core_1.normalizeChainId)(chainID);
            }
        }
        throw new Error('Chain ID is not defined');
    }
    getMagicSDK() {
        if (!this.magicSDK) {
            this.magicSDK = new magic_sdk_1.Magic(this.magicOptions.apiKey, Object.assign(Object.assign({}, this.magicSdkConfiguration), { extensions: [new connect_1.ConnectExtension()] }));
        }
        return this.magicSDK;
    }
    // Overrides isAuthorized because Connect opens overlay whenever we interact with one of its methods.
    // Moreover, there is currently no proper way to know if a user is currently logged in to Magic Connect.
    // So we use a local storage state to handle this information.
    // TODO Once connect API grows, integrate it
    async isAuthorized() {
        if (localStorage.getItem(CONNECT_TIME_KEY) === null) {
            return false;
        }
        return (parseInt(window.localStorage.getItem(CONNECT_TIME_KEY)) +
            CONNECT_DURATION >
            new Date().getTime());
    }
    // Overrides disconnect because there is currently no proper way to disconnect a user from Magic
    // Connect.
    // So we use a local storage state to handle this information.
    async disconnect() {
        window.localStorage.removeItem(CONNECT_TIME_KEY);
    }
}
exports.MagicConnectConnector = MagicConnectConnector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFnaWNDb25uZWN0Q29ubmVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb25uZWN0b3JzL21hZ2ljQ29ubmVjdENvbm5lY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnREFBc0Q7QUFNdEQsc0NBS3FCO0FBQ3JCLHlDQUFrQztBQUVsQyxxREFBZ0U7QUFNaEUsTUFBTSxnQkFBZ0IsR0FBRyxvQ0FBb0MsQ0FBQztBQUM5RCxNQUFNLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxDQUFDLHlCQUF5QjtBQUU3RCxNQUFhLHFCQUFzQixTQUFRLCtCQUFjO0lBS3ZELFlBQVksTUFBMEQ7UUFDcEUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUM7SUFDcEUsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPO1FBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTTtZQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDcEQsSUFBSTtZQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRTFDLElBQUksUUFBUSxDQUFDLEVBQUUsRUFBRTtnQkFDZixRQUFRLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUN2RCxRQUFRLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ2pELFFBQVEsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUM5QztZQUVELHFDQUFxQztZQUNyQyxNQUFNLGVBQWUsR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVsRCx3RUFB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