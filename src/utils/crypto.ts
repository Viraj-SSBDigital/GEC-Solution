export const generateHash = (data: any): string => {
  const str = JSON.stringify(data);
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const hexHash = Math.abs(hash).toString(16).padStart(16, '0');
  const randomSuffix = Math.random().toString(16).substring(2, 18);
  const fullHash = hexHash + randomSuffix + hexHash.split('').reverse().join('');

  return fullHash.substring(0, 64).padEnd(64, '0');
};

export const verifyHash = (hash: string): boolean => {
  return hash.length === 64 && /^[0-9a-f]+$/.test(hash);
};

export const shortenHash = (hash: string, length: number = 8): string => {
  return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`;
};
