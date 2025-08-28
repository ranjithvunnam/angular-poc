import { DropdownItem } from "../core/models/body-types.model";

export const DEFAULT_BODY_TYPES: DropdownItem[] = [
  { id: 1, label: 'Sedan', order: 1 },
  { id: 2, label: 'SUV', order: 2 },
  { id: 3, label: 'Hatchback', order: 3 },
  { id: 4, label: 'Coupe', order: 4 },
  { id: 5, label: 'Convertible', order: 5 },
  { id: 6, label: 'Pickup Truck', order: 6 },
  { id: 7, label: 'Minivan / MPV', order: 7 },
  { id: 8, label: 'Wagon / Estate', order: 8 },
  { id: 9, label: 'Sports Car', order: 9 },
  { id: 10, label: 'Electric Vehicle (EV)', order: 10 },
];

export const DEFAULT_BODY_SUBTYPES: DropdownItem[] = [
  // Sedan
  { id: 101, parentId: 1, label: 'Compact Sedan', order: 1 },
  { id: 102, parentId: 1, label: 'Midsize Sedan', order: 2 },
  { id: 103, parentId: 1, label: 'Full-size Sedan', order: 3 },
  { id: 104, parentId: 1, label: 'Luxury Sedan', order: 4 },

  // SUV
  { id: 105, parentId: 2, label: 'Compact SUV', order: 1 },
  { id: 106, parentId: 2, label: 'Crossover SUV', order: 2 },
  { id: 107, parentId: 2, label: 'Full-size SUV', order: 3 },
  { id: 108, parentId: 2, label: 'Coupe SUV', order: 4 },

  // Hatchback
  { id: 109, parentId: 3, label: '3-door Hatchback', order: 1 },
  { id: 110, parentId: 3, label: '5-door Hatchback', order: 2 },
  { id: 111, parentId: 3, label: 'Hot Hatch', order: 3 },

  // Coupe
  { id: 112, parentId: 4, label: '2-door Coupe', order: 1 },
  { id: 113, parentId: 4, label: 'Sports Coupe', order: 2 },
  { id: 114, parentId: 4, label: 'Luxury Coupe', order: 3 },

  // Convertible
  { id: 115, parentId: 5, label: 'Soft-top Convertible', order: 1 },
  { id: 116, parentId: 5, label: 'Hard-top Convertible', order: 2 },
  { id: 117, parentId: 5, label: 'Roadster', order: 3 },

  // Pickup Truck
  { id: 118, parentId: 6, label: 'Single Cab', order: 1 },
  { id: 119, parentId: 6, label: 'Double Cab', order: 2 },
  { id: 120, parentId: 6, label: 'Crew Cab', order: 3 },
  { id: 121, parentId: 6, label: 'Off-road Pickup', order: 4 },

  // Minivan / MPV
  { id: 122, parentId: 7, label: 'Compact MPV', order: 1 },
  { id: 123, parentId: 7, label: 'Full-size MPV', order: 2 },

  // Wagon / Estate
  { id: 124, parentId: 8, label: 'Compact Wagon', order: 1 },
  { id: 125, parentId: 8, label: 'Crossover Wagon', order: 2 },
  { id: 126, parentId: 8, label: 'Performance Wagon', order: 3 },

  // Sports Car
  { id: 127, parentId: 9, label: 'Supercar', order: 1 },
  { id: 128, parentId: 9, label: 'Track-focused', order: 2 },
  { id: 129, parentId: 9, label: 'Grand Tourer (GT)', order: 3 },

  // Electric Vehicle
  { id: 130, parentId: 10, label: 'Electric Sedan', order: 1 },
  { id: 131, parentId: 10, label: 'Electric SUV', order: 2 },
  { id: 132, parentId: 10, label: 'Electric Hatchback', order: 3 },
];