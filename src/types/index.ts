export type EnergySource = 'solar' | 'wind' | 'hydro' | 'biomass' | 'geothermal';
export type UserRole = 'consumer' | 'generator' | 'admin';
export type TokenStatus = 'generated' | 'allocated' | 'consumed';
export type AllocationMethod = 'FIFO' | 'pro-rata';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Generator {
  id: string;
  name: string;
  type: EnergySource;
  capacity: number;
  location: string;
  latitude: number;
  longitude: number;
  contractedCapacity: number;
  commissionDate: string;
  status: 'active' | 'inactive';
}

export interface GreenToken {
  id: string;
  generatorId: string;
  generatorName: string;
  source: EnergySource;
  units: number;
  timestamp: string;
  location: string;
  status: TokenStatus;
  consumerId?: string;
  consumerName?: string;
  hash: string;
  expiry: string;
  consumed: any;
  consumedDate: any;
}

export interface GreenEnergyCertificate {
  id: string;
  certificateNumber: string;
  generatorId: string;
  generatorName: string;
  consumerId: string;
  consumerName: string;
  energySource: EnergySource;
  units: number;
  generationTimestamp: string;
  issuanceTimestamp: string;
  location: string;
  hash: string;
  expiry: string;
  verified: boolean;
  co2Offset: number;
}

export interface EnergyData {
  timestamp: string;
  generation: number;
  consumption: number;
  greenGeneration: number;
  source?: EnergySource;
  generatorId?: string;
}

export interface AllocationLog {
  id: string;
  timestamp: string;
  tokenId: string;
  consumerId: string;
  consumerName: string;
  units: number;
  method: AllocationMethod;
  hash: string;
}

export interface BlockchainTransaction {
  id: string;
  timestamp: string;
  type: 'token_generation' | 'token_allocation' | 'gec_issuance';
  hash: string;
  previousHash: string;
  data: any;
}

export interface ConsumerPreference {
  consumerId: string;
  greenPercentage: number;
  preferredSources: EnergySource[];
}

export interface SustainabilityMetrics {
  totalGreenEnergy: number;
  co2Saved: number;
  treesEquivalent: number;
  greenPercentage: number;
  certificatesEarned: number;
}
