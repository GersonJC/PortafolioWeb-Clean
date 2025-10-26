'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { getProjectById } from '@/lib/api';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { ProjectChart } from '@/components/interactive/ProjectChart';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.id as string);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById(projectId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="h-64 bg-secondary rounded"></div>
            <div className="h-96 bg-secondary rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
          <Button onClick={() => router.push('/#projects')}>
            Volver a proyectos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Botón de regreso */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/#projects')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a proyectos
          </Button>
        </motion.div>

        {/* Header del proyecto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-2">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {project.shortDescription}
              </p>
            </div>
          </div>

          {/* Enlaces */}
          <div className="flex gap-4 mt-6">
            {project.githubUrl && (
              <Button variant="outline" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            )}
            {project.demoUrl && (
              <Button asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Demo
                </a>
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contexto */}
            {project.context && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Contexto</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.context}
                  </p>
                </Card>
              </motion.div>
            )}

            {/* Problema */}
            {project.problem && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 border-l-4 border-l-red-500">
                  <h2 className="text-2xl font-bold mb-4">Problema</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.problem}
                  </p>
                </Card>
              </motion.div>
            )}

            {/* Objetivo */}
            {project.objective && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 border-l-4 border-l-green-500">
                  <h2 className="text-2xl font-bold mb-4">Objetivo</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.objective}
                  </p>
                </Card>
              </motion.div>
            )}

            {/* Descripción completa */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Descripción Detallada</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </Card>
            </motion.div>

            {/* Gráfico interactivo */}
            {project.chartConfig && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    {project.chartConfig.title || 'Métricas del Proyecto'}
                  </h2>
                  <ProjectChart config={project.chartConfig} />
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stack Tecnológico */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Stack Tecnológico</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Información del proyecto */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Información</h3>
                <div className="space-y-3">
                  {project.startDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Inicio</p>
                      <p className="font-medium">
                        {new Date(project.startDate).toLocaleDateString('es-ES', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                  {project.endDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Finalización</p>
                      <p className="font-medium">
                        {new Date(project.endDate).toLocaleDateString('es-ES', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                  {!project.endDate && project.startDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Estado</p>
                      <p className="font-medium text-green-600">En desarrollo</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Categoría</p>
                    <p className="font-medium">{project.category}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}