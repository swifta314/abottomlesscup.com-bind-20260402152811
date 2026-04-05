export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatStateAbbr(state) {
  const states = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia',
  };
  return states[state?.toUpperCase()] || state;
}

export function citySlug(city, state) {
  return `${slugify(city)}-${state?.toLowerCase()}`;
}

export function formatHours(hours) {
  if (!hours) return 'Hours not listed';
  return hours;
}

export const CATEGORY_META = {
  'study-coffee-shops': {
    label: 'Study Coffee Shops',
    description: 'Quiet, focused spaces with good WiFi and outlets.',
  },
  'coffee-shops-with-wifi': {
    label: 'Coffee Shops with WiFi',
    description: 'Reliable WiFi for remote workers and students.',
  },
  'aesthetic-coffee-shops': {
    label: 'Aesthetic Coffee Shops',
    description: 'Beautiful, photogenic spaces worth visiting.',
  },
  'coffee-shops-with-outdoor-seating': {
    label: 'Coffee Shops with Outdoor Seating',
    description: 'Enjoy your coffee outside in great patio settings.',
  },
  'pet-friendly-coffee-shops': {
    label: 'Pet Friendly Coffee Shops',
    description: 'Bring your furry friend along for coffee.',
  },
  'specialty-coffee-shops': {
    label: 'Specialty Coffee Shops',
    description: 'Single-origin, pour-over, and craft coffee experiences.',
  },
};
