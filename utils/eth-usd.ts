// 1 ETH = 2500 USD
const ETH_USD_PRICE = 2500;
const WEI_PER_ETH = 1e18;

// USD 转 ETH（单位：ETH）
export function usdToEth(usd: number): number {
  return usd / ETH_USD_PRICE;
}

// USD 转 WEI
export function usdToWei(usd: number): bigint {
  return BigInt(Math.floor((usd / ETH_USD_PRICE) * WEI_PER_ETH));
}

// ETH 转 USD
export function ethToUsd(eth: number): number {
  return eth * ETH_USD_PRICE;
}

// WEI 转 USD
export function weiToUsd(wei: bigint | string | number): number {
  return (Number(wei) / WEI_PER_ETH) * ETH_USD_PRICE;
}

// 示例
console.log('10 USD =', usdToEth(10), 'ETH');
console.log('10 USD =', usdToWei(10).toString(), 'wei');
console.log('0.5 ETH =', ethToUsd(0.5), 'USD');
console.log('1000000000000000000 wei =', weiToUsd('1000000000000000000'), 'USD');
