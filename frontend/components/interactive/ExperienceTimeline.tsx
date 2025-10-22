'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExperience } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Briefcase, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export function ExperienceTimeline() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterTech, setFilterTech] = useState<string>('');

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experience'],
    queryFn: getExperience,
  });

  // Obtener todas las tecnologías únicas
  const allTechnologies = Array.from(
    new Set(experiences?.flatMap((exp) => exp.technologies) || [])
  ).sort();

  // Filtrar experiencias por tecnología
  const filteredExperiences = experiences?.filter((exp) =>
    filterTech === '' || exp.technologies.includes(filterTech)
  );

  const formatDate = (dateString: string | null, isCurrent: boolean) => {
    if (isCurrent) return 'Actualidad';
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  const calculateDuration = (start: string, end: string | null, isCurrent: boolean) => {
    const startDate = new Date(start);
    const endDate = isCurrent ? new Date() : new Date(end || start);
    const months = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0) {
      return `${years} año${years > 1 ? 's' : ''} ${
        remainingMonths > 0 ? `${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}` : ''
      }`;
    }
    return `${months} mes${months > 1 ? 'es' : ''}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-secondary rounded mb-3 w-3/4" />
            <div className="h-4 bg-secondary rounded mb-2 w-1/2" />
            <div className="h-4 bg-secondary rounded w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Filtro de tecnologías */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-3">Filtrar por tecnología:</h3>
        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => setFilterTech('')}
            className={`px-3 py-1 rounded-full text-sm ${
              filterTech === ''
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Todas
          </motion.button>
          {allTechnologies.slice(0, 10).map((tech) => (
            <motion.button
              key={tech}
              onClick={() => setFilterTech(tech)}
              className={`px-3 py-1 rounded-full text-sm ${
                filterTech === tech
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tech}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

        <div className="space-y-8">
          <AnimatePresence>
            {filteredExperiences?.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Punto en la línea */}
                <div className="absolute left-8 top-6 w-4 h-4 -ml-2 rounded-full bg-primary border-4 border-background hidden md:block z-10" />

                <Card
                  className={`md:ml-20 p-6 hover:shadow-lg transition-all cursor-pointer ${
                    experience.isCurrent ? 'border-primary' : ''
                  }`}
                  onClick={() =>
                    setExpandedId(expandedId === experience.id ? null : experience.id)
                  }
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-bold">{experience.position}</h3>
                        {experience.isCurrent && (
                          <span className="px-2 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full">
                            Actual
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-medium text-muted-foreground mb-2">
                        {experience.company}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(experience.startDate, false)} -{' '}
                            {formatDate(experience.endDate, experience.isCurrent)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">
                            {calculateDuration(
                              experience.startDate,
                              experience.endDate,
                              experience.isCurrent
                            )}
                          </span>
                        </div>
                        {experience.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{experience.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <motion.div
                      animate={{ rotate: expandedId === experience.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {expandedId === experience.id ? (
                        <ChevronUp className="w-6 h-6 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-muted-foreground" />
                      )}
                    </motion.div>
                  </div>

                  {/* Tecnologías (siempre visible) */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {experience.technologies.slice(0, 5).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-secondary rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {experience.technologies.length > 5 && (
                      <span className="px-2 py-1 text-xs text-muted-foreground">
                        +{experience.technologies.length - 5} más
                      </span>
                    )}
                  </div>

                  {/* Descripción expandible */}
                  <AnimatePresence>
                    {expandedId === experience.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t">
                          <h4 className="font-semibold mb-3">Responsabilidades:</h4>
                          <div className="text-muted-foreground whitespace-pre-line">
                            {experience.description}
                          </div>

                          {experience.technologies.length > 5 && (
                            <div className="mt-4">
                              <h4 className="font-semibold mb-2">
                                Todas las tecnologías:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {experience.technologies.map((tech, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 text-xs bg-secondary rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}