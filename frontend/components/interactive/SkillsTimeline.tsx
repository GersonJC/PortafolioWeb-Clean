'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSkills } from '@/lib/api';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ChartType = 'line' | 'bar' | 'area';
type CategoryType = 'all' | 'Backend' | 'Database' | 'BI' | 'Frontend' | 'DevOps' | 'Tools';

const categories: { value: CategoryType; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Database', label: 'Database' },
  { value: 'BI', label: 'Business Intelligence' },
  { value: 'Frontend', label: 'Frontend' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Tools', label: 'Herramientas' },
];

const chartTypes: { value: ChartType; label: string }[] = [
  { value: 'line', label: 'Línea' },
  { value: 'bar', label: 'Barras' },
  { value: 'area', label: 'Área' },
];

export function SkillsTimeline() {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');

  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => getSkills(),
  });

  // Preparar datos para el gráfico
  const chartData = skills
    ?.filter((skill) => selectedCategory === 'all' || skill.category === selectedCategory)
    .sort((a, b) => b.yearsExperience - a.yearsExperience)
    .slice(0, 10) // Top 10
    .map((skill) => ({
      name: skill.name,
      años: skill.yearsExperience,
      nivel: skill.level,
      proyectos: skill.projectsCount,
    }));

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="años" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Años de experiencia"
            />
            <Line 
              type="monotone" 
              dataKey="proyectos" 
              stroke="hsl(142 76% 36%)" 
              strokeWidth={2}
              name="Proyectos"
            />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Bar dataKey="años" fill="hsl(var(--primary))" name="Años de experiencia" />
            <Bar dataKey="proyectos" fill="hsl(142 76% 36%)" name="Proyectos" />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="años" 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
              name="Años de experiencia"
            />
          </AreaChart>
        );
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Cargando gráfico...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Controles */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Selector de tipo de gráfico */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground mr-2">Visualización:</span>
            {chartTypes.map((type) => (
              <motion.button
                key={type.value}
                onClick={() => setChartType(type.value)}
                className={`px-3 py-1 rounded-full text-sm ${
                  chartType === type.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {type.label}
              </motion.button>
            ))}
          </div>

          {/* Selector de categoría */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground mr-2">Categoría:</span>
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === cat.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Gráfico */}
        <motion.div
          key={`${chartType}-${selectedCategory}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-96"
        >
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </motion.div>

        {/* Información adicional */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {chartData?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Tecnologías</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {chartData?.reduce((sum, s) => sum + s.años, 0).toFixed(1) || 0}
            </div>
            <div className="text-sm text-muted-foreground">Años totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {chartData?.reduce((sum, s) => sum + s.proyectos, 0) || 0}
            </div>
            <div className="text-sm text-muted-foreground">Proyectos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {chartData && chartData.length > 0
                ? (chartData.reduce((sum, s) => sum + s.nivel, 0) / chartData.length).toFixed(1)
                : 0}
            </div>
            <div className="text-sm text-muted-foreground">Nivel promedio</div>
          </div>
        </div>
      </div>
    </Card>
  );
}