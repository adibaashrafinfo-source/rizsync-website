import type { TeamMember } from '@/lib/cms/types';

/**
 * Default leadership profiles — seeded into Supabase. Replace them from the
 * admin panel (Team) with real names, titles, photos and LinkedIn URLs.
 */
const placeholderBio =
  'Placeholder biography. Two to three lines covering professional background, qualifications and the areas of the practice this person leads.';

export const defaultTeam: TeamMember[] = [
  'Founder & Managing Director',
  'Head of Finance & Compliance',
  'Head of Corporate Services',
  'Head of Digital Transformation',
].map((title) => ({
  name: 'Placeholder Name',
  title,
  bio: placeholderBio,
  photo: null,
  linkedin: null,
  email: null,
}));
