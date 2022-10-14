import { ConnectExtension } from '@magic-ext/connect';
import {
  InstanceWithExtensions,
  MagicSDKAdditionalConfiguration,
  SDKBase,
} from '@magic-sdk/provider';
import { Chain, normalizeChainId, UserRejectedRequestError } from '@wagmi/core';
import { Magic } from 'magic-sdk';

import { MagicConnector, MagicOptions } from './magicConnector';

interface MagicConnectOptions extends MagicOptions {
  magicSdkConfiguration?: MagicSDKAdditionalConfiguration<
    string,
    ConnectExtension[]
  >;
}

export class MagicConnectConnector extends MagicConnector {
  magicSDK?: InstanceWithExtensions<SDKBase, ConnectExtension[]>;

  magicSdkConfiguration: MagicSDKAdditionalConfiguration<
    string,
    ConnectExtension[]
  >;

  constructor(config: { chains?: Chain[]; options: MagicConnectOptions }) {
    super(config);
    this.magicSdkConfiguration = config.options.magicSdkConfiguration;
  }

  async connect() {
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
      let chainId: number;
      try {
        chainId = await this.getChainId();
      } catch(e) {
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
          await magic.auth.loginWithEmailOTP({
            email: output.email,
          });
        }

        const signer = await this.getSigner();
        const account = await signer.getAddress();

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
    } catch (error) {
      throw new UserRejectedRequestError('Something went wrong');
    }
  }

  async getChainId(): Promise<number> {
    const networkOptions = this.magicSdkConfiguration?.network;
    if (typeof networkOptions === 'object') {
      const chainID = networkOptions.chainId;
      if (chainID) {
        return normalizeChainId(chainID);
      }
    }
    throw new Error('Chain ID is not defined');
  }

  getMagicSDK(): InstanceWithExtensions<SDKBase, ConnectExtension[]> {
    if (!this.magicSDK) {
      this.magicSDK = new Magic(this.magicOptions.apiKey, {
        ...this.magicSdkConfiguration,
        extensions: [new ConnectExtension()],
      });
      return this.magicSDK;
    }
    return this.magicSDK;
  }
}
