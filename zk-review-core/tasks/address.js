const getCounter = (networkId) => {
    return {
      5: '0x1634D3229Beb5691702caF451a8bABfb73e57470'
    }[networkId];
  };

const getPeerReviewGSN = (networkId) => {
  return {
    '5old': '0x78D993D488d7A89Ab85F0881247db0a866dAb7fD',
    5: '0x40141272e950c29054CBEdE950Abf1ced940A9eB'
  }[networkId];
}

const getSoulBoundToken = (networkId) => {
  return {
    '5withGSN': '0x459dE1B62FEBac77Ed5d46B35e2D094cf3Ee92D9',
    5: '0x9356Afd5DD0A393a5C638d3e35614b9D45479Ac9'
  }[networkId];
}
  
  const getPayMaster = (networkId) => {
    return {
      // 5: '0x2b7E48676090A1B0FB636E1005D77c8B6BEF195c',
      5: '0x7e4123407707516bD7a3aFa4E3ebCeacfcbBb107'
    }[networkId];
  };
  
  const getRelayHub = (networkId) => {
    return {
      5: '0x7DDa9Bf2C0602a96c06FA5996F715C7Acfb8E7b0'
    }[networkId];
  };
  
  const getForwarder = (networkId) => {
    return {
      5: '0xB2b5841DBeF766d4b521221732F9B618fCf34A87'
    }[networkId];
  };
  
  module.exports = {
    getCounter,
    getPayMaster,
    getRelayHub,
    getForwarder,
    getPeerReviewGSN,
    getSoulBoundToken,
  }