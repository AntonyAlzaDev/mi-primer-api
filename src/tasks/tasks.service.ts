import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {

  private tasks: Task[] = [];
  private idCounter = 1;

  create(createTaskDto: CreateTaskDto): Task {
    const newTask:  Task = {
      id: this.idCounter++,
      title: createTaskDto.tile,
      description : createTaskDto.description,
      status: createTaskDto.status,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.tasks.push(newTask);

    return newTask;
  }

  // findAll(): Task[] {
  //   return this.tasks;
  // }

  findAll(status?: string): Task[]{

    if(status){
      return this.tasks.filter(task => task.status === status);
    }

    return this.tasks

  }

  findOne(id: number): Task {
    const  task = this.tasks.find(task => task.id === id);

    if(!task){
      throw new NotFoundException('Task con ID '+ id.toString() + ' no encontrado. verifique que el ID sea correcto' );
    }
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    
    const  taskIndex = this.tasks.findIndex(task => task.id === id);

    if(taskIndex === -1){
      throw new NotFoundException('Task con ID '+ id.toString() + ' no encontrado' );
    }

    if(Object.keys(updateTaskDto).length === 0){
      throw new BadRequestException(
        'Debe proporcionar al menos un campo para actualizar'
      )
    }

    const updatedTask: Task = {
      ...this.tasks[taskIndex],
      ...updateTaskDto,
      updatedAt: new Date()
    };

    this.tasks[taskIndex] = updatedTask

    return updatedTask;
  }

  remove(id: number): {message: string} {
    
    const  taskIndex = this.tasks.findIndex(task => task.id === id);
    
    if(taskIndex === -1){
      throw new NotFoundException('Task con ID '+ id.toString() + ' no encontrado' );
    }

    this.tasks.splice(taskIndex,1);

    return { message: 'Task con ID '+id.toString() + ' fue eliminado' }

  }

  getStats(): {
  total: number;
  byStatus: Record<string, number>;
  created_today: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const stats = {
    total: this.tasks.length,
    byStatus: {
      pending: this.tasks.filter(task => task.status === 'pending').length,
      'in-progress': this.tasks.filter(task => task.status === 'in-progress').length,
      completed: this.tasks.filter(task => task.status === 'completed').length
    },
    created_today: this.tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    }).length
  };
  
  return stats;
}


}
