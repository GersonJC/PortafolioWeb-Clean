'use client';

import { motion } from 'framer-motion';
import { ContactForm } from './ContactForm';
import { Card } from '@/components/ui/card';
import { Mail, Linkedin, Github, MapPin } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'jotag.carranza@gmail.com',
    href: 'mailto:jotag.carranza@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Ubicación',
    value: 'Lima, Perú',
    href: null,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Perfil profesional',
    href: '#', // Reemplaza con tu URL de LinkedIn
  },
  {
    icon: Github,
    label: 'GitHub',
    value: '@GersonJC',
    href: 'https://github.com/GersonJC',
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Contacto</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ¿Tienes un proyecto en mente o quieres trabajar juntos? 
            No dudes en contactarme. Respondo en menos de 24 horas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ContactForm />
          </motion.div>

          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-shadow">
                      {info.href ? (
                        <a
                          href={info.href}
                          target={info.href.startsWith('http') ? '_blank' : undefined}
                          rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-4 group"
                        >
                          <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <info.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{info.label}</p>
                            <p className="font-medium group-hover:text-primary transition-colors">
                              {info.value}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <info.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{info.label}</p>
                            <p className="font-medium">{info.value}</p>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Disponibilidad */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h4 className="font-semibold mb-2">Disponibilidad</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Actualmente abierto a nuevas oportunidades y proyectos freelance.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-600">Disponible</span>
              </div>
            </Card>

            {/* Call to action */}
            <Card className="p-6">
              <h4 className="font-semibold mb-2">¿Prefieres una llamada?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Agenda una reunión virtual para discutir tu proyecto en detalle.
              </p>
              <a
                href="mailto:jotag.carranza@gmail.com?subject=Solicitud de reunión"
                className="text-sm font-medium text-primary hover:underline"
              >
                Solicitar reunión →
              </a>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}