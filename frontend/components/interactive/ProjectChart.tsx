'use client';

import { useState } from 'react';
import { ProjectChartConfig } from '@/lib/types';
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
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon } from 'lucide-react';

interface ProjectChartProps {
  config: ProjectChartConfig;
}

export function ProjectChart({ config }: ProjectChartProps) {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>(
    config.chartType || 'bar'
  );

  const chartData = config.data.map((point) => ({
    name: point.name,
    valor: point.value,
    categoria: point.category || '',
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-primary">
            {config.yAxisLabel || 'Valor'}: {payload[0].value.toLocaleString()}
          </p>
          {payload[0].payload.categoria && (
            <p className="text-sm text-muted-foreground">
              Categoría: {payload[0].payload.categoria}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              label={{ value: config.xAxisLabel, position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              className="text-xs"
              label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 5 }}
              activeDot={{ r: 7 }}
              name={config.yAxisLabel || 'Valor'}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              label={{ value: config.xAxisLabel, position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              className="text-xs"
              label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorValue)"
              name={config.yAxisLabel || 'Valor'}
            />
          </AreaChart>
        );

      case 'bar':
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              label={{ value: config.xAxisLabel, position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              className="text-xs"
              label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="valor"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              name={config.yAxisLabel || 'Valor'}
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Controles de tipo de gráfico */}
      <div className="flex gap-2 justify-end">
        <Button
          variant={chartType === 'bar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('bar')}
          className="gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          Barras
        </Button>
        <Button
          variant={chartType === 'line' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('line')}
          className="gap-2"
        >
          <LineChartIcon className="w-4 h-4" />
          Línea
        </Button>
        <Button
          variant={chartType === 'area' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('area')}
          className="gap-2"
        >
          <AreaChartIcon className="w-4 h-4" />
          Área
        </Button>
      </div>

      {/* Gráfico */}
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Leyenda adicional si hay categorías */}
      {chartData.some((d) => d.categoria) && (
        <div className="text-sm text-muted-foreground text-center">
          Los datos están agrupados por categoría
        </div>
      )}
    </div>
  );
}