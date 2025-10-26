import { Github, Linkedin, Mail, LucideIcon } from 'lucide-react';

export interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
  value: string;
}

export const socialLinks: SocialLink[] = [
  {
    icon: Github,
    href: 'https://github.com/GersonJC',
    label: 'GitHub',
    value: 'Perfil profesional',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/gersoncarranza/', 
    label: 'LinkedIn',
    value: '@GersonJC',
  },
  {
    icon: Mail,
    href: 'mailto:jotag.carranza@gmail.com',
    label: 'Email',
    value: 'jotag.carranza@gmail.com'
  },
];

export const getSocialLinks = (): SocialLink[] => {
  return socialLinks;
};