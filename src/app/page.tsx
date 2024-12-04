'use client';
import React, { useState } from 'react';
import { Weapon, EnhanceLog, UsedResources, Stats } from '../types';
import { ENHANCEMENT_RATES, STONE_TYPES, WEAPON_NAMES, WEAPON_STATS } from '../constants';
import Link from 'next/link';

// 공격력 계산 함수 추가
const calculateAttackPower = (enhancement: number) => {
  let additionalPower = 0;
  for (let i = 1; i <= enhancement; i++) {
    additionalPower += WEAPON_STATS.enhancement[i as keyof typeof WEAPON_STATS.enhancement] || 0;
  }
  return WEAPON_STATS.base + additionalPower;
};

export default function Home() {
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [enhanceLogs, setEnhanceLogs] = useState<EnhanceLog[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAttempts: 0,
    successes: 0,
    failures: 0,
    destroys: 0,
    maxEnhance: 0
  });
  const [usedResources, setUsedResources] = useState<UsedResources>({
    stones: {
      normal: 0,
      advanced: 0,
      supreme: 0
    },
    materials: {
      iron: 0,
      blackIron: 0,
      specialIron: 0,
      lapis: 0
    },
    money: 0
  });

  const [drinkUsed, setDrinkUsed] = useState<boolean>(false);

  const addEnhanceLog = (type: 'success' | 'degrade' | 'maintain' | 'destroy', enhancement: number) => {
    setEnhanceLogs(prev => {
      const newLog = {
        type,
        weaponType: weapon?.type || '',
        enhancement,
        timestamp: Date.now()
      };
      return [newLog, ...prev].slice(0, 5);
    });
  };

  const purchaseWeapon = () => {
    const newWeapon: Weapon = {
      id: Date.now().toString(),
      type: 'sword',
      enhancement: 0,
      createdAt: Date.now()
    };
    setWeapon(newWeapon);
    setUsedResources(prev => ({
      ...prev,
      money: prev.money + 1000
    }));
  };

  const handleEnhance = (stoneType: keyof typeof STONE_TYPES) => {
    if (!weapon) return;
    if (weapon.enhancement >= 12) {
      alert('더 이상 강화할 수 없습니다.');
      return;
    }

    // 재화 소모
    const stoneCost = STONE_TYPES[stoneType];
    setUsedResources(prev => ({
      ...prev,
      stones: {
        ...prev.stones,
        [stoneType]: prev.stones[stoneType] + 1
      },
      materials: {
        iron: prev.materials.iron + stoneCost.materials.iron,
        blackIron: prev.materials.blackIron + stoneCost.materials.blackIron,
        specialIron: prev.materials.specialIron + stoneCost.materials.specialIron,
        lapis: prev.materials.lapis + stoneCost.materials.lapis
      },
      money: prev.money + stoneCost.cost
    }));

    // 강화 시도
    const enhancementLevel = weapon.enhancement as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    const rates = ENHANCEMENT_RATES[enhancementLevel];
    const successRate = rates.success + stoneCost.successBonus + (drinkUsed ? 1 : 0);
    const roll = Math.random() * 100;

    setStats(prev => ({
      ...prev,
      totalAttempts: prev.totalAttempts + 1
    }));

    if (roll < successRate) {
      // 성공
      const newEnhancement = weapon.enhancement + 1;
      setWeapon(prev => prev ? { ...prev, enhancement: newEnhancement } : null);
      addEnhanceLog('success', newEnhancement);
      setStats(prev => ({
        ...prev,
        successes: prev.successes + 1,
        maxEnhance: Math.max(prev.maxEnhance, newEnhancement)
      }));
    } else {
      const destroyRoll = Math.random() * 100;
      if (weapon.enhancement >= 5 && destroyRoll < rates.destroy) {
        // 파괴
        setWeapon(null);
        addEnhanceLog('destroy', weapon.enhancement);
        setStats(prev => ({
          ...prev,
          destroys: prev.destroys + 1
        }));
      } else if (destroyRoll < (rates.destroy + rates.degrade)) {
        // 하락
        const newEnhancement = Math.max(0, weapon.enhancement - 1);
        setWeapon(prev => prev ? { ...prev, enhancement: newEnhancement } : null);
        addEnhanceLog('degrade', newEnhancement);
        setStats(prev => ({
          ...prev,
          failures: prev.failures + 1
        }));
      } else {
        // 유지
        addEnhanceLog('maintain', weapon.enhancement);
        setStats(prev => ({
          ...prev,
          failures: prev.failures + 1
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="https://kochang-simulator.onrender.com/" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
            ← 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-white text-center">코창서버 무기 강화 시뮬레이터</h1>
          <button
            onClick={() => {
              if (confirm('모든 진행 상황이 초기화됩니다. 계속하시겠습니까?')) {
                setWeapon(null);
                setEnhanceLogs([]);
                setStats({
                  totalAttempts: 0,
                  successes: 0,
                  failures: 0,
                  destroys: 0,
                  maxEnhance: 0
                });
                setUsedResources({
                  stones: { normal: 0, advanced: 0, supreme: 0 },
                  materials: {
                    iron: 0,
                    blackIron: 0,
                    specialIron: 0,
                    lapis: 0
                  },
                  money: 0
                });
                setDrinkUsed(false);
              }
            }}
            className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
          >
            초기화
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 왼쪽 섹션 */}
          <div className="space-y-6">
            {/* 무기 정보 */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-[400px]">
              <h2 className="text-2xl font-bold text-white mb-4">무기 정보</h2>
              {weapon ? (
                <div className="text-center">
                  <p className="text-2xl font-bold text-white mb-4">
                    {weapon.enhancement}강 {WEAPON_NAMES[weapon.type]}
                    {weapon.enhancement === 12 && <span className="text-sm text-gray-400 ml-2">(예상)</span>}
                  </p>
                  <div className="text-gray-300 mb-4">
                    <p>공격력: {calculateAttackPower(weapon.enhancement)}
                      <span className="text-sm text-gray-500 ml-2">
                        (기본 {WEAPON_STATS.base} + 강화 {calculateAttackPower(weapon.enhancement) - WEAPON_STATS.base})
                      </span>
                    </p>
                  </div>
                  {weapon.enhancement < 12 && (
                    <div className="text-gray-300">
                      <p>성공 확률: {ENHANCEMENT_RATES[weapon.enhancement as EnhancementLevel].success + (drinkUsed ? 1 : 0)}%
                        {drinkUsed && <span className="text-amber-400 text-sm"> (강화주 +1%)</span>}
                      </p>
                      {weapon.enhancement >= 5 && (
                        <p>파괴 확률: {ENHANCEMENT_RATES[weapon.enhancement as EnhancementLevel].destroy}%</p>
                      )}
                      <p>하락 확률: {ENHANCEMENT_RATES[weapon.enhancement as EnhancementLevel].degrade}%</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  무기를 구매해주세요
                </div>
              )}
            </div>

            <div className="mb-4">
              <button
                onClick={() => setDrinkUsed(!drinkUsed)}
                className={`w-full ${drinkUsed
                  ? 'bg-amber-600 hover:bg-amber-500'
                  : 'bg-amber-700 hover:bg-amber-600'
                  } text-white rounded-lg py-2 transition-colors duration-200`}
              >
                강화주 {drinkUsed ? '사용 중 (+1%)' : '마시기'}
              </button>
            </div>

            {/* 강화 UI */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">강화</h2>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleEnhance('normal')}
                  disabled={!weapon || weapon.enhancement >= 12}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white rounded-lg py-2 px-4"
                >
                  강화석
                  <span className="block text-sm">(5,000원)</span>
                </button>
                <button
                  onClick={() => handleEnhance('advanced')}
                  disabled={!weapon || weapon.enhancement >= 12}
                  className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white rounded-lg py-2 px-4"
                >
                  상급 강화석
                  <span className="block text-sm">(10,000원)</span>
                  <span className="block text-sm">+5%</span>
                </button>
                <button
                  onClick={() => handleEnhance('supreme')}
                  disabled={!weapon || weapon.enhancement >= 12}
                  className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white rounded-lg py-2 px-4"
                >
                  고급 강화석
                  <span className="block text-sm">(20,000원)</span>
                  <span className="block text-sm">+10%</span>
                </button>
              </div>
            </div>

            {/* 무기 구매 */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <button
                onClick={purchaseWeapon}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg py-2"
              >
                무기 구매 (1,000원)
              </button>
            </div>
          </div>

          {/* 오른쪽 섹션 */}
          <div className="space-y-6">
            {/* 강화 등급 이동 UI */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">강화 등급 이동</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    if (weapon && weapon.enhancement > 0) {
                      setWeapon(prev => prev && ({
                        ...prev,
                        enhancement: prev.enhancement - 1
                      }));
                    }
                  }}
                  className="text-white hover:text-gray-300"
                  disabled={!weapon || weapon.enhancement <= 0}
                >
                  &lt;
                </button>
                <select
                  value={weapon?.enhancement || 0}
                  onChange={(e) => {
                    const newEnhancement = Number(e.target.value);
                    setWeapon(prev => prev && ({
                      ...prev,
                      enhancement: newEnhancement
                    }));
                  }}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg flex-grow text-center"
                  disabled={!weapon}
                >
                  {Array.from({ length: 13 }, (_, i) => (
                    <option key={i} value={i}>{i}강{i === 12 ? ' (예상)' : ''}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (weapon && weapon.enhancement < 12) {
                      setWeapon(prev => prev && ({
                        ...prev,
                        enhancement: prev.enhancement + 1
                      }));
                    }
                  }}
                  className="text-white hover:text-gray-300"
                  disabled={!weapon || weapon.enhancement >= 12}
                >
                  &gt;
                </button>
              </div>
            </div>

            {/* 강화 로그 */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">강화 로그</h2>
              <div className="space-y-2">
                {enhanceLogs.map((log) => (
                  <div
                    key={log.timestamp}
                    className={`text-sm ${log.type === 'success' ? 'text-green-400' :
                      log.type === 'degrade' ? 'text-red-400' :
                        log.type === 'destroy' ? 'text-purple-400' :
                          'text-gray-400'
                      }`}
                  >
                    {log.type === 'success' ? `${log.enhancement}강 강화 성공` :
                      log.type === 'degrade' ? `${log.enhancement + 1}강에서 ${log.enhancement}강으로 하락` :
                        log.type === 'destroy' ? `${log.enhancement}강 강화 실패로 파괴` :
                          `${log.enhancement}강 유지`}
                  </div>
                ))}
              </div>
            </div>

            {/* 강화 통계 */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">강화 통계</h2>
              <div className="space-y-2 text-gray-300">
                <p>총 시도: {stats.totalAttempts}회</p>
                <p>성공: {stats.successes}회</p>
                <p>실패: {stats.failures}회</p>
                <p>파괴: {stats.destroys}회</p>
                <p>최고 강화: +{stats.maxEnhance}</p>
              </div>
            </div>

            {/* 사용된 재화 */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">사용된 재화</h2>
              <div className="space-y-2 text-gray-300">
                <div>
                  <p>강화석: {usedResources.stones.normal}개</p>
                  <p>상급 강화석: {usedResources.stones.advanced}개</p>
                  <p>고급 강화석: {usedResources.stones.supreme}개</p>
                </div>
                <div className="mt-4">
                  <p>철: {usedResources.materials.iron}개</p>
                  <p>묵철: {usedResources.materials.blackIron}개</p>
                  <p>오철: {usedResources.materials.specialIron}개</p>
                  <p>청금석: {usedResources.materials.lapis}개</p>
                </div>
                <div className="mt-4">
                  <p>총 사용 금액: {usedResources.money.toLocaleString()}원</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}