"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicAuthConnector = void 0;
const oauth_1 = require("@magic-ext/oauth");
const core_1 = require("@wagmi/core");
const magic_sdk_1 = require("magic-sdk");
const magicConnector_1 = require("./magicConnector");
class MagicAuthConnector extends magicConnector_1.MagicConnector {
    constructor(config) {
        var _a, _b;
        super(config);
        this.magicSdkConfiguration = config.options.magicSdkConfiguration;
        this.oauthProviders = ((_a = config.options.oauthOptions) === null || _a === void 0 ? void 0 : _a.providers) || [];
        this.oauthCallbackUrl = (_b = config.options.oauthOptions) === null || _b === void 0 ? void 0 : _b.callbackUrl;
        this.enableSMSLogin = config.options.enableSMSLogin;
        this.enableEmailLogin = config.options.enableEmailLogin;
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
                const output = await this.getUserDetailsByForm(this.enableSMSLogin, this.enableEmailLogin, this.oauthProviders);
                const magic = this.getMagicSDK();
                // LOGIN WITH MAGIC LINK WITH OAUTH PROVIDER
                if (output.oauthProvider) {
                    await magic.oauth.loginWithRedirect({
                        provider: output.oauthProvider,
                        redirectURI: this.oauthCallbackUrl || window.location.href,
                    });
                }
                // LOGIN WITH MAGIC LINK WITH EMAIL
                if (output.email) {
                    await magic.auth.loginWithMagicLink({
                        email: output.email,
                    });
                }
                // LOGIN WITH MAGIC LINK WITH PHONE NUMBER
                if (output.phoneNumber) {
                    await magic.auth.loginWithSMS({
                        phoneNumber: output.phoneNumber,
                    });
                }
                const signer = await this.getSigner();
                let account = (await signer.getAddress());
                if (!account.startsWith('0x'))
                    account = `0x${account}`;
                return {
                    account,
                    chain: {
                        id: chainId,
                        unsupported: false,
                    },
                    provider,
                };
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
            this.magicSDK = new magic_sdk_1.Magic(this.magicOptions.apiKey, Object.assign(Object.assign({}, this.magicSdkConfiguration), { extensions: [new oauth_1.OAuthExtension()] }));
            return this.magicSDK;
        }
        return this.magicSDK;
    }
}
exports.MagicAuthConnector = MagicAuthConnector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFnaWNBdXRoQ29ubmVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb25uZWN0b3JzL21hZ2ljQXV0aENvbm5lY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0Q0FBaUU7QUFPakUsc0NBS3FCO0FBQ3JCLHlDQUFrQztBQUVsQyxxREFBZ0U7QUFlaEUsTUFBYSxrQkFBbUIsU0FBUSwrQkFBYztJQWdCcEQsWUFBWSxNQUF1RDs7UUFDakUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUM7UUFDbEUsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFBLE1BQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLDBDQUFFLFNBQVMsS0FBSSxFQUFFLENBQUM7UUFDbkUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLDBDQUFFLFdBQVcsQ0FBQztRQUNqRSxJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1FBQ3BELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO0lBQzFELENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU07WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ3BELElBQUk7WUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUUxQyxJQUFJLFFBQVEsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2YsUUFBUSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDdkQsUUFB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