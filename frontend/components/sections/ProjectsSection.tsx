'use client';

import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/lib/api';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export function ProjectsSection() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects', { featured: true }],
    queryFn: () => getProjects({ featured: true }),
  });

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Proyectos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-48 bg-secondary rounded-lg mb-4"></div>
                <div className="h-6 bg-secondary rounded mb-2"></div>
                <div className="h-4 bg-secondary rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Proyectos Destacados</h2>
          <p className="text-red-500">Error al cargar proyectos: {error.message}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Asegúrate que el backend esté corriendo en http://localhost:7071
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Proyectos Destacados
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                
                <p className="text-muted-foreground mb-4 flex-grow">
                  {project.shortDescription}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-secondary px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-xs text-muted-foreground">
                      +{project.technologies.length - 4} más
                    </span>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      GitHub →
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Demo →
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}