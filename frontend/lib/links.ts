import { Github, Linkedin, Mail, LucideIcon } from 'lucide-react';

export interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

export const socialLinks: SocialLink[] = [
  {
    icon: Github,
    href: 'https://github.com/GersonJC',
    label: 'GitHub',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/gersoncarranza/', 
    label: 'LinkedIn',
  },
  {
    icon: Mail,
    href: 'mailto:jotag.carranza@gmail.com',
    label: 'Email',
  },
];

export const getSocialLinks = (): SocialLink[] => {
  return socialLinks;
};