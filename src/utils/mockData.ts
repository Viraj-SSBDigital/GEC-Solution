import { Generator, GreenToken, GreenEnergyCertificate, EnergyData, AllocationLog, BlockchainTransaction, User } from '../types';
import { generateHash } from './crypto';

export const mockUsers: User[] = [
  { id: 'U001', name: 'Consumer User', email: 'consumer@example.com', role: 'consumer' },
  { id: 'U004', name: 'WindPower Ltd', email: 'generator@example.com', role: 'generator' },
  { id: 'U005', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
];

export const mockGenerators: Generator[] = [
  {
    id: 'GEN001',
    name: 'SolarTech Array Alpha',
    type: 'solar',
    capacity: 5000,
    location: 'Rajasthan, India',
    latitude: 27.0238,
    longitude: 74.2179,
    contractedCapacity: 4500,
    commissionDate: '2022-06-15',
    status: 'active',
  },
  {
    id: 'GEN002',
    name: 'WindPower Coastal Farm',
    type: 'wind',
    capacity: 10000,
    location: 'Gujarat, India',
    latitude: 22.2587,
    longitude: 71.1924,
    contractedCapacity: 9500,
    commissionDate: '2021-03-20',
    status: 'active',
  },
  {
    id: 'GEN003',
    name: 'Hydro Valley Plant',
    type: 'hydro',
    capacity: 7500,
    location: 'Uttarakhand, India',
    latitude: 30.0668,
    longitude: 79.0193,
    contractedCapacity: 7000,
    commissionDate: '2020-11-10',
    status: 'active',
  },
  {
    id: 'GEN004',
    name: 'BioEnergy Solutions',
    type: 'biomass',
    capacity: 3000,
    location: 'Punjab, India',
    latitude: 31.1471,
    longitude: 75.3412,
    contractedCapacity: 2800,
    commissionDate: '2023-01-05',
    status: 'active',
  },
  {
    id: 'GEN005',
    name: 'SolarTech Array Beta',
    type: 'solar',
    capacity: 4000,
    location: 'Karnataka, India',
    latitude: 15.3173,
    longitude: 75.7139,
    contractedCapacity: 3800,
    commissionDate: '2023-08-12',
    status: 'active',
  },
];

export const generateMockTokens = (count: number = 50): GreenToken[] => {
  const tokens: GreenToken[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const generator = mockGenerators[Math.floor(Math.random() * mockGenerators.length)];
    const timestamp = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
    const units = Math.floor(Math.random() * 500) + 100;
    const status = Math.random() > 0.3 ? 'allocated' : 'generated';

    const token: GreenToken = {
      id: `TOK${String(i + 1).padStart(6, '0')}`,
      generatorId: generator.id,
      generatorName: generator.name,
      source: generator.type,
      units,
      timestamp,
      location: generator.location,
      status,
      consumerId: status === 'allocated' ? mockUsers.find(u => u.role === 'consumer')?.id : undefined,
      hash: generateHash({ generatorId: generator.id, timestamp, units }),
    };

    tokens.push(token);
  }

  return tokens.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const generateMockCertificates = (tokens: GreenToken[]): GreenEnergyCertificate[] => {
  const certificates: GreenEnergyCertificate[] = [];
  const allocatedTokens = tokens.filter(t => t.status === 'allocated' && t.consumerId);

  allocatedTokens.forEach((token, index) => {
    const consumer = mockUsers.find(u => u.id === token.consumerId);
    if (!consumer) return;

    const certificate: GreenEnergyCertificate = {
      id: `CERT${String(index + 1).padStart(6, '0')}`,
      certificateNumber: `GEC-2024-${String(index + 1).padStart(8, '0')}`,
      generatorId: token.generatorId,
      generatorName: token.generatorName,
      consumerId: token.consumerId!,
      consumerName: consumer.name,
      energySource: token.source,
      units: token.units,
      generationTimestamp: token.timestamp,
      issuanceTimestamp: new Date(new Date(token.timestamp).getTime() + 60000).toISOString(),
      location: token.location,
      hash: generateHash({ tokenId: token.id, consumerId: token.consumerId }),
      verified: true,
      co2Offset: token.units * 0.82,
    };

    certificates.push(certificate);
  });

  return certificates.sort((a, b) => new Date(b.issuanceTimestamp).getTime() - new Date(a.issuanceTimestamp).getTime());
};

export const generateMockEnergyData = (days: number = 7): EnergyData[] => {
  const data: EnergyData[] = [];
  const now = Date.now();
  const interval = 60 * 60 * 1000;

  for (let i = days * 24; i >= 0; i--) {
    const timestamp = new Date(now - i * interval).toISOString();

    data.push({
      timestamp,
      generation: Math.floor(Math.random() * 20000) + 5000,
      consumption: Math.floor(Math.random() * 18000) + 6000,
      greenGeneration: Math.floor(Math.random() * 15000) + 3000,
    });
  }

  return data;
};

export const generateMockAllocationLogs = (tokens: GreenToken[]): AllocationLog[] => {
  const logs: AllocationLog[] = [];
  const allocatedTokens = tokens.filter(t => t.status === 'allocated' && t.consumerId);

  allocatedTokens.forEach((token, index) => {
    const consumer = mockUsers.find(u => u.id === token.consumerId);
    if (!consumer) return;

    logs.push({
      id: `LOG${String(index + 1).padStart(6, '0')}`,
      timestamp: token.timestamp,
      tokenId: token.id,
      consumerId: token.consumerId!,
      consumerName: consumer.name,
      units: token.units,
      method: Math.random() > 0.5 ? 'FIFO' : 'pro-rata',
      hash: generateHash({ tokenId: token.id, consumerId: token.consumerId, timestamp: token.timestamp }),
    });
  });

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const generateMockBlockchain = (tokens: GreenToken[], certificates: GreenEnergyCertificate[]): BlockchainTransaction[] => {
  const transactions: BlockchainTransaction[] = [];
  let previousHash = '0000000000000000000000000000000000000000000000000000000000000000';

  tokens.forEach((token, index) => {
    const hash = generateHash({ previousHash, type: 'token_generation', data: token });
    transactions.push({
      id: `BLK${String(index + 1).padStart(6, '0')}`,
      timestamp: token.timestamp,
      type: 'token_generation',
      hash,
      previousHash,
      data: token,
    });
    previousHash = hash;

    if (token.status === 'allocated') {
      const allocationHash = generateHash({ previousHash, type: 'token_allocation', data: token });
      transactions.push({
        id: `BLK${String(transactions.length + 1).padStart(6, '0')}`,
        timestamp: new Date(new Date(token.timestamp).getTime() + 30000).toISOString(),
        type: 'token_allocation',
        hash: allocationHash,
        previousHash,
        data: { tokenId: token.id, consumerId: token.consumerId },
      });
      previousHash = allocationHash;
    }
  });

  certificates.forEach((cert) => {
    const hash = generateHash({ previousHash, type: 'gec_issuance', data: cert });
    transactions.push({
      id: `BLK${String(transactions.length + 1).padStart(6, '0')}`,
      timestamp: cert.issuanceTimestamp,
      type: 'gec_issuance',
      hash,
      previousHash,
      data: cert,
    });
    previousHash = hash;
  });

  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
