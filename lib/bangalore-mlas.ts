export type Party = "INC" | "BJP";

export type MLA = {
  constituency: string;
  name: string;
  party: Party;
  latitude: number;
  longitude: number;
  /** Placeholder initial avatar — swap for real photo URL when available */
  photoUrl?: string;
};

/**
 * Karnataka Assembly (17th) — Bangalore city + fringe constituencies.
 * Coordinates are approximate constituency-centre points.
 */
export const bangaloreMlas: MLA[] = [
  {
    constituency: "Anekal (SC)",
    name: "V. Shivanna",
    party: "INC",
    latitude: 12.7143,
    longitude: 77.696,
  },
  {
    constituency: "BTM Layout",
    name: "Ramalinga Reddy",
    party: "INC",
    latitude: 12.9137,
    longitude: 77.6103,
  },
  {
    constituency: "Bangalore South",
    name: "M. Krishnappa",
    party: "BJP",
    latitude: 12.91,
    longitude: 77.5694,
  },
  {
    constituency: "Basavanagudi",
    name: "L. A. Ravi Subramanya",
    party: "BJP",
    latitude: 12.9418,
    longitude: 77.5768,
  },
  {
    constituency: "Bommanahalli",
    name: "M. Satish Reddy",
    party: "BJP",
    latitude: 12.8879,
    longitude: 77.6279,
  },
  {
    constituency: "Byatarayanapura",
    name: "Krishna Byre Gowda",
    party: "INC",
    latitude: 13.0601,
    longitude: 77.5392,
  },
  {
    constituency: "C. V. Raman Nagar (SC)",
    name: "S. Raghu",
    party: "BJP",
    latitude: 12.9848,
    longitude: 77.6618,
  },
  {
    constituency: "Chamrajpet",
    name: "B. Z. Zameer Ahmed Khan",
    party: "INC",
    latitude: 12.968,
    longitude: 77.556,
  },
  {
    constituency: "Chickpet",
    name: "Uday B. Garudachar",
    party: "BJP",
    latitude: 12.9726,
    longitude: 77.5767,
  },
  {
    constituency: "Dasarahalli",
    name: "S. Muniraju",
    party: "BJP",
    latitude: 13.0302,
    longitude: 77.5086,
  },
  {
    constituency: "Gandhinagar",
    name: "Dinesh Gundu Rao",
    party: "INC",
    latitude: 12.9791,
    longitude: 77.5574,
  },
  {
    constituency: "Govindarajanagar",
    name: "Priya Krishna",
    party: "INC",
    latitude: 12.9581,
    longitude: 77.535,
  },
  {
    constituency: "Hebbal",
    name: "Suresha B. S.",
    party: "INC",
    latitude: 13.0359,
    longitude: 77.5942,
  },
  {
    constituency: "Hoskote",
    name: "Sharath Kumar Bachegowda",
    party: "INC",
    latitude: 13.0711,
    longitude: 77.7981,
  },
  {
    constituency: "Jayanagar",
    name: "C. K. Ramamurthy",
    party: "BJP",
    latitude: 12.9252,
    longitude: 77.5839,
  },
  {
    constituency: "Krishnarajapuram",
    name: "B. A. Basavaraja",
    party: "BJP",
    latitude: 13.0,
    longitude: 77.6731,
  },
  {
    constituency: "Mahadevapura (SC)",
    name: "Manjula S.",
    party: "BJP",
    latitude: 12.9939,
    longitude: 77.7009,
  },
  {
    constituency: "Mahalakshmi Layout",
    name: "K. Gopalaiah",
    party: "BJP",
    latitude: 13.0138,
    longitude: 77.5496,
  },
  {
    constituency: "Malleshwaram",
    name: "C. N. Ashwath Narayan",
    party: "BJP",
    latitude: 13.0028,
    longitude: 77.5693,
  },
  {
    constituency: "Padmanabhanagar",
    name: "R. Ashoka",
    party: "BJP",
    latitude: 12.9119,
    longitude: 77.5497,
  },
  {
    constituency: "Pulakeshinagar (SC)",
    name: "A. C. Srinivasa",
    party: "INC",
    latitude: 12.9906,
    longitude: 77.6097,
  },
  {
    constituency: "Rajajinagar",
    name: "S. Suresh Kumar",
    party: "INC",
    latitude: 12.9975,
    longitude: 77.5542,
  },
  {
    constituency: "Rajarajeshwarinagar",
    name: "Munirathna",
    party: "BJP",
    latitude: 12.9202,
    longitude: 77.5065,
  },
  {
    constituency: "Sarvagnanagar",
    name: "K. J. George",
    party: "INC",
    latitude: 13.0108,
    longitude: 77.6347,
  },
  {
    constituency: "Shantinagar",
    name: "N. A. Harris",
    party: "INC",
    latitude: 12.9631,
    longitude: 77.6006,
  },
  {
    constituency: "Shivajinagar",
    name: "Rizwan Arshad",
    party: "INC",
    latitude: 12.993,
    longitude: 77.5974,
  },
  {
    constituency: "Vijayanagar",
    name: "H. R. Gaviyappa",
    party: "INC",
    latitude: 12.9691,
    longitude: 77.5305,
  },
  {
    constituency: "Yelahanka",
    name: "S. R. Vishwanath",
    party: "BJP",
    latitude: 13.1002,
    longitude: 77.596,
  },
  {
    constituency: "Yeshwanthpur",
    name: "S. T. Somashekar",
    party: "BJP",
    latitude: 13.0226,
    longitude: 77.5445,
  },
];

export const partyConfig: Record<Party, { color: string; bg: string; border: string; badge: string }> = {
  BJP: {
    color: "#ea580c",
    bg: "bg-orange-500",
    border: "border-orange-500",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
  INC: {
    color: "#2563eb",
    bg: "bg-blue-600",
    border: "border-blue-600",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
};
