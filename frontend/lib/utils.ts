import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// FUNCIONES PARA HERO - Botones 
/*
Descargar CV
 */
export type SupportedLanguage = 'spanish' | 'english';

export const CV_CONFIG = {
  googleDriveIds: {
    spanish: '1rfHccM2KkK_ZPCHynbsh7DBXGScLwM3I',  
    english: '14oJ2IQUkAjmNn7o5FL_QOj04l1voSWDo',  
  },
  filenames: {
    spanish: 'Carranza_CV_ES.pdf',
    english: 'Carranza_CV_EN.pdf',
  },
  defaultLanguage: 'spanish' as SupportedLanguage,
};

export const detectBrowserLanguage = (): SupportedLanguage => {
  // Verificar si estamos en el navegador
  if (typeof window === 'undefined') {
    return 'spanish';
  }

  // Obtener idioma del navegador
  const browserLanguage = navigator.language || 'es';
  const languageCode = browserLanguage.toLowerCase().split('-')[0];
  
  // Mapear a nuestros idiomas
  const languageMap: { [key: string]: SupportedLanguage } = {
    'es': 'spanish',
    'en': 'english',
    'pt': 'spanish',
    'fr': 'english',
    'de': 'english',
    'it': 'spanish',
  };

  return languageMap[languageCode] || 'spanish';
};

export const saveLanguagePreference = (language: SupportedLanguage): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred_language', language);
  }
};

export const getLanguagePreference = (): SupportedLanguage | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const saved = localStorage.getItem('preferred_language');
  return saved as SupportedLanguage | null;
};

export const getUserLanguage = (): SupportedLanguage => {
  const savedLanguage = getLanguagePreference();
  if (savedLanguage) {
    return savedLanguage;
  }
  
  return detectBrowserLanguage();
};

export const getCVDownloadURL = (language?: SupportedLanguage): string => {
  const targetLanguage = language || getUserLanguage();
  const cvId = CV_CONFIG.googleDriveIds[targetLanguage];
  
  if (!cvId || cvId.startsWith('TU_ID_')) {
    const defaultId = CV_CONFIG.googleDriveIds[CV_CONFIG.defaultLanguage];
    return `https://drive.google.com/uc?export=download&id=${defaultId}`;
  }
  
  return `https://drive.google.com/uc?export=download&id=${cvId}`;
};

export const handleDownloadCV = (language?: SupportedLanguage): void => {
  try {
    const targetLanguage = language || getUserLanguage();
    const downloadUrl = getCVDownloadURL(targetLanguage);
    
    // Abrir en nueva pestaña para iniciar descarga
    window.open(downloadUrl, '_blank');
    
    console.log(`CV descargado - Idioma: ${targetLanguage}`);
    
  } catch (error) {
    console.error('Error al descargar CV:', error);
    alert('Error al descargar el CV. Por favor, intenta nuevamente.');
  }
};

/*
Proyectos
 */

export const scrollToProjects = (sectionId: string = 'projects'): void => {
  try {
    const section = document.getElementById(sectionId);
    
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.warn(`Sección con id="${sectionId}" no encontrada`);
    }
  } catch (error) {
    console.error('Error al hacer scroll:', error);
  }
};

export const getTranslations = (language: SupportedLanguage) => {
  const translations = {
    spanish: {
      downloadCV: 'Descargar CV',
      viewProjects: 'Ver Proyectos',
      hello: 'Hola, soy',
    },
    english: {
      downloadCV: 'Download CV',
      viewProjects: 'View Projects',
      hello: "Hi, I'm",
    },
  };

  return translations[language];
};

/* Secciones */
export const SECTION_IDS = {
  HERO: 'hero',
  ABOUT: 'about',
  SKILLS: 'skills',
  EXPERIENCE: 'experience',
  PROJECTS: 'projects',
  CONTACT: 'contact',
} as const;


/* socialLinks */
export const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com/GersonJC',
    label: 'GitHub',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/gersoncarranza/', 
    label: 'LinkedIn',
  },
  {
    icon: Mail,
    href: 'mailto:jotag.carranza@gmail.com',
    label: 'Email',
  },
]
