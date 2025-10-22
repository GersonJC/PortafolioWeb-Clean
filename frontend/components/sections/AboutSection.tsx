'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  Users, 
  Target, 
  TrendingUp, 
  Shield, 
  Zap 
} from 'lucide-react';

const advantages = [
  {
    icon: Brain,
    title: 'Pensamiento Analítico',
    description: 'Capacidad para analizar datos complejos y extraer insights valiosos',
  },
  {
    icon: Users,
    title: 'Trabajo en Equipo',
    description: 'Colaboración efectiva en equipos multidisciplinarios',
  },
  {
    icon: Target,
    title: 'Toma de Decisiones',
    description: 'Decisiones basadas en datos y análisis técnico profundo',
  },
  {
    icon: TrendingUp,
    title: 'Aprendizaje Continuo',
    description: 'Actualización constante en tecnologías y mejores prácticas',
  },
  {
    icon: Shield,
    title: 'Ética de Trabajo',
    description: 'Compromiso con la calidad y cumplimiento de estándares',
  },
  {
    icon: Zap,
    title: 'Comunicación Efectiva',
    description: 'Traducción de conceptos técnicos a lenguaje de negocio',
  },
];

const stats = [
  { label: 'Años de Experiencia', value: '7+', delay: 0 },
  { label: 'Proyectos Completados', value: '25+', delay: 0.1 },
  { label: 'Tecnologías Dominadas', value: '29+', delay: 0.2 },
  { label: 'Empresas', value: '5', delay: 0.3 },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Sobre Mí</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Técnico en Computación e Informática con más de 5 años en el sector financiero, 
            especializado en análisis de datos, automatización de procesos e inteligencia de negocio.
          </p>
        </motion.div>

        {/* Bio detallada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Card className="p-8">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Actualmente cursando <strong>Ingeniería de Sistemas</strong> en la Universidad Peruana 
              de Ciencias Aplicadas (UPC), complementando mi formación técnica con sólidos fundamentos 
              académicos.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Mi experiencia abarca desde el desarrollo de dashboards ejecutivos en <strong>Power BI</strong> 
              y <strong>SQL Server Analysis Services</strong>, hasta la implementación de pipelines ETL 
              y sistemas de auditoría automatizada en entornos de producción.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Apasionado por la <strong>automatización</strong>, la <strong>optimización de procesos</strong> 
              y la transformación de datos en decisiones estratégicas de negocio.
            </p>
          </Card>
        </motion.div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: stat.delay }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <motion.div
                  className="text-4xl font-bold text-primary mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: stat.delay + 0.3 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Ventajas Competitivas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-3xl font-bold text-center mb-12">Ventajas Competitivas</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <advantage.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{advantage.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}