import { OAuthExtension } from '@magic-ext/oauth';
import { normalizeChainId, UserRejectedRequestError, } from '@wagmi/core';
import { Magic } from 'magic-sdk';
import { MagicConnector } from './magicConnector';
export class MagicAuthConnector extends MagicConnector {
    magicSDK;
    magicSdkConfiguration;
    enableSMSLogin;
    enableEmailLogin;
    oauthProviders;
    oauthCallbackUrl;
    constructor(config) {
        super(config);
        this.magicSdkConfiguration = config.options.magicSdkConfiguration;
        this.oauthProviders = config.options.oauthOptions?.providers || [];
        this.oauthCallbackUrl = config.options.oauthOptions?.callbackUrl;
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
            throw new UserRejectedRequestError('User rejected request');
        }
        catch (error) {
            throw new UserRejectedRequestError('Something went wrong');
        }
    }
    async getChainId() {
        const networkOptions = this.magicSdkConfiguration?.network;
        if (typeof networkOptions === 'object') {
            const chainID = networkOptions.chainId;
            if (chainID) {
                return normalizeChainId(chainID);
            }
        }
        throw new Error('Chain ID is not defined');
    }
    getMagicSDK() {
        if (!this.magicSDK) {
            this.magicSDK = new Magic(this.magicOptions.apiKey, {
                ...this.magicSdkConfiguration,
                extensions: [new OAuthExtension()],
            });
            return this.magicSDK;
        }
        return this.magicSDK;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFnaWNBdXRoQ29ubmVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb25uZWN0b3JzL21hZ2ljQXV0aENvbm5lY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFpQixNQUFNLGtCQUFrQixDQUFDO0FBT2pFLE9BQU8sRUFHTCxnQkFBZ0IsRUFDaEIsd0JBQXdCLEdBQ3pCLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFbEMsT0FBTyxFQUFFLGNBQWMsRUFBZ0IsTUFBTSxrQkFBa0IsQ0FBQztBQWVoRSxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsY0FBYztJQUNwRCxRQUFRLENBQXFEO0lBRTdELHFCQUFxQixDQUduQjtJQUVGLGNBQWMsQ0FBVTtJQUV4QixnQkFBZ0IsQ0FBVTtJQUUxQixjQUFjLENBQWtCO0lBRWhDLGdCQUFnQixDQUFVO0lBRTFCLFlBQVksTUFBdUQ7UUFDakUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUM7UUFDbEUsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxTQUFTLElBQUksRUFBRSxDQUFDO1FBQ25FLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUM7UUFDakUsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUNwRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztJQUMxRCxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU87UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVks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