// Dictionary of popular developer & hackathon platforms for instant rich metadata
interface KnownPlatformInfo {
  name: string;
  description: string;
  logoUrl?: string;
}

const KNOWN_PLATFORMS: Record<string, KnownPlatformInfo> = {
  'devpost.com': {
    name: 'Devpost',
    description: 'The home for hackathons — find in-person and online hackathons, build software, and win prizes.',
  },
  'mlh.io': {
    name: 'Major League Hacking (MLH)',
    description: 'The official student hackathon league hosting collegiate competitions and fellowships worldwide.',
  },
  'github.com': {
    name: 'GitHub',
    description: 'Where the world builds software, hosts developer grants, and organizes global open-source hackathons.',
  },
  'developers.google.com': {
    name: 'Google Developer Groups',
    description: 'Global community groups for builders interested in Google developer technologies, Solution Challenge, and summits.',
  },
  'gdg.community.dev': {
    name: 'Google Developer Groups',
    description: 'Official chapter portal for GDG meetups, hackathons, and dev events globally.',
  },
  'unstop.com': {
    name: 'Unstop',
    description: 'Connecting unstoppable talent with hackathons, hiring challenges, quizzes, and technical competitions.',
  },
  'devfolio.co': {
    name: 'Devfolio',
    description: "India's largest community of builders, hosting premier college hackathons and developer grants.",
  },
  'dorahacks.io': {
    name: 'DoraHacks',
    description: 'Global hacker community and Web3 developer incentive platform organizing bounty rounds and hackathons.',
  },
  'ethglobal.com': {
    name: 'ETHGlobal',
    description: 'Uniting the global Ethereum developer ecosystem with premier in-person and virtual hackathons.',
  },
  'hackerearth.com': {
    name: 'HackerEarth',
    description: 'Global developer assessment, coding challenges, and corporate innovation hackathons.',
  },
  'kaggle.com': {
    name: 'Kaggle',
    description: 'Data science & machine learning competitions, datasets, and collaborative notebooks.',
  },
  'codeforces.com': {
    name: 'Codeforces',
    description: 'Competitive programming platform hosting regular rated contests, rounds, and algorithm challenges.',
  },
  'leetcode.com': {
    name: 'LeetCode',
    description: 'Coding challenges, algorithmic contests, and technical interview problem solving.',
  },
  'wemakedevs.org': {
    name: 'WeMakeDevs',
    description: 'Developer community making quality education accessible, hosting hackathons, mentorship, and tech events.',
  },
  'hackereconomy.com': {
    name: 'Hacker Economy',
    description: 'Hackathons, startup bounties, and technical grant programs for creative developers.',
  },
  'eventornado.com': {
    name: 'Eventornado',
    description: 'Modern hackathon management platform for community-driven innovation challenges.',
  },
  'taikai.network': {
    name: 'TAIKAI',
    description: 'Hackathon platform connecting developers with global challenges, mentorship, and bounties.',
  },
};

/**
 * Validates and normalizes user-entered URL
 */
export function normalizeUrl(input: string): { valid: boolean; normalizedUrl: string; domain: string; error?: string } {
  let trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, normalizedUrl: '', domain: '', error: 'Platform URL is required.' };
  }

  // Prepend https:// if no protocol provided
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    
    // Check if hostname has at least a dot and domain part
    if (!hostname || !hostname.includes('.') || hostname.endsWith('.')) {
      return { valid: false, normalizedUrl: '', domain: '', error: 'Please enter a valid domain (e.g. devpost.com).' };
    }

    return {
      valid: true,
      normalizedUrl: parsed.origin + (parsed.pathname === '/' ? '' : parsed.pathname),
      domain: hostname,
    };
  } catch {
    return { valid: false, normalizedUrl: '', domain: '', error: 'Invalid URL format.' };
  }
}

/**
 * Derives a human-friendly brand name from the domain
 */
export function deriveBrandNameFromDomain(domain: string): string {
  // Check known platforms first
  for (const [knownDomain, info] of Object.entries(KNOWN_PLATFORMS)) {
    if (domain === knownDomain || domain.endsWith('.' + knownDomain)) {
      return info.name;
    }
  }

  // Format domain into Title Case: e.g. "hackmit.org" -> "Hackmit", "ai.meta.com" -> "Ai Meta"
  const parts = domain.split('.');
  const baseName = parts.length > 2 ? parts[parts.length - 2] : parts[0];
  
  // Clean special names
  return baseName
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Derives a default short description for the domain
 */
export function deriveDescriptionFromDomain(domain: string, name?: string): string {
  for (const [knownDomain, info] of Object.entries(KNOWN_PLATFORMS)) {
    if (domain === knownDomain || domain.endsWith('.' + knownDomain)) {
      return info.description;
    }
  }

  const label = name || domain;
  return `Explore hackathons, developer competitions, and technical opportunities on ${label}.`;
}

/**
 * Resolves the official logo URL using Google's high-res favicon service
 */
export function getLogoUrlForDomain(domain: string): string {
  // Google's high-resolution favicon service (sz=128 delivers crisp PNG icons for platforms)
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

/**
 * Returns alternative logo fallback (DuckDuckGo icon service)
 */
export function getSecondaryLogoUrl(domain: string): string {
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}
