import { ConnectExtension } from '@magic-ext/connect';
import { OAuthExtension, OAuthProvider } from '@magic-ext/oauth';
import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';
import { RPCProviderModule } from '@magic-sdk/provider/dist/types/modules/rpc-provider';
import { Address, Chain, Connector } from '@wagmi/core';
import { Signer } from 'ethers';
import { AbstractProvider } from 'web3-core';
export interface MagicOptions {
    apiKey: string;
    accentColor?: string;
    isDarkMode?: boolean;
    customLogo?: string;
    customHeaderText?: string;
}
interface UserDetails {
    email: string;
    phoneNumber: string;
    oauthProvider: OAuthProvider;
}
export declare abstract class MagicConnector extends Connector {
    ready: boolean;
    readonly id = "magic";
    readonly name = "Magic";
    provider: RPCProviderModule & AbstractProvider;
    isModalOpen: boolean;
    magicOptions: MagicOptions;
    protected constructor(config: {
        chains?: Chain[];
        options: MagicOptions;
    });
    getAccount(): Promise<Address>;
    getUserDetailsByForm(enableSMSLogin: boolean, enableEmailLogin: boolean, oauthProviders: OAuthProvider[]): Promise<UserDetails>;
    getProvider(): Promise<RPCProviderModule & AbstractProvider>;
    getSigner(): Promise<Signer>;
    isAuthorized(): Promise<boolean>;
    protected onAccountsChanged(accounts: string[]): void;
    protected onChainChanged(chainId: string | number): void;
    protected onDisconnect(): void;
    disconnect(): Promise<void>;
    abstract getMagicSDK(): InstanceWithExtensions<SDKBase, OAuthExtension[]> | InstanceWithExtensions<SDKBase, ConnectExtension[]>;
}
export {};
