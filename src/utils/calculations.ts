import { GreenToken, GreenEnergyCertificate, SustainabilityMetrics } from '../types';

export const calculateSustainabilityMetrics = (
  certificates: GreenEnergyCertificate[],
  totalConsumption: number
): SustainabilityMetrics => {
  const totalGreenEnergy = certificates.reduce((sum, cert) => sum + cert.units, 0);
  const co2Saved = certificates.reduce((sum, cert) => sum + cert.co2Offset, 0);
  const treesEquivalent = Math.floor(co2Saved / 21);
  const greenPercentage = totalConsumption > 0 ? (totalGreenEnergy / totalConsumption) * 100 : 0;

  return {
    totalGreenEnergy,
    co2Saved,
    treesEquivalent,
    greenPercentage,
    certificatesEarned: certificates.length,
  };
};

export const calculateEnergyMix = (tokens: GreenToken[]) => {
  const sourceCount: Record<string, number> = {};

  tokens.forEach(token => {
    sourceCount[token.source] = (sourceCount[token.source] || 0) + token.units;
  });

  const total = Object.values(sourceCount).reduce((sum, val) => sum + val, 0);

  return Object.entries(sourceCount).map(([source, units]) => ({
    source,
    units,
    percentage: total > 0 ? (units / total) * 100 : 0,
  }));
};

export const formatEnergy = (units: number): string => {
  if (units >= 1000) {
    return `${(units / 1000).toFixed(2)} MWh`;
  }
  return `${units.toFixed(2)} kWh`;
};

export const formatCO2 = (kg: number): string => {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} tonnes`;
  }
  return `${kg.toFixed(2)} kg`;
};

export const getSourceColor = (source: string): string => {
  const colors: Record<string, string> = {
    solar: '#F59E0B',
    wind: '#3B82F6',
    hydro: '#06B6D4',
    biomass: '#10B981',
    geothermal: '#EF4444',
  };
  return colors[source] || '#6B7280';
};

export const getSourceIcon = (source: string): string => {
  const icons: Record<string, string> = {
    solar: '☀️',
    wind: '💨',
    hydro: '💧',
    biomass: '🌱',
    geothermal: '🔥',
  };
  return icons[source] || '⚡';
};
