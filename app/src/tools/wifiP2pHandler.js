/*
Author: Ted Jenks

Class to act as a handler for the exchange of data using wifi p2p.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// Third party packages
import {
  startDiscoveringPeers,
  unsubscribeFromPeersUpdates,
  subscribeOnPeersUpdates,
  connect,
  cancelConnect,
  sendMessage,
  getConnectionInfo,
} from 'react-native-wifi-p2p';

// Global constants
const WIFI_TYPE_PHONE = '10-0050F204-5';

//------------------------------------------------------------------------------

/* BODY */

class WifiP2pHandler {
  constructor() {
    try {
      subscribeOnPeersUpdates(this.handleNewPeers);
      startDiscoveringPeers().catch(e =>
        console.warn('Failed to start discovering Peers: ', e),
      );
    } catch (e) {
      console.error('Error: ', e);
    }
  }

  remove() {
    unsubscribeFromPeersUpdates(this.handleNewPeers);
  }

  handleNewPeers = ({devices}) => {
    console.log('OnPeersUpdated', devices);
    this.devices = devices;
  };

  sendData = async data => {
    const connectionInfo = await getConnectionInfo();
    try {
      if (connectionInfo.groupFormed) {
        console.log('Already connected to: ', connectionInfo);
        // If connected
        const status = await this.sendAndDisconnect(data);
        return status;
      } else {
        for (const device of this.devices) {
          if (device.primaryDeviceType === WIFI_TYPE_PHONE) {
            console.log('Connecting to: ', device);
            await connect(device.deviceAddress).catch(e =>
              console.log('Error in connect: ', e),
            );
            await getConnectionInfo().catch(e =>
              console.log('Error getting connection info: ', e),
            );
            const status = await this.sendAndDisconnect(data);
            return status;
          }
        }
      }
    } catch (e) {
      console.log('Error in send message: ', e);
      return false;
    }
    console.log('No valid receiving devices detected:\n', this.devices);
    return false;
  };

  async sendAndDisconnect(data) {
    console.log('Before host excetion: ', JSON.stringify(data));
    await sendMessage(JSON.stringify(data)); //FIXME: throwing error
    await cancelConnect().catch(e =>
      console.log('Error in cancelConnect: ', e),
    );
    return true;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

module.exports = {WifiP2pHandler};
