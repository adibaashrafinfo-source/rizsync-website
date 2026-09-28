/**
 * Leadership — DESIGN.md §6.2.5.
 * TODO(client): supply real names, titles, bios, photographs and LinkedIn URLs.
 */
export interface TeamMember {
  name: string;
  title: string;
  bio: string;
  photo: string;
  linkedin: string;
  initials: string;
}

export const team: TeamMember[] = [
  {
    name: 'Placeholder Name',
    title: 'Founder & Managing Director',
    bio: 'Placeholder biography. Two to three lines covering professional background, qualifications and the areas of the practice this person leads.',
    photo: '/images/team/member-1.webp',
    linkedin: '#',
    initials: 'RS',
  },
  {
    name: 'Placeholder Name',
    title: 'Head of Finance & Compliance',
    bio: 'Placeholder biography. Two to three lines covering professional background, qualifications and the areas of the practice this person leads.',
    photo: '/images/team/member-2.webp',
    linkedin: '#',
    initials: 'RS',
  },
  {
    name: 'Placeholder Name',
    title: 'Head of Corporate Services',
    bio: 'Placeholder biography. Two to three lines covering professional background, qualifications and the areas of the practice this person leads.',
    photo: '/images/team/member-3.webp',
    linkedin: '#',
    initials: 'RS',
  },
  {
    name: 'Placeholder Name',
    title: 'Head of Digital Transformation',
    bio: 'Placeholder biography. Two to three lines covering professional background, qualifications and the areas of the practice this person leads.',
    photo: '/images/team/member-4.webp',
    linkedin: '#',
    initials: 'RS',
  },
];
