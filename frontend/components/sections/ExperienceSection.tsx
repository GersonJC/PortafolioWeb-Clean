'use client';

import { motion } from 'framer-motion';
import { ExperienceTimeline } from '@/components/interactive/ExperienceTimeline';

export function ExperienceSection() {
  return (
    <section id="experience" className="py-20 px-4 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Experiencia Profesional</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Más de 7 años de trayectoria en el sector financiero y educativo, 
            desarrollando soluciones de análisis de datos, automatización y business intelligence.
          </p>
        </motion.div>

        <ExperienceTimeline />
      </div>
    </section>
  );
}