'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Code, 
  Server, 
  Database, 
  CheckCircle, 
  Copy, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ApiEndpoint {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  requestBody?: {
    field: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  //response: string;
  exampleRequest?: string;
  //exampleResponse: string;
}

const apiEndpoints: ApiEndpoint[] = [

  {
    name: 'Obtener Experiencia',
    method: 'GET',
    endpoint: '/experience',
    description: 'Obtiene el historial de experiencia laboral',
  },
  {
    name: 'Obtener Habilidades',
    method: 'GET',
    endpoint: '/skills',
    description: 'Obtiene las habilidades técnicas y años de experiencia',
    parameters: [
      {
        name: 'category',
        type: 'string',
        required: false,
        description: 'Filtrar por categoría (Backend, Database, BI, Frontend, DevOps, Tools)'
      }
    ],
  },
  {
    name: 'Obtener Educación',
    method: 'GET',
    endpoint: '/education',
    description: 'Obtiene la formación académica',
  },
];

const methodColors = {
  GET: 'bg-green-500/10 text-green-600 border-green-500/20',
  POST: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  PUT: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  DELETE: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export function ApiDocsSection() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tu-function-app.azurewebsites.net/api';

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const toggleEndpoint = (endpoint: string) => {
    setExpandedEndpoint(expandedEndpoint === endpoint ? null : endpoint);
  };

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
            <h2 className="text-4xl font-bold">API Documentation</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            APIs REST disponibles construidas con Azure Functions y conectadas a Azure SQL Database.
            Todas las respuestas están en formato JSON.
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
                    {baseUrl}
                  </code>
                  <button
                    onClick={() => copyToClipboard(baseUrl, 'base-url')}
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
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Todas las respuestas incluyen un campo <code className="px-1 py-0.5 bg-secondary rounded">success</code> (boolean)</p>
                  <p>• Los datos se devuelven en el campo <code className="px-1 py-0.5 bg-secondary rounded">data</code></p>
                  <p>• Los errores incluyen un campo <code className="px-1 py-0.5 bg-secondary rounded">message</code> descriptivo</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>*/}

        {/* Lista de endpoints */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiEndpoints.map((api, index) => (
            <motion.div
              key={api.endpoint}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                {/* Header del endpoint */}
                <button
                  onClick={() => toggleEndpoint(api.endpoint)}
                  className="w-full p-6 text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <span className={`px-3 py-1 rounded-md text-sm font-semibold border ${methodColors[api.method]}`}>
                        {api.method}
                      </span>
                      <code className="text-sm font-mono">{api.endpoint}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(`${baseUrl}${api.endpoint}`, api.endpoint);
                        }}
                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                        title="Copiar URL completa"
                      >
                        {copiedEndpoint === api.endpoint ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                      {expandedEndpoint === api.endpoint ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-2">{api.description}</p>
                </button>

                {/* Detalles expandibles */}
                {expandedEndpoint === api.endpoint && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t"
                  >
                    <div className="p-6 space-y-6">
                      {/* Parámetros */}
                      {api.parameters && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Parámetros Query
                          </h4>
                          <div className="space-y-2">
                            {api.parameters.map((param) => (
                              <div key={param.name} className="flex gap-4 text-sm">
                                <code className="px-2 py-1 bg-secondary rounded min-w-[120px]">
                                  {param.name}
                                </code>
                                <span className="text-muted-foreground">{param.type}</span>
                                <span className={param.required ? 'text-red-500' : 'text-green-500'}>
                                  {param.required ? 'Requerido' : 'Opcional'}
                                </span>
                                <span className="text-muted-foreground flex-1">{param.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Request Body */}
                      {api.requestBody && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Request Body
                          </h4>
                          <div className="space-y-2 mb-4">
                            {api.requestBody.map((field) => (
                              <div key={field.field} className="flex gap-4 text-sm">
                                <code className="px-2 py-1 bg-secondary rounded min-w-[120px]">
                                  {field.field}
                                </code>
                                <span className="text-muted-foreground">{field.type}</span>
                                <span className={field.required ? 'text-red-500' : 'text-green-500'}>
                                  {field.required ? 'Requerido' : 'Opcional'}
                                </span>
                                <span className="text-muted-foreground flex-1">{field.description}</span>
                              </div>
                            ))}
                          </div>
                          {api.exampleRequest && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Ejemplo de request:</p>
                              <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm">
                                <code>{api.exampleRequest}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Response 
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Response
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">{api.response}</p>
                        <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm">
                          <code>{api.exampleResponse}</code>
                        </pre>
                      </div>*/}

                      {/* Try it out */}
                      <div className="pt-4 border-t">
                        <a
                          href={`${baseUrl}${api.endpoint}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {api.method === 'GET' ? 'Probar en el navegador' : 'Ver documentación'}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer con tecnologías 
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
              {['Azure Functions', 'C# .NET 8', 'Azure SQL Database', 'REST API', 'Serverless'].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-background rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>*/}
      </div>
    </section>
  );
}