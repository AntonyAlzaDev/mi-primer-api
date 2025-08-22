import { Injectable, NotFoundException } from '@nestjs/common';
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

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const  task = this.tasks.find(task => task.id === id);

    if(!task){
      throw new NotFoundException('Task con ID '+ id.toString() + 'no encontrado' );
    }
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    
    const  taskIndex = this.tasks.findIndex(task => task.id === id);

    if(taskIndex === -1){
      throw new NotFoundException('Task con ID '+ id.toString() + ' no encontrado' );
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
}
