import { useState } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { getProgramById } from '../programs';
import { EXERCISE_LABELS } from '../types';
import { formatDate, formatDateTime, cn } from '../lib/utils';

export function HistoryPage() {
  const sessions = useWorkoutStore((s) => s.sessions);
  const deleteSession = useWorkoutStore((s) => s.deleteSession);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No workouts yet</p>
          <p className="text-sm mt-1">Complete a workout to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">History</h1>
      <p className="text-sm text-gray-500">{sessions.length} workout{sessions.length !== 1 ? 's' : ''}</p>

      <div className="space-y-2">
        {sessions.map((session) => {
          const program = getProgramById(session.programId);
          const template = program?.templates.find((t) => t.variant === session.variant);
          const isExpanded = expandedId === session.id;

          return (
            <div key={session.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : session.id)}
                className="w-full px-4 py-3 text-left flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {template?.label ?? session.variant}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(session.date)}
                    {session.completedAt && (
                      <span className="ml-2 text-gray-400">
                        {formatDateTime(session.completedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 px-4 py-3 space-y-3">
                  {session.exercises.map((exercise) => {
                    const workSets = exercise.sets.filter((s) => s.type === 'work');
                    const completedSets = workSets.filter((s) => s.completed);

                    return (
                      <div key={exercise.id}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">
                            {EXERCISE_LABELS[exercise.exerciseName]}
                          </span>
                          <span className={cn(
                            'text-sm font-medium',
                            completedSets.length === workSets.length ? 'text-green-600' : 'text-amber-600',
                          )}>
                            {completedSets.length}/{workSets.length}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {workSets.map((s, i) => (
                            <span key={s.id}>
                              {i > 0 && ', '}
                              {s.actualWeight ?? s.prescribedWeight}×{s.actualReps ?? s.prescribedReps}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {session.notes && (
                    <p className="text-sm text-gray-500 italic">{session.notes}</p>
                  )}

                  <div className="pt-2 border-t border-gray-100">
                    {confirmDeleteId === session.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            deleteSession(session.id);
                            setConfirmDeleteId(null);
                            setExpandedId(null);
                          }}
                          className="flex-1 py-2 bg-red-500 text-white text-sm font-medium rounded-lg"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="flex-1 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(session.id)}
                        className="text-sm text-red-500 font-medium"
                      >
                        Delete Session
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
