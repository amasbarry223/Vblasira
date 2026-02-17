// Blasira pricing logic
// Commission is embedded in the final price shown to passengers
// Only drivers see the breakdown

const COMMISSION_RATE = 0.15; // 15% Blasira commission

// Predefined vehicle models
export const vehicleModels = {
  voiture: [
    { value: 'Toyota Avensis', label: 'Toyota Avensis' },
    { value: 'Mercedes-Benz Classe C', label: 'Mercedes-Benz Classe C' },
    { value: 'Toyota Corolla', label: 'Toyota Corolla' },
  ],
  moto: [
    { value: 'Djakarta', label: 'Djakarta' },
    { value: 'Sanili', label: 'Sanili' },
    { value: 'Moto Box', label: 'Moto Box' },
  ],
} as const;

// Base price per km by vehicle type
const BASE_PRICE_PER_KM: Record<string, number> = {
  voiture: 75,
  moto: 50,
};

// Calculate total price (what passenger sees) from base price
export function calculateTotalPrice(basePrice: number): number {
  return Math.ceil(basePrice * (1 + COMMISSION_RATE) / 50) * 50; // rounded to nearest 50
}

// Calculate base price from distance and type
export function calculateBasePrice(distanceKm: number, vehicleType: string): number {
  const rate = BASE_PRICE_PER_KM[vehicleType] || 50;
  return Math.ceil(distanceKm * rate / 50) * 50;
}

// Driver breakdown (only visible to driver)
export function getDriverBreakdown(totalPrice: number) {
  const commission = Math.round(totalPrice * COMMISSION_RATE);
  const driverNet = totalPrice - commission;
  return {
    totalPrice,
    commission,
    driverNet,
    commissionRate: COMMISSION_RATE,
  };
}

// Predefined popular routes with fixed total prices (commission included)
export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  totalPrice: number; // final price shown to passengers
  distanceKm: number;
  durationMin: number;
  imageKey: string;
}

export const popularRoutes: PopularRoute[] = [
  { id: 'route-1', from: 'Badalabougou', to: 'Université USSGB', totalPrice: 500, distanceKm: 6, durationMin: 15, imageKey: 'badalabougou' },
  { id: 'route-2', from: 'Kalaban-Coro', to: 'ACI 2000', totalPrice: 750, distanceKm: 10, durationMin: 25, imageKey: 'kalaban-coro' },
  { id: 'route-3', from: 'Magnambougou', to: 'Université ULSHB', totalPrice: 600, distanceKm: 8, durationMin: 20, imageKey: 'magnambougou' },
  { id: 'route-4', from: 'Hippodrome', to: 'ENSup', totalPrice: 550, distanceKm: 7, durationMin: 18, imageKey: 'hippodrome' },
  { id: 'route-5', from: 'Lafiabougou', to: 'Université USSGB', totalPrice: 650, distanceKm: 9, durationMin: 22, imageKey: 'aci-2000' },
  { id: 'route-6', from: 'ACI 2000', to: 'IPR/IFRA', totalPrice: 800, distanceKm: 12, durationMin: 30, imageKey: 'aci-2000' },
];
