import { ConnectExtension } from '@magic-ext/connect';
import { InstanceWithExtensions, MagicSDKAdditionalConfiguration, SDKBase } from '@magic-sdk/provider';
import { Chain } from '@wagmi/core';
import { MagicConnector, MagicOptions } from './magicConnector';
interface MagicConnectOptions extends MagicOptions {
    magicSdkConfiguration?: MagicSDKAdditionalConfiguration;
}
export declare class MagicConnectConnector extends MagicConnector {
    magicSDK?: InstanceWithExtensions<SDKBase, ConnectExtension[]>;
    magicSdkConfiguration: MagicConnectOptions['magicSdkConfiguration'];
    constructor(config: {
        chains?: Chain[];
        options: MagicConnectOptions;
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
    getMagicSDK(): InstanceWithExtensions<SDKBase, ConnectExtension[]>;
    isAuthorized(): Promise<boolean>;
    disconnect(): Promise<void>;
}
export {};
