'use client';

import { motion } from 'framer-motion';
import { SkillsGrid } from '@/components/interactive/SkillsGrid';
import { SkillsTimeline } from '@/components/interactive/SkillsTimeline';

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Habilidades Técnicas</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stack tecnológico completo con experiencia en desarrollo backend, 
            análisis de datos, business intelligence y herramientas cloud.
          </p>
        </motion.div>

        {/* Gráfico Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold mb-6">Experiencia por Tecnología</h3>
          <SkillsTimeline />
        </motion.div>

        {/* Grid de Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-6">Todas las Tecnologías</h3>
          <SkillsGrid />
        </motion.div>
      </div>
    </section>
  );
}