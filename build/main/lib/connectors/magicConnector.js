"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicConnector = void 0;
const core_1 = require("@wagmi/core");
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const view_1 = require("../modal/view");
const IS_SERVER = typeof window === 'undefined';
class MagicConnector extends core_1.Connector {
    constructor(config) {
        super(config);
        this.ready = !IS_SERVER;
        this.id = 'magic';
        this.name = 'Magic';
        this.isModalOpen = false;
        this.magicOptions = config.options;
    }
    async getAccount() {
        const provider = new ethers_1.ethers.providers.Web3Provider(await this.getProvider());
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        if (account.startsWith('0x'))
            return account;
        return `0x${account}`;
    }
    async getUserDetailsByForm(enableSMSLogin, enableEmailLogin, oauthProviders) {
        const output = (await (0, view_1.createModal)({
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
        const provider = new ethers_1.ethers.providers.Web3Provider(await this.getProvider());
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
            this.emit('change', { account: (0, utils_1.getAddress)(accounts[0]) });
    }
    onChainChanged(chainId) {
        const id = (0, core_1.normalizeChainId)(chainId);
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
exports.MagicConnector = MagicConnector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFnaWNDb25uZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2Nvbm5lY3RvcnMvbWFnaWNDb25uZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsc0NBQTBFO0FBQzFFLG1DQUF3QztBQUN4Qyw0Q0FBOEM7QUFHOUMsd0NBQTRDO0FBRTVDLE1BQU0sU0FBUyxHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQztBQWdCaEQsTUFBc0IsY0FBZSxTQUFRLGdCQUFTO0lBYXBELFlBQXNCLE1BQW1EO1FBQ3ZFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQWJoQixVQUFLLEdBQUcsQ0FBQyxTQUFTLENBQUM7UUFFVixPQUFFLEdBQUcsT0FBTyxDQUFDO1FBRWIsU0FBSSxHQUFHLE9BQU8sQ0FBQztRQUl4QixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQU1sQixJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDckMsQ0FBQztJQUVELEtBQUssQ0FBQyxVQUFVO1FBQ2QsTUFBTSxRQUFRLEdBQUcsSUFBSSxlQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FDaEQsTUFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQ3pCLENBQUM7UUFDRixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDcEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUFFLE9BQU8sT0FBa0IsQ0FBQztRQUN4RCxPQUFPLEtBQUssT0FBTyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELEtBQUssQ0FBQyxvQkFBb0IsQ0FDeEIsY0FBdUIsRUFDdkIsZ0JBQXlCLEVBQ3pCLGNBQStCO1FBRS9CLE1BQU0sTUFBTSxHQUFnQixDQUFDLE1BQU0sSUFBQSxrQkFBVyxF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