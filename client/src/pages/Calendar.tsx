import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllUserTasks } from '../services/calendarService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: tasks = [] } = useQuery({ queryKey: ['allTasks'], queryFn: getAllUserTasks });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tasksByDate: Record<string, typeof tasks> = {};
  tasks.forEach((t) => {
    if (!t.deadline) return;
    const key = new Date(t.deadline).toDateString();
    tasksByDate[key] = tasksByDate[key] || [];
    tasksByDate[key].push(t);
  });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(year, month + delta, 1));
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}><ChevronLeft className="w-4 h-4" /></Button>
          <span className="font-medium w-40 text-center">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="outline" size="icon" onClick={() => changeMonth(1)}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (!day) return <div key={i} className="min-h-24" />;
            const dateKey = new Date(year, month, day).toDateString();
            const dayTasks = tasksByDate[dateKey] || [];
            const isToday = new Date().toDateString() === dateKey;

            return (
              <div key={i} className={`min-h-24 border rounded-lg p-1.5 ${isToday ? 'border-indigo-500 bg-indigo-50/50' : 'border-border'}`}>
                <span className={`text-xs font-medium ${isToday ? 'text-indigo-600' : ''}`}>{day}</span>
                <div className="space-y-1 mt-1">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div key={t._id} className="text-[10px] bg-indigo-100 text-indigo-700 rounded px-1 py-0.5 truncate">
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <Badge variant="secondary" className="text-[10px] h-4">+{dayTasks.length - 2} more</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Calendar;