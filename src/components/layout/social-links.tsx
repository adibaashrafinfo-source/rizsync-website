import type { SVGProps } from 'react';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from '@/components/ui/social-icons';
import type { SiteSettings } from '@/lib/cms/types';
import { cn } from '@/lib/utils';

const networks: {
  key: keyof SiteSettings['social'];
  label: string;
  Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
}[] = [
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'youtube', label: 'YouTube', Icon: YouTubeIcon },
  { key: 'x', label: 'X', Icon: XIcon },
  { key: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
];

/** Social profile buttons — only networks with a URL set in the admin appear. */
export function SocialLinks({
  social,
  brand,
  className,
  itemClassName,
}: {
  social: SiteSettings['social'];
  brand: string;
  className?: string;
  itemClassName?: string;
}) {
  const links = networks.filter(({ key }) => social[key] && social[key] !== '#');
  if (!links.length) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {links.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={social[key]}
          aria-label={`${brand} on ${label}`}
          target="_blank"
          rel="noopener noreferrer"
          className={itemClassName}
        >
          <Icon className="h-[18px] w-[18px]" />
        </a>
      ))}
    </div>
  );
}
