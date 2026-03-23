import { useRef, useState } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { PROGRAMS } from '../programs';
import { EXERCISE_LABELS } from '../types';
import type { ExerciseName } from '../types';
import { exportToJson, importFromJson } from '../lib/backup';
import { WeightInput } from '../components/shared/WeightInput';

export function SettingsPage() {
  const {
    activeProgramId,
    workingWeights,
    settings,
    changeProgram,
    setWorkingWeight,
    updateSettings,
    importData,
    getExportData,
  } = useWorkoutStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [editingWeight, setEditingWeight] = useState<ExerciseName | null>(null);

  const activeProgram = PROGRAMS.find((p) => p.id === activeProgramId);

  const handleExport = () => {
    exportToJson(getExportData());
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importFromJson(file);
      importData(data as ReturnType<typeof getExportData>);
      setImportStatus('Data imported successfully!');
    } catch {
      setImportStatus('Failed to import data. Invalid file format.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setImportStatus(null), 3000);
  };

  // Get exercises relevant to the active program
  const programExercises = activeProgram
    ? [...new Set(activeProgram.templates.flatMap((t) => t.exercises.map((e) => e.exerciseName)))]
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Program Selection */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
        <h2 className="font-semibold text-gray-700">Program</h2>
        <div className="space-y-2">
          {PROGRAMS.map((program) => (
            <button
              key={program.id}
              onClick={() => changeProgram(program.id)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                program.id === activeProgramId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="font-semibold text-gray-900">{program.name}</div>
              <div className="text-sm text-gray-500">{program.description}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Working Weights */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
        <h2 className="font-semibold text-gray-700">Working Weights</h2>
        <p className="text-sm text-gray-500">Tap to edit. These are your current work set weights.</p>
        <div className="space-y-2">
          {programExercises.map((name) => (
            <div key={name}>
              <button
                onClick={() => setEditingWeight(editingWeight === name ? null : name)}
                className="w-full flex justify-between items-center py-2 px-1"
              >
                <span className="text-gray-600">{EXERCISE_LABELS[name]}</span>
                <span className="font-bold text-gray-900">{workingWeights[name] ?? 45} lbs</span>
              </button>
              {editingWeight === name && (
                <div className="pb-3">
                  <WeightInput
                    value={workingWeights[name] ?? 45}
                    onChange={(v) => setWorkingWeight(name, v)}
                    increment={2.5}
                    min={0}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Equipment Settings */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
        <h2 className="font-semibold text-gray-700">Equipment</h2>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Bar Weight</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateSettings({ barWeight: Math.max(0, settings.barWeight - 5) })}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600"
            >
              −
            </button>
            <span className="font-bold w-16 text-center">{settings.barWeight} lbs</span>
            <button
              onClick={() => updateSettings({ barWeight: settings.barWeight + 5 })}
              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <span className="text-gray-600 text-sm">Rest Timer (seconds)</span>
          <div className="flex items-center gap-2 mt-1">
            {[120, 180, 300].map((sec) => (
              <button
                key={sec}
                onClick={() => updateSettings({ restTimerSeconds: sec })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.restTimerSeconds === sec
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {Math.floor(sec / 60)}:{(sec % 60).toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Backup & Restore */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
        <h2 className="font-semibold text-gray-700">Backup & Restore</h2>
        <p className="text-sm text-gray-500">
          Export your data as JSON. Save it to Google Drive for backup.
        </p>
        <div className="space-y-2">
          <button
            onClick={handleExport}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl active:bg-blue-700 transition-colors"
          >
            Export Data
          </button>
          <label className="block">
            <span className="block w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl text-center cursor-pointer active:bg-gray-200 transition-colors">
              Import Data
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
        {importStatus && (
          <p className={`text-sm font-medium ${importStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {importStatus}
          </p>
        )}
      </section>
    </div>
  );
}
