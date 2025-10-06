import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GreenToken, GreenEnergyCertificate, Generator, EnergyData, AllocationLog, BlockchainTransaction } from '../types';
import {
  generateMockTokens,
  generateMockCertificates,
  mockGenerators,
  generateMockEnergyData,
  generateMockAllocationLogs,
  generateMockBlockchain
} from '../utils/mockData';

interface DataContextType {
  tokens: GreenToken[];
  certificates: GreenEnergyCertificate[];
  generators: Generator[];
  energyData: EnergyData[];
  allocationLogs: AllocationLog[];
  blockchain: BlockchainTransaction[];
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<GreenToken[]>([]);
  const [certificates, setCertificates] = useState<GreenEnergyCertificate[]>([]);
  const [generators] = useState<Generator[]>(mockGenerators);
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [allocationLogs, setAllocationLogs] = useState<AllocationLog[]>([]);
  const [blockchain, setBlockchain] = useState<BlockchainTransaction[]>([]);

  const refreshData = () => {
    const newTokens = generateMockTokens(100);
    const newCertificates = generateMockCertificates(newTokens);
    const newEnergyData = generateMockEnergyData(7);
    const newAllocationLogs = generateMockAllocationLogs(newTokens);
    const newBlockchain = generateMockBlockchain(newTokens, newCertificates);

    setTokens(newTokens);
    setCertificates(newCertificates);
    setEnergyData(newEnergyData);
    setAllocationLogs(newAllocationLogs);
    setBlockchain(newBlockchain);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{
      tokens,
      certificates,
      generators,
      energyData,
      allocationLogs,
      blockchain,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
