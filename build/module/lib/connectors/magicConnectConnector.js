import { ConnectExtension } from '@magic-ext/connect';
import { normalizeChainId, UserRejectedRequestError, } from '@wagmi/core';
import { Magic } from 'magic-sdk';
import { MagicConnector } from './magicConnector';
const CONNECT_TIME_KEY = 'wagmi-magic-connector.connect.time';
const CONNECT_DURATION = 604800000; // 7 days in milliseconds
export class MagicConnectConnector extends MagicConnector {
    magicSDK;
    magicSdkConfiguration;
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
                extensions: [new ConnectExtension()],
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFnaWNDb25uZWN0Q29ubmVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb25uZWN0b3JzL21hZ2ljQ29ubmVjdENvbm5lY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQU10RCxPQUFPLEVBR0wsZ0JBQWdCLEVBQ2hCLHdCQUF3QixHQUN6QixNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRWxDLE9BQU8sRUFBRSxjQUFjLEVBQWdCLE1BQU0sa0JBQWtCLENBQUM7QUFNaEUsTUFBTSxnQkFBZ0IsR0FBRyxvQ0FBb0MsQ0FBQztBQUM5RCxNQUFNLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxDQUFDLHlCQUF5QjtBQUU3RCxNQUFNLE9BQU8scUJBQXNCLFNBQVEsY0FBYztJQUN2RCxRQUFRLENBQXVEO0lBRS9ELHFCQUFxQixDQUErQztJQUVwRSxZQUFZLE1BQTBEO1FBQ3BFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDO0lBQ3BFLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU07WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ3BELElBQUk7WUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUUxQyxJQUFJLFFBQVEsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2YsUUFBUSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDdkQsUUFBUSxDQUFDLEVBQUUsQ0FBQyxjQUFj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