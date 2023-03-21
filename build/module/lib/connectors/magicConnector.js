import { Connector, normalizeChainId } from '@wagmi/core';
import { ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { createModal } from '../modal/view';
const IS_SERVER = typeof window === 'undefined';
export class MagicConnector extends Connector {
    ready = !IS_SERVER;
    id = 'magic';
    name = 'Magic';
    provider;
    isModalOpen = false;
    magicOptions;
    constructor(config) {
        super(config);
        this.magicOptions = config.options;
    }
    async getAccount() {
        const provider = new ethers.providers.Web3Provider(await this.getProvider());
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        if (account.startsWith('0x'))
            return account;
        return `0x${account}`;
    }
    async getUserDetailsByForm(enableSMSLogin, enableEmailLogin, oauthProviders) {
        const output = (await createModal({
            accentColor: this.magicOptions.accentColor,
            isDarkMode: this.magicOptions.isDarkMode,
            customLogo: this.magicOptions.customLogo,
            customHeaderText: this.magicOptions.customHeaderText,
            enableSMSLogin: enableSMSLogin,
            enableEmailLogin: enableEmailLogin || true,
            oauthProviders,
        }));
        this.isModalOpen = false;
        return output;
    }
    async getProvider() {
        if (this.provider) {
            return this.provider;
        }
        const magic = this.getMagicSDK();
        this.provider = magic.rpcProvider;
        return this.provider;
    }
    async getSigner() {
        const provider = new ethers.providers.Web3Provider(await this.getProvider());
        const signer = await provider.getSigner();
        return signer;
    }
    async isAuthorized() {
        const magic = this.getMagicSDK();
        try {
            return await magic.user.isLoggedIn();
        }
        catch (e) {
            return false;
        }
    }
    onAccountsChanged(accounts) {
        if (accounts.length === 0)
            this.emit('disconnect');
        else
            this.emit('change', { account: getAddress(accounts[0]) });
    }
    onChainChanged(chainId) {
        const id = normalizeChainId(chainId);
        const unsupported = this.isChainUnsupported(id);
        this.emit('change', { chain: { id, unsupported } });
    }
    onDisconnect() {
        this.emit('disconnect');
    }
    async disconnect() {
        const magic = this.getMagicSDK();
        await magic.user.logout();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFnaWNDb25uZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2Nvbm5lY3RvcnMvbWFnaWNDb25uZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsT0FBTyxFQUFrQixTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUUsT0FBTyxFQUFFLE1BQU0sRUFBVSxNQUFNLFFBQVEsQ0FBQztBQUN4QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFHOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1QyxNQUFNLFNBQVMsR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUM7QUFnQmhELE1BQU0sT0FBZ0IsY0FBZSxTQUFRLFNBQVM7SUFDcEQsS0FBSyxHQUFHLENBQUMsU0FBUyxDQUFDO0lBRVYsRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUViLElBQUksR0FBRyxPQUFPLENBQUM7SUFFeEIsUUFBUSxDQUF1QztJQUUvQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBRXBCLFlBQVksQ0FBZTtJQUUzQixZQUFzQixNQUFtRDtRQUN2RSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDckMsQ0FBQztJQUVELEtBQUssQ0FBQyxVQUFVO1FBQ2QsTUFBTSxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FDaEQsTUFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQ3pCLENBQUM7UUFDRixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDcEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUFFLE9B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