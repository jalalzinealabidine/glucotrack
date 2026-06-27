import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const DataContext = createContext(null);

function mapBloodSugarRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    glucoseValue: Number(row.glucose_value),
    unit: row.unit,
    measurementType: row.measurement_type,
    measuredAt: row.measured_at,
    note: row.note ?? '',
    createdAt: row.created_at
  };
}

function mapInsulinRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    insulinType: row.insulin_type,
    units: Number(row.units),
    injectedAt: row.injected_at,
    note: row.note ?? '',
    createdAt: row.created_at
  };
}

function mapReminderRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    time: String(row.reminder_time).slice(0, 5),
    repeatDaily: row.repeat_daily,
    isActive: row.is_active,
    createdAt: row.created_at
  };
}

export function DataProvider({ children }) {
  const { user, storageMode } = useAuth();
  const usingCloud = storageMode === 'cloud' && supabase && user;

  const [localBloodSugarLogs, setLocalBloodSugarLogs] = useLocalStorage('glucotrack_blood_sugar_logs', []);
  const [localInsulinLogs, setLocalInsulinLogs] = useLocalStorage('glucotrack_insulin_logs', []);
  const [localReminders, setLocalReminders] = useLocalStorage('glucotrack_reminders', []);

  const [cloudBloodSugarLogs, setCloudBloodSugarLogs] = useState([]);
  const [cloudInsulinLogs, setCloudInsulinLogs] = useState([]);
  const [cloudReminders, setCloudReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataError, setDataError] = useState('');

  const refreshData = useCallback(async () => {
    if (!usingCloud) return;

    setLoading(true);
    setDataError('');

    const [bloodResult, insulinResult, reminderResult] = await Promise.all([
      supabase.from('blood_sugar_logs').select('*').order('measured_at', { ascending: false }),
      supabase.from('insulin_logs').select('*').order('injected_at', { ascending: false }),
      supabase.from('reminders').select('*').order('reminder_time', { ascending: true })
    ]);

    const error = bloodResult.error || insulinResult.error || reminderResult.error;
    if (error) {
      setDataError(error.message);
      setLoading(false);
      return;
    }

    setCloudBloodSugarLogs((bloodResult.data ?? []).map(mapBloodSugarRow));
    setCloudInsulinLogs((insulinResult.data ?? []).map(mapInsulinRow));
    setCloudReminders((reminderResult.data ?? []).map(mapReminderRow));
    setLoading(false);
  }, [usingCloud, user?.id]);

  useEffect(() => {
    if (usingCloud) {
      refreshData();
    } else {
      setCloudBloodSugarLogs([]);
      setCloudInsulinLogs([]);
      setCloudReminders([]);
      setLoading(false);
      setDataError('');
    }
  }, [usingCloud, refreshData]);

  const bloodSugarLogs = usingCloud ? cloudBloodSugarLogs : localBloodSugarLogs;
  const insulinLogs = usingCloud ? cloudInsulinLogs : localInsulinLogs;
  const reminders = usingCloud ? cloudReminders : localReminders;

  async function addBloodSugarLog(log) {
    if (usingCloud) {
      const { data, error } = await supabase
        .from('blood_sugar_logs')
        .insert({
          user_id: user.id,
          glucose_value: log.glucoseValue,
          unit: log.unit,
          measurement_type: log.measurementType,
          measured_at: log.measuredAt,
          note: log.note
        })
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      setCloudBloodSugarLogs((previousLogs) => [mapBloodSugarRow(data), ...previousLogs]);
      return;
    }

    setLocalBloodSugarLogs((previousLogs) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...log
      },
      ...previousLogs
    ]);
  }

  async function updateBloodSugarLog(id, updatedLog) {
    if (usingCloud) {
      const { data, error } = await supabase
        .from('blood_sugar_logs')
        .update({
          glucose_value: updatedLog.glucoseValue,
          unit: updatedLog.unit,
          measurement_type: updatedLog.measurementType,
          measured_at: updatedLog.measuredAt,
          note: updatedLog.note
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      setCloudBloodSugarLogs((previousLogs) =>
        previousLogs.map((log) => (log.id === id ? mapBloodSugarRow(data) : log))
      );
      return;
    }

    setLocalBloodSugarLogs((previousLogs) =>
      previousLogs.map((log) => (log.id === id ? { ...log, ...updatedLog } : log))
    );
  }

  async function deleteBloodSugarLog(id) {
    if (usingCloud) {
      const { error } = await supabase.from('blood_sugar_logs').delete().eq('id', id);
      if (error) throw new Error(error.message);
      setCloudBloodSugarLogs((previousLogs) => previousLogs.filter((log) => log.id !== id));
      return;
    }

    setLocalBloodSugarLogs((previousLogs) => previousLogs.filter((log) => log.id !== id));
  }

  async function addInsulinLog(log) {
    if (usingCloud) {
      const { data, error } = await supabase
        .from('insulin_logs')
        .insert({
          user_id: user.id,
          insulin_type: log.insulinType,
          units: log.units,
          injected_at: log.injectedAt,
          note: log.note
        })
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      setCloudInsulinLogs((previousLogs) => [mapInsulinRow(data), ...previousLogs]);
      return;
    }

    setLocalInsulinLogs((previousLogs) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...log
      },
      ...previousLogs
    ]);
  }

  async function updateInsulinLog(id, updatedLog) {
    if (usingCloud) {
      const { data, error } = await supabase
        .from('insulin_logs')
        .update({
          insulin_type: updatedLog.insulinType,
          units: updatedLog.units,
          injected_at: updatedLog.injectedAt,
          note: updatedLog.note
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      setCloudInsulinLogs((previousLogs) =>
        previousLogs.map((log) => (log.id === id ? mapInsulinRow(data) : log))
      );
      return;
    }

    setLocalInsulinLogs((previousLogs) =>
      previousLogs.map((log) => (log.id === id ? { ...log, ...updatedLog } : log))
    );
  }

  async function deleteInsulinLog(id) {
    if (usingCloud) {
      const { error } = await supabase.from('insulin_logs').delete().eq('id', id);
      if (error) throw new Error(error.message);
      setCloudInsulinLogs((previousLogs) => previousLogs.filter((log) => log.id !== id));
      return;
    }

    setLocalInsulinLogs((previousLogs) => previousLogs.filter((log) => log.id !== id));
  }

  async function addReminder(reminder) {
    if (usingCloud) {
      const { data, error } = await supabase
        .from('reminders')
        .insert({
          user_id: user.id,
          title: reminder.title,
          reminder_time: reminder.time,
          repeat_daily: reminder.repeatDaily,
          is_active: true
        })
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      setCloudReminders((previousReminders) => [...previousReminders, mapReminderRow(data)].sort((a, b) => a.time.localeCompare(b.time)));
      return;
    }

    setLocalReminders((previousReminders) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        isActive: true,
        ...reminder
      },
      ...previousReminders
    ]);
  }

  async function deleteReminder(id) {
    if (usingCloud) {
      const { error } = await supabase.from('reminders').delete().eq('id', id);
      if (error) throw new Error(error.message);
      setCloudReminders((previousReminders) => previousReminders.filter((reminder) => reminder.id !== id));
      return;
    }

    setLocalReminders((previousReminders) => previousReminders.filter((reminder) => reminder.id !== id));
  }

  async function toggleReminder(id) {
    const reminder = reminders.find((item) => item.id === id);
    if (!reminder) return;

    if (usingCloud) {
      const { data, error } = await supabase
        .from('reminders')
        .update({ is_active: !reminder.isActive })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      setCloudReminders((previousReminders) =>
        previousReminders.map((item) => (item.id === id ? mapReminderRow(data) : item))
      );
      return;
    }

    setLocalReminders((previousReminders) =>
      previousReminders.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  }

  const value = useMemo(
    () => ({
      bloodSugarLogs,
      insulinLogs,
      reminders,
      loading,
      dataError,
      storageMode,
      refreshData,
      addBloodSugarLog,
      updateBloodSugarLog,
      deleteBloodSugarLog,
      addInsulinLog,
      updateInsulinLog,
      deleteInsulinLog,
      addReminder,
      deleteReminder,
      toggleReminder
    }),
    [
      bloodSugarLogs,
      insulinLogs,
      reminders,
      loading,
      dataError,
      storageMode,
      refreshData
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used inside DataProvider');
  }
  return context;
}
