'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Code, 
  Server, 
  Database, 
  CheckCircle, 
  Copy, 
  ExternalLink,
  Loader2
} from 'lucide-react';
import { ApiEndpoint, ApiDocumentation } from '@/lib/types';
import { getApiDocumentation, getApiEndpoints } from '@/lib/api';

const methodColors = {
  GET: 'bg-green-500/10 text-green-600 border-green-500/20',
  POST: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  PUT: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  DELETE: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export function ApiDocsSection() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [apiDocs, setApiDocs] = useState<ApiDocumentation | null>(null);
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [docsData, endpointsData] = await Promise.all([
          getApiDocumentation(),
          getApiEndpoints()
        ]);
        
        setApiDocs(docsData);
        setEndpoints(endpointsData.sort((a, b) => a.OrderIndex - b.OrderIndex));
      } catch (err) {
        setError('Error al cargar la documentación de la API');
        console.error('Error fetching API documentation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  if (loading) {
    return (
      <section id="api-docs" className="py-20 px-4 bg-secondary/20">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error || !apiDocs) {
    return (
      <section id="api-docs" className="py-20 px-4 bg-secondary/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">{error || 'No se pudo cargar la documentación'}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="api-docs" className="py-20 px-4 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Server className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold">{apiDocs.Title}</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {apiDocs.Description}
          </p>
        </motion.div>

        {/* Información general 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Database className="w-6 h-6 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Base URL</h3>
                <div className="flex items-center gap-2 mb-4">
                  <code className="flex-1 px-4 py-2 bg-secondary rounded-md text-sm">
                    {apiDocs.BaseUrl}
                  </code>
                  <button
                    onClick={() => copyToClipboard(apiDocs.BaseUrl, 'base-url')}
                    className="p-2 hover:bg-secondary rounded-md transition-colors"
                    title="Copiar URL base"
                  >
                    {copiedEndpoint === 'base-url' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Todas las respuestas están en formato JSON con la estructura:
                </p>
                <pre className="bg-secondary p-3 rounded-md mt-2 text-sm overflow-x-auto">
{`{
  "success": true,
  "data": [...],
  "message": "string",
  "count": number
}`}
                </pre>
              </div>
            </div>
          </Card>
        </motion.div>*/}

        {/* Endpoints - Grid de 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {endpoints.map((api, index) => {
            // Crear un ID único basado en el endpoint para usar como key
            const uniqueKey = `endpoint-${api.Id}-${api.Endpoint.replace(/\//g, '-')}`;
            
            return (
              <motion.div
                key={uniqueKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-fit"
              >
              <Card className="overflow-hidden h-full flex flex-col">
                {/* Header del card */}
                <div className="p-4 border-b bg-secondary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${methodColors[api.Method]}`}>
                      {api.Method}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(`${apiDocs.BaseUrl}${api.Endpoint}`, api.Endpoint);
                      }}
                      className="p-1.5 hover:bg-secondary rounded-md transition-colors"
                      title="Copiar URL completa"
                    >
                      {copiedEndpoint === api.Endpoint ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <code className="text-xs font-mono break-all block">
                    {api.Endpoint}
                  </code>
                </div>

                {/* Contenido del card */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-sm mb-2">{api.Name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {api.Description}
                  </p>

                  {/* Indicadores de parámetros */}
                  <div className="space-y-2 mb-4">
                    {api.Parameters && api.Parameters.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Code className="w-3 h-3" />
                        <span>{api.Parameters.length} parámetro{api.Parameters.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {api.RequestBody && api.RequestBody.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Database className="w-3 h-3" />
                        <span>{api.RequestBody.length} campo{api.RequestBody.length > 1 ? 's' : ''} en body</span>
                      </div>
                    )}
                  </div>

                  {/* Botón probar en navegador - Todos los métodos */}
                  <a
                    href={`${apiDocs.BaseUrl}${api.Endpoint}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Probar en el navegador
                  </a>
                </div>

              </Card>
            </motion.div>
          );
        })}
        </div>

        {/* Footer con tecnologías 
        {apiDocs.Technologies && apiDocs.Technologies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-4 text-center">Stack Tecnológico</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {apiDocs.Technologies.map((tech, techIndex) => (
                  <span
                    key={`tech-${techIndex}-${tech}`}
                    className="px-4 py-2 bg-background rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        )}*/}
      </div>
    </section>
  );
}