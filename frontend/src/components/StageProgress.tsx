import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Circle } from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
  tasks: string[];
}

interface StageProgressProps {
  stages: Stage[];
  currentStage: number;
}

const StageProgress: React.FC<StageProgressProps> = ({ stages, currentStage }) => {
  const getStatusIcon = (status: Stage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Stage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <span>Automation Pipeline Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(stage.status)}
                <span className="text-white font-medium">{stage.title}</span>
              </div>
              <Badge className={getStatusColor(stage.status)}>
                {stage.status.replace('-', ' ')}
              </Badge>
            </div>
            <p className="text-gray-300 text-sm ml-8">{stage.description}</p>
            <div className="ml-8">
              <Progress value={stage.progress} className="h-2" />
              <span className="text-xs text-gray-400">{stage.progress}% complete</span>
            </div>
            {stage.status === 'in-progress' && (
              <div className="ml-8 mt-2">
                <p className="text-xs text-gray-400 mb-1">Current tasks:</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  {stage.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StageProgress;