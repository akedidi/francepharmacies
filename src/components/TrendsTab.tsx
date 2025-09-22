import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, Euro, Loader2, AlertCircle, Info } from 'lucide-react';
import { TrendsApiService } from '../services/trendsApi';
import { MedicamentTrend } from '../types/trends';

const TrendsTab: React.FC = () => {
  const [trends, setTrends] = useState<MedicamentTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await TrendsApiService.getMedicamentTrends(20);
      setTrends(response.items);
    } catch (err) {
      setError('Erreur lors du chargement des tendances');
      console.error('Erreur tendances:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getTrendIcon = (delta: number) => {
    if (delta > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (delta < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  const getTrendColor = (delta: number) => {
    if (delta > 20) return 'text-green-600 bg-green-50';
    if (delta > 0) return 'text-green-500 bg-green-50';
    if (delta < -20) return 'text-red-600 bg-red-50';
    if (delta < 0) return 'text-red-500 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getScoreColor = (score: number) => {
    if (score >= 9.5) return 'bg-gradient-to-r from-purple-500 to-pink-600';
    if (score >= 8) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (score >= 6) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    if (score >= 4) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-r from-blue-500 to-blue-600';
  };

  const getBuzzIcon = (bonusActu: number) => {
    if (bonusActu >= 0.5) return '🔥';
    if (bonusActu >= 0.3) return '📈';
    if (bonusActu >= 0.1) return '💡';
    return '';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mr-3" />
          <span className="text-lg font-medium text-gray-600">Chargement des tendances...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12 text-red-600">
          <AlertCircle className="w-8 h-8 mr-3" />
          <span className="text-lg font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Tendances Médicaments
        </h2>
        <p className="text-gray-600 text-sm mb-3">
          Évolution des ventes de médicaments remboursés - Données 2024 vs 2023
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Méthode de calcul
          </h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• <strong>Période :</strong> Comparaison décembre 2024 vs décembre 2023</p>
            <p>• <strong>Volume :</strong> Évolution du nombre de boîtes remboursées</p>
            <p>• <strong>Valeur :</strong> Évolution du montant remboursé par l'Assurance Maladie</p>
            <p>• <strong>Source :</strong> Base Medic'AM (CNAM) - Médicaments ville remboursés</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {trends.map((trend, index) => (
          <div key={trend.cip13} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300">
            {/* Header avec rang */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className={`${getScoreColor(trend.score_tendance)} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 shadow-lg`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm leading-tight flex items-center">
                    {trend.label}
                    {trend.bonus_actu >= 0.1 && (
                      <span className="ml-2 text-lg" title={`Buzz actualité: +${(trend.bonus_actu * 100).toFixed(0)}%`}>
                        {getBuzzIcon(trend.bonus_actu)}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">CIP: {trend.cip13}</p>
                  {trend.bonus_actu >= 0.1 && (
                    <p className="text-xs text-purple-600 font-medium mt-1">
                      Buzz actu: +{(trend.bonus_actu * 100).toFixed(0)}% 📰
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Score</div>
                <div className={`${getScoreColor(trend.score_tendance)} text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm`}>
                  {trend.score_tendance.toFixed(1)}
                </div>
              </div>
            </div>

            {/* Statistiques */}
            {/* Statistiques - Affichées seulement si on a des données */}
            {(trend.boites > 0 || trend.euros > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Boîtes</span>
                    </div>
                    {getTrendIcon(trend.delta_volume_pct)}
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <div className="text-lg sm:text-xl font-bold text-blue-600 tabular-nums">
                      {formatNumber(trend.boites)}
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${getTrendColor(trend.delta_volume_pct)}`}>
                      {trend.delta_volume_pct > 0 ? '+' : ''}{trend.delta_volume_pct.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Euro className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Montant total remboursé</span>
                    </div>
                    {getTrendIcon(trend.delta_valeur_pct)}
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <div className="text-lg sm:text-xl font-bold text-green-600 tabular-nums">
                      {formatNumber(trend.euros)}€
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${getTrendColor(trend.delta_valeur_pct)}`}>
                      {trend.delta_valeur_pct > 0 ? '+' : ''}{trend.delta_valeur_pct.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Message pour les médicaments buzz sans données de vente */}
            {trend.boites === 0 && trend.euros === 0 && trend.bonus_actu >= 0.1 && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-3">
                <div className="flex items-center">
                  <span className="text-lg mr-2">📰</span>
                  <div>
                    <p className="text-sm font-medium text-purple-800">Médicament en actualité</p>
                    <p className="text-xs text-purple-600">Données de remboursement non disponibles</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="p-2 sm:p-3 bg-gray-50 rounded-xl">
        <div className="text-xs text-gray-600 text-center leading-relaxed">
          <div className="hidden sm:block">
            <strong>Données officielles :</strong> Caisse Nationale d'Assurance Maladie (CNAM)<br/>
            <strong>Mise à jour :</strong> Mensuelle • <strong>Dernière extraction :</strong> Janvier 2025
          </div>
          <div className="sm:hidden space-y-1">
            <div><strong>Source :</strong> CNAM</div>
            <div><strong>MAJ :</strong> Mensuelle • Jan. 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsTab;