const {FundRawTransaction} = require('../cfdjs_raw_module');
const TestHelper = require('./TestHelper');
const TestUtxoCreater = require('./TestUtxoCreater');

const COIN_BASE = 100000000;
const FIXED_DESCRIPTOR = 'sh(wpkh([ef735203/0\'/0\'/5\']03948c01f159b4204b682668d6e850440564b6610c0e5bf30da684b2131f77c449))#2u75feqc';
const SEGWIT_DESCRIPTOR = 'wpkh([ef735203/0\'/0\'/5\']03948c01f159b4204b682668d6e850440564b6610c0e5bf30da684b2131f77c449)';
const FEE_ASSET = 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdabcdefabcdef';
const DEFAULT_ASSET = '1234567890123456789012345678901234567890123456789012345678901234';
// OP_1 <pubkey1> <pubkey2> OP_2 OP_CHECKMULTISIG
const FIXED_REDEEM_SCRIPT = '512102e5740e63bad28081ed7cf654dd6c19029ca03382fc05ab5f5dda81f2c55b845b2102ec6d499aefd540e90357f1004a136049d1f7df5ad99c44c46e3ed4169e40acb652ae';
const SCRIPT_DESCRIPTOR = 'wsh(raw(512102e5740e63bad28081ed7cf654dd6c19029ca03382fc05ab5f5dda81f2c55b845b2102ec6d499aefd540e90357f1004a136049d1f7df5ad99c44c46e3ed4169e40acb652ae))';

const createFeeInfo = (feeRate, minChange = -1) => {
  return {
    feeRate,
    longTermFeeRate: feeRate,
    knapsackMinChange: minChange,
    dustFeeRate: feeRate,
  };
};

const testCase = [
  // (() => {
  //   const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
  //   return TestHelper.createBitcoinTestCase(
  //     'FundRawTransaction tx: 0 input, 0 output, feeRate: 1',
  //     FundRawTransaction,
  //     [JSON.stringify({
  //       utxos,
  //       selectUtxos: [{}],
  //       tx: '',
  //       isElements: false,
  //       network: 'mainnet',
  //       targetAmount: 0,
  //       reserveAddress: '',
  //       feeInfo: {
  //         feeRate: 0.0,
  //         longTermFeeRate: 0.0,
  //         knapsackMinChange: -1,
  //         dustFeeRate: 0.0,
  //       },
  //     })],
  //     '{"hex":"","usedAddresses":[],"feeAmount":0}',
  //   );
  // })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 0 input(0 btc) 0 output(0 btc), targetAmount: 0, feeRate: 0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        tx: '02000000000000000000',
        isElements: false,
        network: 'mainnet',
        targetAmount: 0,
        reserveAddress: '13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY',
        feeInfo: createFeeInfo(0.0),
      })],
      '{"hex":"02000000000000000000","usedAddresses":[],"feeAmount":0}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 0 input(0 btc) 0 output(0 btc), targetAmount: 11000000, feeRate: 0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        tx: '02000000000000000000',
        isElements: false,
        network: 'mainnet',
        targetAmount: (Math.floor(0.11 * COIN_BASE)),
        reserveAddress: '13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY',
        feeInfo: createFeeInfo(0.0),
      })],
      '{"hex":"020000000100000020000000000000000000000000000000000000000000000000000000000000000000ffffffff01002d3101000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY"],"feeAmount":0}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 1 input(0.05 btc) 0 output(0 btc), targetAmount: 12000000, feeRate: 0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000005000000', 0, 0.05, FIXED_DESCRIPTOR),
        ],
        tx: '02000000010000000500000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0000000000',
        isElements: false,
        network: 'mainnet',
        targetAmount: (Math.floor(0.12 * COIN_BASE)),
        reserveAddress: '13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY',
        feeInfo: createFeeInfo(0.0),
      })],
      '{"hex":"02000000020000000500000000000000000000000000000000000000000000000000efcdab0000000000ffffffff00000010000000000000000000000000000000000000000000000000000000000000000000ffffffff01c0e1e400000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY"],"feeAmount":0}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 0 input(0 btc) 1 output(0.05 btc), targetAmount: 13000000, feeRate: 0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        tx: '020000000001404b4c00000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac00000000',
        isElements: false,
        network: 'mainnet',
        targetAmount: (Math.floor(0.13 * COIN_BASE)),
        reserveAddress: '13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY',
        feeInfo: createFeeInfo(0.0),
      })],
      '{"hex":"020000000100000020000000000000000000000000000000000000000000000000000000000000000000ffffffff02404b4c00000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88acc0e1e400000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY"],"feeAmount":0}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 1 input(0.1 btc) 1 output(0.06 btc), targetAmount: 14000000, feeRate: 0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000010000000', 0, 0.1, FIXED_DESCRIPTOR),
        ],
        tx: '02000000010000001000000000000000000000000000000000000000000000000000efcdab0000000000ffffffff01808d5b00000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac00000000',
        isElements: false,
        network: 'mainnet',
        targetAmount: (Math.floor(0.14 * COIN_BASE)),
        reserveAddress: '13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY',
        feeInfo: createFeeInfo(0.0),
      })],
      '{"hex":"02000000020000001000000000000000000000000000000000000000000000000000efcdab0000000000ffffffff00000010000000000000000000000000000000000000000000000000000000000000000000ffffffff02808d5b00000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac809fd500000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY"],"feeAmount":0}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 1 input(0.11 btc) 1 output(0.07 btc), targetAmount: 0, feeRate: 0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000011000000', 0, 0.11, FIXED_DESCRIPTOR),
        ],
        tx: '02000000010000001100000000000000000000000000000000000000000000000000efcdab0000000000ffffffff01c0cf6a00000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac00000000',
        isElements: false,
        network: 'mainnet',
        targetAmount: 0,
        reserveAddress: '13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY',
        feeInfo: createFeeInfo(0.0),
      })],
      '{"hex":"02000000010000001100000000000000000000000000000000000000000000000000efcdab0000000000ffffffff02c0cf6a00000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac00093d00000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY"],"feeAmount":0}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 1 input(0.01 btc) 1 output(0.15 btc), targetAmount: 0, feeRate: 0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000001000000', 0, 0.01, FIXED_DESCRIPTOR),
        ],
        tx: '02000000010000000100000000000000000000000000000000000000000000000000efcdab0000000000ffffffff01c0e1e400000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac00000000',
        isElements: false,
        network: 'mainnet',
        targetAmount: 0,
        reserveAddress: '13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY',
        feeInfo: createFeeInfo(0.0),
      })],
      '{"hex":"02000000020000000100000000000000000000000000000000000000000000000000efcdab0000000000ffffffff00000020000000000000000000000000000000000000000000000000000000000000000000ffffffff02c0e1e400000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac808d5b00000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["13ydRRyK22QdDSVUVQixtLqbTQLQmbxrfY"],"feeAmount":0}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 0 input 0 output, targetAmount: 0, feeRate: 1.0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        tx: '02000000000000000000',
        isElements: false,
        network: 'testnet',
        targetAmount: 0,
        reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
        feeInfo: createFeeInfo(1.0),
      })],
      '{"hex":"020000000100000010000000000000000000000000000000000000000000000000000000000000000000ffffffff01fa959800000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k"],"feeAmount":134}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 0 input(0 btc) 0 output(0 btc), targetAmount: 11000000, feeRate: 2.0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        tx: '02000000000000000000',
        isElements: false,
        network: 'testnet',
        targetAmount: (Math.floor(0.11 * COIN_BASE)),
        reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
        feeInfo: createFeeInfo(2.0),
      })],
      '{"hex":"020000000100000020000000000000000000000000000000000000000000000000000000000000000000ffffffff01f42b3101000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k"],"feeAmount":268}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 1 input(0.05 btc) 0 output(0 btc), targetAmount: 12000000, feeRate: 3.0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000005000000', 0, 0.05, FIXED_DESCRIPTOR),
        ],
        tx: '02000000010000000500000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0000000000',
        isElements: false,
        network: 'testnet',
        targetAmount: (Math.floor(0.12 * COIN_BASE)),
        reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
        feeInfo: createFeeInfo(3.0),
      })],
      '{"hex":"02000000020000000500000000000000000000000000000000000000000000000000efcdab0000000000ffffffff00000010000000000000000000000000000000000000000000000000000000000000000000ffffffff0120dfe400000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k"],"feeAmount":672}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 0 input(0 btc) 1 output(0.05 btc), targetAmount: 13000000, feeRate: 4.0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        tx: '020000000001404b4c00000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac00000000',
        isElements: false,
        network: 'testnet',
        targetAmount: (Math.floor(0.13 * COIN_BASE)),
        reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
        feeInfo: createFeeInfo(4.0),
      })],
      '{"hex":"020000000100000020000000000000000000000000000000000000000000000000000000000000000000ffffffff02404b4c00000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac20dfe400000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k"],"feeAmount":672}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 1 input(0.1 btc) 1 output(0.06 btc), targetAmount: 14000000, feeRate: 5.0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000010000000', 0, 0.1, FIXED_DESCRIPTOR),
        ],
        tx: '02000000010000001000000000000000000000000000000000000000000000000000efcdab0000000000ffffffff01808d5b00000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac00000000',
        isElements: false,
        network: 'testnet',
        targetAmount: (Math.floor(0.14 * COIN_BASE)),
        reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
        feeInfo: createFeeInfo(5.0),
      })],
      '{"hex":"02000000020000001000000000000000000000000000000000000000000000000000efcdab0000000000ffffffff00000010000000000000000000000000000000000000000000000000000000000000000000ffffffff02808d5b00000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac769ad500000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k"],"feeAmount":1290}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 1 input(0.11 btc) 1 output(0.07 btc), targetAmount: 0, feeRate: 6.0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000011000000', 0, 0.11, FIXED_DESCRIPTOR),
        ],
        tx: '02000000010000001100000000000000000000000000000000000000000000000000efcdab0000000000ffffffff01c0cf6a00000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac00000000',
        isElements: false,
        network: 'testnet',
        targetAmount: 0,
        reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
        feeInfo: createFeeInfo(6.0),
      })],
      '{"hex":"02000000020000001100000000000000000000000000000000000000000000000000efcdab0000000000ffffffff00000010000000000000000000000000000000000000000000000000000000000000000000ffffffff02c0cf6a00000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac7499d500000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k"],"feeAmount":1548}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 1 input(0.01 btc) 1 output(0.15 btc), targetAmount: 0, feeRate: 7.0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000001000000', 0, 0.01, FIXED_DESCRIPTOR),
        ],
        tx: '02000000010000000100000000000000000000000000000000000000000000000000efcdab0000000000ffffffff01c0e1e400000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac00000000',
        isElements: false,
        network: 'testnet',
        targetAmount: 0,
        reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
        feeInfo: createFeeInfo(7.0),
      })],
      '{"hex":"02000000020000000100000000000000000000000000000000000000000000000000efcdab0000000000ffffffff00000020000000000000000000000000000000000000000000000000000000000000000000ffffffff02c0e1e400000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac72865b00000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k"],"feeAmount":1806}',
    );
  })(),
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 2 input(1.3 btc) 3 output(1.05 btc), targetAmount: 2.0 btc, feeRate: 20.0)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000115000000', 0, 1.15, FIXED_DESCRIPTOR),
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000015000000', 0, 0.15, FIXED_DESCRIPTOR),
        ],
        tx: '02000000020000001501000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0000001500000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0340ff1005000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac809fd500000000001976a9149549bfe03588f5cd110afb32b0b3680e10eb07e288ac808d5b00000000001976a91456571712259ca89634d6edadfe10a2f8ce7a898588ac00000000',
        isElements: false,
        network: 'regtest',
        targetAmount: (Math.floor(2.0 * COIN_BASE)),
        reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
        feeInfo: createFeeInfo(20.0),
      })],
      '{"hex":"02000000050000001501000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0000001500000000000000000000000000000000000000000000000000efcdab0000000000ffffffff00000050000000000000000000000000000000000000000000000000000000000000000000ffffffff00000020000000000000000000000000000000000000000000000000000000000000000000ffffffff00000010000000000000000000000000000000000000000000000000000000000000000000ffffffff0440ff1005000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac809fd500000000001976a9149549bfe03588f5cd110afb32b0b3680e10eb07e288ac808d5b00000000001976a91456571712259ca89634d6edadfe10a2f8ce7a898588acb0fd4106000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k"],"feeAmount":11920}',
    );
  })(),
  // TODO: FIX ME
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction (tx: 2 input(1.3 btc) 3 output(1.05 btc), targetAmount: 2.0 btc, feeRate: 20.0, multi-selected utxo)',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: (() => {
          // create utxos (0.01 ~ 2.00)
          return [...Array(200)].map((_, i) => {
            const btc = 0.01 * (i+1);
            const amount = Math.floor(btc * COIN_BASE);
            const txid = 'abcdef' + ('0000000000000000000000000000000000000000000000000000000000' + amount).slice(-58);
            return TestUtxoCreater.createUtxo(txid, 0, btc, FIXED_DESCRIPTOR);
          });
        })(),
        tx: '02000000020000001501000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0000001500000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0340ff1005000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac809fd500000000001976a9149549bfe03588f5cd110afb32b0b3680e10eb07e288ac808d5b00000000001976a91456571712259ca89634d6edadfe10a2f8ce7a898588ac00000000',
        isElements: false,
        network: 'regtest',
        targetAmount: (Math.floor(2.0 * COIN_BASE)),
        reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
        feeInfo: createFeeInfo(20.0, (Math.floor(2 * COIN_BASE))),
      })],
      '{"hex":"02000000050000001501000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0000001500000000000000000000000000000000000000000000000000efcdab0000000000ffffffff00000040000000000000000000000000000000000000000000000000000000000000000000ffffffff00000030000000000000000000000000000000000000000000000000000000000000000000ffffffff00000010000000000000000000000000000000000000000000000000000000000000000000ffffffff0440ff1005000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac809fd500000000001976a9149549bfe03588f5cd110afb32b0b3680e10eb07e288ac808d5b00000000001976a91456571712259ca89634d6edadfe10a2f8ce7a898588acb0fd4106000000001976a91420a5f2c59d3d62a1108e8ce3c5e01133f383039f88ac00000000","usedAddresses":["miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k"],"feeAmount":11920}',
    );
  })(),
];

const errorCase = [
  // (() => {
  //   const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
  //   return TestHelper.createBitcoinTestCase(
  //     'FundRawTransaction - Error - invalid transaction',
  //     FundRawTransaction,
  //     [JSON.stringify({
  //       utxos,
  //       selectUtxos: [
  //         TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000115000000', 0, 1.15, FIXED_DESCRIPTOR),
  //         TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000015000000', 0, 0.15, FIXED_DESCRIPTOR),
  //       ],
  //       tx: '02000000020000001501000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0000001500000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0340ff1005000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac809fd500000000001976a9149549bfe03588f5cd110afb32b0b3680e10eb07e288ac808d5b00000000001976a91456571712259ca89634d6edadfe10a2f8ce7a898588ac00000000',
  //       isElements: false,
  //       network: 'regtest',
  //       targetAmount: (Math.floor(2.0 * COIN_BASE)),
  //       reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
  //       feeInfo: createFeeInfo(20.0),
  //     })],
  //     '{"error":{"code":1,"type":"illegal_argument","message":"Unmatch fee asset."}}',
  //   );
  // })(),

  // error case based on 'FundRawTransaction (tx: 2 input(1.3 btc) 3 output(1.05 btc), targetAmount: 2.0 btc, feeRate: 20.0)' case
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.001, 0.002], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction - Error - not enough utxos',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000115000000', 0, 1.15, FIXED_DESCRIPTOR),
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000015000000', 0, 0.15, FIXED_DESCRIPTOR),
        ],
        tx: '02000000020000001501000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0000001500000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0340ff1005000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac809fd500000000001976a9149549bfe03588f5cd110afb32b0b3680e10eb07e288ac808d5b00000000001976a91456571712259ca89634d6edadfe10a2f8ce7a898588ac00000000',
        isElements: false,
        network: 'regtest',
        targetAmount: (Math.floor(2.0 * COIN_BASE)),
        reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
        feeInfo: createFeeInfo(20.0),
      })],
      '{"error":{"code":2,"type":"illegal_state","message":"Failed to select coin. Not enough utxos."}}',
    );
  })(),
  // TODO: FIX
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction - Error - unmatch address and network type',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000115000000', 0, 1.15, FIXED_DESCRIPTOR),
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000015000000', 0, 0.15, FIXED_DESCRIPTOR),
        ],
        tx: '02000000020000001501000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0000001500000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0340ff1005000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac809fd500000000001976a9149549bfe03588f5cd110afb32b0b3680e10eb07e288ac808d5b00000000001976a91456571712259ca89634d6edadfe10a2f8ce7a898588ac00000000',
        isElements: false,
        network: 'mainnet',
        targetAmount: (Math.floor(2.0 * COIN_BASE)),
        reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
        feeInfo: createFeeInfo(20.0),
      })],
      '{"error":{"code":2,"type":"illegal_state","message":"Failed to select coin. Not enough utxos."}}',
    );
  })(),
  // TODO: FIX
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction - Error - KnapsacMinchange value is too big',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000115000000', 0, 1.15, FIXED_DESCRIPTOR),
          TestUtxoCreater.createUtxo('abcdef0000000000000000000000000000000000000000000000000015000000', 0, 0.15, FIXED_DESCRIPTOR),
        ],
        tx: '02000000020000001501000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0000001500000000000000000000000000000000000000000000000000efcdab0000000000ffffffff0340ff1005000000001976a9145949cf1d302d32d127ee54b480aaf593797db22a88ac809fd500000000001976a9149549bfe03588f5cd110afb32b0b3680e10eb07e288ac808d5b00000000001976a91456571712259ca89634d6edadfe10a2f8ce7a898588ac00000000',
        isElements: false,
        network: 'regtest',
        targetAmount: (Math.floor(2.0 * COIN_BASE)),
        reserveAddress: 'miVaiV4Hq3qszYy6CyhLiG3vKPw7dCMC9k',
        feeInfo: createFeeInfo(20.0, (Math.floor(200 * COIN_BASE))),
      })],
      '{"error":{"code":,"type":"","message":""}}',
    );
  })(),
];

const elementsTestCase = [
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction - Elements - tx: 0 input, 0 output, feeRate: 0',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [{}],
        tx: '020000000000000000000000',
        isElements: true,
        network: 'liquidv1',
        targets: [{
          asset: '',
          amount: (Math.floor(0.15 * COIN_BASE)),
          reserveAddress: 'QKXGAM4Cvd1fvLEz5tbq4YwNRzTjdMWi2q',
        }],
        feeInfo: {
          feeRate: 0.0,
          longTermFeeRate: 0.0,
          knapsackMinChange: -1,
          dustFeeRate: 0.0,
          feeAsset: '',
          isBlindEstimateFee: true,
        },
      })],
      '{"hex":"","usedAddress":[],"feeAmount":0}',
    );
  })(),
];

const elementsErrorCase = [
  (() => {
    const utxos = TestUtxoCreater.createUtxos([0.1, 0.2, 0.3, 0.4, 0.5], FIXED_DESCRIPTOR);
    return TestHelper.createBitcoinTestCase(
      'FundRawTransaction - Elements - Error - tx: 0 input, 0 output, feeRate: 0',
      FundRawTransaction,
      [JSON.stringify({
        utxos,
        selectUtxos: [{}],
        tx: '020000000000000000000000',
        isElements: true,
        network: 'liquidv1',
        targets: [{
          asset: '',
          amount: (Math.floor(0.15 * COIN_BASE)),
          reserveAddress: 'QKXGAM4Cvd1fvLEz5tbq4YwNRzTjdMWi2q',
        }],
        feeInfo: {
          feeRate: 0.0,
          longTermFeeRate: 0.0,
          knapsackMinChange: -1,
          dustFeeRate: 0.0,
          feeAsset: '',
          isBlindEstimateFee: true,
        },
      })],
      '{"error":{"code":1,"type":"illegal_argument","message":"Unmatch fee asset."}}',
    );
  })(),
];

TestHelper.doTest('FundRawTransaction', testCase);
TestHelper.doTest('FundRawTransaction - Error', errorCase);

// TestHelper.doTest('FundRawTransaction - Elements', elementsTestCase);
// TestHelper.doTest('FundRawTransaction - Elements - Error', elementsErrorCase);
