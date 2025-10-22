'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSkills } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Code, 
  BarChart3, 
  Cloud, 
  Wrench,
  Search 
} from 'lucide-react';

const categoryConfig = {
  Database: { icon: Database, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  Backend: { icon: Code, color: 'text-green-500', bg: 'bg-green-500/10' },
  BI: { icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  Frontend: { icon: Code, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  DevOps: { icon: Cloud, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  Tools: { icon: Wrench, color: 'text-gray-500', bg: 'bg-gray-500/10' },
};

const categories = [
  'Todas',
  'Database',
  'Backend',
  'BI',
  'Frontend',
  'DevOps',
  'Tools',
];

export function SkillsGrid() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => getSkills(),
  });

  const filteredSkills = skills?.filter((skill) => {
    const matchesCategory =
      selectedCategory === 'Todas' || skill.category === selectedCategory;
    const matchesSearch = skill.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLevelLabel = (level: number) => {
    const labels = ['Básico', 'Intermedio', 'Avanzado', 'Experto', 'Master'];
    return labels[level - 1] || 'Básico';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-12 w-12 bg-secondary rounded-lg mb-3" />
            <div className="h-4 bg-secondary rounded mb-2" />
            <div className="h-3 bg-secondary rounded w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Filtros */}
      <div className="mb-8 space-y-4">
        {/* Búsqueda */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar tecnología..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categorías */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Grid de Skills */}
      <AnimatePresence mode="popLayout">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          layout
        >
          {filteredSkills?.map((skill, index) => {
            const config = categoryConfig[skill.category as keyof typeof categoryConfig];
            const Icon = config?.icon || Code;

            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <Card className="p-4 h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                  <div className="flex flex-col items-center text-center">
                    {/* Icono */}
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${config?.bg} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${config?.color}`} />
                    </div>

                    {/* Nombre */}
                    <h3 className="font-semibold mb-2 text-sm">{skill.name}</h3>

                    {/* Nivel */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < skill.level ? 'bg-primary' : 'bg-secondary'
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-xs text-muted-foreground mb-2">
                      {getLevelLabel(skill.level)}
                    </span>

                    {/* Experiencia */}
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>{skill.yearsExperience} años</div>
                      <div>{skill.projectsCount} proyectos</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Mensaje si no hay resultados */}
      {filteredSkills?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            No se encontraron tecnologías con los filtros seleccionados
          </p>
        </motion.div>
      )}
    </div>
  );
}