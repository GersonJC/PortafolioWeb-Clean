'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com/GersonJC',
    label: 'GitHub',
  },
  {
    icon: Linkedin,
    href: '#', // Reemplaza con tu LinkedIn
    label: 'LinkedIn',
  },
  {
    icon: Mail,
    href: 'mailto:jotag.carranza@gmail.com',
    label: 'Email',
  },
];

const quickLinks = [
  { name: 'Sobre Mí', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experiencia', href: '#experience' },
  { name: 'Proyectos', href: '#projects' },
  { name: 'Contacto', href: '#contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/20 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Columna 1: Sobre mí */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              GC
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ingeniero de Sistemas especializado en análisis de datos, 
              desarrollo backend y business intelligence.
            </p>
            <p className="text-sm text-muted-foreground">
              Lima, Perú 🇵🇪
            </p>
          </motion.div>

          {/* Columna 2: Links rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Columna 3: Contacto y redes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4">Conéctate</h4>
            <div className="flex gap-4 mb-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <a
                href="mailto:jotag.carranza@gmail.com"
                className="hover:text-primary transition-colors"
              >
                jotag.carranza@gmail.com
              </a>
            </p>
          </motion.div>
        </div>

        {/* Separador */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Gerson Carranza. Todos los derechos reservados.
            </p>
            
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Hecho con <Heart className="w-4 h-4 text-red-500 fill-red-500" /> usando Next.js y Azure
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}