import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { NewsApiService } from '../services/newsApi';
import { NewsArticle } from '../types/trends';

const NewsTab: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await NewsApiService.getPharmacyNews();
      setArticles(response.articles.filter(article => 
        article.title && 
        article.description && 
        article.url &&
        !article.title.includes('[Removed]')
      ));
    } catch (err) {
      setError('Erreur lors du chargement des actualités');
      console.error('Erreur actualités:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'À l\'instant';
    if (diffHours === 1) return 'Il y a 1 heure';
    if (diffHours < 24) return `Il y a ${diffHours} heures`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mr-3" />
          <span className="text-lg font-medium text-gray-600">Chargement des actualités...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
          <span className="text-lg font-medium text-red-600 mb-4">{error}</span>
          <button
            onClick={loadNews}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:space-y-0">
        {articles.map((article, index) => (
          <article key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="p-4">
              {/* Header avec source et date */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Newspaper className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">{article.source.name}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(article.publishedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image si disponible */}
              {article.urlToImage && (
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-32 lg:h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Titre */}
              <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                {truncateText(article.title, 100)}
              </h3>

              {/* Description */}
              {article.description && (
                <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
                  {truncateText(article.description, 150)}
                </p>
              )}

              {/* Lien vers l'article */}
              <div className="flex justify-end mt-auto">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  Lire l'article
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {articles.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucune actualité disponible
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Aucune actualité pharmaceutique récente n'a été trouvée.
          </p>
        </div>
      )}

      {/* Footer info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
        <p className="text-xs text-gray-600 text-center">
          Actualités fournies par NewsAPI • Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
        </p>
      </div>
    </div>
  );
};

export default NewsTab;