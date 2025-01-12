import { OAuthExtension, OAuthProvider } from '@magic-ext/oauth';
import { InstanceWithExtensions, MagicSDKAdditionalConfiguration, MagicSDKExtensionsOption, SDKBase } from '@magic-sdk/provider';
import { Chain } from '@wagmi/core';
import { MagicConnector, MagicOptions } from './magicConnector';
interface MagicAuthOptions extends MagicOptions {
    enableEmailLogin?: boolean;
    enableSMSLogin?: boolean;
    oauthOptions?: {
        providers: OAuthProvider[];
        callbackUrl?: string;
    };
    magicSdkConfiguration?: MagicSDKAdditionalConfiguration<string, OAuthExtension[]>;
}
export declare class MagicAuthConnector extends MagicConnector {
    magicSDK?: InstanceWithExtensions<SDKBase, OAuthExtension[]>;
    magicSdkConfiguration: MagicSDKAdditionalConfiguration<string, MagicSDKExtensionsOption<OAuthExtension['name']>>;
    enableSMSLogin: boolean;
    enableEmailLogin: boolean;
    oauthProviders: OAuthProvider[];
    oauthCallbackUrl?: string;
    constructor(config: {
        chains?: Chain[];
        options: MagicAuthOptions;
    });
    connect(): Promise<{
        provider: import("@magic-sdk/provider/dist/types/modules/rpc-provider").RPCProviderModule & import("web3-core").AbstractProvider;
        chain: {
            id: number;
            unsupported: boolean;
        };
        account: `0x${string}`;
    }>;
    getChainId(): Promise<number>;
    getMagicSDK(): InstanceWithExtensions<SDKBase, OAuthExtension[]>;
}
export {};
