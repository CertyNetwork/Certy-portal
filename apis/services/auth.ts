import { BehaviorSubject, map, of, switchMap, take, withLatestFrom } from 'rxjs';
import { connect, keyStores, WalletConnection, ConnectConfig, utils, providers } from "near-api-js";
import Router from 'next/router'
import Cookies from 'js-cookie';
import { httpClient } from '../httpClient';

// const { publicRuntimeConfig } = getConfig();
const authenticationSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
let nearWallet: WalletConnection;

const nearConfig = {
  networkId: process.env.NETWORK_ID,
  contractName: process.env.CONTRACT_NAME,
  nodeUrl: process.env.NEAR_NODE_URL,
  walletUrl: process.env.WALLET_URL,
  helperUrl: process.env.HELPER_URL,
  explorerUrl: process.env.EXPLORER_URL,
};

const apiConfig = {
  apiUrl: process.env.API_BASE_URL
};

function loginWithNear() {
  if (!nearWallet) {
    throw new Error('Cannot connect to the NEAR right now. Please try again later.');
  }

  if (nearWallet.isSignedIn()) {
    Router.push('/');
    return;
  }
  
  nearWallet.requestSignIn(
    nearConfig.contractName, // contract requesting access
    "Certify Profile", // optional,
    `${window.location.protocol + '//' + window.location.host}`
  );
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  Cookies.remove('ACCESS_TOKEN');
  authenticationSubject.next(false);
  if (nearWallet) {
    nearWallet.signOut();
  }
  Router.push('/start');
}

async function init() {
  const config: ConnectConfig = {
    networkId: nearConfig.networkId || '',
    nodeUrl: nearConfig.nodeUrl || '',
    headers: {},
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    walletUrl: nearConfig.walletUrl,
  };

  const near = await connect(config);
  nearWallet = new WalletConnection(near, '');

  if (!nearWallet.isSignedIn()) {
    return;
  }

  const isAuthenticated = _isAuthenticated();

  if (isAuthenticated) {
    authenticationSubject.next(true);
    return;
  }

  const accountId = nearWallet.getAccountId();
  const nonceResponse = await httpClient.get(`${apiConfig.apiUrl}/auth/get-nonce/${accountId}`);
  if (!nonceResponse) {
    return;
  }
  const keyPair = await nearWallet._keyStore.getKey(nearConfig.networkId || '', accountId);
  const message = Buffer.from(nonceResponse.data.data.nonce);
  const signed = keyPair.sign(message);
  const signature = Buffer.from(signed.signature).toString('base64');
  const authResponse = await httpClient.post(`${apiConfig.apiUrl}/auth`, {
    accountId: accountId,
    signature,
    publicKey: keyPair.getPublicKey().toString()
  });
  
  if (authResponse.data.data.accessToken) {
    Cookies.set('ACCESS_TOKEN', authResponse.data.data.accessToken);
    Cookies.set('REFRESH_TOKEN', authResponse.data.data.refreshToken);
  }
}

function isConnected() {
  if (!nearWallet || !nearWallet.isSignedIn()) {
    return false;
  }

  return true;
}

function getAccountId() {
  if (!nearWallet || !nearWallet.isSignedIn()) {
    return '';
  }

  return nearWallet.getAccountId();
}

function _isAuthenticated(): boolean {
  try {
    const accessToken = Cookies.get('ACCESS_TOKEN');
    const tknInfo = JSON.parse(atob(accessToken.split('.')[1]));

    if (!tknInfo || !tknInfo.accountId) {
      return false;
    }
    if (tknInfo.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export const authenticationService = {
  authenticated: authenticationSubject.asObservable(),
  loginWithNear,
  logout,
  init,
  isConnected,
  isAuthenticated: _isAuthenticated,
  getAccountId,
};